from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI(title="A.P.T.I.T.U.D.E. API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ------------------- Models -------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=2000)
    session_id: Optional[str] = None


class SearchResponse(BaseModel):
    id: str
    session_id: str
    query: str
    answer: str
    created_at: datetime


SYSTEM_PROMPT = (
    "You are A.P.T.I.T.U.D.E. — A Platform Tracking Institutional Trends Uncovering Disparate Enforcement. "
    "You are the first public dataset instrument for Oregon's justice system. "
    "Your purpose is precision, principle, and proof — making siloed public information cohere into the actual record. "
    "Users may ask three kinds of questions: (1) general questions about how Oregon's justice system works, "
    "(2) lookups about a particular actor (judge, district attorney, law enforcement officer, parole/probation officer, or agency), "
    "or (3) caselaw and statute questions (Oregon Revised Statutes (ORS), Oregon Administrative Rules (OAR), Oregon Court of Appeals or Supreme Court decisions). "
    "Detect which kind of question is being asked and respond in this structure using Markdown:\n\n"
    "**Principle.** One precise sentence: for general questions state the controlling rule or process; "
    "for actor questions state what is and is not publicly known about that role in Oregon; "
    "for caselaw questions state the holding or rule.\n\n"
    "**Analysis.** 3-6 disciplined sentences grounding the answer in Oregon-specific sources where possible — "
    "the Oregon Judicial Department (OJD), ORS, OAR, the Oregon Criminal Justice Commission, the STOP Data dashboard (HB 2355), "
    "or the Oregon State Bar. Acknowledge data gaps and siloing rather than inventing facts. "
    "If individual-actor data is not yet loaded into the platform, say so plainly and point to where the public record lives.\n\n"
    "**Proof.** A short bulleted list (2-4 items) of authorities, datasets, or further reading worth consulting.\n\n"
    "Rules: never fabricate case names, statute pinpoints, or individual records; "
    "if uncertain whether a case or person exists, name only the doctrine or role. "
    "Never give individualized legal advice. Keep total length under 240 words. "
    "Close with a single italic line: _For research orientation only — not a substitute for counsel or the official record._"
)


# ------------------- Routes -------------------
@api_router.get("/")
async def root():
    return {"message": "A.P.T.I.T.U.D.E. — A Platform Tracking Institutional Trends Uncovering Disparate Enforcement."}


# Oregon judicial system high-level facts/stats for the hero counter.
# Sources are public; numbers are conservative approximations and will be
# replaced with live data once the official datasets are wired in.
OREGON_FACTS = [
    {"value": 211, "label": "Sitting trial-court judges across Oregon's 36 counties", "kind": "count", "source": "Oregon Judicial Department"},
    {"value": 36, "label": "Counties — each with its own pattern of enforcement", "kind": "count", "source": "Oregon Blue Book"},
    {"value": 27, "label": "Elected District Attorneys — the prosecutorial gatekeepers", "kind": "count", "source": "Oregon DAA"},
    {"value": 380000, "label": "Traffic stops disclosed under Oregon HB 2355 in a recent year", "kind": "count", "source": "Oregon STOP Data Dashboard"},
    {"value": 411, "label": "Oregon's prison incarceration rate per 100,000 — below the U.S. average of 565", "kind": "ratio", "source": "Oregon DOC / BJS"},
    {"value": 95, "label": "Percent of Oregon felony convictions resolved by plea, not trial", "kind": "percent", "source": "Oregon Criminal Justice Commission"},
]


@api_router.get("/oregon-facts")
async def oregon_facts():
    return {"facts": OREGON_FACTS}


@api_router.get("/actors")
async def list_actors(role: Optional[str] = None, county: Optional[str] = None):
    """Returns the list of actor records.

    Returns an empty list with a clear data-status flag while the official
    OJD / DAA / DPSST / DOC datasets are being wired in. Roles will include:
    judge, prosecutor, law_enforcement, parole_probation.
    """
    query = {}
    if role:
        query["role"] = role
    if county:
        query["county"] = county
    docs = await db.actors.find(query, {"_id": 0}).to_list(2000)
    return {
        "data_status": "pending_dataset" if not docs else "loaded",
        "count": len(docs),
        "actors": docs,
    }


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    session_id = req.session_id or str(uuid.uuid4())
    query_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=SYSTEM_PROMPT,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        message = UserMessage(text=req.query)
        answer = await chat.send_message(message)

        if not isinstance(answer, str):
            answer = str(answer)
    except Exception as e:
        logger.exception("LLM search failed")
        raise HTTPException(status_code=502, detail=f"Search failed: {str(e)[:200]}")

    doc = {
        "id": query_id,
        "session_id": session_id,
        "query": req.query,
        "answer": answer,
        "created_at": created_at.isoformat(),
    }
    await db.searches.insert_one(doc)

    return SearchResponse(
        id=query_id,
        session_id=session_id,
        query=req.query,
        answer=answer,
        created_at=created_at,
    )


@api_router.get("/searches", response_model=List[SearchResponse])
async def list_searches(limit: int = 20):
    docs = await db.searches.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    out: List[SearchResponse] = []
    for d in docs:
        ca = d.get("created_at")
        if isinstance(ca, str):
            ca = datetime.fromisoformat(ca)
        out.append(SearchResponse(
            id=d["id"],
            session_id=d["session_id"],
            query=d["query"],
            answer=d["answer"],
            created_at=ca,
        ))
    return out


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
