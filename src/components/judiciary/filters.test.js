import { describe, it, expect } from "vitest";
import { CASE_TYPES, deriveCaseTypes } from "./CaseType";
import { applyJudgeFilters } from "./filters";

const judge = (over = {}) => ({
  id: over.id || "j1", name: "Test Judge", county: "Multnomah",
  category: "Circuit Court", court: "Circuit Court", riskLevel: "low",
  focus: over.focus ?? "General judicial profile",
  ...over,
});

describe("case type registry", () => {
  it("defines the stable registry", () => {
    expect(CASE_TYPES).toEqual(["Criminal", "Family", "Probate", "Civil", "Juvenile", "Other"]);
  });

  it("derives Criminal from criminal-related focus text", () => {
    expect(deriveCaseTypes(judge({ focus: "Criminal, Drug Court" }))).toContain("Criminal");
    expect(deriveCaseTypes(judge({ focus: "Felony Criminal, Gang Cases" }))).toContain("Criminal");
  });

  it("derives Family from family-law focus text", () => {
    expect(deriveCaseTypes(judge({ focus: "Family Law, Child Welfare" }))).toContain("Family");
  });

  it("derives multiple case types when focus spans areas", () => {
    const types = deriveCaseTypes(judge({ focus: "Family Law, Juvenile, Domestic Violence" }));
    expect(types).toContain("Family");
    expect(types).toContain("Juvenile");
  });

  it("falls back to Other for general profiles", () => {
    expect(deriveCaseTypes(judge())).toEqual(["Other"]);
  });
});

describe("applyJudgeFilters", () => {
  const judges = [
    judge({ id: "a", name: "Alpha", county: "Multnomah", riskLevel: "low", focus: "Criminal, Drug Court" }),
    judge({ id: "b", name: "Beta", county: "Clackamas", riskLevel: "high", focus: "Family Law, Child Welfare" }),
    judge({ id: "c", name: "Gamma", county: "Multnomah", riskLevel: "pending", focus: "General judicial profile" }),
  ];

  it("returns all judges with empty filters", () => {
    expect(applyJudgeFilters(judges, {})).toHaveLength(3);
  });

  it("filters by county and risk", () => {
    const out = applyJudgeFilters(judges, { county: "Multnomah", risk: "low" });
    expect(out.map((j) => j.id)).toEqual(["a"]);
  });

  it("filters by multi-select case types using OR semantics", () => {
    const out = applyJudgeFilters(judges, { caseTypes: ["Criminal", "Family"] });
    expect(out.map((j) => j.id).sort()).toEqual(["a", "b"]);
  });

  it("ignores case filter when caseTypes is empty", () => {
    const out = applyJudgeFilters(judges, { caseTypes: [] });
    expect(out).toHaveLength(3);
  });

  it("matches Other for general-profile judges", () => {
    const out = applyJudgeFilters(judges, { caseTypes: ["Other"] });
    expect(out.map((j) => j.id)).toEqual(["c"]);
  });
});
