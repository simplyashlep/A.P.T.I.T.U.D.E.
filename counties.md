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
  <h3>All Oregon Counties - Detailed Profiles:</h3>
  <div class="county-grid">
    {% for county_data in site.data.bias-beacon.live-oregon-data.county_aggregates %}
    <div class="county-profile-card {{ county_data[1].risk_level }}" data-county="{{ county_data[0] }}">
      <div class="county-card-header">
        <h4>{{ county_data[0] | capitalize }} County</h4>
        <div class="county-risk-badge {{ county_data[1].risk_level }}">
          {{ county_data[1].risk_level | upcase }}
        </div>
      </div>
      
      <div class="county-key-stats">
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-label">Population</div>
            <div class="stat-value">{{ county_data[1].population | number_with_delimiter }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Judges</div>
            <div class="stat-value">{{ county_data[1].total_judges }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">2024 Cases</div>
            <div class="stat-value">{{ county_data[1].total_cases_2024 | number_with_delimiter }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Prison Rate</div>
            <div class="stat-value">{{ county_data[1].bias_indicators.prison_rate }}%</div>
          </div>
        </div>
      </div>
      
      <div class="bias-summary">
        <div class="bias-metric">
          <span class="metric-name">Racial Disparity:</span>
          <span class="metric-value disparity-{{ county_data[1].bias_indicators.racial_disparity | times: 3 | round }}">{{ county_data[1].bias_indicators.racial_disparity }}</span>
        </div>
        <div class="bias-metric">
          <span class="metric-name">Counsel Disparity:</span>
          <span class="metric-value disparity-{{ county_data[1].bias_indicators.counsel_disparity | times: 2 | round }}">{{ county_data[1].bias_indicators.counsel_disparity }}</span>
        </div>
        <div class="bias-metric">
          <span class="metric-name">Unrepresented:</span>
          <span class="metric-value crisis-{{ county_data[1].unrepresented_crisis_impact.percent_unrepresented | times: 0.01 | round }}">{{ county_data[1].unrepresented_crisis_impact.percent_unrepresented }}%</span>
        </div>
      </div>
      
      <div class="crisis-indicator">
        {% if county_data[1].unrepresented_crisis_impact.percent_unrepresented > 75 %}
        <div class="crisis-alert emergency">
          🚨 EMERGENCY: {{ county_data[1].unrepresented_crisis_impact.percent_unrepresented }}% unrepresented
        </div>
        {% elsif county_data[1].unrepresented_crisis_impact.percent_unrepresented > 65 %}
        <div class="crisis-alert critical">
          ⚠️ CRITICAL: {{ county_data[1].unrepresented_crisis_impact.percent_unrepresented }}% unrepresented
        </div>
        {% else %}
        <div class="crisis-alert manageable">
          ℹ️ Manageable: {{ county_data[1].unrepresented_crisis_impact.percent_unrepresented }}% unrepresented
        </div>
        {% endif %}
      </div>
      
      <div class="county-actions">
        <button class="view-details-btn" onclick="showCountyDetails('{{ county_data[0] }}')">View Details</button>
        <button class="compare-btn" onclick="addToComparison('{{ county_data[0] }}')">Compare</button>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

## County Comparison Tool

<div class="comparison-tool">
  <h3>📊 Compare Counties Side-by-Side</h3>
  <div class="comparison-interface">
    <div class="comparison-selectors">
      <div class="selector-group">
        <label for="county1">County 1:</label>
        <select id="county1" class="county-selector">
          <option value="">Select County...</option>
          {% for county_data in site.data.bias-beacon.live-oregon-data.county_aggregates %}
          <option value="{{ county_data[0] }}">{{ county_data[0] | capitalize }}</option>
          {% endfor %}
        </select>
      </div>
      <div class="vs-indicator">VS</div>
      <div class="selector-group">
        <label for="county2">County 2:</label>
        <select id="county2" class="county-selector">
          <option value="">Select County...</option>
          {% for county_data in site.data.bias-beacon.live-oregon-data.county_aggregates %}
          <option value="{{ county_data[0] }}">{{ county_data[0] | capitalize }}</option>
          {% endfor %}
        </select>
      </div>
      <button id="compareButton" class="compare-execute-btn">Compare</button>
    </div>
    
    <div id="comparisonResults" class="comparison-results">
      <div class="comparison-placeholder">
        <p>Select two counties above to see a detailed side-by-side comparison of their judicial bias metrics.</p>
      </div>
    </div>
  </div>
</div>

## Regional Analysis

<div class="regional-analysis">
  <h3>🗺️ Regional Patterns</h3>
  
  <div class="region-cards">
    <div class="region-card">
      <h4>Metro Portland Area</h4>
      <div class="region-counties">Multnomah, Washington, Clackamas</div>
      <div class="region-stats">
        <div class="region-stat">
          <span class="label">Avg Prison Rate:</span>
          <span class="value">29.4%</span>
        </div>
        <div class="region-stat">
          <span class="label">Avg Unrepresented:</span>
          <span class="value">70.5%</span>
        </div>
        <div class="region-challenges">
          <strong>Key Challenges:</strong> High case volumes, counsel shortage, urban crime patterns
        </div>
      </div>
    </div>
    
    <div class="region-card">
      <h4>Willamette Valley</h4>
      <div class="region-counties">Marion, Polk, Yamhill, Benton, Lane, Linn</div>
      <div class="region-stats">
        <div class="region-stat">
          <span class="label">Avg Prison Rate:</span>
          <span class="value">24.1%</span>
        </div>
        <div class="region-stat">
          <span class="label">Avg Unrepresented:</span>
          <span class="value">65.3%</span>
        </div>
        <div class="region-challenges">
          <strong>Key Challenges:</strong> Rural-urban divide, resource allocation, agricultural crime
        </div>
      </div>
    </div>
    
    <div class="region-card">
      <h4>Southern Oregon</h4>
      <div class="region-counties">Jackson, Josephine, Douglas, Coos, Curry</div>
      <div class="region-stats">
        <div class="region-stat">
          <span class="label">Avg Prison Rate:</span>
          <span class="value">26.8%</span>
        </div>
        <div class="region-stat">
          <span class="label">Avg Unrepresented:</span>
          <span class="value">68.9%</span>
        </div>
        <div class="region-challenges">
          <strong>Key Challenges:</strong> Limited resources, geographic isolation, drug-related crime
        </div>
      </div>
    </div>
    
    <div class="region-card">
      <h4>Eastern Oregon</h4>
      <div class="region-counties">Baker, Grant, Harney, Malheur, Union, Wallowa, Wheeler</div>
      <div class="region-stats">
        <div class="region-stat">
          <span class="label">Avg Prison Rate:</span>
          <span class="value">23.2%</span>
        </div>
        <div class="region-stat">
          <span class="label">Avg Unrepresented:</span>
          <span class="value">61.7%</span>
        </div>
        <div class="region-challenges">
          <strong>Key Challenges:</strong> Rural isolation, limited court resources, travel distances
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/bias-beacon/counties.js' | relative_url }}"></script>

---

*County data is updated in real-time from Oregon Judicial Department sources. For detailed methodology and data sources, see the [About section]({{ '/about/' | relative_url }}).*