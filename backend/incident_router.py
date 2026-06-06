"""
Incident API for Aptitude Brain (matches spec: Submit Incident + Retrieve Legal Map).

POST /api/incident/submit
GET  /api/incident/{id}/result

Wired into the existing FastAPI server on aptitude-emergent.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict

import os

# Reuse the mongo + emergent pattern from server.py when imported
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    from emergentintegrations.llm.chat import LlmChat
except Exception:
    AsyncIOMotorClient = None
    LlmChat = None

from .orchestration.pipeline import AptitudeOrchestrator

router = APIRouter(prefix="/api/incident", tags=["brain-incident"])


class IncidentSubmit(BaseModel):
    text: str = Field(..., min_length=20, max_length=20000, description="Raw user narrative of the legal experience")
    jurisdiction: Optional[Dict[str, Any]] = Field(default={"state": "Oregon"})


class IncidentResult(BaseModel):
    incident_id: str
    workflow_id: str
    structured_event: dict
    classification: dict
    graph: dict
    retrieval: dict
    procedural: dict
    audit_trail: list
    status: str


def get_orchestrator():
    # In real server.py this would be initialized once with the global mongo client + llm
    # For standalone import we create a minimal one (no db = no persistence in this module)
    return AptitudeOrchestrator(db=None, llm_client=None)


@router.post("/submit", response_model=IncidentResult)
async def submit_incident(payload: IncidentSubmit, orch: AptitudeOrchestrator = Depends(get_orchestrator)):
    try:
        result = await orch.submit_incident(payload.text, payload.jurisdiction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")


@router.get("/{incident_id}/result")
async def get_result(incident_id: str, orch: AptitudeOrchestrator = Depends(get_orchestrator)):
    # In full impl: load from incidents + structured_events + graph collections
    # For MVP the submit returns everything; this is a placeholder for persisted fetch
    raise HTTPException(status_code=501, detail="Persisted result fetch not wired in this scaffold. Use the response from /submit or implement load from db.")
