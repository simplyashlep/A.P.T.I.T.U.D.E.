"""
Execution Pipeline (Deterministic Flow) + Orchestrator

Matches spec:
IncidentCreated → Structured → Classified → GraphExpanded → Retrieved → Procedural → Response

MVP: sequential in-process execution with full audit trail.
Persists to Mongo (incidents, structured_events, graph_nodes, graph_edges, audit_log).
"""
import uuid
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from ..agents import (
    IntakeParserAgent,
    LegalClassifierAgent,
    GraphSeederAgent,
    VectorRetrievalAgent,
    ProceduralEngineAgent,
)


class AptitudeOrchestrator:
    def __init__(self, db=None, llm_client=None):
        self.db = db  # motor db or None
        self.llm = llm_client
        self.agents = {
            "intake": IntakeParserAgent(llm_client=llm_client),
            "classifier": LegalClassifierAgent(llm_client=llm_client),
            "graph_seeder": GraphSeederAgent(llm_client=llm_client),
            "retrieval": VectorRetrievalAgent(llm_client=llm_client),
            "procedural": ProceduralEngineAgent(llm_client=llm_client),
        }

    async def submit_incident(self, text: str, jurisdiction: Optional[dict] = None) -> Dict[str, Any]:
        """Main entry for POST /api/incident/submit equivalent."""
        jurisdiction = jurisdiction or {"state": "Oregon"}
        workflow_id = str(uuid.uuid4())
        incident_id = str(uuid.uuid4())
        correlation_id = str(uuid.uuid4())

        base_state = {
            "workflow_id": workflow_id,
            "incident_id": incident_id,
            "correlation_id": correlation_id,
            "jurisdiction": jurisdiction,
            "started_at": datetime.now(timezone.utc).isoformat(),
        }

        # Step 1: Ingestion record
        incident_doc = {
            "_id": incident_id,
            "workflow_id": workflow_id,
            "raw_text": text,
            "jurisdiction": jurisdiction,
            "status": "INGESTION",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        if self.db is not None:
            await self.db.incidents.insert_one(incident_doc)

        # Step 2: Intake
        intake_res = self.agents["intake"].run({"text": text, "jurisdiction": jurisdiction}, base_state)
        structured = intake_res["output"]
        base_state["structured_event"] = structured

        # Step 3: Classification
        class_res = self.agents["classifier"].run({"structured_event": structured}, base_state)
        classification = class_res["output"]
        base_state["classification"] = classification

        # Step 4: Graph
        graph_res = self.agents["graph_seeder"].run({"structured_event": structured, "classification": classification}, base_state)
        graph = graph_res["output"]
        base_state["graph"] = graph

        # Step 5: Retrieval
        ret_res = self.agents["retrieval"].run({"structured_event": structured, "classification": classification}, base_state)
        retrieval = ret_res["output"]

        # Step 6: Procedural
        proc_res = self.agents["procedural"].run({"structured_event": structured, "classification": classification}, base_state)
        procedural = proc_res["output"]

        result = {
            "incident_id": incident_id,
            "workflow_id": workflow_id,
            "structured_event": structured,
            "classification": classification,
            "graph": graph,
            "retrieval": retrieval,
            "procedural": procedural,
            "audit_trail": [
                intake_res["audit_metadata"],
                class_res["audit_metadata"],
                graph_res["audit_metadata"],
                ret_res["audit_metadata"],
                proc_res["audit_metadata"],
            ],
            "status": "COMPLETE",
            "completed_at": datetime.now(timezone.utc).isoformat(),
        }

        if self.db is not None:
            await self.db.structured_events.insert_one({"incident_id": incident_id, "event_json": structured, "event_type": structured.get("event_type")})
            # naive graph + audit persistence (expand with proper collections in prod)
            await self.db.audit_log.insert_many([a | {"incident_id": incident_id} for a in result["audit_trail"]])

        return result

    def replay(self, incident_id: str):
        """Stub for workflow.replayed per spec. Load snapshot and re-execute stages."""
        # TODO: load from db, re-run agents with same inputs for verification
        return {"status": "replay_not_implemented", "incident_id": incident_id}
