/**
 * Judge Card Component
 * Legacy component for backward compatibility
 * For new implementations, use flip-card.js instead
 */

// Re-export flip card functionality for modern usage
export { flipCardHTML, simpleCardHTML } from './flip-card.js';

/**
 * Generate legacy judge card HTML (non-flip version)
 * @param {Object} j - Judge data object
 * @returns {string} - HTML string for the judge card
 */
export function judgeCardHTML(j) {
  const specialties = (j.case_specialization || j.specialization || []).join(', ');
  const prisonRate = j.bias_metrics?.prison_rate || j.prison_rate || '—';
  const totalCases = j.caseload_2024 || j.total_cases || '—';
  const yearsServed = calculateYearsServed(j);
  const racialDisparity = j.bias_metrics?.sentence_disparity?.racial?.disparity_score || j.racial_disparity || '—';
  const counselDisparity = j.bias_metrics?.sentence_disparity?.counsel_representation?.disparity_score || j.counsel_disparity || '—';
  const riskLevel = j.risk_assessment || 'moderate';

  return `
  <article class="judge-card ${riskLevel}" data-id="${j.id}">
    <div class="risk-badge ${riskLevel}">
      ${riskLevel.replace('_', ' ').toUpperCase()}
    </div>

    <div class="judge-header">
      <div class="judge-name">${j.name}</div>
      <div class="judge-court">${j.county || 'Unknown'} — ${j.court || 'Circuit Court'}</div>
      <div class="judge-department">${specialties || 'General'}</div>
    </div>

    <div class="key-metrics">
      <div class="metric-item">
        <span class="metric-value">${prisonRate}%</span>
        <span class="metric-label">Prison Rate</span>
      </div>
      <div class="metric-item">
        <span class="metric-value">${totalCases}</span>
        <span class="metric-label">Cases</span>
      </div>
      <div class="metric-item">
        <span class="metric-value">${yearsServed}</span>
        <span class="metric-label">Years</span>
      </div>
    </div>

    <div class="bias-indicators">
      <div class="bias-metric">
        <span class="bias-label">Racial Disparity</span>
        <span class="bias-score">${racialDisparity}</span>
      </div>
      <div class="bias-metric">
        <span class="bias-label">Counsel Disparity</span>
        <span class="bias-score">${counselDisparity}</span>
      </div>
    </div>

    <div class="card-actions">
      <button class="btn btn-primary view-details-btn" data-judge-id="${j.id}">View</button>
      <button class="btn btn-secondary add-compare-btn" data-judge-id="${j.id}" data-judge-name="${j.name}">Compare</button>
    </div>
  </article>`;
}

/**
 * Calculate years served on bench
 */
function calculateYearsServed(judge) {
  if (!judge.tenure_start) return '—';
  const startYear = parseInt(judge.tenure_start);
  const endYear = judge.tenure_end ? parseInt(judge.tenure_end) : new Date().getFullYear();
  return endYear - startYear;
}

// Default export for backward compatibility
export default judgeCardHTML;
