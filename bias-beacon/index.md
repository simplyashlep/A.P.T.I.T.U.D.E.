---
layout: page
title: "Bias Beacon - Judicial Bias Tracker"
permalink: /bias-beacon/
description: "Comprehensive analysis of judicial sentencing patterns across all 36 counties, tracking bias indicators in criminal justice decisions."
---

# Bias Beacon: Judicial Bias Tracker

<div class="bias-beacon-hero">
  <div class="hero-content">
    <h2>Illuminating Patterns in Judicial Decision-Making</h2>
    <p>The Bias Beacon analyzes judicial sentencing patterns across all 36 counties, providing unprecedented transparency into criminal justice decisions. Our comprehensive database tracks sentencing disparities, demographic impacts, and judicial consistency over 5-10 years of real court data.</p>
  </div>
</div>

## What We Track

<div class="tracking-metrics">
  <div class="metric-card">
    <h3>📊 Sentencing Patterns</h3>
    <ul>
      <li>Prison time imposed per judge</li>
      <li>Sentence length variations by demographics</li>
      <li>Conviction rates and plea agreements</li>
      <li>Probation vs. incarceration rates</li>
    </ul>
  </div>

  <div class="metric-card">
    <h3>⚖️ Legal Representation Impact</h3>
    <ul>
      <li>Public defender vs. private attorney outcomes</li>
      <li>Conviction rates by representation type</li>
      <li>Sentence length disparities</li>
      <li>Plea bargain acceptance rates</li>
    </ul>
  </div>

  <div class="metric-card">
    <h3>👥 Demographic Analysis</h3>
    <ul>
      <li>Sentencing by race and ethnicity</li>
      <li>Gender-based sentencing patterns</li>
      <li>Age-related judicial decisions</li>
      <li>Socioeconomic impact indicators</li>
    </ul>
  </div>

  <div class="metric-card">
    <h3>🏛️ Judicial Profiles</h3>
    <ul>
      <li>Case type specializations</li>
      <li>Total prison time attributed</li>
      <li>Comparative sentencing severity</li>
      <li>Consistency metrics</li>
    </ul>
  </div>
</div>

## Key Features

### 🔍 [Judge Profiles](/bias-beacon/judges/)
Detailed analysis of individual judges including:
- Sentencing history and patterns
- Case type distribution
- Demographic impact analysis
- Comparison with county and state averages

### 🗺️ [County Comparisons](/bias-beacon/counties/)
County-by-county breakdown showing:
- Regional sentencing variations
- Demographic disparities by location
- Resource allocation impacts
- Justice system efficiency metrics

### 📈 [Data Visualizations](/bias-beacon/visualizations/)
Interactive charts and graphs displaying:
- Sentencing trend analysis
- Bias indicator dashboards
- Comparative judicial metrics
- Historical pattern recognition

### 🔎 [Search & Analysis](/bias-beacon/search/)
Advanced search tools for:
- Finding specific cases or patterns
- Filtering by multiple criteria
- Generating custom reports
- Exporting data for research

## Methodology

Our analysis is based on:

- **Comprehensive Data**: 5-10 years of judicial records across all 36 counties
- **Multiple Variables**: Consideration of case type, demographics, representation, and outcomes
- **Statistical Analysis**: Rigorous statistical methods to identify significant patterns
- **Peer Review**: Methodology reviewed by legal and statistical experts

## Data Sources

All data is sourced from:
- Official court records
- Public sentencing databases
- State judicial reporting systems
- County clerk records

**Data Coverage**: {{ site.data.bias-beacon.coverage_years | default: "2014-2024" }}  
**Total Cases Analyzed**: {{ site.data.bias-beacon.total_cases | default: "Loading..." }}  
**Judges Tracked**: {{ site.data.bias-beacon.total_judges | default: "Loading..." }}  
**Counties Covered**: {{ site.data.bias-beacon.total_counties | default: "36" }}

## Getting Started

<div class="cta-section">
  <div class="cta-item">
    <h3>🔍 Explore by Judge</h3>
    <p>Search for specific judges and analyze their sentencing patterns.</p>
    <a href="/bias-beacon/judges/" class="btn btn-primary">Browse Judges</a>
  </div>

  <div class="cta-item">
    <h3>🗺️ Compare Counties</h3>
    <p>See how justice varies across different counties.</p>
    <a href="/bias-beacon/counties/" class="btn btn-primary">View Counties</a>
  </div>

  <div class="cta-item">
    <h3>📊 View Dashboard</h3>
    <p>Interactive overview of key metrics and trends.</p>
    <a href="/bias-beacon/dashboard/" class="btn btn-primary">Open Dashboard</a>
  </div>
</div>

## Important Notice

The Bias Beacon is designed to promote transparency and accountability in the judicial system. All data presented is:

- ✅ **Factual**: Based on official court records
- ✅ **Contextual**: Presented with appropriate statistical context
- ✅ **Transparent**: Methodology and sources clearly documented
- ✅ **Respectful**: Focused on systemic patterns, not individual criticism

Our goal is to support evidence-based discussions about judicial fairness and criminal justice reform.

---

*For questions about methodology, data sources, or to report errors, please [contact us](mailto:{{ site.email }}).*