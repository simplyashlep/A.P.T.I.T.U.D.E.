"""Oregon judges data loader and helpers."""
from __future__ import annotations
import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).parent / "data"
DIRECTORY_PATH = DATA_DIR / "judges-directory.json"

_cache: dict[str, Any] | None = None


def load_directory() -> dict[str, Any]:
    global _cache
    if _cache is None:
        with open(DIRECTORY_PATH, "r", encoding="utf-8") as f:
            _cache = json.load(f)
    return _cache


def all_judges() -> list[dict[str, Any]]:
    return load_directory().get("judges", [])


def get_judge(judge_id: str) -> dict[str, Any] | None:
    for j in all_judges():
        if j.get("id") == judge_id:
            return j
    return None


def filter_judges(
    q: str | None = None,
    county: str | None = None,
    court: str | None = None,
    risk: str | None = None,
    with_metrics: bool | None = None,
) -> list[dict[str, Any]]:
    judges = all_judges()
    if q:
        ql = q.lower().strip()
        judges = [
            j for j in judges
            if ql in (j.get("name") or "").lower()
            or ql in (j.get("county") or "").lower()
            or ql in (j.get("roleTitle") or "").lower()
            or ql in (j.get("category") or "").lower()
        ]
    if county:
        judges = [j for j in judges if (j.get("county") or "").lower() == county.lower()]
    if court:
        judges = [j for j in judges if (j.get("category") or "").lower() == court.lower()]
    if risk:
        judges = [j for j in judges if (j.get("riskLevel") or "").lower() == risk.lower()]
    if with_metrics is True:
        judges = [j for j in judges if j.get("metricsVerified")]
    return judges


def stats() -> dict[str, Any]:
    judges = all_judges()
    counts = load_directory().get("counts", {})

    by_county: dict[str, int] = {}
    by_court: dict[str, int] = {}
    by_risk: dict[str, int] = {}
    for j in judges:
        c = j.get("county") or "Unknown"
        ct = j.get("category") or "Unknown"
        r = j.get("riskLevel") or "pending"
        by_county[c] = by_county.get(c, 0) + 1
        by_court[ct] = by_court.get(ct, 0) + 1
        by_risk[r] = by_risk.get(r, 0) + 1

    counties_sorted = sorted(by_county.items(), key=lambda kv: kv[0])

    return {
        "totals": {
            "judges": len(judges),
            "officialJudges": counts.get("officialJudges", len(judges)),
            "presidingJudges": counts.get("presidingJudges", 0),
            "judgesWithMetrics": counts.get("judgesWithMetrics", 0),
        },
        "by_court": by_court,
        "by_risk": by_risk,
        "counties": [{"name": c, "count": n} for c, n in counties_sorted],
        "generated_at": load_directory().get("generatedAt"),
    }


def slim(judge: dict[str, Any]) -> dict[str, Any]:
    """Tier I + score view for list endpoints."""
    return {
        "id": judge.get("id"),
        "name": judge.get("name"),
        "category": judge.get("category"),
        "roleTitle": judge.get("roleTitle"),
        "county": judge.get("county"),
        "district": judge.get("district"),
        "termExpiresDisplay": judge.get("termExpiresDisplay"),
        "officialPhotoUrl": judge.get("officialPhotoUrl"),
        "isPresiding": bool(judge.get("isPresiding")),
        "score": judge.get("score"),
        "scoreLabel": judge.get("scoreLabel"),
        "riskLevel": judge.get("riskLevel"),
        "metricsVerified": bool(judge.get("metricsVerified")),
        "focus": judge.get("focus"),
        "tenureDisplay": judge.get("tenureDisplay"),
    }
