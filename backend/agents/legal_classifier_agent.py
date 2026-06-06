"""
Agent 2: Legal Classifier Agent

SYSTEM ROLE (verbatim):
You are a legal classification engine.

TASK:
Map structured events to legal claim types and doctrine clusters.

OUTPUT:
{
  "claims": [...],
  "doctrines": [...],
  "confidence_scores": {...}
}

RULES:
- Use ontology only
- Do not hallucinate statutes or cases
- Prefer conservative classification
"""
from typing import Any, Dict
import time, json
from pathlib import Path
from .base_agent import BaseAgent

_ONTOLOGY_DIR = Path(__file__).parent.parent.parent / "ontology"


class LegalClassifierAgent(BaseAgent):
    name = "legal_classifier"
    SYSTEM_PROMPT = '''SYSTEM ROLE:
You are a legal classification engine.

TASK:
Map structured events to legal claim types and doctrine clusters.

OUTPUT:
{
    "claims": [...],
    "doctrines": [...],
    "confidence_scores": {...}
}

RULES:
- Use ontology only
- Do not hallucinate statutes or cases
- Prefer conservative classification
'''

    def __init__(self, llm_client=None):
        super().__init__(llm_client)
        self.claims = json.loads((_ONTOLOGY_DIR / "claims.json").read_text())["claims"]
        self.doctrines = json.loads((_ONTOLOGY_DIR / "doctrines.json").read_text())["doctrines"]

    def run(self, event: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        structured = event.get("structured_event") or event  # accept raw or previous output
        et = structured.get("event_type", "")

        claims = []
        doctrines = []
        scores = {}

        # Ontology-driven conservative mapping (production version uses LLM + strict ontology filter)
        if et in ("warrant_misidentification_arrest", "database_identity_error", "biometric_false_match"):
            claims = ["false_arrest", "unlawful_detention", "civil_rights_violation_42usc1983"]
            doctrines = ["probable_cause_standard", "seizure_under_fourth_amendment", "qualified_immunity_framework"]
            scores = {"false_arrest": 0.78, "civil_rights_violation_42usc1983": 0.71}
        elif et == "eyewitness_misidentification":
            claims = ["false_arrest", "due_process_violation"]
            doctrines = ["probable_cause_standard", "due_process_identity_verification"]
            scores = {"false_arrest": 0.65}

        out = {"claims": claims, "doctrines": doctrines, "confidence_scores": scores}

        return {
            "output": out,
            "confidence": max(scores.values()) if scores else 0.6,
            "audit_metadata": self._audit_metadata(event, out),
            "emitted_events": [self._emit("event.classified", {"claims": claims})],
            "version": self.version,
            "execution_metrics": self._metrics(start),
        }
