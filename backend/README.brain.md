## Aptitude Brain (Core Legal Intelligence)

This directory and sibling ontology/ + pipelines/ implement the multi-agent legal reasoning system described in the Aptitude System Technical Manual.

### Architecture Alignment
- Follows Volume I (System Architecture) principles: Auditability before automation, Structured Truth before model output, Jurisdictional Isolation, Event-Driven, Immutable records, Versioned knowledge.
- 5 agents with strict contracts and the exact prompts from the spec.
- Orchestration is replayable and emits the canonical events (incident.created, .structured, .classified, graph.* , retrieval.*, procedure.generated, ...).
- All outputs carry audit_metadata with input/output hashes.

### Current Status (on aptitude-emergent)
- Ontology (misidentification module) implemented as JSON + loaded in agents.
- All 5 agents runnable (LLM path prepared for emergentintegrations; deterministic fallback always works).
- Full pipeline in backend/orchestration/pipeline.py : submit_incident -> complete result.
- FastAPI router ready (import in server.py to expose /api/incident/submit and /result).

### Next (high priority)
- Wire the incident_router into the main server.py (include_router).
- Persist using the existing motor Mongo client (incidents, structured_events, graph_nodes, graph_edges, audit_log).
- Add real vector store (store embeddings on document_chunks or use Qdrant/pgvector).
- Seed graph and retrieval corpus from oregon-legal-repo + ORS / CourtListener ingestion pipeline.
- Add full provenance for every citation.

### Running a sample
```bash
cd backend
python -c '
import asyncio
from orchestration.pipeline import AptitudeOrchestrator
orch = AptitudeOrchestrator()
res = asyncio.run(orch.submit_incident("I was arrested on a warrant that was for someone else with a similar name. They never checked my ID properly."))
print(res["classification"])
print(res["procedural"])
'
```

See the full LaTeX Technical Manual (user's living doc) and the cross-volume dependency graph for complete rules.

All system invariants must be respected (no output without provenance, no citation without source, etc.).
