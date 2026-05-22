# A.P.T.I.T.U.D.E. — PRD

## Original Problem Statement
Premium dark legal-tech landing → pivoted (iteration 2) into **A Platform Tracking Institutional Trends Uncovering Disparate Enforcement** — Oregon's first public judicial dataset platform. Cinematic Lady Justice hero, central LLM search, 8 sub-pages: Judiciary (211 sitting judges), Watchtower (prosecutors), Law Enforcement (every officer), Community Corrections (every PO), Bias Beacon (dashboard with disparity heat maps + budget flow), Juris Lab (document AI agents), Community (commons + complaint pathways), About.

## Architecture
- **Frontend**: React (CRA + Tailwind + shadcn). Routes: `/`, `/judiciary`, `/watchtower`, `/law-enforcement`, `/community-corrections`, `/bias-beacon`, `/juris-lab`, `/community`, `/about`. Components under `src/components/aptitude/*`; pages under `src/pages/*`.
- **Backend**: FastAPI in `/app/backend/server.py`. All routes prefixed `/api`.
- **LLM**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via `emergentintegrations`. System prompt Oregon-focused; handles general / actor / caselaw questions in Principle / Analysis / Proof Markdown structure.
- **Mongo collections**: `db.searches`, `db.status_checks`, `db.actors` (empty, awaiting dataset).
- **Endpoints**: `/api/`, `/api/status` (POST/GET), `/api/search`, `/api/searches`, `/api/oregon-facts`, `/api/actors`.

## User Personas
- Oregonians researching a particular judge, DA, officer, or PO
- Public-defense and legal-aid staff scanning patterns across a county
- Reporters following disparity and budget flows
- Self-represented people navigating complaint pathways

## Core Requirements (static)
- Deep navy / near-black / ivory / soft gold / steel-blue palette; no neon, no purple SaaS gradients
- Hero: Lady Justice video bg w/ slow walking pan, dark navy overlay, **3D embossed wordmark**, full acronym expanded beneath, borderless soft-underline search bar, **Oregon fact counter at bottom of hero**
- 8 sub-pages with PageShell template, "Awaiting Dataset" data-status panel where applicable
- Actor cards designed for 3-tier flip + 3-actor compare (data-pending)
- LLM-powered Counsel's Brief on hero search

## Implemented (2026-05-22)

### Iteration 1
- Initial premium dark landing page, custom SVG wordmark, glassmorphic search, Claude Sonnet 4.5 integration, MongoDB persistence, Markdown render
- 100% tests passing (6/6 pytest)

### Iteration 2 — Oregon Judicial Platform Pivot
- Full acronym expansion under wordmark + 3D embossed metallic wordmark (text-shadow stack + gold gradient text fill)
- Borderless soft-underline search bar (replaced hard pill outline)
- Hero walking-pan animation on Lady Justice (CSS keyframes, reduced-motion safe)
- Animated Oregon-fact counter at hero bottom (6 rotating facts: 211 judges, 36 counties, 27 DAs, 380K STOP stops, 411 prison rate, 95% plea rate)
- 8 3D-raised flipping "Pages" cards on home page (textile, shadowed, hover-to-reveal tiers)
- 8 scaffolded routes with `PageShell` template, "Awaiting Dataset" status panels:
  - `/judiciary` — toolbar (search/filter/compare 0/3), Tier I/II/III framework, 9 "Sealed" skeleton actor cards
  - `/watchtower` — 9 county office cards
  - `/law-enforcement` — 9 agency cards
  - `/community-corrections` — 12 county cards
  - `/bias-beacon` — 4 dashboard panels w/ illustrative SVG charts (heatmap, bars, flow, pulse)
  - `/juris-lab` — upload zone + 4 agent cards (Analyst, Researcher, Draft Counsel, Informer)
  - `/community` — 6 pillars (public comment, meetings, ORS/OAR, complaint pathways, groups, CPS-pending)
  - `/about` — 3 founder placeholders + 3 tenet columns
- New backend endpoints `/api/oregon-facts` and `/api/actors`
- LLM system prompt rewritten for Oregon-specific judicial context
- TopNav redesigned: 5 primary links + About + mobile menu
- File structure refactored: `components/aptitude/*` + `pages/*` (no file > 700 lines)
- 100% tests passing (10/10 pytest + full frontend verification)

## Prioritized Backlog (data-dependent → next iterations)

### P0 — Once dataset arrives
- Wire 211 judge records into `/judiciary` actor cards
- Build full 3-tier flip + 3-actor compare functionality on actor cards
- Wire DAs into `/watchtower` (office → individual DDA drill-down)
- Wire officers into `/law-enforcement` (agency → officer)
- Wire POs into `/community-corrections` (county → PO)

### P1 — Bias Beacon real charts
- Connect Oregon STOP data feed → live disparity heat map
- Connect OJD / OCJC feeds → demographic conviction & sentencing charts
- Connect state budget data → follow-the-money sankey/flow chart
- Add 3D `react-three-fiber` visualizations for the deep-dive tier

### P1 — Juris Lab agent build-out
- Document upload → S3-compatible storage
- 4 agents wired to Claude Sonnet 4.5 with specialized system prompts (Analyst, Researcher, Draft Counsel, Informer)
- Shared template library + community-curated bank

### P2 — Community page activation
- Public-comment portals (deep links to each Oregon agency window)
- Statewide meeting calendar (ingest from OR.gov)
- Complaint pathways: step-by-step flow for judge / lawyer / LE / PO / CPS oversight bodies
- Group discussion threads (auth required)

### P2 — Auth + accounts
- Add Google or Emergent Auth for saved searches, compare-set persistence, community participation
- Roles: public / community member / verified researcher

### P3 — Bespoke hero asset
- Replace Pixabay loop with user's Canva-exported Lady Justice walking video

## Next Tasks (immediate, awaiting user)
- Receive judicial roster CSV/JSON → wire `/judiciary`
- Receive prosecutor, LE, PO rosters → wire respective pages
- Receive founder bios → populate `/about`
- Receive bespoke Lady Justice MP4 → swap hero video source
