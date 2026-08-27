import { clamp01, DIMENSIONS, SOURCE_TIERS } from "./contracts";

// Deterministic djb2-style hash → 8 hex chars. Used for ids and audit hashes.
export const hashString = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
};

export const ALLOWED_SOURCE_TYPES = [
  "public_record", "regulatory_filing", "court_decision", "agency_report",
  "cfpb_complaint", "ftc_action", "inspector_general", "individual_submission",
];

const REQUIRED = [
  "entityId", "eventId", "sourceRecordId", "citation",
  "documentDate", "jurisdictionCode", "rawValue",
];

export const normalizeEvidence = (raw) => {
  for (const key of REQUIRED) {
    if (raw[key] == null || raw[key] === "") {
      throw new TypeError(`Evidence missing required field: ${key}`);
    }
  }
  if (!ALLOWED_SOURCE_TYPES.includes(raw.sourceType)) {
    throw new TypeError(`Evidence has unknown sourceType: ${raw.sourceType}`);
  }
  if (!DIMENSIONS.includes(raw.dimension)) {
    throw new TypeError(`Evidence has unknown dimension: ${raw.dimension}`);
  }

  const isIndividual = raw.sourceType === "individual_submission";
  const tier = isIndividual ? 6 : raw.credibilityTier ?? inferTier(raw.sourceType);
  const tierWeight = (SOURCE_TIERS.find((t) => t.tier === tier) || { weight: 0.05 }).weight;

  return {
    id: hashString(`${raw.entityId}${raw.eventId}${raw.sourceRecordId}`),
    entityId: raw.entityId,
    eventId: raw.eventId,
    sourceRecordId: raw.sourceRecordId,
    sourceType: raw.sourceType,
    credibilityTier: tier,
    citation: raw.citation,
    documentDate: raw.documentDate,
    jurisdictionCode: raw.jurisdictionCode,
    dimension: raw.dimension,
    rawValue: clamp01(Number(raw.rawValue)),
    confidence: raw.confidence ?? tierWeight,
    processingVersion: "brain-v1",
    ontologyVersion: "ontology-v1",
    metricRegistryVersion: "metrics-v1",
    normalizationVersion: "norm-v1",
    inputHash: hashString(JSON.stringify(raw)),
    recordedAt: new Date().toISOString(),
  };
};

// Best-effort default tier when the caller did not supply one.
const inferTier = (sourceType) => {
  switch (sourceType) {
    case "court_decision": return 1;
    case "agency_report": return 2;
    case "cfpb_complaint":
    case "ftc_action": return 3;
    case "regulatory_filing": return 4;
    case "public_record": return 3;
    case "inspector_general": return 2;
    default: return 6;
  }
};
