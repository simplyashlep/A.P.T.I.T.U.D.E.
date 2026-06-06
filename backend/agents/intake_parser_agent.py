"""
Agent 1: Intake Parser Agent

SYSTEM ROLE (verbatim from spec):
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
"""
from typing import Any, Dict
import time
from .base_agent import BaseAgent


class IntakeParserAgent(BaseAgent):
    name = "intake_parser"
    SYSTEM_PROMPT = '''SYSTEM ROLE:
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

Legal Event schema (core fields):
{
  "event_id": "uuid",
  "event_type": "warrant_misidentification_arrest | eyewitness_misidentification | ...",
  "narrative_raw": "...",
  "jurisdiction": {"state": "Oregon"},
  "actors": [ {"type": "...", "role": "..."} ],
  "timeline": [ {"ts": "...", "event": "..."} ],
  "legal_signals": {
    "rights_implicated": [],
    "procedural_triggers": []
  },
  "uncertainty": []
}
'''

    def run(self, event: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        narrative = event.get("text") or event.get("narrative_raw", "")
        jurisdiction = event.get("jurisdiction", {"state": "Oregon"})

        # In production: call LLM with self.SYSTEM_PROMPT + narrative, parse strict JSON.
        # For MVP / no-key: lightweight rule-based structure + explicit uncertainty.
        structured = self._structure(narrative, jurisdiction)

        audit = self._audit_metadata(event, structured, jurisdiction.get("state", "Oregon"))
        metrics = self._metrics(start)

        return {
            "output": structured,
            "confidence": structured.get("_confidence", 0.72),
            "audit_metadata": audit,
            "emitted_events": [self._emit("incident.structured", {"event_id": structured["event_id"]})],
            "version": self.version,
            "execution_metrics": metrics,
        }

    def _structure(self, narrative: str, jurisdiction: dict) -> dict:
        # Minimal deterministic structuring for demo / offline use.
        # Real version uses the LLM prompt exclusively.
        n_lower = narrative.lower()
        et = "warrant_misidentification_arrest"
        if "eyewitness" in n_lower or "witness" in n_lower:
            et = "eyewitness_misidentification"
        elif "biometric" in n_lower or "fingerprint" in n_lower or "facial" in n_lower:
            et = "biometric_false_match"
        elif "database" in n_lower or "record" in n_lower:
            et = "database_identity_error"

        actors = []
        if "police" in n_lower or "officer" in n_lower or "deputy" in n_lower:
            actors.append({"type": "law_enforcement", "role": "arresting_officer"})
        if "jail" in n_lower or "booked" in n_lower:
            actors.append({"type": "agency", "role": "jail"})

        timeline = []
        if "arrest" in n_lower:
            timeline.append({"ts": "reported", "event": "arrest/detention occurred"})

        uncertainty = []
        if "maybe" in n_lower or "possibly" in n_lower or "believe" in n_lower:
            uncertainty.append("identity mismatch details partially uncertain per narrative")

        return {
            "event_id": __import__('uuid').uuid4().hex,
            "event_type": et,
            "narrative_raw": narrative,
            "jurisdiction": jurisdiction,
            "actors": actors,
            "timeline": timeline,
            "legal_signals": {
                "rights_implicated": ["fourth_amendment", "due_process"],
                "procedural_triggers": ["identity_verification_failure"]
            },
            "uncertainty": uncertainty,
            "_confidence": 0.65 if uncertainty else 0.82,
        }
