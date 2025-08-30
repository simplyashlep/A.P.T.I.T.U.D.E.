---
layout: default
title: Judge Profiles - Bias Beacon
permalink: /bias-beacon/judges/
---

<div class="bias-beacon-container">
  <h1>Oregon Judge Profiles</h1>
  
  <div class="methodology-link">
    <p>📊 <a href="{{ '/bias-beacon/methodology/' | relative_url }}" class="methodology-btn">View Bias Calculation Methodology</a> - Learn how our bias metrics are calculated and validated</p>
  </div>
  
  <div class="judges-controls">
    <div class="filter-controls">
      <select id="county-filter">
        <option value="">All Counties</option>
        <option value="multnomah">Multnomah County</option>
        <option value="washington">Washington County</option>
        <option value="clackamas">Clackamas County</option>
        <option value="lane">Lane County</option>
        <option value="jackson">Jackson County</option>
        <option value="marion">Marion County</option>
        <option value="deschutes">Deschutes County</option>
        <option value="yamhill">Yamhill County</option>
      </select>
      
      <select id="risk-filter">
        <option value="">All Risk Levels</option>
        <option value="low">Low Risk</option>
        <option value="moderate">Moderate Risk</option>
        <option value="high">High Risk</option>
      </select>
      
      <select id="department-filter">
        <option value="">All Departments</option>
        <option value="criminal">Criminal</option>
        <option value="civil">Civil</option>
        <option value="family">Family</option>
        <option value="juvenile">Juvenile</option>
      </select>
      
      <input type="text" id="judge-search" placeholder="Search judges by name...">
    </div>
    
    <div class="comparison-controls">
      <div id="comparison-panel" class="comparison-panel-visible">
        <h3>🔍 Judge Comparison Tool</h3>
        <div id="selected-judges" class="selected-judges-area">
          <p class="comparison-help">Click "Add to Compare" on judge cards to compare up to 3 judges side-by-side</p>
        </div>
        <div class="comparison-buttons">
          <button id="compare-btn" disabled class="btn btn-primary">Compare Selected Judges</button>
          <button id="clear-comparison" class="btn btn-secondary">Clear All</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Bias Heat Map Dashboard -->
  <div class="heat-map-section">
    <h2>🗺️ Oregon Judicial Bias Heat Map</h2>
    <p>Visual representation of bias patterns across Oregon counties and demographic factors</p>
    
    <div class="heat-map-controls">
      <div class="heat-map-filters">
        <select id="heat-map-metric">
          <option value="racial_disparity">Racial Disparity Score</option>
          <option value="counsel_disparity">Counsel Disparity Score</option>
          <option value="prison_rate">Prison Rate</option>
          <option value="reversal_rate">Reversal Rate</option>
        </select>
        
        <select id="heat-map-view">
          <option value="county">By County</option>
          <option value="department">By Department</option>
          <option value="risk_level">By Risk Level</option>
        </select>
        
        <button id="heat-map-refresh" class="btn btn-secondary">Update Heat Map</button>
      </div>
    </div>
    
    <div class="heat-map-container">
      <div class="heat-map-legend">
        <h4>📊 Bias Level Scale</h4>
        <div class="legend-items">
          <div class="legend-item excellent">Excellent (Low Bias)</div>
          <div class="legend-item low">Low Risk</div>
          <div class="legend-item moderate">Moderate Risk</div>
          <div class="legend-item high">High Risk</div>
          <div class="legend-item critical">Critical (High Bias)</div>
        </div>
      </div>
      
      <div id="heat-map-grid" class="heat-map-grid">
        <!-- Dynamic heat map tiles will be generated here -->
      </div>
      
      <div class="heat-map-stats">
        <div class="stat-summary">
          <h4>📈 Summary Statistics</h4>
          <div id="heat-map-summary">
            <!-- Dynamic summary statistics -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="judges-grid" id="judges-grid">
    <!-- Dynamic judge cards for all counties -->
    {% for county_data in site.data.bias-beacon.live-oregon-data.oregon_judges %}
      {% assign county_name = county_data[0] %}
      {% assign judges = county_data[1] %}
      
      {% for judge_data in judges %}
      <div class="judge-card {{ judge_data.risk_assessment }}" 
           data-county="{{ judge_data.county | downcase }}" 
           data-department="{{ judge_data.department | downcase }}" 
           data-risk="{{ judge_data.risk_assessment }}"
           data-period="{{ judge_data.time_period_coverage }}"
           data-id="{{ judge_data.id }}"
           data-name="{{ judge_data.name }}">
        
        <!-- Risk Badge -->
        <div class="risk-badge {{ judge_data.risk_assessment }}">
          {{ judge_data.risk_assessment | replace: '_', ' ' | upcase }}
        </div>
        
        <!-- Judge Header -->
        <div class="judge-header">
          <h3 class="judge-name">{{ judge_data.name }}</h3>
          <div class="judge-court">{{ judge_data.county }} County {{ judge_data.court }}</div>
          <div class="judge-department">{{ judge_data.department }} Department</div>
          
          {% if judge_data.specialization %}
          <div class="specialization">
            <strong>Specializes in:</strong> {{ judge_data.specialization | join: ", " }}
          </div>
          {% endif %}
        </div>
        
        <!-- Key Metrics -->
        <div class="key-metrics">
          <div class="metric-item">
            <span class="metric-value">{{ judge_data.bias_metrics.prison_rate }}%</span>
            <span class="metric-label">Prison Rate</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">{{ judge_data.appellate_record.total_appeals_2024 }}</span>
            <span class="metric-label">2024 Appeals</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">{{ judge_data.appellate_record.reversal_rate }}%</span>
            <span class="metric-label">Reversal Rate</span>
          </div>
        </div>
        
        <!-- Bias Indicators -->
        <div class="bias-indicators">
          <div class="bias-metric">
            <span class="bias-label">Racial Disparity:</span>
            <span class="bias-score disparity-{{ judge_data.bias_metrics.sentence_disparity.racial.disparity_score | divided_by: 3 | round }}">{{ judge_data.bias_metrics.sentence_disparity.racial.disparity_score }}</span>
          </div>
          <div class="bias-metric">
            <span class="bias-label">Counsel Disparity:</span>
            <span class="bias-score disparity-{{ judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score | divided_by: 5 | round }}">{{ judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score }}</span>
          </div>
        </div>
        
        <!-- Card Actions -->
        <div class="card-actions">
          <button class="btn btn-primary view-details-btn" data-judge-id="{{ judge_data.id }}">
            View Full Profile
          </button>
          <button class="btn btn-secondary add-compare-btn" data-judge-id="{{ judge_data.id }}" data-judge-name="{{ judge_data.name }}">
            Add to Compare
          </button>
        </div>
        
        <!-- Hidden detailed data for modal/search -->
        <div class="judge-details" style="display: none;">
          <p><strong>Court:</strong> {{ judge_data.county }} County {{ judge_data.court }}</p>
          <p><strong>Department:</strong> {{ judge_data.department }}</p>
          <p><strong>Tenure:</strong> {{ judge_data.tenure_start }}{% if judge_data.tenure_end %} - {{ judge_data.tenure_end }}{% else %} - Present{% endif %}</p>
          <p><strong>Data Period:</strong> {{ judge_data.time_period_coverage }}</p>
          <p><strong>2024 Caseload:</strong> {{ judge_data.caseload_2024 | number_with_delimiter }} cases</p>
        </div>
        
        <!-- Representation Type Analysis -->
        {% if judge_data.representation_analysis %}
        <div class="representation-breakdown" style="display: none;">
          <h4>📋 Representation Type Analysis</h4>
          <div class="rep-stats">
            <div class="rep-type">
              <span class="rep-label">Self-Represented:</span>
              <span class="rep-count">{{ judge_data.representation_analysis.by_representation_type.self_represented.count }} cases ({{ judge_data.representation_analysis.by_representation_type.self_represented.percentage }}%)</span>
              <span class="rep-outcome">Avg: {{ judge_data.representation_analysis.by_representation_type.self_represented.avg_sentence_months }}mo, {{ judge_data.representation_analysis.by_representation_type.self_represented.conviction_rate }}% conviction</span>
            </div>
            <div class="rep-type">
              <span class="rep-label">Court-Appointed:</span>  
              <span class="rep-count">{{ judge_data.representation_analysis.by_representation_type.court_appointed.count }} cases ({{ judge_data.representation_analysis.by_representation_type.court_appointed.percentage }}%)</span>
              <span class="rep-outcome">Avg: {{ judge_data.representation_analysis.by_representation_type.court_appointed.avg_sentence_months }}mo, {{ judge_data.representation_analysis.by_representation_type.court_appointed.conviction_rate }}% conviction</span>
            </div>
            <div class="rep-type">
              <span class="rep-label">Retained Counsel:</span>
              <span class="rep-count">{{ judge_data.representation_analysis.by_representation_type.retained_counsel.count }} cases ({{ judge_data.representation_analysis.by_representation_type.retained_counsel.percentage }}%)</span>
              <span class="rep-outcome">Avg: {{ judge_data.representation_analysis.by_representation_type.retained_counsel.avg_sentence_months }}mo, {{ judge_data.representation_analysis.by_representation_type.retained_counsel.conviction_rate }}% conviction</span>
            </div>
          </div>
          
          <div class="disparity-alerts">
            <div class="disparity-item">
              <strong>Self-Rep vs Retained:</strong> +{{ judge_data.representation_analysis.disparity_analysis.self_vs_retained.sentence_difference }} months, +{{ judge_data.representation_analysis.disparity_analysis.self_vs_retained.conviction_rate_difference }}% conviction rate
            </div>
            <div class="disparity-item">
              <strong>Court-Appointed vs Retained:</strong> +{{ judge_data.representation_analysis.disparity_analysis.appointed_vs_retained.sentence_difference }} months, +{{ judge_data.representation_analysis.disparity_analysis.appointed_vs_retained.conviction_rate_difference }}% conviction rate
            </div>
          </div>
        </div>
        {% endif %}
        
        <div class="bias-metrics" style="display: none;">
          <h4>⚖️ Bias Analysis</h4>
          <div class="metric">
            <span class="metric-label">Prison Rate:</span>
            <span class="metric-value">{{ judge_data.bias_metrics.prison_rate }}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Racial Disparity Score:</span>
            <span class="metric-value disparity-{{ judge_data.bias_metrics.sentence_disparity.racial.disparity_score | divided_by: 3 | round }}">{{ judge_data.bias_metrics.sentence_disparity.racial.disparity_score }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Counsel Disparity Score:</span>
            <span class="metric-value disparity-{{ judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score | divided_by: 5 | round }}">{{ judge_data.bias_metrics.sentence_disparity.counsel_representation.disparity_score }}</span>
          </div>
        </div>
        
        <div class="appellate-record" style="display: none;">
          <h4>📋 2024 Appeals Record</h4>
          <div class="appeals-stats">
            <span class="appeals-count">{{ judge_data.appellate_record.total_appeals_2024 }} appeals</span>
            <span class="reversal-rate">{{ judge_data.appellate_record.reversal_rate }}% reversed</span>
          </div>
        </div>
        
        {% if judge_data.awards_recognition %}
        <div class="awards-recognition" style="display: none;">
          <h4>🏆 Recognition & Awards</h4>
          <ul>
            {% for award in judge_data.awards_recognition %}
            <li>{{ award }}</li>
            {% endfor %}
          </ul>
        </div>
        {% endif %}
        
        {% if judge_data.stop_data_correlation %}
        <div class="stop-correlation" style="display: none;">
          <h4>🚔 STOP Data Correlation Analysis</h4>
          <div class="stop-stats">
            <div class="pipeline-analysis">
              <h5>Traffic Stop to Court Pipeline</h5>
              <div class="demographic-flow">
                <div class="demo-row">
                  <span class="demo-label">Black defendants:</span>
                  <span class="stop-rate">{{ judge_data.stop_data_correlation.county_stop_patterns.demographic_breakdown.black }}% in stops</span>
                  <span class="court-rate">→ {{ judge_data.stop_data_correlation.judicial_caseload_demographics.black_defendants }}% in court</span>
                  <span class="overrep {{ judge_data.stop_data_correlation.correlation_analysis.stop_to_court_pipeline.black_overrepresentation | plus: 0 | times: 1.0 }}">{{ judge_data.stop_data_correlation.correlation_analysis.stop_to_court_pipeline.black_overrepresentation }}% overrepresentation</span>
                </div>
                <div class="demo-row">
                  <span class="demo-label">Hispanic defendants:</span>
                  <span class="stop-rate">{{ judge_data.stop_data_correlation.county_stop_patterns.demographic_breakdown.hispanic }}% in stops</span>
                  <span class="court-rate">→ {{ judge_data.stop_data_correlation.judicial_caseload_demographics.hispanic_defendants }}% in court</span>
                  <span class="overrep {{ judge_data.stop_data_correlation.correlation_analysis.stop_to_court_pipeline.hispanic_overrepresentation | plus: 0 | times: 1.0 }}">{{ judge_data.stop_data_correlation.correlation_analysis.stop_to_court_pipeline.hispanic_overrepresentation }}% overrepresentation</span>
                </div>
                <div class="demo-row">
                  <span class="demo-label">White defendants:</span>
                  <span class="stop-rate">{{ judge_data.stop_data_correlation.county_stop_patterns.demographic_breakdown.white }}% in stops</span>
                  <span class="court-rate">→ {{ judge_data.stop_data_correlation.judicial_caseload_demographics.white_defendants }}% in court</span>
                  <span class="underrep">{{ judge_data.stop_data_correlation.correlation_analysis.stop_to_court_pipeline.white_underrepresentation }}% underrepresentation</span>
                </div>
              </div>
            </div>
            
            <div class="search-analysis">
              <h5>Racial Search Rate Disparities</h5>
              <div class="search-rates">
                <div class="search-row">
                  <span class="race-label">White:</span>
                  <span class="search-rate">{{ judge_data.stop_data_correlation.correlation_analysis.search_rate_correlation.racial_search_disparities.white_search_rate }}%</span>
                </div>
                <div class="search-row">
                  <span class="race-label">Black:</span>
                  <span class="search-rate high-rate">{{ judge_data.stop_data_correlation.correlation_analysis.search_rate_correlation.racial_search_disparities.black_search_rate }}%</span>
                </div>
                <div class="search-row">
                  <span class="race-label">Hispanic:</span>
                  <span class="search-rate high-rate">{{ judge_data.stop_data_correlation.correlation_analysis.search_rate_correlation.racial_search_disparities.hispanic_search_rate }}%</span>
                </div>
              </div>
              <div class="contraband-found">
                <span class="contraband-label">Contraband Found Rate:</span>
                <span class="contraband-rate">{{ judge_data.stop_data_correlation.correlation_analysis.search_rate_correlation.contraband_found_rate }}%</span>
              </div>
            </div>
            
            <div class="correlation-interpretation">
              <h5>Analysis</h5>
              <p class="interpretation-text">{{ judge_data.stop_data_correlation.correlation_analysis.interpretation }}</p>
            </div>
          </div>
        </div>
        {% endif %}
        
        {% if judge_data.specialization %}
        <div class="specialization" style="display: none;">
          <strong>Specializes in:</strong> {{ judge_data.specialization | join: ", " }}
        </div>
        {% endif %}
        
        <div class="judge-actions" style="display: none;">
          <button class="view-details-btn" data-judge-id="{{ judge_data.id }}">View Full Profile</button>
          <button class="add-compare-btn" data-judge-id="{{ judge_data.id }}" data-judge-name="{{ judge_data.name }}">Add to Compare</button>
        </div>
      </div>
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


## Judge Directory

<div id="judges-list" class="judges-grid">
  <!-- All available judges will be loaded here via JavaScript when data is available -->
  <div class="loading-message">
    <h3>Loading All Judge Data...</h3>
    <p>All judge profiles from the Bias Beacon dataset will be displayed here once loaded.</p>
    <p><em>Note: Upload your complete judicial data zip file to populate this section with every judge record available.</em></p>
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
>>>>>>> 5361f0859af1e2017b0adccf65496b898c10a2ef
