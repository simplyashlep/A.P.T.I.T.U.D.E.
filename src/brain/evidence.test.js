import { describe, it, expect } from "vitest";
import { normalizeEvidence, hashString, ALLOWED_SOURCE_TYPES } from "./evidence";

const validRaw = {
  entityId: "judge-or-001",
  eventId: "evt-1",
  sourceRecordId: "src-1",
  sourceType: "court_decision",
  citation: "State v. Example, 123 Or App 45 (2024)",
  documentDate: "2024-03-01",
  jurisdictionCode: "OR",
  dimension: "F",
  rawValue: 0.91,
};

describe("evidence model", () => {
  it("returns a deterministic hash", () => {
    expect(hashString("abc")).toBe(hashString("abc"));
    expect(hashString("abc")).not.toBe(hashString("abd"));
  });

  it("normalizes valid raw evidence with provenance and version fields", () => {
    const e = normalizeEvidence(validRaw);
    expect(e.credibilityTier).toBe(1);
    expect(e.processingVersion).toBe("brain-v1");
    expect(e.normalizationVersion).toBe("norm-v1");
    expect(e.inputHash).toMatch(/^[0-9a-f]{8}$/);
    expect(e.recordedAt).toBeTruthy();
    expect(e.id).toBe(hashString("judge-or-001" + "evt-1" + "src-1"));
  });

  it("forces individual submissions to credibility tier 6", () => {
    const e = normalizeEvidence({ ...validRaw, sourceType: "individual_submission" });
    expect(e.credibilityTier).toBe(6);
  });

  it("clamps raw values into [0, 1]", () => {
    expect(normalizeEvidence({ ...validRaw, rawValue: 1.7 }).rawValue).toBe(1);
    expect(normalizeEvidence({ ...validRaw, rawValue: -0.2 }).rawValue).toBe(0);
  });

  it("rejects evidence missing required fields", () => {
    expect(() => normalizeEvidence({ ...validRaw, citation: undefined }))
      .toThrow(/citation/);
    expect(() => normalizeEvidence({ ...validRaw, dimension: undefined }))
      .toThrow(/dimension/);
  });

  it("rejects unknown source types and unknown dimensions", () => {
    expect(() => normalizeEvidence({ ...validRaw, sourceType: "rumor" }))
      .toThrow(/sourceType/);
    expect(() => normalizeEvidence({ ...validRaw, dimension: "X" }))
      .toThrow(/dimension/);
  });
});
