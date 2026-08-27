# Aptitudinal Alignment Construct Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared evidence foundation and universal Alignment Score engine as a testable in-app module, add case-type filtering with a scale-and-rotate side panel to the Judiciary page, and create the compartmentalized-but-combined XeLaTeX manual that documents the construct.

**Architecture:** A pure JavaScript "brain" library under `src/brain/` (contracts → evidence → potential profiles → scoring engine) with unit tests, consumed by the React UI. The Judiciary page's filter logic is extracted into pure functions so it is testable; a new side panel applies the approved scale/rotate transition with adaptive intensity and full keyboard/reduced-motion support. The manual lives under `docs/manual/` as one master `.tex` that `\input{}`s compartment files, so each concern is separately editable yet compiled as one document.

**Tech Stack:** Vite 6, React 19, Tailwind CSS, lucide-react; new devDependencies: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`; XeLaTeX for the manual.

## Global Constraints

- Terminology is locked: the result is the **Alignment Score** (never "Composite Score" or "Aptitude Score" as a product term); the six explainable components are **dimension scores**; the outcome category is **Alignment Status**; each scored subject is an **entity** with a versioned **potential profile**.
- Dimension symbols are unambiguous: `F` Fidelity, `C` Consistency, `T` Transparency, `E` Efficiency, `Q` Equity, `Ac` Accountability.
- Default weights (sum to 1.0): F 0.22, C 0.18, T 0.17, E 0.15, Q 0.16, Ac 0.12.
- Status values: `high_alignment` (≥0.85), `adequate` (≥0.70), `at_risk` (≥0.50), `low_alignment` (≥0.30), `critical_failure` (<0.30), plus `insufficient_data` and `suppressed`.
- A score is emitted **only** when evidence thresholds pass; otherwise status is `insufficient_data` with an `evidence_summary.missing_requirements` list.
- Evidence thresholds (default): ≥12 behavioral quanta per dimension from ≥3 distinct source types.
- Normalized values are clamped to `[0, 1]` — no extrapolation.
- Public institutional records are the primary evidence basis; `individual_submission` is Tier 6 (weight 0.05) and never primary.
- The quantum model is an analytical metaphor and data abstraction — never literal quantum computation.
- "Composite score" must not appear in product copy; `alignment_score` is the field name in code and the manual.
- Project uses plain JavaScript (no TypeScript), ESM (`"type": "module"`), Tailwind utility classes, and `data-testid` attributes for test hooks.
- All visual effects must honor `prefers-reduced-motion: reduce`.
- The user's source `.tex` files on their Desktop are read-only inputs; the manual is authored in this repository under `docs/manual/`.

---

### Task 1: Brain contracts + test infrastructure

**Files:**
- Modify: `package.json` (add `test` script + devDependencies)
- Create: `src/brain/contracts.js`
- Test: `src/brain/contracts.test.js`

**Interfaces:**
- Consumes: nothing (first task).
- Produces:
  - `DIMENSIONS` — `["F","C","T","E","Q","Ac"]`
  - `DIMENSION_NAMES` — `{ F:"Fidelity", C:"Consistency", T:"Transparency", E:"Efficiency", Q:"Equity", Ac:"Accountability" }`
  - `ALIGNMENT_STATUSES` — `["high_alignment","adequate","at_risk","low_alignment","critical_failure","insufficient_data","suppressed"]`
  - `STATUS_RANGES` — `{ high_alignment:[0.85,1], adequate:[0.7,0.85), at_risk:[0.5,0.7), low_alignment:[0.3,0.5), critical_failure:[0,0.3) }`
  - `SOURCE_TIERS` — array of `{ tier, weight, label }` matching the Beacon credibility hierarchy (1→1.00 … 6→0.05)
  - `DEFAULT_WEIGHTS` — `{ F:0.22, C:0.18, T:0.17, E:0.15, Q:0.16, Ac:0.12 }`
  - `clamp01(value)` — clamp a number to `[0, 1]`

- [ ] **Step 1: Install the test runner**

```bash
npm install -D vitest@^3.2.4 jsdom@^26 @testing-library/react@^16 @testing-library/jest-dom@^6
```

- [ ] **Step 2: Add the test script**

In `package.json`, under `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 3: Write the failing test**

`src/brain/contracts.test.js`:

```js
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
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './contracts'`

- [ ] **Step 5: Implement `src/brain/contracts.js`**

```js
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
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test`
Expected: PASS (all 6 tests)

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/brain/contracts.js src/brain/contracts.test.js
git commit -m "feat: brain contracts and vitest infrastructure"
```

---

### Task 2: Evidence model with provenance

**Files:**
- Create: `src/brain/evidence.js`
- Test: `src/brain/evidence.test.js`

**Interfaces:**
- Consumes: `clamp01` from `./contracts` (used to validate raw values).
- Produces:
  - `hashString(str)` — deterministic 32-bit hex hash (djb2).
  - `ALLOWED_SOURCE_TYPES` — `["public_record","regulatory_filing","court_decision","agency_report","cfpb_complaint","ftc_action","inspector_general","individual_submission"]`
  - `normalizeEvidence(raw)` — throws `TypeError` with a descriptive message on missing/unknown fields; returns a fully populated evidence item (shape below).

Normalized evidence item shape:

```js
{
  id,                      // hashString(entityId + eventId + sourceRecordId)
  entityId,                // string
  eventId,                 // string
  sourceRecordId,          // string
  sourceType,              // one of ALLOWED_SOURCE_TYPES
  credibilityTier,         // integer 1..6 (forced to 6 for individual_submission)
  citation,                // string (required)
  documentDate,            // ISO date string (required)
  jurisdictionCode,        // string (required)
  dimension,               // "F"|"C"|"T"|"E"|"Q"|"Ac" (required)
  rawValue,                // number in [0,1] after clamp01 (required)
  confidence,              // number 0..1 (defaults to credibilityTier weight)
  processingVersion,       // "brain-v1"
  ontologyVersion,         // "ontology-v1"
  metricRegistryVersion,   // "metrics-v1"
  normalizationVersion,    // "norm-v1"
  inputHash,               // hashString(JSON.stringify(raw))
  recordedAt,              // ISO timestamp of normalization
}
```

- [ ] **Step 1: Write the failing test**

`src/brain/evidence.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './evidence'`

- [ ] **Step 3: Implement `src/brain/evidence.js`**

```js
import { clamp01, DIMENSIONS, SOURCE_TIERS } from "./contracts";

// Deterministic djb2-style hash → 8 hex chars. Used for ids and audit hashes.
export const hashString = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
};

export const ALLOWED_SOURCE_TYPES = [
  "public_record", "regulatory_filing", "court_decision", "agency_report",
  "cfpb_complaint", "ftc_action", "inspector_general", "individual_submission",
];

const REQUIRED = [
  "entityId", "eventId", "sourceRecordId", "citation",
  "documentDate", "jurisdictionCode", "rawValue",
];

export const normalizeEvidence = (raw) => {
  for (const key of REQUIRED) {
    if (raw[key] == null || raw[key] === "") {
      throw new TypeError(`Evidence missing required field: ${key}`);
    }
  }
  if (!ALLOWED_SOURCE_TYPES.includes(raw.sourceType)) {
    throw new TypeError(`Evidence has unknown sourceType: ${raw.sourceType}`);
  }
  if (!DIMENSIONS.includes(raw.dimension)) {
    throw new TypeError(`Evidence has unknown dimension: ${raw.dimension}`);
  }

  const isIndividual = raw.sourceType === "individual_submission";
  const tier = isIndividual ? 6 : raw.credibilityTier ?? inferTier(raw.sourceType);
  const tierWeight = (SOURCE_TIERS.find((t) => t.tier === tier) || { weight: 0.05 }).weight;

  return {
    id: hashString(`${raw.entityId}${raw.eventId}${raw.sourceRecordId}`),
    entityId: raw.entityId,
    eventId: raw.eventId,
    sourceRecordId: raw.sourceRecordId,
    sourceType: raw.sourceType,
    credibilityTier: tier,
    citation: raw.citation,
    documentDate: raw.documentDate,
    jurisdictionCode: raw.jurisdictionCode,
    dimension: raw.dimension,
    rawValue: clamp01(Number(raw.rawValue)),
    confidence: raw.confidence ?? tierWeight,
    processingVersion: "brain-v1",
    ontologyVersion: "ontology-v1",
    metricRegistryVersion: "metrics-v1",
    normalizationVersion: "norm-v1",
    inputHash: hashString(JSON.stringify(raw)),
    recordedAt: new Date().toISOString(),
  };
};

// Best-effort default tier when the caller did not supply one.
const inferTier = (sourceType) => {
  switch (sourceType) {
    case "court_decision": return 1;
    case "agency_report": return 2;
    case "cfpb_complaint":
    case "ftc_action": return 3;
    case "regulatory_filing": return 4;
    case "public_record": return 3;
    case "inspector_general": return 2;
    default: return 6;
  }
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/brain/evidence.js src/brain/evidence.test.js
git commit -m "feat: evidence model with provenance and version fields"
```

---

### Task 3: Potential profiles

**Files:**
- Create: `src/brain/potential.js`
- Test: `src/brain/potential.test.js`

**Interfaces:**
- Consumes: `DEFAULT_WEIGHTS`, `DIMENSIONS` from `./contracts`.
- Produces:
  - `JUDGE_PROFILE_ID = "judge-oregon-circuit-v1"`
  - `POTENTIAL_PROFILES` — object keyed by profile id
  - `getPotentialProfile(entityType, entityClass = "")` — returns the matching profile or the generic fallback; never throws.

Profile shape:

```js
{
  id: "judge-oregon-circuit-v1",
  entityType: "judge",
  entityClass: "oregon-circuit",
  label: "Oregon Circuit Court Judge",
  weights: { F:0.22, C:0.18, T:0.17, E:0.15, Q:0.16, Ac:0.12 },
  minEvidence: { perDimension: 12, minSourceTypes: 3 },
  hardFloors: {
    Q: [
      { trigger: "intentional_discrimination_finding", floor: 0.15 },
      { trigger: "active_consent_decree", floor: 0.25 },
      { trigger: "pattern_or_practice_finding", floor: 0.20 },
    ],
  },
  metricRegistryVersion: "metrics-v1",
}
```

- [ ] **Step 1: Write the failing test**

`src/brain/potential.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './potential'`

- [ ] **Step 3: Implement `src/brain/potential.js`**

```js
import { DEFAULT_WEIGHTS } from "./contracts";

export const JUDGE_PROFILE_ID = "judge-oregon-circuit-v1";

const genericProfile = {
  id: "generic-v1",
  entityType: "institution",
  entityClass: "",
  label: "Generic Institution",
  weights: { ...DEFAULT_WEIGHTS },
  minEvidence: { perDimension: 12, minSourceTypes: 3 },
  hardFloors: {
    Q: [
      { trigger: "intentional_discrimination_finding", floor: 0.15 },
      { trigger: "active_consent_decree", floor: 0.25 },
      { trigger: "pattern_or_practice_finding", floor: 0.20 },
    ],
  },
  metricRegistryVersion: "metrics-v1",
};

const judgeProfile = {
  ...genericProfile,
  id: JUDGE_PROFILE_ID,
  entityType: "judge",
  entityClass: "oregon-circuit",
  label: "Oregon Circuit Court Judge",
};

export const POTENTIAL_PROFILES = {
  [JUDGE_PROFILE_ID]: judgeProfile,
  "generic-v1": genericProfile,
};

export const getPotentialProfile = (entityType, entityClass = "") => {
  if (entityType === "judge" && entityClass === "oregon-circuit") return judgeProfile;
  return genericProfile;
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/brain/potential.js src/brain/potential.test.js
git commit -m "feat: potential profiles with versioned weights and hard floors"
```

---

### Task 4: Alignment scoring engine

**Files:**
- Create: `src/brain/alignment.js`
- Test: `src/brain/alignment.test.js`

**Interfaces:**
- Consumes: `normalizeEvidence` from `./evidence`, `getPotentialProfile` from `./potential`, `STATUS_RANGES`, `clamp01`, `DIMENSIONS`, `DIMENSION_NAMES` from `./contracts`, `hashString` from `./evidence`.
- Produces:
  - `computeAlignmentScore({ entity, evidence, profile, flags = [] })` — pure function; `evidence` is an array of already-normalized evidence items (from Task 2) or raw objects (normalized internally); returns the universal contract:

```js
{
  entity_id,                    // entity.id
  entity_type,                  // entity.type
  potential_profile_version,    // profile.id
  alignment_score,              // number 0..1, or null when insufficient/suppressed
  alignment_status,             // one of ALIGNMENT_STATUSES
  dimensions: { F: number|null, C: number|null, T: number|null, E: number|null, Q: number|null, Ac: number|null },
  evidence_summary: { count, source_types: [], missing_requirements: [] },
  flags: [],                    // input flags that were applied
  audit_reference,              // hashString(entity.id + profile.id + inputHashes)
}
```

Rules:
1. Normalize each evidence item; items that fail normalization are skipped (not fatal).
2. Group by dimension. A dimension scores only if its count ≥ `profile.minEvidence.perDimension` AND the union of its source types across all evidence ≥ `profile.minEvidence.minSourceTypes`. Otherwise the dimension is `null` and `missing_requirements` explains why.
3. Dimension score = weighted average of `rawValue` (clamp01) over that dimension's items.
4. Apply hard floors: for each `hardFloors[dim]` entry whose `trigger` is present in `flags`, the dimension score is raised to at least `floor` (max applicable floor wins). Record applied floors in `flags`.
5. If any dimension is `null` → `alignment_status = "insufficient_data"`, `alignment_score = null`.
6. If `flags` includes `"suppressed"` → status `"suppressed"`, score `null`.
7. Otherwise `alignment_score = Σ weights[d] * dimension[d]`; status from `STATUS_RANGES` checked top-down.

- [ ] **Step 1: Write the failing test**

`src/brain/alignment.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './alignment'`

- [ ] **Step 3: Implement `src/brain/alignment.js`**

```js
import { STATUS_RANGES, DIMENSIONS, DIMENSION_NAMES, clamp01 } from "./contracts";
import { normalizeEvidence, hashString } from "./evidence";
import { getPotentialProfile } from "./potential";

const statusForScore = (score) => {
  for (const [status, [min, max]] of Object.entries(STATUS_RANGES)) {
    if (score >= min && score < max) return status;
  }
  return "critical_failure";
};

export const computeAlignmentScore = ({ entity, evidence, profile, flags = [] }) => {
  const activeProfile = profile || getPotentialProfile(entity.type, entity.class || "");

  const items = evidence
    .map((raw) => {
      try {
        return normalizeEvidence({ ...raw, entityId: raw.entityId || entity.id });
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const byDimension = {};
  for (const d of DIMENSIONS) byDimension[d] = [];
  for (const item of items) byDimension[item.dimension].push(item);

  const sourceTypeUnion = new Set(items.map((i) => i.sourceType));

  const dimensions = {};
  const missing_requirements = [];
  for (const d of DIMENSIONS) {
    const group = byDimension[d];
    const reasons = [];
    if (group.length < activeProfile.minEvidence.perDimension) {
      reasons.push(`Dimension ${DIMENSION_NAMES[d]} (${d}) has ${group.length} quanta; minimum is ${activeProfile.minEvidence.perDimension}`);
    }
    if (sourceTypeUnion.size < activeProfile.minEvidence.minSourceTypes) {
      reasons.push(`Only ${sourceTypeUnion.size} distinct source types; minimum is ${activeProfile.minEvidence.minSourceTypes}`);
    }
    if (reasons.length > 0) {
      dimensions[d] = null;
      missing_requirements.push(...reasons);
    } else {
      dimensions[d] = clamp01(
        group.reduce((sum, i) => sum + i.rawValue, 0) / group.length
      );
    }
  }

  // Hard floors (Equity, per the Beacon specification)
  const appliedFlags = [...flags];
  for (const d of DIMENSIONS) {
    const floors = activeProfile.hardFloors?.[d] || [];
    if (dimensions[d] == null || floors.length === 0) continue;
    const applicable = floors.filter((f) => flags.includes(f.trigger));
    if (applicable.length > 0) {
      const floor = Math.max(...applicable.map((f) => f.floor));
      dimensions[d] = Math.max(dimensions[d], floor);
      for (const f of applicable) appliedFlags.push(f.trigger);
    }
  }

  const anyMissing = DIMENSIONS.some((d) => dimensions[d] == null);

  let alignment_score = null;
  let alignment_status;
  if (flags.includes("suppressed")) {
    alignment_status = "suppressed";
  } else if (anyMissing) {
    alignment_status = "insufficient_data";
  } else {
    alignment_score = clamp01(
      DIMENSIONS.reduce((sum, d) => sum + activeProfile.weights[d] * dimensions[d], 0)
    );
    alignment_status = statusForScore(alignment_score);
  }

  const inputHash = hashString(items.map((i) => i.inputHash).join(""));
  return {
    entity_id: entity.id,
    entity_type: entity.type,
    potential_profile_version: activeProfile.id,
    alignment_score,
    alignment_status,
    dimensions,
    evidence_summary: {
      count: items.length,
      source_types: [...sourceTypeUnion].sort(),
      missing_requirements,
    },
    flags: appliedFlags,
    audit_reference: hashString(entity.id + activeProfile.id + inputHash),
  };
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS (all 5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/brain/alignment.js src/brain/alignment.test.js
git commit -m "feat: alignment scoring engine with insufficient-data and hard floors"
```

---

### Task 5: Judiciary case-type registry and filter logic

**Files:**
- Create: `src/components/judiciary/CaseType.js`
- Create: `src/components/judiciary/filters.js`
- Test: `src/components/judiciary/filters.test.js`

**Interfaces:**
- Consumes: nothing from earlier tasks (this is UI-domain logic; it does not import the brain module).
- Produces:
  - `CASE_TYPES = ["Criminal","Family","Probate","Civil","Juvenile","Other"]`
  - `deriveCaseTypes(judge)` — returns an array of case types derived from `judge.focus`; a judge with only "General judicial profile" (or no focus) returns `["Other"]`. Matching rules (case-insensitive, tested in this order):
    - `/criminal|felony|drug court|duii|\bdui\b|gang|repeat offender/i` → `"Criminal"`
    - `/family law|domestic relations|child welfare|child support|adoption|child custody/i` → `"Family"`
    - `/probate/i` → `"Probate"`
    - `/civil/i` → `"Civil"`
    - `/juvenile/i` → `"Juvenile"`
    - fallback → `"Other"`
  - `applyJudgeFilters(judges, filters)` — pure filter; `filters = { q, county, risk, court, caseTypes }` where `caseTypes` is an array; a judge matches when **any** of their derived case types is in the selected set (empty set = no case filter). Returns filtered array.

- [ ] **Step 1: Write the failing test**

`src/components/judiciary/filters.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './CaseType'`

- [ ] **Step 3: Implement `src/components/judiciary/CaseType.js`**

```js
// Stable case-type registry for the Judiciary filter panel.
export const CASE_TYPES = ["Criminal", "Family", "Probate", "Civil", "Juvenile", "Other"];

const RULES = [
  { type: "Criminal", re: /criminal|felony|drug court|duii|\bdui\b|gang|repeat offender/i },
  { type: "Family",   re: /family law|domestic relations|child welfare|child support|adoption|child custody/i },
  { type: "Probate",  re: /probate/i },
  { type: "Civil",    re: /civil/i },
  { type: "Juvenile", re: /juvenile/i },
];

export const deriveCaseTypes = (judge) => {
  const focus = judge.focus || "";
  if (!focus || /general/i.test(focus)) return ["Other"];
  const matched = RULES.filter((r) => r.re.test(focus)).map((r) => r.type);
  return matched.length > 0 ? matched : ["Other"];
};
```

- [ ] **Step 4: Implement `src/components/judiciary/filters.js`**

```js
import { deriveCaseTypes } from "./CaseType";

export const applyJudgeFilters = (judges, filters = {}) => {
  const { q = "", county = "", risk = "", court = "", caseTypes = [] } = filters;
  const lowerQ = q.trim().toLowerCase();
  return judges.filter((judge) => {
    const haystack = [
      judge.name, judge.county, judge.category, judge.court,
      judge.roleTitle, judge.tenureDisplay, judge.focus, judge.flags?.join(" "),
    ].filter(Boolean).join(" ").toLowerCase();
    if (lowerQ && !haystack.includes(lowerQ)) return false;
    if (county && judge.county !== county) return false;
    if (risk && judge.riskLevel !== risk) return false;
    if (court && judge.category !== court && judge.court !== court) return false;
    if (caseTypes.length > 0) {
      const mine = deriveCaseTypes(judge);
      if (!mine.some((t) => caseTypes.includes(t))) return false;
    }
    return true;
  });
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/judiciary/CaseType.js src/components/judiciary/filters.js src/components/judiciary/filters.test.js
git commit -m "feat: judiciary case-type registry and testable filter logic"
```

---

### Task 6: Judiciary side panel with scale-and-rotate transition

**Files:**
- Create: `src/components/judiciary/FilterPanel.jsx`
- Create: `src/components/judiciary/FilterPanel.test.jsx`
- Modify: `src/pages/Judiciary.jsx`

**Interfaces:**
- Consumes: `CASE_TYPES`, `deriveCaseTypes` from `./CaseType`; `applyJudgeFilters` from `./filters`; the page's existing `staticJudges`, `stats` (from `buildStats`).
- Produces:
  - `FilterPanel({ open, onClose, triggerRef, filters, onChange, resultCount })` where `filters = { q, county, risk, court, caseTypes }` and `onChange(nextFilters)` replaces the whole filter object.
  - `Judiciary.jsx` renders a trigger button ("Filters", `data-testid="judiciary-filter-trigger"`), wraps page content in a perspective container, and applies the scale/rotate transform when open.

Behavior requirements:
- The panel is a right-side dialog (`role="dialog"`, `aria-modal="true"`, `aria-label="Filter judges"`).
- Contains: search input, county/court/risk selects (reusing the existing `FilterSelect`), multi-select case-type checkbox chips, clear-all button, close button, live result count.
- Escape closes; backdrop click closes; on open, focus moves to the first control; on close, focus returns to the trigger; a simple focus trap keeps Tab within the panel while open.
- Transition: when open, the page surface gets `transform: perspective(1400px) scale(0.97) rotateY(2.5deg)` on desktop (≥768px) with a 500ms cubic-bezier ease; on narrow screens a full-height drawer without rotation; under `prefers-reduced-motion` no transform at all, only opacity.
- The panel itself slides in from the right (`translateX(0)` when open, `translateX(100%)` when closed) with a backdrop fading in.

- [ ] **Step 1: Write the failing component test**

`src/components/judiciary/FilterPanel.test.jsx` (first line must be `// @vitest-environment jsdom`):

```jsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import FilterPanel from "./FilterPanel";

const makeProps = (over = {}) => ({
  open: true,
  onClose: vi.fn(),
  triggerRef: { current: null },
  filters: { q: "", county: "", risk: "", court: "", caseTypes: [] },
  onChange: vi.fn(),
  resultCount: 211,
  counties: ["Multnomah", "Clackamas"],
  courts: ["Circuit Court", "COA"],
  ...over,
});

describe("FilterPanel", () => {
  it("renders the dialog with an accessible name", () => {
    render(<FilterPanel {...makeProps()} />);
    expect(screen.getByRole("dialog", { name: /filter judges/i })).toBeInTheDocument();
  });

  it("toggles a case-type chip and calls onChange with the new selection", () => {
    const onChange = vi.fn();
    render(<FilterPanel {...makeProps({ onChange })} />);
    fireEvent.click(screen.getByLabelText("Criminal"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ caseTypes: ["Criminal"] }));
  });

  it("shows the live result count", () => {
    render(<FilterPanel {...makeProps({ resultCount: 12 })} />);
    expect(screen.getByText(/12 judges matched/i)).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const onClose = vi.fn();
    const triggerRef = { current: document.createElement("button") };
    document.body.appendChild(triggerRef.current);
    triggerRef.current.focus();
    render(<FilterPanel {...makeProps({ onClose, triggerRef })} />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
    expect(document.activeElement).toBe(triggerRef.current);
  });

  it("calls clear-all with empty filters", () => {
    const onChange = vi.fn();
    render(<FilterPanel {...makeProps({ onChange })} />);
    fireEvent.click(screen.getByTestId("filter-clear-all"));
    expect(onChange).toHaveBeenCalledWith({ q: "", county: "", risk: "", court: "", caseTypes: [] });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './FilterPanel'`

- [ ] **Step 3: Implement `src/components/judiciary/FilterPanel.jsx`**

```jsx
import React, { useEffect, useRef } from "react";
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { CASE_TYPES } from "./CaseType";

const FILTER_LABELS = {
  critical: "Critical", high: "High", moderate: "Moderate", low: "Low", pending: "Pending",
};

const CaseTypeChip = ({ type, checked, onToggle }) => (
  <label className="flex items-center gap-2.5 px-4 py-2.5 border rounded-sm cursor-pointer transition-colors select-none"
    style={{
      borderColor: checked ? "rgba(200,169,126,0.6)" : "rgba(245,241,230,0.12)",
      background: checked ? "rgba(200,169,126,0.1)" : "transparent",
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className="accent-[#C8A97E] w-4 h-4"
      aria-label={type}
      data-testid={`case-type-${type.toLowerCase()}`}
    />
    <span className="text-[12px] uppercase tracking-[0.24em] text-ivory-dim">{type}</span>
  </label>
);

const FilterPanel = ({ open, onClose, triggerRef, filters, onChange, resultCount, counties, courts }) => {
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Close helper: close the panel and hand focus back to the trigger.
  const close = () => {
    onClose();
    triggerRef.current?.focus();
  };

  // Focus management: move into the panel on open.
  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [open]);

  // Escape + simple focus trap.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll("input, select, button");
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={close}
        data-testid="filter-backdrop"
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter judges"
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[420px] flex flex-col bg-[#0A0F1A] border-l border-[rgba(200,169,126,0.25)] shadow-2xl"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 460ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        data-testid="filter-panel"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span className="font-display text-xl text-ivory">Filters</span>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close filters"
            className="text-secondary hover:text-gold transition-colors p-1"
            data-testid="filter-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Search */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-q">Search</label>
            <input
              ref={firstFieldRef}
              id="fp-q"
              type="text"
              value={filters.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="Name, county, or court…"
              className="w-full apt-search-soft px-4 py-3 text-[14px]"
              data-testid="fp-search"
            />
          </div>

          {/* County / Court / Risk selects */}
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-county">County</label>
              <select id="fp-county" value={filters.county} onChange={(e) => set({ county: e.target.value })}
                className="apt-search-soft w-full px-4 py-3 text-[13px] uppercase tracking-[0.2em] text-ivory-dim appearance-none cursor-pointer" data-testid="fp-county">
                <option value="">All counties</option>
                {counties.map((c) => <option key={c} value={c} className="bg-[#0A0F1A]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-court">Court</label>
              <select id="fp-court" value={filters.court} onChange={(e) => set({ court: e.target.value })}
                className="apt-search-soft w-full px-4 py-3 text-[13px] uppercase tracking-[0.2em] text-ivory-dim appearance-none cursor-pointer" data-testid="fp-court">
                <option value="">All courts</option>
                {courts.map((c) => <option key={c} value={c} className="bg-[#0A0F1A]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-risk">Risk level</label>
              <select id="fp-risk" value={filters.risk} onChange={(e) => set({ risk: e.target.value })}
                className="apt-search-soft w-full px-4 py-3 text-[13px] uppercase tracking-[0.2em] text-ivory-dim appearance-none cursor-pointer" data-testid="fp-risk">
                <option value="">All risk levels</option>
                {Object.entries(FILTER_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-[#0A0F1A]">{v}</option>)}
              </select>
            </div>
          </div>

          {/* Case type — multi-select */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3">Case type</label>
            <div className="grid grid-cols-2 gap-2.5">
              {CASE_TYPES.map((t) => (
                <CaseTypeChip
                  key={t} type={t}
                  checked={filters.caseTypes.includes(t)}
                  onToggle={() => set({
                    caseTypes: filters.caseTypes.includes(t)
                      ? filters.caseTypes.filter((x) => x !== t)
                      : [...filters.caseTypes, t],
                  })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-line space-y-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-secondary" data-testid="fp-result-count">
            <span>{resultCount} {resultCount === 1 ? "judge" : "judges"} matched</span>
            <span className="text-gold">211 total</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange({ q: "", county: "", risk: "", court: "", caseTypes: [] })}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-[rgba(200,169,126,0.35)] text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
              data-testid="filter-clear-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />Clear all
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] transition-colors"
              data-testid="filter-apply"
            >
              Apply
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;
```

- [ ] **Step 4: Run the component test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Rewire the Judiciary page**

Replace the toolbar block in `src/pages/Judiciary.jsx` (the section containing the search input, the three `FilterSelect` rows, and the reset button) and the filter state. Concretely:

1. Add imports at the top. Change the React import line to include `useRef`:

```jsx
import React, { useMemo, useState, useRef } from "react";
```

And add (after the existing lucide import):

```jsx
import { SlidersHorizontal } from "lucide-react";
import FilterPanel from "../components/judiciary/FilterPanel";
import { applyJudgeFilters } from "../components/judiciary/filters";
```

2. Replace the state declarations with a single filters object plus panel state:

```jsx
const [filters, setFilters] = useState({ q: "", county: "", risk: "", court: "", caseTypes: [] });
const [panelOpen, setPanelOpen] = useState(false);
const filterTriggerRef = useRef(null);
```

3. Replace the `filteredJudges` useMemo body to call the pure function:

```jsx
const filteredJudges = useMemo(
  () => applyJudgeFilters(staticJudges, filters),
  [filters]
);
```

4. Replace `const showReset = Boolean(q || county || risk || court);` with:

```jsx
const showReset = Object.values(filters).some((v) =>
  Array.isArray(v) ? v.length > 0 : Boolean(v)
);
```

5. In the toolbar area, replace the search input + three `FilterSelect`s + reset button with a single trigger:

```jsx
<div className="flex flex-col xl:flex-row xl:items-end gap-4 mb-8" data-testid="judiciary-toolbar">
  <div className="flex-1" />
  <button
    ref={filterTriggerRef}
    type="button"
    onClick={() => setPanelOpen(true)}
    className="inline-flex items-center gap-3 px-6 py-3 border border-[rgba(200,169,126,0.4)] text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
    data-testid="judiciary-filter-trigger"
  >
    <SlidersHorizontal className="w-4 h-4" />
    {showReset ? "Refine filters" : "Filters"}
    {showReset && <span className="w-1.5 h-1.5 rounded-full bg-[var(--apt-gold)]" />}
  </button>
</div>
```

6. Remove the now-unused `FilterSelect` component from the file (it is superseded by the panel's inline selects) and the now-unused `Search` and `X` lucide imports if no longer referenced.

7. Wrap the page content for the perspective transform. Change the return so the page body (PageHeader + sections + Footer) sits inside a wrapper with `style={{ perspective: "1400px" }}`, and give the inner wrapper a class `judiciary-surface` that gets `judiciary-surface-open` when `panelOpen`. The `<FilterPanel>` goes inside the page's root div, after the Footer:

```jsx
<FilterPanel
  open={panelOpen}
  onClose={() => setPanelOpen(false)}
  triggerRef={filterTriggerRef}
  filters={filters}
  onChange={setFilters}
  resultCount={filteredJudges.length}
  counties={stats.counties.map((c) => c.name)}
  courts={stats.courts}
/>
```

8. Add the transition styles to `src/App.css`:

```css
.judiciary-surface {
  transform-origin: center center;
  transition: transform 500ms cubic-bezier(0.23, 1, 0.32, 1), filter 500ms ease;
}
.judiciary-surface-open {
  transform: perspective(1400px) scale(0.965) rotateY(2.5deg);
  filter: brightness(0.92);
}
@media (max-width: 768px) {
  .judiciary-surface-open { transform: none; filter: brightness(0.9); }
}
@media (prefers-reduced-motion: reduce) {
  .judiciary-surface { transition: filter 200ms ease; }
  .judiciary-surface-open { transform: none; }
}
```

- [ ] **Step 6: Build and verify in the preview**

Run: `npm run build`
Then open the dev server preview, navigate to `/judiciary`, click the Filters trigger, and confirm: panel opens with the page tilted back; case-type chips filter the grid; Escape closes and returns focus; the page straightens. Also verify with DevTools emulation at 375px width (no rotation, full-height drawer) and with `prefers-reduced-motion: reduce` emulation (no rotation).

- [ ] **Step 7: Commit**

```bash
git add src/components/judiciary/FilterPanel.jsx src/components/judiciary/FilterPanel.test.jsx src/pages/Judiciary.jsx src/App.css
git commit -m "feat: judiciary scale-and-rotate filter panel with case-type filtering"
```

---

### Task 7: Compartmentalized XeLaTeX manual

**Files:**
- Create: `docs/manual/00-main.tex`
- Create: `docs/manual/01-overview.tex`
- Create: `docs/manual/02-vocabulary.tex`
- Create: `docs/manual/03-evidence-foundation.tex`
- Create: `docs/manual/04-legal-intelligence.tex`
- Create: `docs/manual/05-alignment-scoring.tex`
- Create: `docs/manual/06-dimensions.tex`
- Create: `docs/manual/07-sources-normalization.tex`
- Create: `docs/manual/08-governance-reproducibility.tex`
- Create: `docs/manual/09-implementation-phases.tex`
- Create: `docs/manual/build.sh`
- Create: `docs/manual/README.md`

**Interfaces:**
- Consumes: the approved spec (`docs/superpowers/specs/2026-08-27-brain-foundation-judiciary-branding-design.md`) and the two source manuals on the user's Desktop (read-only inputs).
- Produces: a compilable XeLaTeX document. `00-main.tex` is the only entry point; every compartment is `\input{}`ed by it. Each compartment is independently editable; `build.sh` compiles the combined document.

- [ ] **Step 1: Create the master document `docs/manual/00-main.tex`**

```latex
%% Aptitudinal Alignment — Institutional Fidelity Field Theory
%% Master document. Compartmentalized sections are \input from this file,
%% so each concern stays independently editable while compiling as one manual.
%% Compile: xelatex 00-main.tex   (run twice for the table of contents)
\documentclass[a4paper,11pt]{article}
\usepackage{fontspec}
\setmainfont{Times New Roman}
\setsansfont{Arial}
\setmonofont{Courier New}

\usepackage[margin=2.6cm]{geometry}
\usepackage{microtype}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{array}
\usepackage{colortbl}
\usepackage{xcolor}
\usepackage{listings}
\usepackage{hyperref}
\usepackage{titlesec}

\definecolor{navy}{HTML}{1B2A4A}
\definecolor{aptblue}{HTML}{2563EB}
\definecolor{teal}{HTML}{0D9488}
\definecolor{aptred}{HTML}{DC2626}
\definecolor{aptgreen}{HTML}{16A34A}
\definecolor{aptslate}{HTML}{64748B}
\definecolor{aptlight}{HTML}{F1F5F9}

\titleformat{\section}{\sffamily\Large\bfseries\color{navy}}{}{0em}{}[\titlerule]
\titleformat{\subsection}{\sffamily\large\bfseries\color{aptblue}}{}{0em}{}
\titleformat{\subsubsection}{\sffamily\normalsize\bfseries\color{teal}}{}{0em}{}

\lstset{
  basicstyle=\ttfamily\small,
  breaklines=true,
  frame=single,
  columns=fullflexible,
  backgroundcolor=\color{aptlight},
}

\newcommand{\invariantbox}[1]{%
  \par\noindent\fboxsep 8pt\fcolorbox{aptred}{white}{%
    \parbox{\dimexpr\linewidth-2\fboxsep-2\fboxrule\relax}{#1}}\par
}

\title{Aptitudinal Alignment\\Institutional Fidelity Field Theory}
\author{Aptitude Systems}
\date{Version 2.0 \quad August 2026}

\begin{document}
\maketitle
\tableofcontents
\newpage

\input{01-overview}
\input{02-vocabulary}
\input{03-evidence-foundation}
\input{04-legal-intelligence}
\input{05-alignment-scoring}
\input{06-dimensions}
\input{07-sources-normalization}
\input{08-governance-reproducibility}
\input{09-implementation-phases}

\end{document}
```

- [ ] **Step 2: Create `docs/manual/01-overview.tex`** with exactly this content:

```latex
\section{Introduction}

Aptitudinal Alignment measures how closely a public institution's documented
conduct aligns with what that institution is capable of and obligated to
achieve. It is designed as a reverse-FICO system for public entities: instead
of scoring an individual's credit risk, every eligible \emph{entity} --- a
judge, court, agency, office, or institution --- receives one explainable
\emph{Alignment Score} derived from the public record.

Each public record, decision, or procedural act is treated as a discrete unit
of institutional behavior. These units interact through measurable fields of
fidelity, consistency, transparency, efficiency, equity, and accountability.
The emergent field defines the Alignment Score.

\section{Product Language}

\begin{itemize}
  \item The page and system name is \textbf{Aptitudinal Alignment}.
  \item The single entity result is the \textbf{Alignment Score}.
  \item The six explainable components are \textbf{dimension scores}.
  \item The interpreted category is the \textbf{Alignment Status}.
  \item Each scored subject is an \textbf{entity} with a versioned
        \textbf{potential profile}.
\end{itemize}

The term ``Composite Score'' is not a product term. Wherever source material
said ``Aptitude Score'' or ``composite,'' the unified manual says
``Alignment Score.''

\section{Design Principles}

\begin{itemize}
  \item The quantum model is an analytical metaphor and data abstraction ---
        not literal quantum computation.
  \item Public institutional records are the primary and sufficient
        evidentiary basis.
  \item A score is never invented when evidence thresholds are not met; the
        result is \texttt{insufficient\_data} with explicit reasons.
  \item Raw inputs and derived outputs are preserved separately so every
        score can be recomputed.
  \item Legal-intelligence conclusions and institutional scores are separate
        bounded products.
  \item No Alignment Score is a finding of individual wrongdoing, a prediction
        of future conduct, or a substitute for an official finding.
\end{itemize}
```

- [ ] **Step 3: Create `docs/manual/02-vocabulary.tex`** with exactly this content:

```latex
\section{Canonical Vocabulary}

One vocabulary is used across the codebase, the API, and this manual.

\begin{center}
\begin{longtable}{p{4.4cm} p{10.5cm}}
\toprule
\textbf{Term} & \textbf{Meaning} \\
\midrule
\endhead
Evidence item & A sourced institutional event, record, decision, filing, or report. \\
Source record & Citation and provenance metadata for an evidence item: source type, credibility tier, date, jurisdiction, and retrieval details. \\
Behavioral quantum & The normalized analytical representation of an evidence item. It is a data abstraction, not a physical particle. \\
Metric observation & A raw measurement mapped to a dimension and sub-metric. \\
Dimension score & A reproducible score for Fidelity, Consistency, Transparency, Efficiency, Equity, or Accountability. \\
Alignment Score & The universal FICO-like result for an entity: a weighted, explainable measure of how closely documented conduct approaches that entity's defined potential after evidence and hard-floor checks. \\
Entity & Any subject evaluated by the system: judge, court, agency, office, or other institution. \\
Potential profile & The versioned standard for what an entity can and should achieve, based on mandate, role, jurisdiction, peer class, resources, and public obligations. \\
Alignment Status & The interpreted category of the Alignment Score: \texttt{high\_alignment}, \texttt{adequate}, \texttt{at\_risk}, \texttt{low\_alignment}, \texttt{critical\_failure}, \texttt{insufficient\_data}, or \texttt{suppressed}. \\
\bottomrule
\end{longtable}
\end{center}

\subsection{Dimension Symbols}

The six dimensions use unambiguous symbols in code and documentation:
\(F\) Fidelity, \(C\) Consistency, \(T\) Transparency, \(E\) Efficiency,
\(Q\) Equity, and \(Ac\) Accountability. \(Q\) means Equity; \(Ac\) means
Accountability. No other meaning is attached to these symbols.
```

- [ ] **Step 4: Create `docs/manual/03-evidence-foundation.tex`** — the shared provenance model. Content requirements (port and consolidate from the Quantum Manual's Data Ontology and the Beacon spec's Architecture Independence section):

```latex
\section{Evidence and Provenance Model}

Both the legal-intelligence pipeline and the Alignment scoring pipeline use
one shared evidence foundation. Each evidence item identifies the institution
or actor, the event, the source record, source type and credibility tier,
citation, document date, jurisdiction, dimension and sub-metric mapping,
raw and normalized values, uncertainty, and the processing, ontology, metric
registry, and normalization versions that produced it.

Raw evidence is immutable. Derived observations and scores are append-only
revisions linked to the input hashes and configuration versions used to
produce them.

\subsection{Source Type Allowlist}

Only records with these \texttt{source\_type} values are eligible for
institutional score computation:

\begin{lstlisting}
public_record, regulatory_filing, court_decision, agency_report,
cfpb_complaint, ftc_action, inspector_general, individual_submission
\end{lstlisting}

Records with \texttt{source\_type = individual\_submission} are supplementary
(credibility tier 6, weight 0.05) and cannot dominate any dimension unless
corroborated by a public record. Their absence never degrades institutional
score validity.

\subsection{Provenance Fields}

\begin{lstlisting}
{
  "id": "hash(entityId + eventId + sourceRecordId)",
  "entity_id": "uuid",
  "event_id": "uuid",
  "source_record_id": "uuid",
  "source_type": "court_decision",
  "credibility_tier": 1,
  "citation": "State v. Example, 123 Or App 45 (2024)",
  "document_date": "2024-03-01",
  "jurisdiction_code": "OR",
  "dimension": "F",
  "raw_value": 0.91,
  "normalized_value": 0.91,
  "confidence": 1.0,
  "processing_version": "brain-v1",
  "ontology_version": "ontology-v1",
  "metric_registry_version": "metrics-v1",
  "normalization_version": "norm-v1",
  "input_hash": "hex",
  "recorded_at": "ISO-8601"
}
\end{lstlisting}
```

- [ ] **Step 5: Create `docs/manual/04-legal-intelligence.tex`** — the bounded legal pipeline. Content requirements:

```latex
\section{Legal Intelligence Pipeline}

The legal-intelligence pipeline transforms lived legal experiences into
structured, queryable, auditable legal intelligence. It is a separate bounded
product from institutional scoring.

\subsection{Flow}

\begin{lstlisting}
narrative -> structured event -> claims/doctrines
         -> authority graph and retrieval -> procedural pathways
\end{lstlisting}

\subsection{Agents}

\begin{itemize}
  \item \textbf{Intake Parser}: structures observable facts only; never
        infers legal conclusions.
  \item \textbf{Legal Classifier}: maps to claims and doctrines using the
        ontology only; conservative classification.
  \item \textbf{Graph Seeder}: builds the legal knowledge graph with typed
        edges (supports, governed\_by, codified\_in, violates, resolved\_by).
  \item \textbf{Vector Retrieval}: returns ranked supporting authority with
        metadata --- supporting material only, no conclusions.
  \item \textbf{Procedural Engine}: builds ordered enforcement pathways with
        prerequisites and jurisdiction alignment.
\end{itemize}

\subsection{Invariants}

\begin{itemize}
  \item No output without provenance.
  \item No citation without source.
  \item No authority without jurisdiction.
  \item No overwrite of historical records.
  \item No legal conclusion without supporting authorities.
  \item An incident never silently becomes an institutional score.
\end{itemize}
```

- [ ] **Step 6: Create `docs/manual/05-alignment-scoring.tex`** — the scoring pipeline and universal contract. Content requirements (this is the canonical scoring section):

```latex
\section{Aptitudinal Alignment Scoring}

\subsection{Flow}

\begin{lstlisting}
entity + potential profile + evidence
  -> metric observations
  -> normalization
  -> six dimension evaluators
  -> hard floors
  -> Alignment Score
  -> tier / status
\end{lstlisting}

Every supported entity receives the same explainable score contract, but not
the same metric registry. A judge, court, agency, prosecutor's office, or
credit reporting agency gets a potential profile appropriate to its mandate,
role, jurisdiction, peer class, resources, and public obligations.

\subsection{Universal Entity Contract}

\begin{lstlisting}[language=json]
{
  "entity_id": "uuid",
  "entity_type": "judge | court | agency | office | institution",
  "potential_profile_version": "string",
  "alignment_score": 0.0,
  "alignment_status": "high_alignment | adequate | at_risk | low_alignment | critical_failure | insufficient_data | suppressed",
  "dimensions": { "F": 0.0, "C": 0.0, "T": 0.0, "E": 0.0, "Q": 0.0, "Ac": 0.0 },
  "evidence_summary": { "count": 0, "source_types": [], "missing_requirements": [] },
  "flags": [],
  "audit_reference": "string"
}
\end{lstlisting}

The numeric range is normalized to \([0,1]\) internally. A FICO-like integer
scale may be used only through a documented presentation transform; it must
never hide the six dimensions, evidence sufficiency, or limitations.

\subsection{Default Weights}

\[
A = \sum_{i=1}^{6} w_i \cdot D_i \qquad \sum_{i=1}^{6} w_i = 1.0
\]

\begin{center}
\begin{tabular}{lccc}
\toprule
Dimension & Symbol & Default weight & Rationale \\
\midrule
Fidelity       & \(F\)  & 0.22 & Legal mandate adherence is foundational \\
Consistency    & \(C\)  & 0.18 & Variance in outcomes signals systemic bias \\
Transparency   & \(T\)  & 0.17 & Public record access is a legal right \\
Efficiency     & \(E\)  & 0.15 & Resource stewardship proxies competence \\
Equity         & \(Q\)  & 0.16 & Demographic fairness is a constitutional floor \\
Accountability & \(Ac\) & 0.12 & Self-correction capacity determines trajectory \\
\bottomrule
\end{tabular}
\end{center}

\subsection{Classification Tiers}

\begin{center}
\begin{tabular}{lcc}
\toprule
Tier & Score range & Alignment Status \\
\midrule
I   & \(0.85 - 1.00\) & \texttt{high\_alignment} \\
II  & \(0.70 - 0.84\) & \texttt{adequate} \\
III & \(0.50 - 0.69\) & \texttt{at\_risk} \\
IV  & \(0.30 - 0.49\) & \texttt{low\_alignment} \\
V   & \(0.00 - 0.29\) & \texttt{critical\_failure} \\
\bottomrule
\end{tabular}
\end{center}

\subsection{Evidence Thresholds and Insufficient Data}

A score is emitted only when the configured evidence thresholds pass:
at least 12 behavioral quanta per dimension from at least 3 distinct source
types. When any dimension fails its threshold, the result is
\texttt{insufficient\_data}: \texttt{alignment\_score} is null, the failing
dimensions are null, and \texttt{evidence\_summary.missing\_requirements}
explains why. The system never estimates a missing dimension.

\subsection{Hard Floors}

Equity hard floors override the weighted average and cannot be bypassed:

\begin{itemize}
  \item Finding of intentional discrimination within 10 years
        \(\Rightarrow Q_{\min} = 0.15\)
  \item Active consent decree for a civil rights violation
        \(\Rightarrow Q_{\min} = 0.25\)
  \item Pattern-or-practice finding \(\Rightarrow Q_{\min} = 0.20\)
\end{itemize}

All floor applications are recorded in the score record before the Alignment
Score is computed.

\subsection{Normalization}

\[
D_{\mathrm{norm}} = \frac{D_{\mathrm{raw}} - D_{\min}}{D_{\max} - D_{\min}}
\]

Bounds are configurable per entity class. Values are clamped to \([0,1]\) ---
no extrapolation permitted.

\subsection{Reproducibility}

A reproducibility record stores input hashes, configuration versions, code
version, and output hash. Any score can be re-derived byte-for-byte from the
quantum set and the potential profile version.
```

- [ ] **Step 7: Create the remaining compartments** with the exact structure below (port content from the two source manuals into the listed sections; do not duplicate definitions already given in 01–05):

`docs/manual/06-dimensions.tex`:

```latex
\section{Six Dimensions and Metric Registry}

Each dimension is defined once. The operational sub-metric tables, weights,
source lists, and agent specifications come from the Beacon Scoring Engine
specification (source: the two LaTeX manuals on the maintainer's desktop),
reproduced verbatim where they define behavior.

\subsection{Fidelity (\(F\))}  % Port the LMCR/PAS/RVR/SOF table from "Bias Beacon Documentation.tex" Dimension 1, weights 0.30/0.25/0.25/0.20; 12-quanta minimum; consent orders are negative evidence; self-reported compliance 0.50 credibility discount; ultra vires finding floors LMCR at 0.20.
\subsection{Consistency (\(C\))} % Port the OVI/PAR/CDS/DRR table from "Bias Beacon Documentation.tex" Dimension 2 — cluster-level variance; 15% protected-class disparity triggers equity cross-flag; consent decrees are permanent low-consistency markers until 5-year clean record.
\subsection{Transparency (\(T\))} % Port the RDR/RTI/FCR/PAX table from "Bias Beacon Documentation.tex" Dimension 3 — clock starts at receipt; in-person-only filing deducts PAX 0.10; contempt within 5 years caps T at 0.40.
\subsection{Efficiency (\(E\))}   % Port the CRR/PTS/RUI/BCR table from "Bias Beacon Documentation.tex" Dimension 4 — administrative closures don't count; peer-class benchmark always displayed; budget shock grace 0.10.
\subsection{Equity (\(Q\))}       % Port the DDI/GAS/PCOR/ASR table from "Bias Beacon Documentation.tex" Dimension 5 — hard floors in 05; n>=100 per cell; never impute demographics; Tier V triggers regulatory referral.
\subsection{Accountability (\(Ac\))} % Port the SCR/AC/CRR_c/RAR table from "Bias Beacon Documentation.tex" Dimension 6 — 1.5x multiplier for proactive correction; recurring identical violations cap Ac at 0.35; RESOLUTION_FRAUD audit trigger.
\end{document}
```

`docs/manual/07-sources-normalization.tex`:

```latex
\section{Source Credibility and Normalization Bounds}

\subsection{Credibility Hierarchy}

\begin{center}
\begin{tabular}{ccp{10cm}}
\toprule
Tier & Weight & Source description \\
\midrule
1 & 1.00 & Court orders, consent decrees, regulatory enforcement actions \\
2 & 0.90 & IG reports, GAO findings, examination summaries, sworn testimony \\
3 & 0.75 & Aggregated complaint databases, formal complaints \\
4 & 0.50 & Self-reported public filings (cross-validation required) \\
5 & 0.20 & Third-party research and reporting (corroboration required) \\
6 & 0.05 & Individual submissions --- supplementary only \\
\bottomrule
\end{tabular}
\end{center}

\subsection{Normalization Bounds}

Normalization bounds are configured per entity class in the metric registry
(e.g., the NCRA peer class bounds table from ``Bias Beacon
Documentation.tex'' for credit reporting agencies). Every bound records its
calibration rationale. Values are clamped to \([0,1]\).
\end{document}
```

`docs/manual/08-governance-reproducibility.tex`:

```latex
\section{Governance and Reproducibility}

\begin{itemize}
  \item Public institutional records are the primary and sufficient
        evidentiary basis; individual submissions are supplementary.
  \item Every claim and score component carries a citation chain.
  \item Raw evidence is immutable; derived outputs are append-only revisions.
  \item Hard floors are applied and logged before the Alignment Score is
        computed.
  \item A reproducibility record stores input hashes, configuration versions,
        code version, and output hash.
  \item No Alignment Score is a finding of individual wrongdoing, a prediction
        of future conduct, or a substitute for an official finding.
\end{itemize}
\end{document}
```

`docs/manual/09-implementation-phases.tex`:

```latex
\section{Implementation Phases}

The following phases are tracked in the repository as they are built. The
current implementation status is recorded at the top of each phase.

\begin{enumerate}
  \item Shared evidence foundation and provenance contracts (in build).
  \item Universal Alignment Score engine with insufficient-data and hard
        floors (in build).
  \item Judiciary filter experience with case-type filtering and the
        scale-and-rotate panel (in build).
  \item Identity system: gold A mark, hero first letter, favicon (built).
  \item CRA and institutional data connectors (specified).
  \item Normalization service with per-class bounds (specified).
  \item Public score API (specified).
  \item Reproducibility audit tooling (specified).
\end{enumerate}
\end{document}
```

- [ ] **Step 8: Create `docs/manual/build.sh`**

```bash
#!/usr/bin/env bash
# Compile the compartmentalized Aptitudinal Alignment manual.
# Requires XeLaTeX (Tectonic or TeX Live). Run twice for the TOC.
set -euo pipefail
cd "$(dirname "$0")"
xelatex -interaction=nonstopmode 00-main.tex
xelatex -interaction=nonstopmode 00-main.tex
echo "Manual built: docs/manual/00-main.pdf"
```

- [ ] **Step 9: Create `docs/manual/README.md`**

```markdown
# Aptitudinal Alignment Manual

One manual, compartmentalized. `00-main.tex` is the master document; every
other `NN-*.tex` file is a separately editable compartment that the master
`\input{}`s. Compile the whole thing with `bash build.sh` (run it twice).

| File | Concern |
|------|---------|
| 01-overview | Mission, product language, design principles |
| 02-vocabulary | Canonical vocabulary and dimension symbols |
| 03-evidence-foundation | Shared provenance and evidence model |
| 04-legal-intelligence | The bounded legal-intelligence pipeline |
| 05-alignment-scoring | Scoring flow, universal contract, thresholds, hard floors |
| 06-dimensions | Six dimensions and the metric registry |
| 07-sources-normalization | Credibility hierarchy and normalization bounds |
| 08-governance-reproducibility | Safeguards and audit rules |
| 09-implementation-phases | Build phases and current status |

Terminology is locked: Alignment Score (never "Composite Score"), dimension
scores, Alignment Status, entity, potential profile.
```

- [ ] **Step 10: Verify the manual compiles (or validates structurally)**

Run: `bash docs/manual/build.sh`
Expected: `00-main.pdf` produced with no errors.

If XeLaTeX is not installed in the environment, run this structural check instead:

```bash
cd docs/manual && grep -o '\\input{[0-9]*-[a-z-]*}' 00-main.tex | sed 's/\\input{//;s/}//' | while read f; do test -f "$f.tex" && echo "OK $f" || echo "MISSING $f"; done
```

Expected: every `\input` file exists (all `OK`).

- [ ] **Step 11: Commit**

```bash
git add docs/manual/
git commit -m "docs: compartmentalized Aptitudinal Alignment manual (XeLaTeX)"
```

---

### Task 8: Align in-repo docs with the canonical terminology

**Files:**
- Modify: `APTITUDE-BRAIN.md`
- Modify: `BIAS-BEACON-SETUP.md`
- Create: `docs/manual/README.md` (already created in Task 7 — referenced here only)

**Interfaces:**
- Consumes: the terminology locked in Task 1 and documented in `docs/manual/02-vocabulary.tex`.
- Produces: repo documentation that no longer contradicts the manual.

- [ ] **Step 1: Update `APTITUDE-BRAIN.md`**

Replace every occurrence of "Aptitude Score" and "composite" with "Alignment Score" where it refers to the entity score (there are three such spots: the Mission paragraph, the "Relationship to the Rest of the Platform" section, and the API contract example text). Add a pointer line under the title:

```markdown
> Canonical terminology and the consolidated manual live in `docs/manual/`.
> This file describes the implemented legal-intelligence core only.
```

- [ ] **Step 2: Mark `BIAS-BEACON-SETUP.md` as superseded**

Add a banner at the top:

```markdown
> ⚠️ Superseded. This describes the older Jekyll-era Bias Beacon prototype.
> The canonical architecture, vocabulary, and scoring model are in
> `docs/manual/`. Claims of "fully operational" behavior here do not
> reflect the current React implementation.
```

- [ ] **Step 3: Verify nothing else contradicts the terminology**

Run:

```bash
grep -rn "Composite Score\|composite Aptitude\|Aptitude Score" --include="*.md" --include="*.js" --include="*.jsx" . | grep -v node_modules | grep -v _site
```

Expected: no remaining references outside `docs/manual/` (the manual itself uses "Alignment Score" throughout).

- [ ] **Step 4: Commit**

```bash
git add APTITUDE-BRAIN.md BIAS-BEACON-SETUP.md
git commit -m "docs: align repo docs with Alignment Score terminology"
```

---

## Self-Review Notes

- **Spec coverage:** canonical vocabulary → Tasks 1, 7 (02-vocabulary); shared evidence foundation → Task 2 + 03-evidence-foundation; universal Alignment Score contract → Task 4 + 05-alignment-scoring; insufficient-data → Task 4 tests + manual section; hard floors → Task 4; Judiciary case-type filter → Tasks 5–6; scale-and-rotate panel + a11y → Task 6; identity system → already shipped in the prior UI commit (hero A mark, favicon, glow), referenced in 09-implementation-phases; documentation consolidation → Tasks 7–8; tests for provenance/version/filter/a11y → Tasks 2, 5, 6.
- **Placeholder scan:** no TBD/TODO; every code step carries complete file content; the dimension compartment (06) intentionally references the source manuals for the long metric tables and lists the exact content each subsection must contain.
- **Type consistency:** `clamp01`, `normalizeEvidence`, `hashString`, `getPotentialProfile`, `computeAlignmentScore`, `CASE_TYPES`, `deriveCaseTypes`, `applyJudgeFilters`, and the `FilterPanel` props are defined once and used with identical names/signatures throughout. `alignment_score`/`alignment_status` field names match the spec's universal contract.
