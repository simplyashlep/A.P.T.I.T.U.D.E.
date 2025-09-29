---
layout: page
title: "Dashboard - Bias Beacon"
permalink: /bias-beacon/dashboard/
description: "Comprehensive dashboard showing real-time bias patterns across Oregon's judicial system with individual judge analysis."
---

# Bias Beacon Dashboard

<div class="dashboard-header">
  <p>Real-time overview of judicial sentencing patterns, bias indicators, and criminal justice metrics across all 36 Oregon counties. Includes individual judge selection and comprehensive analysis tools.</p>
  <div class="data-status">
    <div class="status-indicator live">🟢 LIVE DATA</div>
    <div class="last-updated">Last Updated: {{ site.data.bias-beacon.live-oregon-data.last_updated | date: "%B %d, %Y at %I:%M %p" }}</div>
    <div class="next-update">Next Update: {{ site.data.bias-beacon.live-oregon-data.next_scheduled_update | date: "%B %d at %I:%M %p" }}</div>
  </div>
</div>

## Individual Judge Analysis

<div class="dashboard-judge-selection">
  <div class="judge-selection-header">
    <h3>📊 Select Judge for Detailed Analysis</h3>
    <p>Choose any judge from the dropdown to view comprehensive bias metrics, representation type analysis, and appeals tracking.</p>
  </div>
  
  <div class="judge-selection-controls">
    <div class="selection-row">
      <div class="judge-selector">
        <label for="dashboard-judge-select">Select Judge:</label>
        <select id="dashboard-judge-select" class="dashboard-judge-dropdown">
          <option value="">-- Choose a Judge --</option>
          <!-- Populated by JavaScript -->
        </select>
      </div>
      
      <div class="quick-filters">
        <label for="dashboard-county-filter">Filter by County:</label>
        <select id="dashboard-county-filter" class="dashboard-filter">
          <option value="">All Counties</option>
          <option value="multnomah">Multnomah County</option>
          <option value="washington">Washington County</option>
          <option value="lane">Lane County</option>
          <option value="jackson">Jackson County</option>
          <option value="marion">Marion County</option>
          <option value="clackamas">Clackamas County</option>
        </select>
        
        <label for="dashboard-risk-filter">Risk Level:</label>
        <select id="dashboard-risk-filter" class="dashboard-filter">
          <option value="">All Risk Levels</option>
          <option value="excellent">Excellent</option>
          <option value="low">Low Concern</option>
          <option value="moderate">Moderate</option>
          <option value="high">High Concern</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>
  </div>
  
  <div id="selected-judge-dashboard" class="judge-dashboard-container" style="display: none;">
    <!-- Selected judge analysis will be populated here -->
  </div>
</div>

## Case Type Analysis

<div class="case-type-analysis">
  <div class="case-type-header">
    <h3>⚖️ Bias Patterns by Case Type</h3>
    <p>Interactive analysis showing how bias metrics vary across different types of criminal cases.</p>
  </div>
  
  <div class="case-type-selector">
    <label for="case-type-filter">Select Case Type:</label>
    <select id="case-type-filter" class="case-type-dropdown">
      <option value="all">All Case Types</option>
      <option value="felony">Felony Cases</option>
      <option value="misdemeanor">Misdemeanor Cases</option>
      <option value="drug">Drug Offenses</option>
      <option value="violent">Violent Crimes</option>
      <option value="property">Property Crimes</option>
      <option value="traffic">Traffic Violations</option>
      <option value="dui">DUI/DUII Cases</option>
      <option value="domestic">Domestic Violence</option>
    </select>
  </div>
  
  <div id="case-type-results" class="case-type-results">
    <div class="case-type-grid">
      <div class="case-type-metric">
        <div class="metric-header">Prison Rate Variation</div>
        <div id="prison-rate-variation" class="metric-visualization"></div>
      </div>
      
      <div class="case-type-metric">
        <div class="metric-header">Sentence Length Disparities</div>
        <div id="sentence-disparities" class="metric-visualization"></div>
      </div>
      
      <div class="case-type-metric">
        <div class="metric-header">Representation Impact</div>
        <div id="representation-impact" class="metric-visualization"></div>
      </div>
    </div>
  </div>
</div>

## Key Statistics

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-number">{{ site.data.bias-beacon.oregon-judicial-data.metadata.total_cases_analyzed | number_with_delimiter }}</div>
    <div class="stat-label">Total Cases Analyzed</div>
    <div class="stat-period">{{ site.data.bias-beacon.oregon-judicial-data.metadata.data_period }}</div>
  </div>

  <div class="stat-card">
    <div class="stat-number">{{ site.data.bias-beacon.oregon-judicial-data.metadata.total_counties }}</div>
    <div class="stat-label">Counties Covered</div>
    <div class="stat-period">Complete Oregon Coverage</div>
  </div>

  <div class="stat-card">
    <div class="stat-number">{{ site.data.bias-beacon.oregon-judicial-data.metadata.total_judges }}</div>
    <div class="stat-label">Judges Tracked</div>
    <div class="stat-period">Active & Historical</div>
  </div>

  <div class="stat-card">
    <div class="stat-number">{{ site.data.bias-beacon.oregon-judicial-data.aggregate_stats.total_prison_years_imposed | number_with_delimiter }}</div>
    <div class="stat-label">Total Prison Years</div>
    <div class="stat-period">Sentences Imposed</div>
  </div>
</div>

<!-- Crisis Alert Card -->
<div class="crisis-alert-card">
  <div class="crisis-header">
    <h3>🚨 {{ site.data.bias-beacon.live-oregon-data.current_events.unrepresented_crisis.title }}</h3>
    <div class="severity-badge critical">CRITICAL</div>
  </div>
  <div class="crisis-stats">
    <div class="crisis-stat">
      <span class="number">{{ site.data.bias-beacon.live-oregon-data.current_events.unrepresented_crisis.statewide_impact.percent_criminal_unrepresented }}%</span>
      <span class="label">Criminal Cases Unrepresented</span>
    </div>
    <div class="crisis-stat">
      <span class="number">{{ site.data.bias-beacon.live-oregon-data.current_events.unrepresented_crisis.statewide_impact.average_delay_days }}</span>
      <span class="label">Average Delay (Days)</span>
    </div>
  </div>
  <a href="{{ '/bias-beacon/current-events/' | relative_url }}" class="crisis-link">View Full Crisis Report →</a>
</div>

## Bias Indicators Overview

<div class="bias-indicators">
  <div class="indicator-section">
    <h3>🔴 High Concern Areas</h3>
    <div class="indicator-list">
      {% for indicator in site.data.bias-beacon.oregon-judicial-data.bias_indicators.high_concern %}
      <div class="indicator-item high-concern">
        <div class="indicator-icon">🚨</div>
        <div class="indicator-text">{{ indicator }}</div>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="indicator-section">
    <h3>🟡 Moderate Concern Areas</h3>
    <div class="indicator-list">
      {% for indicator in site.data.bias-beacon.oregon-judicial-data.bias_indicators.moderate_concern %}
      <div class="indicator-item moderate-concern">
        <div class="indicator-icon">⚠️</div>
        <div class="indicator-text">{{ indicator }}</div>
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="indicator-section">
    <h3>🟢 Best Practices</h3>
    <div class="indicator-list">
      {% for indicator in site.data.bias-beacon.oregon-judicial-data.bias_indicators.best_practices %}
      <div class="indicator-item best-practice">
        <div class="indicator-icon">✅</div>
        <div class="indicator-text">{{ indicator }}</div>
      </div>
      {% endfor %}
    </div>
  </div>
</div>

## Live County Data Overview

<div class="county-overview-grid">
  {% for county in site.data.bias-beacon.live-oregon-data.county_aggregates %}
  <div class="county-card {{ county[1].risk_level }}" data-county="{{ county[0] }}">
    <div class="county-header">
      <h4>{{ county[0] | capitalize }} County</h4>
      <div class="risk-indicator {{ county[1].risk_level }}">{{ county[1].risk_level | upcase }}</div>
    </div>
    
    <div class="county-stats">
      <div class="stat-row">
        <span class="stat-label">Prison Rate:</span>
        <span class="stat-value">{{ county[1].bias_indicators.prison_rate }}%</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Racial Disparity:</span>
        <span class="stat-value">{{ county[1].bias_indicators.racial_disparity }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Counsel Disparity:</span>
        <span class="stat-value">{{ county[1].bias_indicators.counsel_disparity }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Unrepresented:</span>
        <span class="stat-value">{{ county[1].unrepresented_crisis_impact.percent_unrepresented }}%</span>
      </div>
    </div>
    
    <div class="county-judges">
      <small>{{ county[1].total_judges }} judges • {{ county[1].total_cases_2024 | number_with_delimiter }} cases (2024)</small>
    </div>
  </div>
  {% endfor %}
</div>

## Interactive Visualizations

<div class="viz-container">
  <div class="viz-section">
    <h3>📊 Real-Time Prison Rates by County</h3>
    <div id="prison-rates-chart" class="chart-container">
      <canvas id="prisonRatesCanvas" width="800" height="400"></canvas>
    </div>
  </div>

  <div class="viz-section">
    <h3>👥 Counsel Representation Disparities</h3>
    <div id="counsel-disparity-chart" class="chart-container">
      <canvas id="counselDisparityCanvas" width="800" height="400"></canvas>
    </div>
  </div>

  <div class="viz-section">
    <h3>⚖️ Appeals and Reversal Tracking</h3>
    <div id="appeals-chart" class="chart-container">
      <canvas id="appealsCanvas" width="800" height="400"></canvas>
    </div>
  </div>

  <div class="viz-section">
    <h3>📈 Unrepresented Crisis Trends</h3>
    <div id="crisis-trends-chart" class="chart-container">
      <canvas id="crisisTrendsCanvas" width="800" height="400"></canvas>
    </div>
  </div>
</div>

## Quick Insights

<div class="insights-section">
  <h3>🔍 Key Findings</h3>
  <div class="insights-list">
    {% for finding in site.data.bias-beacon.oregon-judicial-data.key_findings %}
    <div class="insight-item {{ finding.significance }}">
      <div class="finding-header">
        <h4>{{ finding.title }}</h4>
        <div class="significance-badge {{ finding.significance }}">{{ finding.significance | upcase }}</div>
      </div>
      <p>{{ finding.description }}</p>
      {% if finding.counties_affected %}
      <div class="affected-counties">
        <strong>Affected Counties:</strong> {{ finding.counties_affected | join: ", " }}
      </div>
      {% endif %}
      {% if finding.highest_rate %}
      <div class="finding-stats">
        <span class="stat-highlight">Highest: {{ finding.highest_rate }}</span>
        {% if finding.lowest_rate %}
        <span class="stat-highlight">Lowest: {{ finding.lowest_rate }}</span>
        {% endif %}
      </div>
      {% endif %}
    </div>
    {% endfor %}
  </div>
</div>

## Filter Dashboard Data

<div class="dashboard-filters">
  <h3>Filter Data View</h3>
  <div class="filter-controls">
    <div class="filter-group">
      <label for="date-range">Date Range:</label>
      <select id="date-range" class="filter-select">
        <option value="all">All Years</option>
        <option value="recent">Last 3 Years</option>
        <option value="2020-2024">2020-2024</option>
        <option value="2015-2019">2015-2019</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="case-types">Case Types:</label>
      <select id="case-types" class="filter-select">
        <option value="all">All Case Types</option>
        <option value="felony">Felony Only</option>
        <option value="misdemeanor">Misdemeanor Only</option>
        <option value="drug">Drug Offenses</option>
        <option value="violent">Violent Crimes</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="county-group">County Group:</label>
      <select id="county-group" class="filter-select">
        <option value="all">All Counties</option>
        <option value="urban">Urban Counties</option>
        <option value="rural">Rural Counties</option>
        <option value="high-volume">High Volume Courts</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="demographic">Demographic Focus:</label>
      <select id="demographic" class="filter-select">
        <option value="all">All Demographics</option>
        <option value="race">Racial Analysis</option>
        <option value="gender">Gender Analysis</option>
        <option value="age">Age Analysis</option>
      </select>
    </div>
  </div>
  
  <button id="apply-filters" class="btn btn-primary">Apply Filters</button>
  <button id="reset-filters" class="btn btn-secondary">Reset</button>
</div>

## Download Data

<div class="download-section">
  <h3>📥 Export Data</h3>
  <p>Download filtered data for further analysis:</p>
  <div class="download-buttons">
    <button class="btn btn-outline" onclick="downloadCSV()">Download CSV</button>
    <button class="btn btn-outline" onclick="downloadJSON()">Download JSON</button>
    <button class="btn btn-outline" onclick="generateReport()">Generate Report</button>
  </div>
</div>

## Methodology & Sources

<div class="methodology-section">
  <h3>📋 Data Quality</h3>
  <div class="quality-metrics">
    <div class="quality-item">
      <strong>Data Coverage:</strong> <span id="data-coverage">Loading...</span>%
    </div>
    <div class="quality-item">
      <strong>Last Updated:</strong> <span id="last-updated">Loading...</span>
    </div>
    <div class="quality-item">
      <strong>Data Sources:</strong> Official court records, state databases
    </div>
    <div class="quality-item">
      <strong>Verification:</strong> Multi-source cross-referencing
    </div>
  </div>
</div>

---

<div class="dashboard-footer">
  <p><strong>Important:</strong> All statistics are presented with appropriate context and confidence intervals. Patterns identified here warrant further investigation but should not be considered definitive proof of bias without additional analysis.</p>
  
  <p>For questions about methodology, data interpretation, or to report issues, please <a href="mailto:{{ site.email }}">contact us</a>.</p>
</div>

<script>
// Dashboard functionality will be implemented here
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initializeDashboard();
});

function initializeDashboard() {
    // Placeholder for dashboard initialization
    console.log('Dashboard initialized - waiting for data');
}

function downloadCSV() {
    alert('CSV download will be available once data is loaded');
}

function downloadJSON() {
    alert('JSON download will be available once data is loaded');
}

function generateReport() {
    alert('Report generation will be available once data is loaded');
}
</script>