"""
Universal Agent Contract for Aptitude Brain.

All agents are stateless with respect to long-term memory (use passed state + audit).
Every transformation is fully auditable.
"""
from abc import ABC, abstractmethod
from typing import Any, Dict
from datetime import datetime, timezone
import hashlib
import uuid


class BaseAgent(ABC):
    version = "0.1.0"
    name = "base"

    def __init__(self, llm_client=None):
        self.llm_client = llm_client  # emergentintegrations LlmChat or compatible

    @abstractmethod
    def run(self, event: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent's contract. Must never mutate input event/state."""
        pass

    def _audit_metadata(self, input_event: dict, output: Any, jurisdiction: str = "Oregon") -> dict:
        input_str = str(input_event)
        output_str = str(output)
        return {
            "agent": self.name,
            "version": self.version,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "jurisdiction": jurisdiction,
            "input_hash": hashlib.sha256(input_str.encode()).hexdigest()[:16],
            "output_hash": hashlib.sha256(output_str.encode()).hexdigest()[:16],
            "correlation_id": state.get("correlation_id") or str(uuid.uuid4()),
            "workflow_id": state.get("workflow_id"),
            "incident_id": state.get("incident_id"),
        }

    def _metrics(self, start_ts: float) -> dict:
        # caller should pass time.perf_counter() or similar
        return {"execution_time_ms": round((__import__('time').perf_counter() - start_ts) * 1000, 2)}

    def _emit(self, event_type: str, payload: dict) -> dict:
        return {"type": event_type, "payload": payload, "ts": datetime.now(timezone.utc).isoformat()}
