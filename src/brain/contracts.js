// Canonical vocabulary and constants for the Aptitudinal Alignment construct.
// Plain-language meaning lives in docs/manual/02-vocabulary.tex; these values
// are the single source of truth for code.

export const DIMENSIONS = ["F", "C", "T", "E", "Q", "Ac"];

export const DIMENSION_NAMES = {
  F: "Fidelity",
  C: "Consistency",
  T: "Transparency",
  E: "Efficiency",
  Q: "Equity",
  Ac: "Accountability",
};

export const ALIGNMENT_STATUSES = [
  "high_alignment",
  "adequate",
  "at_risk",
  "low_alignment",
  "critical_failure",
  "insufficient_data",
  "suppressed",
];

// [min, max); ranges are checked top-down, so high_alignment wins at exactly 0.85.
export const STATUS_RANGES = {
  high_alignment: [0.85, 1.0],
  adequate: [0.7, 0.85],
  at_risk: [0.5, 0.7],
  low_alignment: [0.3, 0.5],
  critical_failure: [0.0, 0.3],
};

// Beacon credibility hierarchy — Tier 1 is authoritative, Tier 6 is supplementary.
export const SOURCE_TIERS = [
  { tier: 1, weight: 1.0, label: "Court orders, consent decrees, regulatory enforcement actions" },
  { tier: 2, weight: 0.9, label: "IG reports, GAO findings, examination summaries, sworn testimony" },
  { tier: 3, weight: 0.75, label: "Aggregated complaint databases, formal complaints" },
  { tier: 4, weight: 0.5, label: "Self-reported public filings (cross-validation required)" },
  { tier: 5, weight: 0.2, label: "Third-party research and reporting (corroboration required)" },
  { tier: 6, weight: 0.05, label: "Individual submissions — supplementary only" },
];

export const DEFAULT_WEIGHTS = {
  F: 0.22,
  C: 0.18,
  T: 0.17,
  E: 0.15,
  Q: 0.16,
  Ac: 0.12,
};

export const clamp01 = (value) => Math.min(1, Math.max(0, value));
