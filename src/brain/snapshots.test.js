import { describe, it, expect } from "vitest";
import { createSourceSnapshot, verifySourceSnapshot, selectSnapshotsForEntity } from "./snapshots";

describe("source snapshots", () => {
  const base = {
    entityId: "equifax-inc",
    sourceType: "regulatory_filing",
    sourceRecordId: "sec-2025-10k",
    retrievedAt: "2026-08-29T00:00:00Z",
    payload: { company: "Equifax Inc.", year: 2025 },
  };

  it("creates deterministic immutable snapshots", () => {
    const first = createSourceSnapshot(base);
    const second = createSourceSnapshot(base);
    expect(first.id).toBe(second.id);
    expect(first.contentHash).toBe(second.contentHash);
    expect(Object.isFrozen(first)).toBe(true);
    expect(verifySourceSnapshot(first)).toBe(true);
  });

  it("detects tampering", () => {
    const snapshot = createSourceSnapshot(base);
    const tampered = { ...snapshot, payload: { ...snapshot.payload, year: 2024 } };
    expect(verifySourceSnapshot(tampered)).toBe(false);
  });

  it("selects valid snapshots independently of vertical", () => {
    const equifax = createSourceSnapshot(base);
    const corrections = createSourceSnapshot({
      ...base,
      entityId: "oregon-doc",
      sourceType: "agency_report",
      sourceRecordId: "doc-2025-report",
    });
    expect(selectSnapshotsForEntity([equifax, corrections], "equifax-inc")).toEqual([equifax]);
    expect(selectSnapshotsForEntity([equifax, corrections], "oregon-doc", ["agency_report"])).toEqual([corrections]);
  });
});
