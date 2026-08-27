import { describe, it, expect } from "vitest";
import { computeAlignmentScore } from "./alignment";
import { getPotentialProfile } from "./potential";

const entity = { id: "judge-or-001", type: "judge", class: "oregon-circuit", name: "Example" };
const profile = getPotentialProfile("judge", "oregon-circuit");

const mk = (dimension, rawValue, sourceType = "court_decision", n = 0) => ({
  entityId: entity.id, eventId: `evt-${dimension}-${n}`, sourceRecordId: `src-${dimension}-${n}`,
  sourceType, citation: `State v. Example ${n} (2024)`, documentDate: "2024-01-01",
  jurisdictionCode: "OR", dimension, rawValue,
});

const fullSet = () => {
  const out = [];
  for (const d of ["F", "C", "T", "E", "Q", "Ac"]) {
    for (let i = 0; i < 12; i += 1) {
      out.push(mk(d, 0.85 + (i % 3) * 0.05, "court_decision", i));
    }
    // give each dimension a second source type so minSourceTypes=3 is satisfiable
    out.push(mk(d, 0.7, "agency_report", 100));
    out.push(mk(d, 0.75, "public_record", 101));
  }
  return out;
};

describe("alignment scoring engine", () => {
  it("returns the universal contract shape", () => {
    const r = computeAlignmentScore({ entity, evidence: fullSet(), profile });
    expect(r.entity_id).toBe(entity.id);
    expect(r.potential_profile_version).toBe(profile.id);
    expect(r.evidence_summary.count).toBe(84);
    expect(r.alignment_status).toBe("high_alignment");
    expect(r.alignment_score).toBeGreaterThan(0.7);
    expect(r.audit_reference).toMatch(/^[0-9a-f]{8}$/);
  });

  it("reports insufficient_data when a dimension lacks evidence", () => {
    const evidence = fullSet().filter((e) => e.dimension !== "Q");
    const r = computeAlignmentScore({ entity, evidence, profile });
    expect(r.alignment_status).toBe("insufficient_data");
    expect(r.alignment_score).toBeNull();
    expect(r.dimensions.Q).toBeNull();
    expect(r.evidence_summary.missing_requirements.some((m) => m.includes("Q"))).toBe(true);
  });

  it("applies equity hard floors when triggered", () => {
    const r = computeAlignmentScore({
      entity, evidence: fullSet(), profile,
      flags: ["intentional_discrimination_finding"],
    });
    expect(r.dimensions.Q).toBeGreaterThanOrEqual(0.15);
    expect(r.flags).toContain("intentional_discrimination_finding");
  });

  it("suppresses the score when flagged", () => {
    const r = computeAlignmentScore({ entity, evidence: fullSet(), profile, flags: ["suppressed"] });
    expect(r.alignment_status).toBe("suppressed");
    expect(r.alignment_score).toBeNull();
  });

  it("clamps dimension scores to [0, 1]", () => {
    const bad = fullSet().map((e) => ({ ...e, rawValue: 9 }));
    const r = computeAlignmentScore({ entity, evidence: bad, profile });
    expect(r.dimensions.F).toBe(1);
  });
});
