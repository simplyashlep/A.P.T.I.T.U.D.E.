/**
 * Flip Card Component for Bias Beacon
 * Creates elegant 3D flip cards for judges (and reusable for prosecutors, etc.)
 *
 * Front: Judge name with bias-score color coding, raised outline design
 * Back: Comprehensive bias metrics on hover
 */

import { BiasScoreCalculator } from '../bias-beacon/bias-score-calculator.js';

/**
 * Generate flip card HTML for a judge
 * @param {Object} j - Judge data object
 * @returns {string} - HTML string for the flip card
 */
export function flipCardHTML(j) {
  // Calculate bias score
  const biasResult = BiasScoreCalculator.calculate(j);
  const score = biasResult.score;
  const level = biasResult.level;
  const color = biasResult.color;
  const textColor = biasResult.textColor;

  // Format tenure
  const tenureStart = j.tenure_start || 'Unknown';
  const tenureEnd = j.tenure_end || 'Present';
  const tenure = `${tenureStart} - ${tenureEnd}`;

  // Calculate years on bench
  const currentYear = new Date().getFullYear();
  const startYear = parseInt(j.tenure_start) || currentYear;
  const yearsOnBench = currentYear - startYear;

  // Get metrics
  const prisonRate = j.bias_metrics?.prison_rate || j.prison_rate || 'N/A';
  const racialDisparity = j.bias_metrics?.sentence_disparity?.racial?.disparity_score || j.racial_disparity || 'N/A';
  const counselDisparity = j.bias_metrics?.sentence_disparity?.counsel_representation?.disparity_score || j.counsel_disparity || 'N/A';
  const reversalRate = j.appellate_record?.reversal_rate || j.reversal_rate || 'N/A';
  const totalAppeals = j.appellate_record?.total_appeals_2024 || j.total_appeals || 'N/A';
  const caseload = j.caseload_2024 || j.total_cases || 'N/A';

  // Specializations
  const specializations = (j.specialization || j.case_specialization || []).join(', ') || 'General';

  // Status badge
  const status = j.current_status || 'active';
  const statusLabel = status === 'active' ? 'Active' : 'Former';

  // Accountability flags
  const flags = j.accountability_flags || [];
  const flagsHTML = flags.length > 0
    ? flags.map(f => `<li>${f}</li>`).join('')
    : '<li>No accountability flags</li>';

  // Representation analysis (if available)
  const repAnalysis = j.representation_analysis;
  let representationHTML = '';
  if (repAnalysis) {
    const selfRep = repAnalysis.by_representation_type?.self_represented;
    const courtAppointed = repAnalysis.by_representation_type?.court_appointed;
    const retained = repAnalysis.by_representation_type?.retained_counsel;

    representationHTML = `
      <div class="flip-metric-group">
        <h4>Representation Disparity</h4>
        <div class="rep-comparison">
          <div class="rep-item">
            <span class="rep-label">Self-Rep:</span>
            <span class="rep-value">${selfRep?.avg_sentence_months || 'N/A'}mo avg</span>
          </div>
          <div class="rep-item">
            <span class="rep-label">Court-Appt:</span>
            <span class="rep-value">${courtAppointed?.avg_sentence_months || 'N/A'}mo avg</span>
          </div>
          <div class="rep-item">
            <span class="rep-label">Retained:</span>
            <span class="rep-value">${retained?.avg_sentence_months || 'N/A'}mo avg</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
  <article class="flip-card"
           data-id="${j.id}"
           data-name="${j.name}"
           data-county="${(j.county || '').toLowerCase()}"
           data-score="${score}"
           data-level="${level}">
    <div class="flip-card-inner">

      <!-- FRONT OF CARD -->
      <div class="flip-card-front" style="--card-accent: ${color}; --card-text: ${textColor};">
        <div class="card-front-content">
          <div class="status-indicator ${status}">${statusLabel}</div>

          <div class="judge-name-container">
            <h2 class="judge-name-display" style="color: ${color};">${j.name}</h2>
            <div class="county-label">${j.county || 'Unknown'} County</div>
          </div>

          <div class="bias-score-indicator">
            <div class="score-circle" style="background: ${color}; color: ${textColor};">
              <span class="score-value">${Math.round(score)}</span>
            </div>
            <span class="score-label">${biasResult.level.charAt(0).toUpperCase() + biasResult.level.slice(1)}</span>
          </div>

          <div class="card-front-footer">
            <span class="hover-hint">Hover for details</span>
          </div>
        </div>
      </div>

      <!-- BACK OF CARD -->
      <div class="flip-card-back">
        <div class="card-back-header">
          <h3>${j.name}</h3>
          <div class="score-badge" style="background: ${color}; color: ${textColor};">
            ${Math.round(score)} - ${BiasScoreCalculator.getLevelLabel(score)}
          </div>
        </div>

        <div class="card-back-content">
          <!-- Basic Info -->
          <div class="flip-metric-group">
            <h4>Overview</h4>
            <div class="metric-grid-mini">
              <div class="metric-mini">
                <span class="metric-label">Court</span>
                <span class="metric-value">${j.court || 'Circuit Court'}</span>
              </div>
              <div class="metric-mini">
                <span class="metric-label">Tenure</span>
                <span class="metric-value">${yearsOnBench} years</span>
              </div>
              <div class="metric-mini">
                <span class="metric-label">Caseload '24</span>
                <span class="metric-value">${typeof caseload === 'number' ? caseload.toLocaleString() : caseload}</span>
              </div>
              <div class="metric-mini">
                <span class="metric-label">Focus</span>
                <span class="metric-value truncate">${specializations}</span>
              </div>
            </div>
          </div>

          <!-- Key Bias Metrics -->
          <div class="flip-metric-group">
            <h4>Bias Indicators</h4>
            <div class="bias-metrics-grid">
              <div class="bias-metric-item ${getBiasLevelClass(prisonRate, 'prison')}">
                <span class="bias-metric-label">Prison Rate</span>
                <span class="bias-metric-value">${prisonRate}%</span>
              </div>
              <div class="bias-metric-item ${getBiasLevelClass(racialDisparity, 'racial')}">
                <span class="bias-metric-label">Racial Disparity</span>
                <span class="bias-metric-value">${racialDisparity}</span>
              </div>
              <div class="bias-metric-item ${getBiasLevelClass(counselDisparity, 'counsel')}">
                <span class="bias-metric-label">Counsel Disparity</span>
                <span class="bias-metric-value">${counselDisparity}</span>
              </div>
              <div class="bias-metric-item ${getBiasLevelClass(reversalRate, 'reversal')}">
                <span class="bias-metric-label">Reversal Rate</span>
                <span class="bias-metric-value">${reversalRate}%</span>
              </div>
            </div>
          </div>

          ${representationHTML}

          <!-- Appellate Record -->
          <div class="flip-metric-group">
            <h4>Appellate Record</h4>
            <div class="appellate-summary">
              <span>${totalAppeals} appeals in 2024</span>
              <span>${reversalRate}% reversed</span>
            </div>
          </div>

          <!-- Accountability Flags -->
          <div class="flip-metric-group flags-section">
            <h4>Accountability Flags</h4>
            <ul class="flags-list">
              ${flagsHTML}
            </ul>
          </div>
        </div>

        <div class="card-back-actions">
          <button class="btn btn-primary view-details-btn" data-judge-id="${j.id}">
            Full Profile
          </button>
          <button class="btn btn-secondary add-compare-btn" data-judge-id="${j.id}" data-judge-name="${j.name}">
            Compare
          </button>
        </div>
      </div>

    </div>
  </article>`;
}

/**
 * Get CSS class for bias metric severity
 */
function getBiasLevelClass(value, type) {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'neutral';

  const thresholds = {
    prison: { low: 25, moderate: 35, high: 45 },
    racial: { low: 3, moderate: 6, high: 10 },
    counsel: { low: 5, moderate: 10, high: 15 },
    reversal: { low: 10, moderate: 18, high: 25 }
  };

  const t = thresholds[type] || thresholds.prison;

  if (numValue <= t.low) return 'level-low';
  if (numValue <= t.moderate) return 'level-moderate';
  if (numValue <= t.high) return 'level-high';
  return 'level-critical';
}

/**
 * Generate a simplified card for search results
 */
export function simpleCardHTML(j) {
  const biasResult = BiasScoreCalculator.calculate(j);

  return `
  <div class="simple-judge-card"
       data-id="${j.id}"
       data-score="${biasResult.score}"
       style="border-left-color: ${biasResult.color};">
    <div class="simple-card-info">
      <span class="simple-name" style="color: ${biasResult.color};">${j.name}</span>
      <span class="simple-county">${j.county || 'Unknown'} County</span>
    </div>
    <div class="simple-score" style="background: ${biasResult.color}; color: ${biasResult.textColor};">
      ${Math.round(biasResult.score)}
    </div>
  </div>`;
}

// Export default
export default flipCardHTML;
