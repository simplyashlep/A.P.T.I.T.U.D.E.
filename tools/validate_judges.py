#!/usr/bin/env python3
"""Validate judge data in _data/bias-beacon/live-oregon-data.yml

Outputs a per-county judge count, total counts and searches for specific names.
"""
import sys
import yaml
from pathlib import Path


def load_data(path):
    with open(path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def main():
    repo_root = Path(__file__).resolve().parents[1]
    data_file = repo_root / '_data' / 'bias-beacon' / 'live-oregon-data.yml'
    if not data_file.exists():
        print(f"Data file not found: {data_file}")
        sys.exit(2)

    data = load_data(data_file)
    judges = data.get('oregon_judges', {})

    total = 0
    county_counts = {}
    for county_key, county_list in judges.items():
        # county_list is expected to be a list
        count = len(county_list) if isinstance(county_list, list) else 0
        county_counts[county_key] = count
        total += count

    print('Judge counts by county:')
    for county, count in sorted(county_counts.items()):
        print(f" - {county}: {count}")

    print(f"\nTotal judges found in data: {total}")

    # Search for important names
    names_to_check = ['Coburn', 'Thompson', 'Menchaca']
    found = {n: [] for n in names_to_check}
    for county_key, county_list in judges.items():
        for j in county_list:
            name = j.get('name', '')
            for n in names_to_check:
                if n.lower() in name.lower():
                    found[n].append((county_key, name))

    print('\nSearch results for specific names:')
    for n in names_to_check:
        hits = found.get(n, [])
        if hits:
            print(f" - {n}: found {len(hits)} entry(ies):")
            for county_key, name in hits:
                print(f"     {name} (county key: {county_key})")
        else:
            print(f" - {n}: NOT FOUND")


if __name__ == '__main__':
    main()
