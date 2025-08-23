---
layout: page
title: "Judge Profiles - Bias Beacon"
permalink: /bias-beacon/judges/
description: "Individual judicial profiles showing sentencing patterns, case specializations, and bias indicators."
---

# Judge Profiles

<div class="judges-header">
  <p>Comprehensive analysis of individual judges' sentencing patterns, case types, and decision-making consistency. Data spans 5-10 years of judicial records across all 36 counties.</p>
</div>

## Search Judges

<div class="judge-search">
  <div class="search-controls">
    <input type="text" id="judge-search" placeholder="Search by judge name..." class="search-input">
    <select id="county-filter" class="filter-select">
      <option value="">All Counties</option>
      <!-- County options will be populated by JavaScript -->
    </select>
    <select id="case-type-filter" class="filter-select">
      <option value="">All Case Types</option>
      <option value="felony">Felony Cases</option>
      <option value="misdemeanor">Misdemeanor Cases</option>
      <option value="drug">Drug Offenses</option>
      <option value="violent">Violent Crimes</option>
      <option value="property">Property Crimes</option>
      <option value="traffic">Traffic Violations</option>
    </select>
  </div>
</div>

## Judge Directory

<div id="judges-list" class="judges-grid">
  <!-- Judges will be loaded here via JavaScript when data is available -->
  <div class="loading-message">
    <h3>Loading Judge Data...</h3>
    <p>Judge profiles will be displayed here once the Bias Beacon data is loaded.</p>
    <p><em>Note: Upload your judicial data zip file to populate this section.</em></p>
  </div>
</div>

## Key Metrics Tracked

<div class="metrics-explanation">
  <div class="metric-item">
    <h3>📊 Sentencing Severity Index</h3>
    <p>Comparative measure of how harsh a judge's sentences are relative to county and state averages for similar cases.</p>
  </div>

  <div class="metric-item">
    <h3>⚖️ Representation Disparity</h3>
    <p>Difference in outcomes between defendants with public defenders versus private attorneys.</p>
  </div>

  <div class="metric-item">
    <h3>👥 Demographic Impact Score</h3>
    <p>Statistical analysis of sentencing patterns across different demographic groups.</p>
  </div>

  <div class="metric-item">
    <h3>🎯 Consistency Rating</h3>
    <p>Measure of how consistent a judge's sentencing is for similar cases and circumstances.</p>
  </div>

  <div class="metric-item">
    <h3>🏛️ Case Specialization</h3>
    <p>Types of cases a judge most commonly presides over and their expertise areas.</p>
  </div>

  <div class="metric-item">
    <h3>⏱️ Total Prison Time</h3>
    <p>Cumulative prison time attributed to the judge's sentencing decisions over the analysis period.</p>
  </div>
</div>

## Understanding the Profiles

Each judge profile includes:

### Basic Information
- **Name and Title**: Full judicial title and current position
- **County/Jurisdiction**: Primary court location and jurisdiction
- **Years on Bench**: Length of service covered in our analysis
- **Case Volume**: Total cases presided over during analysis period

### Sentencing Analysis
- **Average Sentence Length**: By crime type and severity
- **Incarceration Rate**: Percentage of cases resulting in prison time
- **Probation vs. Prison**: Alternative sentencing preferences
- **Fine Amounts**: Monetary penalty patterns

### Demographic Patterns
- **Racial Disparities**: Sentencing differences across racial lines
- **Gender Differences**: Male vs. female defendant outcomes
- **Age-based Patterns**: How defendant age affects sentencing
- **Socioeconomic Indicators**: Impact of defendant economic status

### Legal Representation Impact
- **Public Defender Outcomes**: Conviction and sentencing rates
- **Private Attorney Outcomes**: Comparative success rates
- **Self-Representation**: Pro se defendant outcomes
- **Appointed Counsel**: Court-appointed attorney effectiveness

### Case Type Specialization
- **Primary Case Types**: Most common case categories
- **Expertise Areas**: Specialized court assignments
- **Sentence Variation**: Consistency within case types
- **Appeal Rates**: Frequency of sentence appeals

### Comparative Analysis
- **County Rankings**: How the judge compares locally
- **Statewide Percentiles**: Position among all state judges
- **Peer Comparisons**: Similar judges in similar jurisdictions
- **Trend Analysis**: Changes in patterns over time

---

*Judge profiles are generated from official court records and are updated quarterly. All statistics are presented with appropriate context and statistical significance indicators.*