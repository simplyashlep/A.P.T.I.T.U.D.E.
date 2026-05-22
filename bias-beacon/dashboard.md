---
layout: default
title: Bias Beacon Dashboard
permalink: /bias-beacon/dashboard/
body_class: page-bias-beacon
---

<section class="dashboard-hero">
  <h1 class="text-shimmer">Judicial Bias Patterns Dashboard</h1>
  <p class="dashboard-intro text-dynamic">Interactive statewide view of judicial decision patterns, sentence disparities, and demographic factors influencing outcomes.</p>
</section>

<div class="dashboard-container">
  
  <!-- State-Wide Summary Cards -->
  <section class="dashboard-summary">
    <div class="summary-card">
      <div class="card-value text-glow">211</div>
      <div class="card-label">Circuit Court Judges</div>
      <div class="card-detail">Across 36 judicial districts</div>
    </div>
    
    <div class="summary-card">
      <div class="card-value text-glow">35+</div>
      <div class="card-label">Judges with Metrics</div>
      <div class="card-detail">Verified decision pattern data</div>
    </div>
    
    <div class="summary-card">
      <div class="card-value text-glow">36</div>
      <div class="card-label">County Jurisdictions</div>
      <div class="card-detail">Plus appellate courts</div>
    </div>
    
    <div class="summary-card">
      <div class="card-value text-glow">8</div>
      <div class="card-label">Judicial Districts</div>
      <div class="card-detail">Statewide coverage</div>
    </div>
  </section>

  <!-- Heat Map Section -->
  <section class="dashboard-heatmap">
    <h2>Prison Sentence Usage by County</h2>
    <p class="section-intro">Percentage of cases resulting in prison sentences vs. alternative sentencing</p>
    <div class="heatmap-grid" id="county-heatmap">
      <!-- Heat map will be rendered here with county data -->
      <div class="placeholder">Loading county heat map...</div>
    </div>
  </section>

  <!-- Metrics Comparison -->
  <section class="dashboard-metrics">
    <h2>Key Judicial Metrics</h2>
    
    <div class="metrics-row">
      <div class="metric-fullwidth">
        <h3>Reversal Rate Distribution</h3>
        <p class="metric-description">How often judges' decisions are reversed or modified on appeal</p>
        <div class="chart-placeholder" id="reversal-chart">Creating reversal rate chart...</div>
      </div>
    </div>

    <div class="metrics-row">
      <div class="metric-card">
        <h3>Prison Usage</h3>
        <div class="stat-large">31.2%</div>
        <p class="stat-description">State average prison sentence rate</p>
      </div>
      
      <div class="metric-card">
        <h3>Reversal Rate</h3>
        <div class="stat-large">15.8%</div>
        <p class="stat-description">State average appeal reversal rate</p>
      </div>
      
      <div class="metric-card">
        <h3>Counsel Disparity</h3>
        <div class="stat-large">9.7%</div>
        <p class="stat-description">Disparity between represented/unrepresented</p>
      </div>
      
      <div class="metric-card">
        <h3>Racial Disparity</h3>
        <div class="stat-large">6.3%</div>
        <p class="stat-description">Disparity across racial groups</p>
      </div>
    </div>
  </section>

  <!-- Judge Rankings -->
  <section class="dashboard-rankings">
    <h2>Judge Rankings</h2>
    <p class="section-intro">See how judges compare across key metrics</p>
    
    <div class="ranking-tabs">
      <button class="tab-button tab-active" data-tab="prison">Prison Usage</button>
      <button class="tab-button" data-tab="reversal">Reversal Rate</button>
      <button class="tab-button" data-tab="counsel">Counsel Disparity</button>
      <button class="tab-button" data-tab="racial">Racial Disparity</button>
    </div>

    <div class="ranking-table" id="prison-ranking">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Judge Name</th>
            <th>County</th>
            <th>Prison Usage %</th>
            <th>Cases (2024)</th>
          </tr>
        </thead>
        <tbody>
          <!-- Rankings will be populated by JavaScript -->
          <tr><td colspan="5" class="placeholder">Loading judge rankings...</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- County Comparison -->
  <section class="dashboard-counties">
    <h2>County Comparison</h2>
    <p class="section-intro">How decision patterns vary across Oregon's judicial districts</p>
    
    <div class="county-grid" id="county-comparison">
      <!-- County profiles will be rendered here -->
      <div class="placeholder">Loading county data...</div>
    </div>
  </section>

  <!-- Data Info -->
  <section class="dashboard-info">
    <h2>About This Dashboard</h2>
    <p>This dashboard aggregates publicly available data from Oregon's Judicial Department, court records, and the Bias Beacon analytic dataset. Metrics include:</p>
    <ul>
      <li><strong>Prison Sentence Usage:</strong> Percentage of cases where judges imposed prison sentences</li>
      <li><strong>Appeal Reversal Rate:</strong> Percentage of cases where appellate courts reversed or modified decisions</li>
      <li><strong>Counsel Representation Disparity:</strong> Outcome differences between represented and unrepresented defendants</li>
      <li><strong>Racial Outcome Disparity:</strong> Outcome differences across racial groups</li>
    </ul>
    <p>Data is verified before publication and updated quarterly. Metrics are available for judges with sufficient case volume and verified analytics.</p>
  </section>

</div>

<!-- Dashboard styling now handled by _cohesive-theme.scss -->
