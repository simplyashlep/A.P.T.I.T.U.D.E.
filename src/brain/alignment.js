import { STATUS_RANGES, DIMENSIONS, DIMENSION_NAMES, clamp01 } from "./contracts";
import { normalizeEvidence, hashString } from "./evidence";
import { getPotentialProfile } from "./potential";

const statusForScore = (score) => {
  for (const [status, [min, max]] of Object.entries(STATUS_RANGES)) {
    if (score >= min && score < max) return status;
  }
  return "critical_failure";
};

export const computeAlignmentScore = ({ entity, evidence, profile, flags = [] }) => {
  const activeProfile = profile || getPotentialProfile(entity.type, entity.class || "");

  const items = evidence
    .map((raw) => {
      try {
        return normalizeEvidence({ ...raw, entityId: raw.entityId || entity.id });
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const byDimension = {};
  for (const d of DIMENSIONS) byDimension[d] = [];
  for (const item of items) byDimension[item.dimension].push(item);

  const sourceTypeUnion = new Set(items.map((i) => i.sourceType));

  const dimensions = {};
  const missing_requirements = [];
  for (const d of DIMENSIONS) {
    const group = byDimension[d];
    const reasons = [];
    if (group.length < activeProfile.minEvidence.perDimension) {
      reasons.push(`Dimension ${DIMENSION_NAMES[d]} (${d}) has ${group.length} quanta; minimum is ${activeProfile.minEvidence.perDimension}`);
    }
    if (sourceTypeUnion.size < activeProfile.minEvidence.minSourceTypes) {
      reasons.push(`Only ${sourceTypeUnion.size} distinct source types; minimum is ${activeProfile.minEvidence.minSourceTypes}`);
    }
    if (reasons.length > 0) {
      dimensions[d] = null;
      missing_requirements.push(...reasons);
    } else {
      dimensions[d] = clamp01(
        group.reduce((sum, i) => sum + i.rawValue, 0) / group.length
      );
    }
  }

  // Hard floors (Equity, per the Beacon specification)
  const appliedFlags = [...flags];
  for (const d of DIMENSIONS) {
    const floors = activeProfile.hardFloors?.[d] || [];
    if (dimensions[d] == null || floors.length === 0) continue;
    const applicable = floors.filter((f) => flags.includes(f.trigger));
    if (applicable.length > 0) {
      const floor = Math.max(...applicable.map((f) => f.floor));
      dimensions[d] = Math.max(dimensions[d], floor);
      for (const f of applicable) appliedFlags.push(f.trigger);
    }
  }

  const anyMissing = DIMENSIONS.some((d) => dimensions[d] == null);

  let alignment_score = null;
  let alignment_status;
  if (flags.includes("suppressed")) {
    alignment_status = "suppressed";
  } else if (anyMissing) {
    alignment_status = "insufficient_data";
  } else {
    alignment_score = clamp01(
      DIMENSIONS.reduce((sum, d) => sum + activeProfile.weights[d] * dimensions[d], 0)
    );
    alignment_status = statusForScore(alignment_score);
  }

  const inputHash = hashString(items.map((i) => i.inputHash).join(""));
  return {
    entity_id: entity.id,
    entity_type: entity.type,
    potential_profile_version: activeProfile.id,
    alignment_score,
    alignment_status,
    dimensions,
    evidence_summary: {
      count: items.length,
      source_types: [...sourceTypeUnion].sort(),
      missing_requirements,
    },
    flags: appliedFlags,
    audit_reference: hashString(entity.id + activeProfile.id + inputHash),
  };
};
