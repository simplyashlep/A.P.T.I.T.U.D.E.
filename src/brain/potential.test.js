import { describe, it, expect } from "vitest";
import { JUDGE_PROFILE_ID, POTENTIAL_PROFILES, getPotentialProfile } from "./potential";
import { DIMENSIONS } from "./contracts";

describe("potential profiles", () => {
  it("ships a judge profile with weights summing to 1.0", () => {
    const p = POTENTIAL_PROFILES[JUDGE_PROFILE_ID];
    expect(p).toBeTruthy();
    const sum = Object.values(p.weights).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("defines evidence thresholds for every profile", () => {
    for (const p of Object.values(POTENTIAL_PROFILES)) {
      expect(p.minEvidence.perDimension).toBeGreaterThan(0);
      expect(p.minEvidence.minSourceTypes).toBeGreaterThan(0);
    }
  });

  it("covers every dimension with a weight", () => {
    for (const p of Object.values(POTENTIAL_PROFILES)) {
      for (const d of DIMENSIONS) {
        expect(typeof p.weights[d]).toBe("number");
      }
    }
  });

  it("returns the judge profile for judge entities", () => {
    expect(getPotentialProfile("judge", "oregon-circuit").id).toBe(JUDGE_PROFILE_ID);
  });

  it("falls back to the generic profile for unknown entity types", () => {
    expect(getPotentialProfile("mystery-entity").id).toBe("generic-v1");
  });
});
