# Aptitude Brain — Legal Intelligence Core

**The reasoning engine that turns unstructured legal experiences into structured, queryable, auditable legal intelligence.**

This is the implementation of Volumes I–VI from the Aptitude System Technical Manual (living LaTeX architecture document).

## Mission
Transform lived legal experiences (narratives, records, questions) into:
- Structured events
- Ontology-mapped claims, doctrines, remedies
- Citation graphs + semantic retrieval
- Procedural enforcement pathways
- Complete audit provenance

**Design principles (non-negotiable):** Auditability before automation, Structured truth before model output, Reproducibility before performance, Jurisdictional isolation, Explainability by design, Event-driven execution, Immutable historical records, Versioned knowledge, Deterministic behavior.

## Core Architecture (from Volume I)

User Narrative → Structured Event (Intake Parser) → Legal Classification (ontology) → Graph Expansion (nodes/edges) → Vector Retrieval → Procedural Analysis → Response + Audit

All steps are:
- Triggered by events
- Linked by workflow_id / incident_id / correlation_id
- Fully audited (input hash, output hash, agent version, jurisdiction, timestamp)

## The Five Agents (exact contracts & prompts from the spec)

### 1. Intake Parser Agent
**Role:** Legal event structuring engine.
Extracts observable facts only. Never infers legal conclusions.

Prompt (verbatim):
```
SYSTEM ROLE:
You are a legal event structuring engine.

TASK:
Extract structured legal facts from unstructured narrative.

OUTPUT REQUIREMENTS:
Return valid JSON matching the Legal Event schema.

RULES:
- Do not infer legal conclusions
- Do not provide advice
- Only structure observable facts
- Preserve uncertainty explicitly
```

Output includes: event_id, event_type (one of the 5 misid types), actors, timeline, legal_signals, uncertainty[].

### 2. Legal Classifier Agent
Maps to claims + doctrines **using the ontology only** (conservative).

Prompt (verbatim):
```
SYSTEM ROLE:
You are a legal classification engine.

TASK:
Map structured events to legal claim types and doctrine clusters.

OUTPUT:
{ "claims": [...], "doctrines": [...], "confidence_scores": {...} }

RULES:
- Use ontology only
- Do not hallucinate statutes or cases
- Prefer conservative classification
```

### 3. Graph Seeder Agent
Constructs the legal knowledge graph. Every edge has a typed relationship. No orphans. Jurisdiction filtering mandatory.

Relationships (deterministic):
- Event → Claim : supports
- Claim → Doctrine : governed_by
- Doctrine → Statute : codified_in
- Event → Policy : violates
- Claim → Remedy : resolved_by

### 4. Vector Retrieval Agent
Semantic retrieval of supporting authority (cases, statutes, policies). Returns ranked chunks with metadata. **Supporting material only — no conclusions.**

### 5. Procedural Engine Agent
Builds ordered enforcement pathways (criminal defense, civil, administrative) with prerequisites and jurisdiction alignment. Never omits required steps.

## Current Implementation (on `aptitude-emergent` branch)

- `ontology/` — JSON definitions for event_types (warrant_misidentification_arrest, eyewitness_misidentification, database_identity_error, biometric_false_match, mixed_identity_detention), claims, doctrines, remedies, and relationship rules.
- `backend/agents/` — Full Python classes implementing the Universal Agent Contract (`run(event, state) → {output, confidence, audit_metadata, emitted_events, version, execution_metrics}`).
- `backend/orchestration/pipeline.py` — Complete deterministic 6-step orchestrator matching the spec state machine. Produces the full result object.
- `backend/incident_router.py` + wired into `backend/server.py` — `POST /api/incident/submit` and `GET /api/incident/{id}/result`.
- All outputs carry full audit trail with hashes.
- LLM-ready (reuses the existing emergentintegrations + Claude setup on the branch) with safe deterministic fallbacks.
- Demo: `backend/tools/run_brain_demo.py`

The backend is **FastAPI + Mongo** (reusing the existing stack). The brain is additive to the existing Beacon/judge data serving and the strict /search Q&A endpoint.

## API Contracts (spec)

```
POST /api/incident/submit
{
  "text": "... raw narrative ...",
  "jurisdiction": { "state": "Oregon", "county": "..." }
}

Returns:
{
  "incident_id": "...",
  "workflow_id": "...",
  "structured_event": { ... },
  "classification": { "claims": [...], "doctrines": [...] },
  "graph": { "nodes": [...], "edges": [...] },
  "retrieval": { "top_k": [...] },
  "procedural": { "pathways": [...] },
  "audit_trail": [ ... hashes, versions, timestamps ... ]
}
```

## System Invariants (enforced)
- No output without provenance.
- No citation without source.
- No authority without jurisdiction.
- No overwrite of historical records.
- No legal conclusion without supporting authorities.
- No procedural recommendation without prerequisite validation.

## Relationship to the Rest of the Platform
- Feeds the Bias Beacon / Judicial Analytics (Volume V).
- Powers Juris Lab research tools.
- The static UI (this site, deployed via Cloudflare from this branch) will consume the brain APIs for interactive incident intake, legal map visualization, and procedural guidance.
- Raw corpus lives in the sibling `oregon-legal-repo` (court filings, DHS materials, etc.) and will be ingested via the pipeline (Tier 1–4 sources: binding law, case law, agency policies, secondary material).

## Next Steps (see full living LaTeX Technical Manual for details)
- Full persistence of incidents / graph / audits in the DB layer.
- Real vector store + embedding pipeline (pgvector / Qdrant or Mongo vectors).
- Legal corpus ingestion (ORS, CourtListener, agency manuals from oregon-legal-repo PDFs).
- Graph store (Neo4j/Memgraph or in-process for MVP).
- Rich frontend components on this site (incident form → live structured result + graph viewer + procedural tree).
- Versioned ontology + prompt governance.

See the full **Aptitude System Technical Manual** (the LaTeX document you are maintaining) for the complete ontology spec, agent prompts, orchestration model, storage architecture, security/audit model, and cross-volume dependencies.

---
*This brain is not a search engine. It is a legal reasoning system that transforms lived experience into structured legal intelligence.*

**Implementation branch for core:** `aptitude-emergent`
**UI / docs branch (this Cloudflare deploy):** `claude/judge-bias-beacon-scoring-8qAT3`
