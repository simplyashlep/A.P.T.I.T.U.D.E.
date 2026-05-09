#!/usr/bin/env python3
"""
Generate individual judge profile pages from judges-directory.json
This script creates markdown files for all judges that can be rendered by Jekyll.
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime

def slugify(name):
    """Convert judge name to URL-safe slug"""
    slug = name.lower().replace(' ', '-').replace('.', '')
    slug = re.sub(r'[^a-z0-9\-]', '', slug)
    return slug

def get_initials(name):
    """Extract initials from judge name"""
    parts = name.split()
    return ''.join([p[0].upper() for p in parts if p])

def load_judges():
    """Load judges from JSON file"""
    json_path = '_data/bias-beacon/judges-directory.json'
    with open(json_path, 'r') as f:
        data = json.load(f)
    return data.get('judges', [])

def create_judge_page(judge, output_dir='_judges'):
    """Create a Jekyll markdown page for a judge"""
    
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Generate filename
    judge_id = judge.get('id', '').replace('official-', '')
    slug = slugify(judge.get('name', 'unknown'))
    filename = f"{judge_id:03d}-{slug}.md"
    filepath = os.path.join(output_dir, filename)
    
    # Extract data with safe defaults
    name = judge.get('name', 'Unknown')
    county = judge.get('county', '')
    district = judge.get('district', '')
    position = judge.get('position', '')
    email = judge.get('email', '')
    phone = judge.get('phone', '')
    bio_url = judge.get('bioUrl', '')
    photo_url = judge.get('officialPhotoUrl', '')
    is_presiding = judge.get('isPresiding', False)
    is_pro_tem = judge.get('isProTem', False)
    role_title = judge.get('roleTitle', 'Judge')
    term_expires = judge.get('termExpires', '')
    term_display = judge.get('termExpiresDisplay', '')
    summary = judge.get('summary', '')
    focus = judge.get('focus', 'General judicial profile')
    caseload = judge.get('caseload2024')
    tenure = judge.get('tenureDisplay', '')
    category = judge.get('category', 'Circuit Court')
    
    # Metrics (may be null)
    score = judge.get('score')
    score_label = judge.get('scoreLabel', 'Pending')
    risk_level = judge.get('riskLevel', 'pending')
    metrics_verified = judge.get('metricsVerified', False)
    prison_usage = judge.get('prisonUsage')
    reversal_rate = judge.get('reversalRate')
    counsel_disparity = judge.get('counselDisparity')
    racial_disparity = judge.get('racialDisparity')
    appeals_2024 = judge.get('appeals2024')
    
    # Generate permalink
    permalink = f"/bias-beacon/judges/{slug}/"
    
    # Generate YAML frontmatter
    frontmatter = f"""---
layout: judge-profile
title: "{name} - {county} {category}"
judge_id: "{judge.get('id', '')}"
name: "{name}"
initials: "{get_initials(name)}"
role_title: "{role_title}"
court: "{category}"
county: "{county}"
district: {district}
position: {position}
email: "{email}"
phone: "{phone}"
bio_url: "{bio_url}"
official_photo_url: "{photo_url}"
is_presiding: {str(is_presiding).lower()}
is_pro_tem: {str(is_pro_tem).lower()}
score: {score}
score_label: "{score_label}"
risk_level: "{risk_level}"
metrics_verified: {str(metrics_verified).lower()}
summary: "{summary.replace('"', '\\"')}"
focus: "{focus}"
caseload_2024: {caseload}
tenure_display: "{tenure}"
term_expires: "{term_expires}"
term_expires_display: "{term_display}"
prison_usage: {prison_usage}
reversal_rate: {reversal_rate}
counsel_disparity: {counsel_disparity}
racial_disparity: {racial_disparity}
appeals_2024: {appeals_2024}
permalink: "{permalink}"
---
"""
    
    # Generate content section
    if metrics_verified:
        content = f"""## Judicial Profile

{summary}

## Focus Areas

{focus}

## 2024 Caseload

In 2024, Judge {name} handled {caseload} cases across a range of civil, criminal, and equity matters.

## Appeals and Reversals

With a reversal rate of {reversal_rate}%, Judge {name}'s decisions are modified or reversed on appeal at a rate that should be examined in comparison to peer judges and state averages.

## Comparative Note

Judge {name} serves in {county} County within Judicial District {district}. Their decision patterns and sentencing data show disparities worthy of attention, particularly in areas of counsel representation and racial outcome equity.
"""
    else:
        content = f"""## Judicial Profile

{summary}

## Position Details

- **Court:** {category}
- **County:** {county} County
- **Judicial District:** {district}
- **Position Number:** {position}
- **Term Expires:** {term_display}

## Data Collection Status

Detailed bias metrics and decision pattern data are currently being compiled for Judge {name}. As data verification is completed, additional analytics regarding sentencing patterns, appeal reversals, and outcome disparities will be made available.

## About Circuit Courts in Oregon

Circuit courts are Oregon's trial courts of general jurisdiction. They handle all civil, criminal, and domestic relations cases, as well as most equity matters. Judge {name} plays a crucial role in the administration of justice in {county} County.
"""
    
    # Write the file
    page_content = frontmatter + content
    
    with open(filepath, 'w') as f:
        f.write(page_content)
    
    return filepath

def main():
    """Generate all judge pages"""
    print("Loading judges from JSON...")
    judges = load_judges()
    print(f"Found {len(judges)} judges")
    
    print("Generating judge profile pages...")
    
    created_count = 0
    for judge in judges:
        try:
            filepath = create_judge_page(judge)
            created_count += 1
            if created_count % 50 == 0:
                print(f"  Created {created_count} pages...")
        except Exception as e:
            name = judge.get('name', 'Unknown')
            print(f"  ERROR creating page for {name}: {e}")
    
    print(f"\nSuccessfully created {created_count} judge profile pages!")
    print(f"Pages are located in the _judges/ directory")
    print(f"\nTo use these pages:")
    print(f"1. Add 'collections:' to _config.yml:")
    print(f"   judges:")
    print(f"     output: true")
    print(f"     permalink: /bias-beacon/judges/:slug/")
    print(f"2. Update the 'Full Profile' button in judges.md to link to {{ site.judges }}")

if __name__ == '__main__':
    main()
