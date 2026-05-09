import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)

with open(os.path.join(project_dir, 'assets/data/official-judges.json'), 'r', encoding='utf-8') as f:
    data = json.load(f)

judges_raw = data['judges']
print(f'Total entries: {len(judges_raw)}')

# Deduplicate by name (some judges appear twice for multi-county districts)
seen = {}
for j in judges_raw:
    name = j['name']
    if name not in seen:
        seen[name] = j

judges = list(seen.values())
print(f'Unique judges: {len(judges)}')

with_photos = [j for j in judges if j.get('officialPhotoUrl')]
print(f'With photos: {len(with_photos)}')

# Build the new judges.json
output = {
    "metadata": {
        "project_name": "Oregon Judicial Bias Tracker",
        "source": "Oregon Blue Book / Oregon Judicial Department",
        "coverage_area": "All Oregon Circuit Court Districts",
        "total_judges": len(judges),
        "judges_with_photos": len(with_photos),
        "last_updated": "2026-04-12"
    },
    "judges": []
}

for j in judges:
    judge_entry = {
        "id": f"judge_{j['id']:03d}",
        "name": j['name'],
        "county": j.get('county', 'Unknown'),
        "court": j.get('category', 'Circuit Court'),
        "roleTitle": j.get('roleTitle', 'Circuit Court Judge'),
        "district": int(j['district']) if j.get('district') else None,
        "termExpires": j.get('termExpires', ''),
        "email": j.get('email', ''),
        "phone": j.get('phone', ''),
        "bioUrl": j.get('bioUrl', ''),
        "photoUrl": j.get('officialPhotoUrl', None),
        "current_status": "active"
    }
    output["judges"].append(judge_entry)

# Sort by county then name
output["judges"].sort(key=lambda x: (x["county"], x["name"]))

out_path = os.path.join(project_dir, 'assets/data/judges.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f'Wrote {len(output["judges"])} judges to {out_path}')

# Also write a Jekyll-friendly _data file
data_dir = os.path.join(project_dir, '_data')
os.makedirs(data_dir, exist_ok=True)
data_path = os.path.join(data_dir, 'judges.json')
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
print(f'Also wrote to {data_path}')
