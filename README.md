---
# A.P.T.I.T.U.D.E.

**A Platform Tracking Institutional Transparency Using Data Edification**

Public accountability tools for Oregon's justice system — judge bias tracking (Bias Beacon), prosecutorial and law-enforcement transparency, community corrections oversight, and the core **Aptitude Brain** legal intelligence engine.

## Cloudflare Deployment (recommended settings)

This branch (`claude/judge-bias-beacon-scoring-8qAT3`) deploys the premium React UI + Aptitude Brain docs.

### CF Pages / Git integration settings (set once in dashboard)
- **Root directory**: `/`
- **Build command**: `yarn install && yarn build`   (or `npm install && npm run build`)
  - The `package.json` build script handles:
    - clean _site (forces clean output, busts any restored cache from prior builds)
    - `vite build` (outputs to `_site` per vite.config.js — this is the full UI)
    - `node scripts/copy-brain.cjs` (copies the brain .md docs into `_site/` and `_site/brain/`)
- **Output directory**: `_site`
- **Deploy command** (if using Wrangler versions upload for your setup): `npx wrangler versions upload`

**Do not** put long copy/cp commands or repeated `rm` in the dashboard Build command. Keep it simple — all logic lives in `package.json` + `scripts/copy-brain.cjs` (source controlled, no more escaping nightmares or drift).

After pushing to this branch, CF will trigger a build. In the **Deployments** tab, select the new version built from this branch and deploy it to production if it doesn't promote automatically. This is how you "go back" to a known-good UI build.

<<<<<<< Updated upstream
If a deploy ever shows the old UI again: the build used a cached `_site` — the clean step in the script + a fresh push should resolve it. You can also manually trigger a new deployment from a known commit (like dce0229) in the CF UI.

## What We Are Building

A full platform with two tightly integrated layers:

1. **The Brain** (legal reasoning core) — documented in the Aptitude System Technical Manual (LaTeX). Transforms raw narratives and records into structured events, ontology-mapped claims/doctrines/remedies, citation graphs, semantic retrieval, and procedural pathways. Fully auditable, jurisdiction-aware, deterministic where possible, LLM-assisted only for constrained structuring/classification.

2. **The Public UI & Analytics** (this site) — Bias Beacon (judge profiles, county comparisons, dashboards), actor lookups, research tools, and interactive surfaces that will consume the brain APIs (incident intake form → live Legal Map + graph + procedural guidance).

## Current State

- **UI (Cloudflare-deployed from this branch `claude/judge-bias-beacon-scoring-8qAT3`)**: Advanced React/Vite premium UI with interactive judge cards, search, filters across 36 counties, color-themed modules, dashboard scaffolding, and the brain documentation.
- **Brain core (implemented on `aptitude-emergent`)**: Ontology, 5 agents with exact spec prompts, full orchestration pipeline, incident submit/result API, audit everything.

See the brain docs in the deployed site (copied into the build at / and /brain/).

## Deployment
- Pushes to this branch trigger the CF Git integration using the build/deploy commands set in the dashboard.
- The build command includes the copies for brain docs into _site.
- After the build and wrangler versions upload, the new version is created. In the CF Deployments tab, find the new version from the claude branch and deploy it to production if the production site doesn't auto-update to the latest on the branch.
- The "Create a new deployment" shows the asset uploader for manual uploads (hence the static-only warning); this is not the Git flow. The Git-triggered builds happen automatically on push to the production branch using your dashboard settings.

The goal: every piece of the platform is auditable, reproducible, and grounded in structured legal truth — not model weights.

---
_For research orientation only — not a substitute for counsel or the official record._

<<<<<<< Updated upstream
**Latest update:** Polished the exact UI from commit dce0229 (thicker courthouse icon strokeWidth=2.5 + no border, larger site name text-2xl, body font 1.125rem, About page titled "The Premise"). Build stabilized with clean `scripts/copy-brain.cjs` and simple dashboard settings. Push to this branch for deploys. Use CF Deployments to promote the version with the good UI if needed.
