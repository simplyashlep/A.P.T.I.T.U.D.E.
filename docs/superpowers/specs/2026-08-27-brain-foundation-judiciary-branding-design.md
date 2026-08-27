# Aptitude Brain Foundation, Judiciary Filters, and Identity Design

**Date:** 2026-08-27  
**Status:** Approved for planning; terminology revision incorporated  
**Scope:** First implementation slice

## Goal

Create one understandable and technically reliable foundation for Aptitude's legal-intelligence and Aptitudinal Alignment systems, while delivering the Judiciary filter experience and the supplied gold A identity treatment.

## Product principles

- Explain the system in common language while preserving precise technical contracts.
- Treat the quantum model as an analytical metaphor and data abstraction, not literal quantum computing.
- Prefer evidence and provenance over unsupported conclusions.
- Never invent a score when evidence thresholds are not met.
- Preserve raw inputs and derived outputs separately so results can be reproduced.
- Keep legal-intelligence conclusions and institutional scores as separate bounded products.
- Use accessible, reduced-motion alternatives for all visual effects.

## Canonical vocabulary

| Term | Meaning |
|---|---|
| Evidence item | A sourced institutional event, record, decision, filing, or report. |
| Source record | Citation and provenance metadata for an evidence item: source type, credibility tier, date, jurisdiction, and retrieval details. |
| Behavioral quantum | The normalized analytical representation of an evidence item. It is a data abstraction, not a physical particle. |
| Metric observation | A raw measurement mapped to a dimension and sub-metric. |
| Dimension score | A reproducible score for Fidelity, Consistency, Transparency, Efficiency, Equity, or Accountability. |
| Alignment Score | The universal FICO-like result for an entity: a weighted, explainable measure of how closely documented conduct approaches that entity's defined potential after evidence and hard-floor checks. |
| Entity | Any subject evaluated by the system, including a judge, court, agency, office, or other institution. |
| Potential profile | The versioned standard for what an entity can and should achieve, based on mandate, role, jurisdiction, peer class, resources, and public obligations. |
| Status | `scored`, `insufficient_data`, or `suppressed`, with explicit reasons. |

The six dimensions use unambiguous symbols in code and documentation: `F`, `C`, `T`, `E`, `Q`, and `Ac`. `Q` means Equity; `Ac` means Accountability. “Composite score” is not a product term; the resulting value is always called the Alignment Score.

## Brain architecture

### Shared evidence foundation

Both products use the same provenance and versioning foundation. Each evidence/observation record must identify:

- institution or actor ID;
- event ID and source record ID;
- source type and credibility tier;
- citation, document date, jurisdiction, and retrieval metadata;
- dimension and sub-metric mapping when applicable;
- raw value and normalized value when applicable;
- uncertainty/confidence;
- processing, ontology, metric-registry, and normalization versions.

Raw evidence is immutable. Derived observations and scores are append-only revisions linked to the input hashes and configuration versions used to produce them.

### Legal intelligence pipeline

`narrative → structured event → claims/doctrines → authority graph and retrieval → procedural pathways`

The pipeline remains conservative: intake structures observable facts; classification uses the ontology; retrieval supplies supporting authority; procedural output validates prerequisites and jurisdiction. It does not silently convert an incident into an institutional score.

### Aptitudinal Alignment pipeline

`entity + potential profile + evidence → metric observations → normalization → six dimension evaluators → hard floors → Alignment Score → tier/status`

Every supported entity receives the same explainable score contract, but not the same metric registry. A judge, court, agency, prosecutor's office, or credit reporting agency gets a potential profile appropriate to its mandate, role, jurisdiction, peer class, resources, and public obligations. This is the reverse-FICO model: instead of measuring an individual's credit risk, Aptitudinal Alignment measures an entity's documented progress toward its institutional potential.

The Beacon scoring specification is operationally authoritative where it conflicts with the conceptual manual. The Alignment Score uses versioned weights and bounds. The former Beacon/Aptitude Score wording in source material is normalized to Alignment Score in the unified manual. A score is emitted only when the configured evidence thresholds pass; otherwise the result is `insufficient_data` with evidence counts and missing requirements.

### Alignment Score safeguards

- Public institutional records are the primary evidence basis.
- Individual submissions are supplementary and cannot dominate a dimension without corroboration.
- Every claim and score component has a citation chain.
- Normalized values are clamped to `[0, 1]`.
- Hard floors are applied before Alignment Score calculation and logged.
- A reproducibility record stores input hashes, configuration versions, code version, and output hash.
- No Alignment Score is presented as a finding of individual wrongdoing; public copy describes measured institutional patterns and limitations.
- The score is entity-wide and role-specific: the same entity may have distinct potential profiles for different jurisdictions or operational roles, each explicitly versioned.
- The Alignment Score is not a prediction of future conduct and must not be used as a substitute for an official finding.

## Aptitudinal Alignment product language

The page and system name is **Aptitudinal Alignment**. The single entity result is the **Alignment Score**. The six dimensions explain the result; they are not competing scores or alternate product names. Public copy should describe the result as “how closely an entity's documented conduct aligns with its potential and obligations.”

## Judiciary page

### Filter model

Preserve existing filters and add a multi-select `caseType` filter. The initial case-type registry is:

- Criminal
- Family
- Probate
- Civil
- Juvenile
- Other

Values should be derived from available judge records when possible, normalized through a stable mapping, and retain `Other` for unknown or unmapped values. The filter state is structured so a future API can consume it without changing the UI contract.

The panel provides:

- current search/filter controls;
- multi-select case type controls;
- result count;
- clear-all action;
- close action and backdrop dismissal;
- accessible group labels and selected states.

### Transition

Use the scale-and-rotate interaction pattern shown by the reference SidebarTransitions example. Opening the panel scales and tilts the page surface behind it, with adaptive intensity: restrained on narrow screens and more pronounced on wide screens. Closing reverses the transform. The panel itself remains readable and usable.

Keyboard and accessibility requirements:

- Escape closes the panel.
- Focus moves into the panel on open and returns to the trigger on close.
- The backdrop closes the panel.
- The panel exposes dialog semantics and an accessible name.
- `prefers-reduced-motion: reduce` disables rotation and uses an immediate or short-opacity transition.
- On small screens, use a conventional full-height drawer rather than forcing a perspective transform.

## Identity system

The supplied `Aptitude_Logo_Letter_1.png` is the source mark for the first letter of the site wordmark. Copy the asset into the repository's public asset area and reference it from the header/brand treatment. Preserve the source image; any favicon derivative is a separate generated or hand-prepared asset.

The favicon uses the same recognizable gold A mark at small size. The primary UI treatment may add a restrained gold glow and occasional glint using CSS, while preserving contrast, load performance, and reduced-motion behavior. The mark needs useful alt text where informative and an accessible site name where decorative.

## Universal entity model

Aptitudinal Alignment is designed as a reverse-FICO system for public and institutional entities. Every supported entity has an entity record, a role and jurisdiction context, and one or more versioned potential profiles. The potential profile defines the obligations and achievable standards against which evidence is interpreted. The universal output contract is:

```json
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
```

The numeric range is normalized to `[0, 1]` internally and may be displayed as a FICO-like integer scale only through a documented presentation transform. The display must never hide the six dimensions, evidence sufficiency, or limitations.

## Documentation consolidation

The quantum manual and Beacon specification are consolidated by role rather than duplicated chapter-by-chapter:

1. mission, boundaries, and plain-language overview;
2. canonical vocabulary and evidence/provenance model;
3. shared storage and audit contracts;
4. legal-intelligence pipeline;
5. Aptitudinal Alignment institutional-scoring pipeline;
6. universal entity model and Alignment Score contract;
7. six dimension definitions and metric registry;
8. source credibility and normalization;
9. safeguards, insufficient-data rules, and reproducibility;
10. implementation phases and future integrations.

Repeated descriptions of entities, agents, source tiers, and invariants appear once and are cross-referenced. Conceptual equations are retained only where they explain the model; executable formulas and thresholds are defined once in the metric registry.

## First-slice deliverables

1. Consolidated canonical brain documentation with implementation status clearly marked.
2. Shared evidence/provenance and universal Alignment Score contracts suitable for the current application and future service/API work.
3. Judiciary page with case-type filtering and the scale-and-rotate filter panel.
4. Supplied A mark integrated into the site identity and favicon.
5. Tests for filter behavior, insufficient-data behavior, provenance/version fields, and key accessibility states.
6. Build and live-preview verification.

## Non-goals for this slice

- Production ingestion of every external data source listed in the manuals.
- A full legal vector database or Neo4j deployment.
- Literal quantum computation.
- Predictive judgments about individual judges.
- Replacing official records or legal counsel.

## Acceptance criteria

- A reader can distinguish evidence, metric observation, dimension score, Alignment Score, potential profile, and status without reading implementation details.
- The two source manuals no longer repeat the same definitions or make contradictory claims.
- Missing evidence yields `insufficient_data`, not a fabricated or implied Alignment Score.
- Every supported entity uses the universal Alignment Score contract with an explicit, versioned potential profile.
- The Judiciary page filters by all existing options and multi-select case type.
- The filter panel supports mouse, keyboard, mobile, backdrop, Escape, focus return, and reduced-motion use.
- The A mark and favicon load from repository-controlled assets and remain legible.
- The project builds successfully and the preview shows no runtime errors.
