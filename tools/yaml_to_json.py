#!/usr/bin/env python3
"""
Convert YAML data in `_data/bias-beacon/oregon-judicial-data.yml` to
`assets/data/judges.json` for client-side consumption.
"""
import json
import sys
from pathlib import Path

try:
    import yaml
except Exception:
    print('PyYAML is required. Install with: pip3 install pyyaml')
    sys.exit(1)

root = Path(__file__).resolve().parents[1]
src = root / '_data' / 'bias-beacon' / 'oregon-judicial-data.yml'
dst_dir = root / 'assets' / 'data'
dst = dst_dir / 'judges.json'

if not src.exists():
    print('Source YAML not found:', src)
    sys.exit(1)

dst_dir.mkdir(parents=True, exist_ok=True)

with src.open('r', encoding='utf-8') as f:
    data = yaml.safe_load(f)

# Normalize output — include sample_judges and counties as top-level lists
output = {
    'metadata': data.get('metadata', {}),
    'counties': data.get('counties', []),
    'judges': data.get('sample_judges', [])
}

with dst.open('w', encoding='utf-8') as f:
    json.dump(output, f, indent=2)

print('Wrote', dst)
