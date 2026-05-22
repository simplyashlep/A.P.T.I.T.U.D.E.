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
    "You are A.P.T.I.T.U.D.E., a disciplined legal research assistant. "
    "Your purpose is precision, principle, and proof. "
    "Answer with the restraint of a senior appellate clerk: calm, exact, and grounded in law and reason. "
    "When the user submits a query, respond in this exact structure using plain text and Markdown:\n\n"
    "**Principle.** One precise sentence stating the controlling legal principle.\n\n"
    "**Analysis.** 3-6 disciplined sentences. Cite doctrines, statutes, or canonical cases by name where relevant. "
    "Acknowledge ambiguity rather than inventing facts.\n\n"
    "**Proof.** A short bulleted list (2-4 items) of the authorities, frameworks, or further reading worth consulting.\n\n"
    "Rules: never fabricate citations or pinpoints; if you are not certain a case exists, name only the doctrine. "
    "Never give individualized legal advice. Always close with a single italic line: "
    "_For research orientation only — not a substitute for counsel._ "
    "Keep total length under 220 words. Use jurisdiction-neutral framing unless the query specifies one."
)


# ------------------- Routes -------------------
@api_router.get("/")
async def root():
    return {"message": "A.P.T.I.T.U.D.E. — Precision. Principle. Proof."}


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
