---
layout: page
title: "Dashboard - Bias Beacon"
permalink: /bias-beacon/dashboard/
description: "Interactive dashboard showing key judicial bias metrics, trends, and patterns across all counties."
---

# Bias Beacon Dashboard

<div class="dashboard-header">
  <p>Real-time overview of judicial sentencing patterns, bias indicators, and criminal justice metrics across all 36 counties. Data refreshed quarterly.</p>
</div>

## Key Statistics

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-number" id="total-cases">Loading...</div>
    <div class="stat-label">Total Cases Analyzed</div>
    <div class="stat-period">5-10 Year Period</div>
  </div>

  <div class="stat-card">
    <div class="stat-number" id="total-judges">36</div>
    <div class="stat-label">Counties Covered</div>
    <div class="stat-period">Complete Coverage</div>
  </div>

  <div class="stat-card">
    <div class="stat-number" id="active-judges">Loading...</div>
    <div class="stat-label">Judges Tracked</div>
    <div class="stat-period">Active & Historical</div>
  </div>

  <div class="stat-card">
    <div class="stat-number" id="prison-years">Loading...</div>
    <div class="stat-label">Total Prison Years</div>
    <div class="stat-period">Sentences Imposed</div>
  </div>
</div>

## Bias Indicators Overview

<div class="bias-indicators">
  <div class="indicator-section">
    <h3>🔴 High Concern Areas</h3>
    <div id="high-concern" class="indicator-list">
      <div class="placeholder">Data will be displayed here showing counties or judges with significant bias indicators.</div>
    </div>
  </div>

  <div class="indicator-section">
    <h3>🟡 Moderate Concern Areas</h3>
    <div id="moderate-concern" class="indicator-list">
      <div class="placeholder">Moderate bias indicators will be shown here.</div>
    </div>
  </div>

  <div class="indicator-section">
    <h3>🟢 Best Practices</h3>
    <div id="best-practices" class="indicator-list">
      <div class="placeholder">Counties and judges with exemplary fairness metrics will be highlighted here.</div>
    </div>
  </div>
</div>

## Interactive Visualizations

<div class="viz-container">
  <div class="viz-section">
    <h3>📊 Sentencing Severity by County</h3>
    <div id="severity-chart" class="chart-placeholder">
      <p>Interactive bar chart showing average sentence lengths across all counties. Click on bars to drill down into specific county data.</p>
    </div>
  </div>

  <div class="viz-section">
    <h3>👥 Demographic Disparity Heatmap</h3>
    <div id="disparity-heatmap" class="chart-placeholder">
      <p>Heat map visualization showing sentencing disparities across demographic groups by county.</p>
    </div>
  </div>

  <div class="viz-section">
    <h3>⚖️ Public vs. Private Attorney Outcomes</h3>
    <div id="representation-chart" class="chart-placeholder">
      <p>Comparative analysis of case outcomes based on type of legal representation.</p>
    </div>
  </div>

  <div class="viz-section">
    <h3>📈 Trends Over Time</h3>
    <div id="trends-chart" class="chart-placeholder">
      <p>Line chart showing how sentencing patterns have changed over the 5-10 year analysis period.</p>
    </div>
  </div>
</div>

## Quick Insights

<div class="insights-section">
  <h3>🔍 Key Findings</h3>
  <div id="key-findings" class="insights-list">
    <!-- Findings will be populated from data analysis -->
    <div class="insight-item placeholder">
      <h4>Finding 1</h4>
      <p>Key insights about judicial bias patterns will be displayed here once data is processed.</p>
    </div>
    <div class="insight-item placeholder">
      <h4>Finding 2</h4>
      <p>Significant statistical findings about representation disparities.</p>
    </div>
    <div class="insight-item placeholder">
      <h4>Finding 3</h4>
      <p>Important trends in demographic sentencing patterns.</p>
    </div>
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