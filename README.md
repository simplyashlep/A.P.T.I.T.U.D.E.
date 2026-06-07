---
# A.P.T.I.T.U.D.E.

**A Platform Tracking Institutional Transparency Using Data Edification**

Public accountability tools for Oregon's justice system — judge bias tracking (Bias Beacon), prosecutorial and law-enforcement transparency, community corrections oversight, and the core **Aptitude Brain** legal intelligence engine.

## Current CF Pages Build Settings (from your dashboard)

- Build command: `yarn install && yarn build && mkdir -p _site/brain && cp APTITUDE-BRAIN.md INCIDENT-INTAKE-DEMO.md PROJECT-STATUS.md README.md _site/brain/ || true && cp APTITUDE-BRAIN.md INCIDENT-INTAKE-DEMO.md _site/ || true`
- Deploy command: `npx wrangler versions upload`
- Root directory: `/`
- Build token: `CLOUDFLARE_GROK`
- Build variables: `NODE_VERSION`

**Important for clean build (to bust output cache):** Edit the build command in the CF dashboard to start with `rm -rf _site || true && ` followed by the rest. This deletes any restored old _site from cache, forcing a fresh build with the current code and the brain doc copies.

## What We Are Building

A full platform with two tightly integrated layers:

1. **The Brain** (legal reasoning core) — documented in the Aptitude System Technical Manual (LaTeX). Transforms raw narratives and records into structured events, ontology-mapped claims/doctrines/remedies, citation graphs, semantic retrieval, and procedural pathways. Fully auditable, jurisdiction-aware, deterministic where possible, LLM-assisted only for constrained structuring/classification.

2. **The Public UI & Analytics** (this site) — Bias Beacon (judge profiles, county comparisons, dashboards), actor lookups, research tools, and interactive surfaces that will consume the brain APIs (incident intake form → live Legal Map + graph + procedural guidance).

## Current State

- **UI (Cloudflare-deployed from this branch `claude/judge-bias-beacon-scoring-8qAT3`)**: Advanced React/Vite premium UI with interactive judge cards, search, filters across 36 counties, color-themed modules, dashboard scaffolding, and the brain documentation.
- **Brain core (implemented on `aptitude-emergent`)**: Ontology, 5 agents with exact spec prompts, full orchestration pipeline, incident submit/result API, audit everything.

See the brain docs in the deployed site (copied into the build at / and /brain/).

## Deployment
- Pushes to this branch trigger the CF Git integration using the build/deploy commands you set in the dashboard.
- The build command includes the copies for the brain docs into _site.
- After the build and wrangler versions upload, a new version is created. In the CF Deployments tab, find the new version from the claude branch and use the deploy option to make it the production if the site doesn't update automatically.
- Note: The "Create a new deployment" shows the asset uploader for manual asset uploads (which only supports static and shows the warning); for Git-triggered builds from this branch, push to the branch to trigger the configured build command.

The goal: every piece of the platform is auditable, reproducible, and grounded in structured legal truth — not model weights.

---
_For research orientation only — not a substitute for counsel or the official record._

**Latest trigger:** Pushed a small change to force a build using your current CF dashboard settings. Prepend `rm -rf _site || true && ` to the build command in CF to force a clean build without cache restore. The new version should include the premium UI and brain docs.
