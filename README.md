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

**To force a clean build and bust output cache (important!):** In the CF dashboard, edit the Build command to prepend `rm -rf _site || true && ` to the above. This deletes any restored old _site from cache before the build, ensuring a fresh build from the current source code on the branch, and the copies will include the current brain docs in the deployed _site.

## What We Are Building

A full platform with two tightly integrated layers:

1. **The Brain** (legal reasoning core) — documented in the Aptitude System Technical Manual (LaTeX). Transforms raw narratives and records into structured events, ontology-mapped claims/doctrines/remedies, citation graphs, semantic retrieval, and procedural pathways. Fully auditable, jurisdiction-aware, deterministic where possible, LLM-assisted only for constrained structuring/classification.

2. **The Public UI & Analytics** (this site) — Bias Beacon (judge profiles, county comparisons, dashboards), actor lookups, research tools, and interactive surfaces that will consume the brain APIs (incident intake form → live Legal Map + graph + procedural guidance).

## Current State

- **UI (Cloudflare-deployed from this branch `claude/judge-bias-beacon-scoring-8qAT3`)**: Advanced React/Vite premium UI with interactive judge cards, search, filters across 36 counties, color-themed modules, dashboard scaffolding, and the brain documentation.
- **Brain core (implemented on `aptitude-emergent`)**: Ontology, 5 agents with exact spec prompts, full orchestration pipeline, incident submit/result API, audit everything.

See the brain docs in the deployed site (copied into the build at / and /brain/).

## Deployment
- Pushes to this branch trigger the CF Git integration, which runs the Build command you set in the dashboard (the long one with copies for brain docs), then the Deploy command (wrangler versions upload).
- The "Create a new deployment" in CF shows the asset uploader for manual direct uploads of pre-built assets (hence the static-only warning); this is not the Git flow. The Git-triggered builds happen automatically on push to the production branch using your dashboard settings.
- After a build, a new version is uploaded. In the CF Deployments tab, look for the list of Git deployments from the claude branch; find the new one and use any "Deploy" or "Deploy to production" option for that version if the production site doesn't auto-update to the latest on the branch.

The goal: every piece of the platform is auditable, reproducible, and grounded in structured legal truth — not model weights.

---
_For research orientation only — not a substitute for counsel or the official record._

**Latest push:** Small change to trigger a fresh build using your current CF dashboard settings. Prepend the rm -rf to the build command in CF to force clean (no cache restore of old _site). The new version should have the premium UI + brain docs.
