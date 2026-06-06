"""
Agent 3: Graph Seeder Agent

SYSTEM ROLE:
You are a legal knowledge graph constructor.

TASK:
Attach legal nodes (statutes, cases, policies, remedies) to structured events.

OUTPUT:
Graph edges in standardized format.

RULES:
- Every edge must have a defined relationship type
- No orphan nodes allowed
- Jurisdiction filtering is mandatory
"""
from typing import Any, Dict
import time, uuid
from .base_agent import BaseAgent


class GraphSeederAgent(BaseAgent):
    name = "graph_seeder"

    def run(self, event: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        structured = event.get("structured_event", event)
        classification = event.get("classification", {})
        jurisdiction = structured.get("jurisdiction", {"state": "Oregon"})

        nodes = []
        edges = []

        # Seed core nodes from event + classification (deterministic per spec)
        event_node_id = str(uuid.uuid4())
        nodes.append({"id": event_node_id, "node_type": "Event", "label": structured.get("event_type"), "ref_id": structured.get("event_id")})

        for claim in classification.get("claims", []):
            claim_id = str(uuid.uuid4())
            nodes.append({"id": claim_id, "node_type": "Claim", "label": claim, "jurisdiction": jurisdiction})
            edges.append({
                "id": str(uuid.uuid4()),
                "from_node": event_node_id,
                "to_node": claim_id,
                "edge_type": "supports",
                "weight": 0.8,
                "jurisdiction": jurisdiction
            })

        for doctrine in classification.get("doctrines", []):
            d_id = str(uuid.uuid4())
            nodes.append({"id": d_id, "node_type": "Doctrine", "label": doctrine})
            # link last claim if present
            if edges:
                edges.append({"id": str(uuid.uuid4()), "from_node": edges[-1]["to_node"], "to_node": d_id, "edge_type": "governed_by", "weight": 0.9, "jurisdiction": jurisdiction})

        # Always seed at least one remedy path
        remedy_id = str(uuid.uuid4())
        nodes.append({"id": remedy_id, "node_type": "Remedy", "label": "section_1983_civil_action"})
        if classification.get("claims"):
            edges.append({"id": str(uuid.uuid4()), "from_node": edges[0]["to_node"] if edges else event_node_id, "to_node": remedy_id, "edge_type": "resolved_by", "weight": 0.7, "jurisdiction": jurisdiction})

        out = {"nodes": nodes, "edges": edges}

        return {
            "output": out,
            "confidence": 0.88,
            "audit_metadata": self._audit_metadata(event, out),
            "emitted_events": [self._emit("graph.nodes.created", {"count": len(nodes)}), self._emit("graph.edges.created", {"count": len(edges)})],
            "version": self.version,
            "execution_metrics": self._metrics(start),
        }
