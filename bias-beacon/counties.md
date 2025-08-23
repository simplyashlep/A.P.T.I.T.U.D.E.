---
layout: page
title: "County Comparisons - Bias Beacon"
permalink: /bias-beacon/counties/
description: "County-by-county analysis of judicial sentencing patterns and criminal justice outcomes across all 36 counties."
---

# County Comparisons

<div class="counties-header">
  <p>Comparative analysis of criminal justice outcomes across all 36 counties, revealing regional variations in sentencing patterns, resource allocation, and judicial consistency.</p>
</div>

## Interactive County Map

<div id="county-map" class="county-map-container">
  <div class="map-placeholder">
    <h3>Interactive County Map</h3>
    <p>A visual map showing sentencing severity, demographic disparities, and key justice metrics by county will be displayed here once data is loaded.</p>
    <div class="map-legend">
      <h4>Legend (Sample)</h4>
      <div class="legend-item"><span class="color-box severe"></span> High Sentencing Severity</div>
      <div class="legend-item"><span class="color-box moderate"></span> Moderate Sentencing</div>
      <div class="legend-item"><span class="color-box lenient"></span> Lower Sentencing Severity</div>
    </div>
  </div>
</div>

## County Rankings

<div class="county-controls">
  <h3>Rank Counties By:</h3>
  <div class="ranking-buttons">
    <button class="ranking-btn active" data-metric="severity">Sentencing Severity</button>
    <button class="ranking-btn" data-metric="disparity">Demographic Disparity</button>
    <button class="ranking-btn" data-metric="representation">Representation Gap</button>
    <button class="ranking-btn" data-metric="consistency">Judicial Consistency</button>
    <button class="ranking-btn" data-metric="volume">Case Volume</button>
  </div>
</div>

<div id="county-rankings" class="county-rankings">
  <!-- Rankings will be populated via JavaScript -->
  <div class="loading-message">
    <h3>Loading County Data...</h3>
    <p>County rankings and comparisons will appear here once the judicial data is processed.</p>
  </div>
</div>

## Key County Metrics

<div class="county-metrics-grid">
  <div class="metric-card">
    <h3>📊 Sentencing Severity Index</h3>
    <p>Average sentence length and incarceration rates compared to state benchmarks. Helps identify counties with particularly harsh or lenient sentencing patterns.</p>
    <div class="metric-details">
      <strong>Includes:</strong>
      <ul>
        <li>Average prison sentence length</li>
        <li>Incarceration vs. probation rates</li>
        <li>Fine amounts and community service</li>
        <li>Suspended sentence frequency</li>
      </ul>
    </div>
  </div>

  <div class="metric-card">
    <h3>⚖️ Demographic Disparity Score</h3>
    <p>Statistical measure of sentencing differences across racial, gender, and socioeconomic lines within each county.</p>
    <div class="metric-details">
      <strong>Analyzes:</strong>
      <ul>
        <li>Racial sentencing disparities</li>
        <li>Gender-based differences</li>
        <li>Age-related patterns</li>
        <li>Economic status impact</li>
      </ul>
    </div>
  </div>

  <div class="metric-card">
    <h3>🏛️ Judicial Resources</h3>
    <p>Assessment of court resources, case loads, and their impact on justice outcomes in each county.</p>
    <div class="metric-details">
      <strong>Measures:</strong>
      <ul>
        <li>Judge-to-population ratio</li>
        <li>Average case processing time</li>
        <li>Public defender caseloads</li>
        <li>Court facility adequacy</li>
      </ul>
    </div>
  </div>

  <div class="metric-card">
    <h3>📈 Consistency Rating</h3>
    <p>How consistent sentencing is within each county for similar cases and circumstances.</p>
    <div class="metric-details">
      <strong>Evaluates:</strong>
      <ul>
        <li>Inter-judge consistency</li>
        <li>Sentence predictability</li>
        <li>Appeal rates</li>
        <li>Reversal frequencies</li>
      </ul>
    </div>
  </div>

  <div class="metric-card">
    <h3>👥 Representation Impact</h3>
    <p>Difference in outcomes between public defender and private attorney representation by county.</p>
    <div class="metric-details">
      <strong>Compares:</strong>
      <ul>
        <li>Conviction rates by representation</li>
        <li>Sentence length differences</li>
        <li>Plea bargain success rates</li>
        <li>Trial outcome variations</li>
      </ul>
    </div>
  </div>

  <div class="metric-card">
    <h3>🔍 Case Type Distribution</h3>
    <p>Breakdown of case types and specializations across different counties and their impact on outcomes.</p>
    <div class="metric-details">
      <strong>Tracks:</strong>
      <ul>
        <li>Drug offense patterns</li>
        <li>Violent crime handling</li>
        <li>Property crime sentences</li>
        <li>Traffic violation outcomes</li>
      </ul>
    </div>
  </div>
</div>

## Detailed County Profiles

<div class="county-directory">
  <h3>Select a County for Detailed Analysis:</h3>
  <div id="county-list" class="county-list">
    <!-- County list will be populated from data -->
    <div class="loading-message">
      <p>County profiles will be available once judicial data is processed. Each county profile will include:</p>
      <ul>
        <li>Detailed sentencing statistics</li>
        <li>Judge-by-judge breakdowns</li>
        <li>Demographic impact analysis</li>
        <li>Historical trend data</li>
        <li>Resource allocation metrics</li>
        <li>Comparison with similar counties</li>
      </ul>
    </div>
  </div>
</div>

## Understanding Regional Variations

### Geographic Factors
- **Urban vs. Rural**: How population density affects judicial outcomes
- **Economic Conditions**: Impact of local economic health on sentencing
- **Resource Availability**: Court funding and staffing levels
- **Cultural Factors**: Regional attitudes toward crime and punishment

### Administrative Differences
- **Court Structure**: How court organization affects efficiency
- **Judicial Selection**: Election vs. appointment impacts
- **Training Programs**: Continuing education availability
- **Technology Adoption**: Modern case management systems

### Policy Variations
- **Local Ordinances**: County-specific legal frameworks
- **Prosecutor Policies**: District attorney approaches
- **Public Defender Systems**: Representation quality variations
- **Alternative Programs**: Diversionary and rehabilitation options

## Data Methodology

Our county comparisons are based on:

- **Standardized Metrics**: Consistent measurement across all counties
- **Population Adjustments**: Per-capita calculations where appropriate
- **Case Complexity**: Adjustments for case difficulty and severity
- **Temporal Consistency**: Multi-year averaging to account for fluctuations
- **Statistical Significance**: Only reporting meaningful differences

---

*County data is updated quarterly and includes confidence intervals for all statistical measures. Comparisons account for differences in case mix, demographics, and local legal frameworks.*