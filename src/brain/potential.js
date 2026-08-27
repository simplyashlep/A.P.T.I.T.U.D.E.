import { DEFAULT_WEIGHTS } from "./contracts";

export const JUDGE_PROFILE_ID = "judge-oregon-circuit-v1";

const genericProfile = {
  id: "generic-v1",
  entityType: "institution",
  entityClass: "",
  label: "Generic Institution",
  weights: { ...DEFAULT_WEIGHTS },
  minEvidence: { perDimension: 12, minSourceTypes: 3 },
  hardFloors: {
    Q: [
      { trigger: "intentional_discrimination_finding", floor: 0.15 },
      { trigger: "active_consent_decree", floor: 0.25 },
      { trigger: "pattern_or_practice_finding", floor: 0.20 },
    ],
  },
  metricRegistryVersion: "metrics-v1",
};

const judgeProfile = {
  ...genericProfile,
  id: JUDGE_PROFILE_ID,
  entityType: "judge",
  entityClass: "oregon-circuit",
  label: "Oregon Circuit Court Judge",
};

export const POTENTIAL_PROFILES = {
  [JUDGE_PROFILE_ID]: judgeProfile,
  "generic-v1": genericProfile,
};

export const getPotentialProfile = (entityType, entityClass = "") => {
  if (entityType === "judge" && entityClass === "oregon-circuit") return judgeProfile;
  return genericProfile;
};
