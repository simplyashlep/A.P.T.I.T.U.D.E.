#!/usr/bin/env python3
import csv
import json
from pathlib import Path

try:
    import yaml
except Exception:
    print("PyYAML is required. Install with: pip install pyyaml")
    raise

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / '_data' / 'bias-beacon' / 'live-oregon-data.yml'
OUT_CSV = ROOT / 'tools' / 'judges.csv'

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    doc = yaml.safe_load(f)

judges = []
for county_key, county_list in (doc.get('oregon_judges') or {}).items():
    if not isinstance(county_list, list):
        continue
    for j in county_list:
        row = {
            'id': j.get('id') or '',
            'name': j.get('name') or '',
            'county_key': county_key,
            'county': j.get('county') or '',
            'court': j.get('court') or '',
            'department': j.get('department') or '',
            'tenure_start': j.get('tenure_start') or '',
            'tenure_end': j.get('tenure_end') or '',
            'current_status': j.get('current_status') or '',
            'caseload_2024': j.get('caseload_2024') or '',
            'time_period_coverage': j.get('time_period_coverage') or '',
            'prison_rate': None,
            'raw': json.dumps(j, ensure_ascii=False)
        }
        # nested bias_metrics.prison_rate
        bm = j.get('bias_metrics') or {}
        if isinstance(bm, dict):
            row['prison_rate'] = bm.get('prison_rate')
        judges.append(row)

OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
fieldnames = ['id','name','county_key','county','court','department','tenure_start','tenure_end','current_status','caseload_2024','time_period_coverage','prison_rate','raw']
with open(OUT_CSV, 'w', encoding='utf-8', newline='') as csvf:
    writer = csv.DictWriter(csvf, fieldnames=fieldnames)
    writer.writeheader()
    for r in judges:
        writer.writerow(r)

print(f'Wrote {len(judges)} judges to {OUT_CSV}')
