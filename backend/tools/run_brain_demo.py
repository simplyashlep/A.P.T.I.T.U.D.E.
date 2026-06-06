#!/usr/bin/env python3
"""
Quick demo of the Aptitude Brain pipeline on aptitude-emergent branch.
Run from repo root: python -m backend.tools.run_brain_demo
"""
import asyncio
import sys
from pathlib import Path

# allow import when run as script
sys.path.insert(0, str(Path(__file__).parent.parent))

from orchestration.pipeline import AptitudeOrchestrator


SAMPLE_NARRATIVE = """
I was pulled over and arrested because of a warrant for 'John Smith' with a similar birthdate.
The officers did not compare my ID photo or fingerprints to the warrant subject.
I spent 14 hours in jail before they realized the mistake and released me.
This happened in Multnomah County, Oregon.
""".strip()


async def main():
    orch = AptitudeOrchestrator(db=None)
    print("=== Aptitude Brain Demo ===")
    print("Input narrative (truncated):", SAMPLE_NARRATIVE[:120], "...\n")
    result = await orch.submit_incident(SAMPLE_NARRATIVE, {"state": "Oregon", "county": "Multnomah"})
    print("Incident ID:", result["incident_id"])
    print("Event Type:", result["structured_event"]["event_type"])
    print("Claims:", result["classification"]["claims"])
    print("Doctrines:", result["classification"]["doctrines"])
    print("Graph nodes seeded:", len(result["graph"]["nodes"]))
    print("Procedural pathways:", len(result["procedural"]["pathways"]))
    print("\nAudit trail length:", len(result["audit_trail"]))
    print("\nSUCCESS: Full brain pipeline executed with provenance.")


if __name__ == "__main__":
    asyncio.run(main())
