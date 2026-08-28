import { DEFAULT_WEIGHTS } from "./contracts";
import { METRIC_REGISTRIES, validateMetricRegistry } from "./metric-registry";

const base = (id, entityType, entityClass, metrics, details = {}) => {
  const validation = validateMetricRegistry(metrics);
  if (!validation.valid) throw new Error(`${id}: ${validation.errors.join("; ")}`);
  return {
    id,
    entityType,
    entityClass,
    metrics,
    weights: { ...DEFAULT_WEIGHTS },
    metricRegistryVersion: id,
    minEvidence: { perDimension: 12, minSourceTypes: 3 },
    hardFloors: {
      Q: [
        { trigger: "intentional_discrimination_finding", floor: 0.15 },
        { trigger: "active_consent_decree", floor: 0.25 },
        { trigger: "pattern_or_practice_finding", floor: 0.20 },
      ],
    },
    ...details,
  };
};

export const NCRA_PROFILE = base(
  "ncra-v1",
  "institution",
  "nationwide-consumer-reporting-agency",
  METRIC_REGISTRIES["ncra-v1"],
  { label: "Nationwide Consumer Reporting Agency", peerClass: "ncra-primary" }
);

export const CORRECTIONS_PROFILE = base(
  "corrections-v1",
  "agency",
  "department-of-corrections",
  METRIC_REGISTRIES["corrections-v1"],
  { label: "Department of Corrections", peerClass: "state-corrections-departments" }
);

export const VERTICAL_PROFILES = {
  [NCRA_PROFILE.id]: NCRA_PROFILE,
  [CORRECTIONS_PROFILE.id]: CORRECTIONS_PROFILE,
};

export const getVerticalProfile = (profileId) => VERTICAL_PROFILES[profileId] || null;
