import { describe, it, expect } from "vitest";
import { normalizeMetricValue, createMetricObservation, aggregateMetricObservations, aggregateDimensionsFromMetrics } from "./observations";

const metric = { code: "TEST", dimension: "F", direction: "positive", weight: 1 };
const inverse = { ...metric, code: "INV", direction: "inverse" };
const bounds = { min: 0, max: 100 };

const provenance = {
  entityId: "entity-1", sourceType: "agency_report", sourceRecordId: "record-1",
  citation: "Agency report 2025", documentDate: "2025-01-01", jurisdictionCode: "US",
};

describe("metric observations", () => {
  it("normalizes and clamps positive values", () => {
    expect(normalizeMetricValue({ value: 50, bounds })).toBe(0.5);
    expect(normalizeMetricValue({ value: 200, bounds })).toBe(1);
    expect(normalizeMetricValue({ value: -2, bounds })).toBe(0);
  });

  it("inverts adverse metrics after normalization", () => {
    expect(normalizeMetricValue({ value: 25, bounds, direction: inverse.direction })).toBe(0.75);
  });

  it("preserves provenance and reports sample sufficiency", () => {
    const item = createMetricObservation({ ...provenance, metric: { ...metric, minimumSample: 10 }, value: 80, bounds, sampleSize: 4 });
    expect(item.normalizedValue).toBe(0.8);
    expect(item.sufficientSample).toBe(false);
    expect(item.citation).toBe(provenance.citation);
  });

  it("aggregates confidence-weighted observations and dimensions", () => {
    const first = createMetricObservation({ ...provenance, metric, value: 40, bounds, confidence: 1 });
    const second = createMetricObservation({ ...provenance, metric, value: 80, bounds, confidence: 3, sourceRecordId: "record-2" });
    const aggregate = aggregateMetricObservations([first, second], metric);
    expect(aggregate.value).toBeCloseTo(0.6);
    const dimensions = aggregateDimensionsFromMetrics([aggregate], [metric]);
    expect(dimensions.F.value).toBeCloseTo(0.6);
  });
});
