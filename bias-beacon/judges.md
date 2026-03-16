---
layout: default
title: Judge Profiles - Bias Beacon
permalink: /bias-beacon/judges/
---

<div class="bias-beacon-container">
  <h1>Oregon Judge Profiles</h1>
  <p class="page-subtitle">Comprehensive bias analysis for every sitting and former judge from the past 5 years across all 36 Oregon counties.</p>

  <div class="methodology-link">
    <p><a href="{{ '/bias-beacon/methodology/' | relative_url }}" class="methodology-btn">View Bias Calculation Methodology</a> - Learn how our Bias Beacon Scores are calculated and validated</p>
  </div>

  <!-- Enhanced Search and Filter Controls -->
  <div class="judges-controls-enhanced">
    <div class="search-row">
      <div class="search-wrapper">
        <input type="text"
               id="judge-search"
               class="search-input-enhanced"
               placeholder="Search by judge name or specialization...">
        <span class="search-icon">&#128269;</span>
      </div>

      <div class="results-info">
        <span id="results-count" class="results-count">Loading judges...</span>
      </div>
    </div>

    <div class="filter-row">
      <div class="filter-group">
        <label for="county-filter">County</label>
        <select id="county-filter" class="filter-select">
          <option value="all">All Counties</option>
          <option value="multnomah">Multnomah County</option>
          <option value="washington">Washington County</option>
          <option value="clackamas">Clackamas County</option>
          <option value="lane">Lane County</option>
          <option value="jackson">Jackson County</option>
          <option value="marion">Marion County</option>
          <option value="deschutes">Deschutes County</option>
          <option value="yamhill">Yamhill County</option>
          <option value="linn">Linn County</option>
          <option value="benton">Benton County</option>
          <option value="douglas">Douglas County</option>
          <option value="josephine">Josephine County</option>
          <option value="klamath">Klamath County</option>
          <option value="umatilla">Umatilla County</option>
          <option value="polk">Polk County</option>
          <option value="columbia">Columbia County</option>
          <option value="coos">Coos County</option>
          <option value="curry">Curry County</option>
          <option value="lincoln">Lincoln County</option>
          <option value="tillamook">Tillamook County</option>
          <option value="clatsop">Clatsop County</option>
          <option value="hood_river">Hood River County</option>
          <option value="wasco">Wasco County</option>
          <option value="jefferson">Jefferson County</option>
          <option value="crook">Crook County</option>
          <option value="malheur">Malheur County</option>
          <option value="baker">Baker County</option>
          <option value="union">Union County</option>
          <option value="wallowa">Wallowa County</option>
          <option value="grant">Grant County</option>
          <option value="harney">Harney County</option>
          <option value="lake">Lake County</option>
          <option value="morrow">Morrow County</option>
          <option value="gilliam">Gilliam County</option>
          <option value="sherman">Sherman County</option>
          <option value="wheeler">Wheeler County</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="risk-filter">Bias Level</label>
        <select id="risk-filter" class="filter-select">
          <option value="all">All Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High Risk</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low Risk</option>
          <option value="excellent">Excellent</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort-by">Sort By</label>
        <select id="sort-by" class="filter-select">
          <option value="score">Bias Score (Highest First)</option>
          <option value="name">Name (A-Z)</option>
          <option value="county">County (Alphabetical)</option>
          <option value="prison_rate">Prison Rate</option>
          <option value="reversal_rate">Reversal Rate</option>
        </select>
      </div>

      <button id="sort-order" class="sort-order-btn" title="Toggle sort order">&#8595;</button>
    </div>
  </div>

  <!-- Bias Score Legend -->
  <div class="bias-legend-bar">
    <h4>Bias Beacon Score Legend</h4>
    <div class="legend-items-horizontal">
      <div class="legend-chip excellent">
        <span class="legend-color"></span>
        <span class="legend-text">0-20 Excellent</span>
      </div>
      <div class="legend-chip low">
        <span class="legend-color"></span>
        <span class="legend-text">21-40 Low Risk</span>
      </div>
      <div class="legend-chip moderate">
        <span class="legend-color"></span>
        <span class="legend-text">41-60 Moderate</span>
      </div>
      <div class="legend-chip high">
        <span class="legend-color"></span>
        <span class="legend-text">61-80 High Risk</span>
      </div>
      <div class="legend-chip critical">
        <span class="legend-color"></span>
        <span class="legend-text">81-100 Critical</span>
      </div>
    </div>
  </div>

  <!-- Statistics Summary -->
  <div id="bias-stats" class="bias-stats-bar">
    <!-- Dynamic statistics will be inserted here -->
  </div>

  <!-- Comparison Panel -->
  <div class="comparison-controls">
    <div id="comparison-panel" class="comparison-panel-visible">
      <h3>Judge Comparison Tool</h3>
      <div id="selected-judges" class="selected-judges-area">
        <p class="comparison-help">Click "Compare" on judge cards to compare up to 3 judges side-by-side</p>
      </div>
      <div class="comparison-buttons">
        <button id="compare-btn" disabled class="btn btn-primary">Compare Selected Judges</button>
        <button id="clear-comparison" class="btn btn-secondary">Clear All</button>
      </div>
    </div>
  </div>

  <!-- Flip Cards Container -->
  <div id="judges-grid" class="flip-cards-grid">
    <!-- Jekyll-rendered judge cards (will be enhanced by JavaScript) -->
    {% for county_data in site.data.bias-beacon.live-oregon-data.oregon_judges %}
      {% assign county_name = county_data[0] %}
      {% assign judges = county_data[1] %}

      {% for judge_data in judges %}
      <article class="flip-card"
               data-id="{{ judge_data.id }}"
               data-name="{{ judge_data.name }}"
               data-county="{{ judge_data.county | downcase }}"
               data-level="{{ judge_data.risk_assessment }}">
        <div class="flip-card-inner">

          <!-- FRONT OF CARD -->
          <div class="flip-card-front"
               style="--card-accent: {% if judge_data.risk_assessment == 'critical' %}#5F0F40{% elsif judge_data.risk_assessment == 'high' %}#9A031E{% elsif judge_data.risk_assessment == 'moderate' %}#666666{% elsif judge_data.risk_assessment == 'low' %}#9FA8FF{% else %}#A3FF05{% endif %};">
            <div class="card-front-content">
              <div class="status-indicator {% if judge_data.current_status %}{{ judge_data.current_status }}{% else %}active{% endif %}">
                {% if judge_data.current_status == 'inactive' %}Former{% else %}Active{% endif %}
              </div>

              <div class="judge-name-container">
                <h2 class="judge-name-display" style="color: {% if judge_data.risk_assessment == 'critical' %}#5F0F40{% elsif judge_data.risk_assessment == 'high' %}#9A031E{% elsif judge_data.risk_assessment == 'moderate' %}#666666{% elsif judge_data.risk_assessment == 'low' %}#9FA8FF{% else %}#1a5a1a{% endif %};">
                  {{ judge_data.name }}
                </h2>
                <div class="county-label">{{ judge_data.county }} County</div>
              </div>

              <div class="bias-score-indicator">
                <div class="score-circle" style="background: {% if judge_data.risk_assessment == 'critical' %}#5F0F40{% elsif judge_data.risk_assessment == 'high' %}#9A031E{% elsif judge_data.risk_assessment == 'moderate' %}#666666{% elsif judge_data.risk_assessment == 'low' %}#9FA8FF{% else %}#A3FF05{% endif %}; color: {% if judge_data.risk_assessment == 'moderate' or judge_data.risk_assessment == 'high' or judge_data.risk_assessment == 'critical' %}#FFFFFF{% else %}#0B0F12{% endif %};">
                  <span class="score-value">
                    {% if judge_data.risk_assessment == 'critical' %}85{% elsif judge_data.risk_assessment == 'high' %}70{% elsif judge_data.risk_assessment == 'moderate' %}50{% elsif judge_data.risk_assessment == 'low' %}30{% else %}15{% endif %}
                  </span>
                </div>
                <span class="score-label">{{ judge_data.risk_assessment | capitalize }}</span>
              </div>

              <div class="card-front-footer">
                <span class="hover-hint">Hover for details</span>
              </div>
            </div>
          </div>

          <!-- BACK OF CARD -->
          <div class="flip-card-back">
            <div class="card-back-header">
              <h3>{{ judge_data.name }}</h3>
              <div class="score-badge" style="background: {% if judge_data.risk_assessment == 'critical' %}#5F0F40{% elsif judge_data.risk_assessment == 'high' %}#9A031E{% elsif judge_data.risk_assessment == 'moderate' %}#666666{% elsif judge_data.risk_assessment == 'low' %}#9FA8FF{% else %}#A3FF05{% endif %}; color: {% if judge_data.risk_assessment == 'moderate' or judge_data.risk_assessment == 'high' or judge_data.risk_assessment == 'critical' %}#FFFFFF{% else %}#0B0F12{% endif %};">
                {{ judge_data.risk_assessment | capitalize }}
              </div>
            </div>

            <div class="card-back-content">
              <!-- Overview -->
              <div class="flip-metric-group">
                <h4>Overview</h4>
                <div class="metric-grid-mini">
                  <div class="metric-mini">
                    <span class="metric-label">Court</span>
                    <span class="metric-value">{{ judge_data.court | default: "Circuit Court" }}</span>
                  </div>
                  <div class="metric-mini">
                    <span class="metric-label">Tenure</span>
                    <span class="metric-value">{{ judge_data.tenure_start }} - {% if judge_data.tenure_end %}{{ judge_data.tenure_end }}{% else %}Present{% endif %}</span>
                  </div>
                  <div class="metric-mini">
                    <span class="metric-label">Caseload '24</span>
                    <span class="metric-value">{{ judge_data.caseload_2024 | default: "N/A" }}</span>
                  </div>
                  <div class="metric-mini">
                    <span class="metric-label">Focus</span>
                    <span class="metric-value truncate">{{ judge_data.specialization | join: ", " | default: "General" }}</span>
                  </div>
                </div>
              </div>

              <!-- Bias Indicators -->
              <div class="flip-metric-group">
                <h4>Bias Indicators</h4>
                <div class="bias-metrics-grid">
                  <div class="bias-metric-item {% if judge_data.bias_metrics.prison_rate > 45 %}level-critical{% elsif judge_data.bias_metrics.prison_rate > 35 %}level-high{% elsif judge_data.bias_metrics.prison_rate > 25 %}level-moderate{% else %}level-low{% endif %}">
                    <span class="bias-metric-label">Prison Rate</span>
                    <span class="bias-metric-value">{{ judge_data.bias_metrics.prison_rate | default: "N/A" }}%</span>
                  </div>
                  <div class="bias-metric-item {% if judge_data.bias_metrics.sentence_disparity.racial.disparity_score > 10 %}level-critical{% elsif judge_data.bias_metrics.sentence_disparity.racial.disparity_score > 6 %}level-high{% elsif judge_data.bias_metrics.sentence_disparity.racial.disparity_score > 3 %}level-moderate{% else %}level-low{% endif %}">
                    <span class="bias-metric-label">Racial Disparity</span>
                    <span class="bias-metric-value">{{ judge_data.bias_metrics.sentence_disparity.racial.disparity_score | default: "N/A" }}</span>
                  </div>
                  <div class="bias-metric-item {% if judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score > 15 %}level-critical{% elsif judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score > 10 %}level-high{% elsif judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score > 5 %}level-moderate{% else %}level-low{% endif %}">
                    <span class="bias-metric-label">Counsel Disparity</span>
                    <span class="bias-metric-value">{{ judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score | default: "N/A" }}</span>
                  </div>
                  <div class="bias-metric-item {% if judge_data.appellate_record.reversal_rate > 25 %}level-critical{% elsif judge_data.appellate_record.reversal_rate > 18 %}level-high{% elsif judge_data.appellate_record.reversal_rate > 10 %}level-moderate{% else %}level-low{% endif %}">
                    <span class="bias-metric-label">Reversal Rate</span>
                    <span class="bias-metric-value">{{ judge_data.appellate_record.reversal_rate | default: "N/A" }}%</span>
                  </div>
                </div>
              </div>

              {% if judge_data.representation_analysis %}
              <!-- Representation Disparity -->
              <div class="flip-metric-group">
                <h4>Representation Disparity</h4>
                <div class="rep-comparison">
                  <div class="rep-item">
                    <span class="rep-label">Self-Rep:</span>
                    <span class="rep-value">{{ judge_data.representation_analysis.by_representation_type.self_represented.avg_sentence_months }}mo avg</span>
                  </div>
                  <div class="rep-item">
                    <span class="rep-label">Court-Appt:</span>
                    <span class="rep-value">{{ judge_data.representation_analysis.by_representation_type.court_appointed.avg_sentence_months }}mo avg</span>
                  </div>
                  <div class="rep-item">
                    <span class="rep-label">Retained:</span>
                    <span class="rep-value">{{ judge_data.representation_analysis.by_representation_type.retained_counsel.avg_sentence_months }}mo avg</span>
                  </div>
                </div>
              </div>
              {% endif %}

              <!-- Appellate Record -->
              <div class="flip-metric-group">
                <h4>Appellate Record</h4>
                <div class="appellate-summary">
                  <span>{{ judge_data.appellate_record.total_appeals_2024 | default: "0" }} appeals in 2024</span>
                  <span>{{ judge_data.appellate_record.reversal_rate | default: "0" }}% reversed</span>
                </div>
              </div>

              {% if judge_data.accountability_flags %}
              <!-- Accountability Flags -->
              <div class="flip-metric-group flags-section">
                <h4>Accountability Flags</h4>
                <ul class="flags-list">
                  {% for flag in judge_data.accountability_flags %}
                  <li>{{ flag }}</li>
                  {% endfor %}
                </ul>
              </div>
              {% endif %}
            </div>

            <div class="card-back-actions">
              <button class="btn btn-primary view-details-btn" data-judge-id="{{ judge_data.id }}">
                Full Profile
              </button>
              <button class="btn btn-secondary add-compare-btn" data-judge-id="{{ judge_data.id }}" data-judge-name="{{ judge_data.name }}">
                Compare
              </button>
            </div>
          </div>

        </div>
      </article>
      {% endfor %}
    {% endfor %}
  </div>

  <!-- Judge Detail Modal -->
  <div id="judge-detail-modal" class="modal">
    <div class="modal-content judge-detail-content">
      <span class="close judge-modal-close">&times;</span>
      <div id="judge-detail-content">
        <!-- Dynamic judge profile content -->
      </div>
    </div>
  </div>

  <!-- Judge Comparison Modal -->
  <div id="comparison-modal" class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Judge Comparison</h2>
      <div id="comparison-results"></div>
    </div>
  </div>
</div>

## Understanding the Bias Beacon Score

The **Bias Beacon Score** is a composite metric (0-100) that combines multiple indicators of judicial bias:

<div class="metrics-explanation">
  <div class="metric-item">
    <h3>Racial Disparity (25%)</h3>
    <p>Measures sentencing differences between white defendants and defendants of color for similar offenses.</p>
  </div>

  <div class="metric-item">
    <h3>Counsel Disparity (20%)</h3>
    <p>Compares outcomes for self-represented defendants vs. those with retained counsel.</p>
  </div>

  <div class="metric-item">
    <h3>Prison Rate (15%)</h3>
    <p>Percentage of cases resulting in incarceration, compared to state averages.</p>
  </div>

  <div class="metric-item">
    <h3>Appellate Reversal Rate (15%)</h3>
    <p>How often the judge's decisions are overturned on appeal, indicating procedural or substantive errors.</p>
  </div>

  <div class="metric-item">
    <h3>Gender Disparity (10%)</h3>
    <p>Differences in sentencing between male and female defendants for similar crimes.</p>
  </div>

  <div class="metric-item">
    <h3>Accountability Indicators (10%)</h3>
    <p>Formal complaints, notable reversals, and patterns requiring oversight.</p>
  </div>
</div>

---

*Judge profiles are generated from official Oregon court records and are updated quarterly. All statistics include appropriate context and statistical significance indicators. Hover over any card to see detailed metrics.*

<script type="module">
  // Initialize flip card manager when page loads
  import { FlipCardManager } from '{{ "/assets/js/bias-beacon/flip-card-manager.js" | relative_url }}';

  document.addEventListener('DOMContentLoaded', () => {
    // The FlipCardManager will auto-initialize, but we can add additional handlers here

    // Modal close handlers
    document.querySelectorAll('.modal .close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('show');
      });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });
  });
</script>

<style>
/* Enhanced Controls Styling */
.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

.judges-controls-enhanced {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.search-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  position: relative;
  min-width: 280px;
}

.search-input-enhanced {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.search-input-enhanced:focus {
  outline: none;
  border-color: #5F0F40;
  box-shadow: 0 0 0 3px rgba(95, 15, 64, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: #888;
}

.results-info {
  font-size: 0.95rem;
  color: #666;
}

.filter-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 0.6rem 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  min-width: 160px;
}

.filter-select:focus {
  outline: none;
  border-color: #5F0F40;
}

.sort-order-btn {
  padding: 0.6rem 0.8rem;
  font-size: 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-order-btn:hover {
  background: #5F0F40;
  color: white;
  border-color: #5F0F40;
}

/* Bias Legend Bar */
.bias-legend-bar {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
}

.bias-legend-bar h4 {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-items-horizontal {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.legend-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.legend-chip .legend-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.legend-chip.excellent { background: rgba(163, 255, 5, 0.2); }
.legend-chip.excellent .legend-color { background: #A3FF05; }

.legend-chip.low { background: rgba(159, 168, 255, 0.2); }
.legend-chip.low .legend-color { background: #9FA8FF; }

.legend-chip.moderate { background: rgba(102, 102, 102, 0.15); }
.legend-chip.moderate .legend-color { background: #666666; }

.legend-chip.high { background: rgba(154, 3, 30, 0.15); }
.legend-chip.high .legend-color { background: #9A031E; }

.legend-chip.critical { background: rgba(95, 15, 64, 0.15); }
.legend-chip.critical .legend-color { background: #5F0F40; }

/* Statistics Bar */
.bias-stats-bar {
  display: flex;
  gap: 2rem;
  padding: 1rem 1.5rem;
  background: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.stat-value {
  font-weight: 700;
  color: #0B0F12;
}

.stat-distribution {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}

.stat-distribution span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.dist-excellent { background: #A3FF05; color: #0B0F12; }
.dist-low { background: #9FA8FF; color: #0B0F12; }
.dist-moderate { background: #666666; color: #FFFFFF; }
.dist-high { background: #9A031E; color: #FFFFFF; }
.dist-critical { background: #5F0F40; color: #FFFFFF; }

/* No Results Message */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  grid-column: 1 / -1;
}

.no-results h3 {
  color: #666;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #888;
}

@media (max-width: 768px) {
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    min-width: 100%;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .legend-items-horizontal {
    justify-content: center;
  }

  .bias-stats-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stat-distribution {
    margin-left: 0;
  }
}
</style>
