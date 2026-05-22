# A.P.T.I.T.U.D.E. — PRD

## Original Problem Statement
Build a premium dark-theme landing page for A.P.T.I.T.U.D.E. with a cinematic, restrained legal aesthetic. Lady Justice video background in hero, dark navy overlay, central full-width LLM-powered search bar. Palette: deep navy, near-black, muted ivory, soft gold, faint steel-blue. Tagline: "Accountability Is Real." Avoid neon, purple SaaS gradients, generic SaaS cards. Sections: Hero, Principles, Capabilities, Trust/Quote, Footer.

## Architecture
- **Frontend**: React (CRA + Tailwind + shadcn/ui). Single page in `/app/frontend/src/App.js`. Theme tokens & fonts (Playfair Display + Cormorant Garamond + Outfit) in `/app/frontend/src/index.css`.
- **Backend**: FastAPI in `/app/backend/server.py`. All routes prefixed `/api`. Mongo via Motor.
- **LLM**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via `emergentintegrations` LlmChat + `EMERGENT_LLM_KEY`. Disciplined system prompt returns Principle / Analysis / Proof in Markdown.
- **Persistence**: `db.searches` stores `{id, session_id, query, answer, created_at}`. Sessions enable conversation continuity.

## User Personas
- Law students and junior associates needing fast doctrinal orientation
- Senior counsel scanning controlling principles before drafting
- Legal-tech enthusiasts exploring AI research instruments

## Core Requirements (static)
- Dark navy base, near-black surfaces, ivory text, gold accents (no neon / purple SaaS)
- Hero: Lady Justice video bg + custom SVG wordmark + tagline + dominant glassmorphic search
- Refined nav, principles trio, bespoke capabilities grid, cinematic editorial quote, footer
- Accessible (focus rings, reduced-motion fallback to still image), responsive, performant

## Implemented (2026-05-22)
- Custom SVG scale logo + decorative A.P.T.I.T.U.D.E. wordmark with gold dotted separators
- Hero with Pixabay Lady Justice video (fallback Unsplash poster, second video source as backup)
- Sticky glass top nav with scroll-aware blur
- LLM-powered search: POST `/api/search` (Claude Sonnet 4.5) + GET `/api/searches`, Markdown rendering of "Counsel's Brief"
- Drifting subject-areas marquee strip
- "Three rules. No exceptions." Principles section with Roman numerals
- Bento Capabilities grid (4 cards, full-width discipline card)
- Trust section with Aristotle quote + scale silhouette
- Refined footer with brand mark and minimal links
- Reduced-motion CSS + grain texture + gold hairlines
- Suggestion chips that populate the search input
- Tested: 100% backend pytest + frontend visual + flow validation (testing_agent_v3 iteration 1)

## Prioritized Backlog
- P1: Recent searches drawer (uses existing `/api/searches`)
- P1: Streaming responses for the Counsel's Brief (token-by-token reveal)
- P2: Jurisdiction selector (US / UK / EU / IN) wired into the system prompt
- P2: Save / share a brief (anonymous shareable URL)
- P2: Replace the Pixabay video with a hosted, color-graded cut
- P3: Dark mode toggle for an ivory-on-cream "vellum" reading variant for the brief panel

## Next Tasks (immediate)
- Optionally swap hero video to a user-provided direct URL (Canva link wasn't directly embeddable)
- Wire share & copy actions on the brief
