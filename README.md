---
# A.P.T.I.T.U.D.E.

**A Platform Tracking Institutional Transparency Using Data Edification**

Public accountability tools for Oregon's justice system — judge bias tracking (Bias Beacon), prosecutorial and law-enforcement transparency, community corrections oversight, and the core **Aptitude Brain** legal intelligence engine.

## What We Are Building

A full platform with two tightly integrated layers:

1. **The Brain** (legal reasoning core) — documented in the Aptitude System Technical Manual (LaTeX). Transforms raw narratives and records into structured events, ontology-mapped claims/doctrines/remedies, citation graphs, semantic retrieval, and procedural pathways. Fully auditable, jurisdiction-aware, deterministic where possible, LLM-assisted only for constrained structuring/classification.

2. **The Public UI & Analytics** (this site) — Bias Beacon (judge profiles, county comparisons, dashboards), actor lookups, research tools, and interactive surfaces that will consume the brain APIs (incident intake form → live Legal Map + graph + procedural guidance).

## Current State

- **UI (Cloudflare-deployed from this branch `claude/judge-bias-beacon-scoring-8qAT3`)**: Advanced Jekyll static site with interactive judge cards, search, filters across 36 counties, color-themed modules, dashboard scaffolding, and now documentation + static preview for the Brain.
- **Brain core (implemented on `aptitude-emergent`)**: Ontology, 5 agents with exact spec prompts, full orchestration pipeline, incident submit/result API, audit everything. Runnable today (see the demo).

See:
- [APTITUDE-BRAIN.md](./APTITUDE-BRAIN.md) — full architecture, agents, invariants
- [INCIDENT-INTAKE-DEMO.md](./INCIDENT-INTAKE-DEMO.md) — interactive static simulation of a full brain run (replaceable with real API call)
- The living **Aptitude System Technical Manual** (LaTeX) for every volume, prompt, schema, and cross-dependency
- Bias Beacon docs (BIAS-BEACON-SETUP.md, JUDGE-DATA-IMPLEMENTATION.md, etc.)

## Quick Start (Brain Demo)
On the brain branch:
```bash
cd backend
python tools/run_brain_demo.py
```

Or open INCIDENT-INTAKE-DEMO.md in the deployed site for the in-browser preview.

## Deployment
- This branch (`claude/judge-bias-beacon-scoring-8qAT3`) → Cloudflare Pages (the public site you are reading).
- Brain backend (FastAPI) deployed separately; the UI will call it.

## Contributing / Next
See PROJECT-STATUS.md for the current checklist (Beacon data population + brain UI integration points).

The goal: every piece of the platform is auditable, reproducible, and grounded in structured legal truth — not model weights.

---
_For research orientation only — not a substitute for counsel or the official record._
