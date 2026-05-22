"""Backend tests for A.P.T.I.T.U.D.E. API"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://legal-inquiry-1.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ------------------- Root -------------------
def test_root_brand_message(session):
    r = session.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert "message" in data
    assert "A.P.T.I.T.U.D.E." in data["message"]


# ------------------- Search Validation -------------------
def test_search_validation_short_query(session):
    r = session.post(f"{API}/search", json={"query": "a"}, timeout=30)
    assert r.status_code == 422


def test_search_validation_empty_query(session):
    r = session.post(f"{API}/search", json={"query": ""}, timeout=30)
    assert r.status_code == 422


# ------------------- Search (LLM call) -------------------
@pytest.fixture(scope="module")
def first_search(session):
    payload = {"query": "What governs the doctrine of piercing the corporate veil?"}
    r = session.post(f"{API}/search", json=payload, timeout=120)
    assert r.status_code == 200, f"Unexpected status: {r.status_code} {r.text}"
    return r.json()


def test_search_returns_structured_brief(first_search):
    data = first_search
    assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
    assert "session_id" in data and isinstance(data["session_id"], str) and len(data["session_id"]) > 0
    assert "created_at" in data
    assert "answer" in data and isinstance(data["answer"], str) and len(data["answer"]) > 30
    # Counsel's Brief structure
    answer = data["answer"]
    assert "Principle" in answer
    assert "Analysis" in answer
    assert "Proof" in answer


def test_search_persists_and_listed(session, first_search):
    r = session.get(f"{API}/searches?limit=20", timeout=30)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) >= 1
    ids = [it.get("id") for it in items]
    assert first_search["id"] in ids
    # No mongo _id leakage
    for it in items:
        assert "_id" not in it


def test_search_session_continuation(session, first_search):
    payload = {
        "query": "Apply that doctrine to a single-owner LLC with commingled funds.",
        "session_id": first_search["session_id"],
    }
    r = session.post(f"{API}/search", json=payload, timeout=120)
    assert r.status_code == 200
    data = r.json()
    assert data["session_id"] == first_search["session_id"]
    assert len(data["answer"]) > 30
