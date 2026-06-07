---
# A.P.T.I.T.U.D.E.

**A Platform Tracking Institutional Transparency Using Data Edification**

Public accountability tools for Oregon's justice system — judge bias tracking (Bias Beacon), prosecutorial and law-enforcement transparency, community corrections oversight, and the core **Aptitude Brain** legal intelligence engine.

## Current CF Pages Build Settings (from dashboard)

- **Build command**: `yarn install && yarn build && mkdir -p _site/brain && cp APTITUDE-BRAIN.md INCIDENT-INTAKE-DEMO.md PROJECT-STATUS.md README.md _site/brain/ || true && cp APTITUDE-BRAIN.md INCIDENT-INTAKE-DEMO.md _site/ || true`
- **Deploy command**: `npx wrangler versions upload`
- **Root directory**: `/`
- **Build token**: `CLOUDFLARE_GROK`
- **Build variables**: `NODE_VERSION`

These settings are used by the Cloudflare Git integration for builds on the production branch `claude/judge-bias-beacon-scoring-8qAT3`.

## What We Are Building

A full platform with two tightly integrated layers:

1. **The Brain** (legal reasoning core) — documented in the Aptitude System Technical Manual (LaTeX). Transforms raw narratives and records into structured events, ontology-mapped claims/doctrines/remedies, citation graphs, semantic retrieval, and procedural pathways. Fully auditable, jurisdiction-aware, deterministic where possible, LLM-assisted only for constrained structuring/classification.

2. **The Public UI & Analytics** (this site) — Bias Beacon (judge profiles, county comparisons, dashboards), actor lookups, research tools, and interactive surfaces that will consume the brain APIs (incident intake form → live Legal Map + graph + procedural guidance).

## Current State

- **UI (Cloudflare-deployed from this branch `claude/judge-bias-beacon-scoring-8qAT3`)**: Advanced React/Vite premium UI with interactive judge cards, search, filters across 36 counties, color-themed modules, dashboard scaffolding, and the brain documentation.
- **Brain core (implemented on `aptitude-emergent`)**: Ontology, 5 agents with exact spec prompts, full orchestration pipeline, incident submit/result API, audit everything.

See the brain docs in the deployed site (copied into the build).

## Deployment
- Pushes to this branch trigger the CF Git integration using the above build/deploy commands from the dashboard.
- The "Create a new deployment" in CF may show the asset uploader for manual uploads; for Git-triggered builds from this branch, push code to the branch.
- After a build, new versions are uploaded via wrangler versions upload. Use the CF Deployments tab to manage and deploy the desired version to the production branch if needed.

The goal: every piece of the platform is auditable, reproducible, and grounded in structured legal truth — not model weights.

---
_For research orientation only — not a substitute for counsel or the official record._

**Latest push**: Small change to trigger a fresh build with current code and the dashboard build command (including brain doc copies). This should produce a new version with the premium UI + brain content.
