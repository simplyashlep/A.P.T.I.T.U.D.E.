"""
Aptitude Brain Agents

Each agent implements the Universal Agent Contract:
    def run(self, event: dict, state: dict) -> dict:
        return {
            "output": ...,
            "confidence": 0.0-1.0,
            "audit_metadata": {...},
            "emitted_events": [...],
            "version": "0.1",
            "execution_metrics": {...}
        }

See Aptitude System Technical Manual for full contracts and prompts.
"""
from .base_agent import BaseAgent
from .intake_parser_agent import IntakeParserAgent
from .legal_classifier_agent import LegalClassifierAgent
from .graph_seeder_agent import GraphSeederAgent
from .vector_retrieval_agent import VectorRetrievalAgent
from .procedural_engine_agent import ProceduralEngineAgent

__all__ = [
    "BaseAgent",
    "IntakeParserAgent",
    "LegalClassifierAgent",
    "GraphSeederAgent",
    "VectorRetrievalAgent",
    "ProceduralEngineAgent",
]
