import { describe, it, expect } from "vitest";
import {
  DIMENSIONS, DIMENSION_NAMES, ALIGNMENT_STATUSES, STATUS_RANGES,
  SOURCE_TIERS, DEFAULT_WEIGHTS, clamp01,
} from "./contracts";

describe("brain contracts", () => {
  it("defines exactly six dimensions with unambiguous names", () => {
    expect(DIMENSIONS).toEqual(["F", "C", "T", "E", "Q", "Ac"]);
    expect(DIMENSION_NAMES.Q).toBe("Equity");
    expect(DIMENSION_NAMES.Ac).toBe("Accountability");
  });

  it("defines the full alignment status vocabulary", () => {
    expect(ALIGNMENT_STATUSES).toEqual([
      "high_alignment", "adequate", "at_risk", "low_alignment",
      "critical_failure", "insufficient_data", "suppressed",
    ]);
  });

  it("maps statuses to non-overlapping score ranges", () => {
    expect(STATUS_RANGES.high_alignment[0]).toBe(0.85);
    expect(STATUS_RANGES.adequate[0]).toBe(0.7);
    expect(STATUS_RANGES.at_risk[0]).toBe(0.5);
    expect(STATUS_RANGES.low_alignment[0]).toBe(0.3);
    expect(STATUS_RANGES.critical_failure[1]).toBe(0.3);
  });

  it("defines the credibility hierarchy from Tier 1 to Tier 6", () => {
    expect(SOURCE_TIERS).toHaveLength(6);
    expect(SOURCE_TIERS[0]).toMatchObject({ tier: 1, weight: 1.0 });
    expect(SOURCE_TIERS[5]).toMatchObject({ tier: 6, weight: 0.05 });
  });

  it("has default weights that sum to 1.0", () => {
    const sum = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("clamps values to [0, 1]", () => {
    expect(clamp01(-0.4)).toBe(0);
    expect(clamp01(0.6)).toBe(0.6);
    expect(clamp01(1.4)).toBe(1);
  });
});
