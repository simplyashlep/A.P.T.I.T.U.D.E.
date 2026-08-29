import { clamp01 } from "./contracts";
import { hashString } from "./evidence";

const numeric = (value, field) => {
  const result = Number(value);
  if (!Number.isFinite(result)) throw new TypeError(`${field} must be numeric`);
  return result;
};

export const normalizeMetricValue = ({ value, bounds, direction = "positive" }) => {
  const raw = numeric(value, "value");
  if (!bounds || !Number.isFinite(bounds.min) || !Number.isFinite(bounds.max) || bounds.max <= bounds.min) {
    throw new TypeError("valid normalization bounds are required");
  }
  const normalized = clamp01((raw - bounds.min) / (bounds.max - bounds.min));
  return direction === "inverse" ? 1 - normalized : normalized;
};

export const createMetricObservation = ({
  entityId,
  metric,
  value,
  bounds,
  sampleSize = 1,
  sourceType,
  sourceRecordId,
  citation,
  documentDate,
  jurisdictionCode,
  confidence,
  flags = [],
}) => {
  if (!entityId || !metric?.code || !sourceType || !sourceRecordId || !citation || !documentDate || !jurisdictionCode) {
    throw new TypeError("metric observation is missing required provenance");
  }
  const normalizedValue = normalizeMetricValue({ value, bounds, direction: metric.direction });
  const minimumSample = metric.minimumSample || 1;
  return {
    id: hashString(`${entityId}:${metric.code}:${sourceRecordId}`),
    entityId,
    metricCode: metric.code,
    dimension: metric.dimension,
    sourceType,
    sourceRecordId,
    citation,
    documentDate,
    jurisdictionCode,
    rawValue: numeric(value, "value"),
    normalizedValue,
    sampleSize: numeric(sampleSize, "sampleSize"),
    sufficientSample: Number(sampleSize) >= minimumSample,
    confidence: confidence == null ? null : clamp01(numeric(confidence, "confidence")),
    flags: [...flags],
    registryVersion: metric.registryVersion || null,
  };
};

export const aggregateMetricObservations = (observations, metric) => {
  const relevant = observations.filter((item) => item.metricCode === metric.code && item.sufficientSample);
  if (relevant.length === 0) {
    return { metricCode: metric.code, dimension: metric.dimension, value: null, count: 0, sufficient: false };
  }
  const weighted = relevant.reduce((acc, item) => {
    const weight = item.confidence == null ? 1 : item.confidence;
    return { total: acc.total + item.normalizedValue * weight, weight: acc.weight + weight };
  }, { total: 0, weight: 0 });
  return {
    metricCode: metric.code,
    dimension: metric.dimension,
    value: weighted.weight ? weighted.total / weighted.weight : null,
    count: relevant.length,
    sufficient: weighted.weight > 0,
    flags: [...new Set(relevant.flatMap((item) => item.flags || []))],
  };
};

export const aggregateDimensionsFromMetrics = (aggregates, registry) => {
  const dimensions = {};
  for (const metric of registry) {
    const item = aggregates.find((candidate) => candidate.metricCode === metric.code);
    if (!item || item.value == null) continue;
    if (!dimensions[metric.dimension]) dimensions[metric.dimension] = { total: 0, weight: 0, metrics: [] };
    dimensions[metric.dimension].total += item.value * metric.weight;
    dimensions[metric.dimension].weight += metric.weight;
    dimensions[metric.dimension].metrics.push(item.metricCode);
  }
  return Object.fromEntries(Object.entries(dimensions).map(([dimension, value]) => [dimension, {
    value: value.weight ? value.total / value.weight : null,
    metrics: value.metrics,
  }]));
};
