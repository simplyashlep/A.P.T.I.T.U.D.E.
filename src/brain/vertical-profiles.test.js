import { describe, it, expect } from "vitest";
import { DIMENSIONS } from "./contracts";
import { NCRA_METRICS, CORRECTIONS_METRICS, validateMetricRegistry } from "./metric-registry";
import { NCRA_PROFILE, CORRECTIONS_PROFILE, getVerticalProfile } from "./vertical-profiles";

describe("vertical metric registries", () => {
  it("validates the detailed NCRA Beacon registry", () => {
    expect(validateMetricRegistry(NCRA_METRICS)).toEqual({ valid: true, errors: [] });
    expect(NCRA_METRICS).toHaveLength(24);
    expect(new Set(NCRA_METRICS.map((m) => m.dimension))).toEqual(new Set(DIMENSIONS));
  });

  it("validates an independent Corrections registry", () => {
    expect(validateMetricRegistry(CORRECTIONS_METRICS)).toEqual({ valid: true, errors: [] });
    expect(new Set(CORRECTIONS_METRICS.map((m) => m.dimension))).toEqual(new Set(DIMENSIONS));
    expect(CORRECTIONS_METRICS.some((m) => m.code === "LMCR")).toBe(false);
  });

  it("keeps vertical profiles separate while sharing the contract", () => {
    expect(NCRA_PROFILE.id).toBe("ncra-v1");
    expect(CORRECTIONS_PROFILE.id).toBe("corrections-v1");
    expect(getVerticalProfile("corrections-v1").weights).toEqual(NCRA_PROFILE.weights);
    expect(CORRECTIONS_PROFILE.entityClass).toBe("department-of-corrections");
  });

  it("rejects duplicate or incomplete metric definitions", () => {
    const result = validateMetricRegistry([
      { code: "X", dimension: "F", weight: 1, requiredSourceTypes: ["agency_report"] },
      { code: "X", dimension: "F", weight: 1, requiredSourceTypes: ["agency_report"] },
    ]);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("duplicate metric: X");
  });
});
