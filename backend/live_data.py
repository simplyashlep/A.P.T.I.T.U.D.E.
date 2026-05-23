"""Oregon live data loader (STOP + sentencing + dashboards)."""
from __future__ import annotations
import yaml
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).parent / "data"
LIVE_PATH = DATA_DIR / "live-oregon-data.yml"

_cache: dict[str, Any] | None = None


def load_live() -> dict[str, Any]:
    global _cache
    if _cache is None:
        with open(LIVE_PATH, "r", encoding="utf-8") as f:
            _cache = yaml.safe_load(f) or {}
    return _cache


def stop_summary() -> dict[str, Any]:
    data = load_live()
    osd = data.get("oregon_stop_data", {}) or {}
    statewide = osd.get("statewide_summary", {}) or {}
    by_race = osd.get("demographic_patterns", {}).get("by_race_ethnicity", {}) or {}

    demographics = []
    for key, vals in by_race.items():
        if not isinstance(vals, dict):
            continue
        demographics.append({
            "group": key.replace("_", " ").title(),
            "key": key,
            "stops_pct": vals.get("percentage_of_stops"),
            "population_pct": vals.get("percentage_of_population"),
            "stop_rate_per_1000": vals.get("stop_rate_per_1000"),
            "search_rate": vals.get("search_rate"),
            "contraband_found_rate": vals.get("contraband_found_rate"),
        })

    return {
        "statewide": {
            "total_stops_2024": statewide.get("total_stops_2024"),
            "reporting_agencies": statewide.get("reporting_agencies"),
            "counties_covered": statewide.get("counties_covered"),
            "analysis_period": statewide.get("analysis_period"),
        },
        "demographics": demographics,
        "source": "Oregon STOP Database (ORS 131.362) via live-oregon-data.yml",
    }


def stop_counties() -> dict[str, Any]:
    data = load_live()
    osd = data.get("oregon_stop_data", {}) or {}
    counties_block = osd.get("county_stop_patterns", {}) or {}
    counties = []
    for slug, vals in counties_block.items():
        if not isinstance(vals, dict):
            continue
        counties.append({
            "key": slug,
            "name": slug.replace("_", " ").title(),
            "total_stops_2024": vals.get("total_stops_2024"),
            "primary_agencies": vals.get("primary_agencies"),
            "demographic_summary": vals.get("demographic_summary"),
            "disparity_indicators": vals.get("disparity_indicators"),
        })
    counties.sort(key=lambda c: (c.get("total_stops_2024") or 0), reverse=True)
    return {"counties": counties, "count": len(counties)}


def disparity_indicators() -> dict[str, Any]:
    data = load_live()
    osd = data.get("oregon_stop_data", {}) or {}
    indicators = osd.get("disparity_indicators") or osd.get("disparity_analysis") or {}
    pipeline = (osd.get("cross_dataset_correlations") or {}).get("stop_to_prosecution_pipeline", {})
    return {
        "indicators": indicators,
        "pipeline": pipeline,
    }


# Five Oregon Criminal Justice Commission dashboards (Tableau Public)
OCJC_DASHBOARDS = [
    {
        "id": "jri-prison-use",
        "label": "JRI Prison Use",
        "title": "Justice Reinvestment · Prison Use",
        "description": "Statewide prison admission and use trends under Oregon's Justice Reinvestment Initiative.",
        "viz_name": "JusticeReinvestmentDashboardHome/JRIPrisonUse",
    },
    {
        "id": "jri-sentencing",
        "label": "JRI Sentencing",
        "title": "Sentencing Patterns",
        "description": "How Oregon sentences are distributed by offense, county, and disposition.",
        "viz_name": "JusticeReinvestmentDashboardHome/JRISentencingDash",
    },
    {
        "id": "jri-equity",
        "label": "JRI Equity",
        "title": "Equity & Disparity",
        "description": "Demographic outcomes in Oregon's justice system — the closest official measure of disparity.",
        "viz_name": "JusticeReinvestmentDashboardHome/JRIEquity",
    },
    {
        "id": "jri-programs",
        "label": "JRI Programs",
        "title": "Programs & Diversion",
        "description": "Investment in programs that divert from incarceration — outcomes by county and program type.",
        "viz_name": "JusticeReinvestmentDashboardHome/JRIPrograms",
    },
    {
        "id": "prison-forecast",
        "label": "Prison Forecast",
        "title": "Prison Population Forecast",
        "description": "Statewide forecast of Oregon's prison population and the levers that move it.",
        "viz_name": "PrisonPopulationForecast/LandingPage",
    },
]


def dashboards() -> list[dict[str, str]]:
    base = "https://public.tableau.com/views"
    static = "https://public.tableau.com/static/images"
    out = []
    for d in OCJC_DASHBOARDS:
        viz = d["viz_name"]  # e.g. JusticeReinvestmentDashboardHome/JRIPrisonUse
        workbook, sheet = viz.split("/", 1)
        prefix = workbook[:2]
        viz_url = f"{base}/{viz}"
        embed_url = (
            f"{viz_url}?:embed=y&:showVizHome=no&:tabs=no&:toolbar=no&:display_count=no"
            "&:showShareOptions=false"
        )
        thumbnail_url = f"{static}/{prefix}/{workbook}/{sheet}/1.png"
        public_url = f"https://public.tableau.com/app/profile/ocjc/viz/{workbook}/{sheet}"
        out.append({
            **d,
            "viz_url": viz_url,
            "embed_url": embed_url,
            "thumbnail_url": thumbnail_url,
            "public_url": public_url,
        })
    return out
