export function judgeCardHTML(j) {
  const specialties = (j.case_specialization || j.case_specialization || []).join(', ');
  return `
  <article class="judge-card" data-id="${j.id}">
    <div class="judge-header">
      <div class="judge-name">${j.name}</div>
      <div class="judge-court">${j.county} — ${j.court}</div>
      <div class="judge-department">${specialties}</div>
    </div>

    <div class="key-metrics">
      <div class="metric-item">
        <span class="metric-value">${j.prison_rate ?? '—'}</span>
        <span class="metric-label">Prison Rate</span>
      </div>
      <div class="metric-item">
        <span class="metric-value">${j.total_cases ?? '—'}</span>
        <span class="metric-label">Cases</span>
      </div>
      <div class="metric-item">
        <span class="metric-value">${j.years_served ?? '—'}</span>
        <span class="metric-label">Years</span>
      </div>
    </div>

    <div class="bias-indicators">
      <div class="bias-metric"><span class="bias-label">Racial Disparity</span><span class="bias-score">${j.racial_disparity ?? '—'}</span></div>
      <div class="bias-metric"><span class="bias-label">Counsel Disparity</span><span class="bias-score">${j.counsel_disparity ?? '—'}</span></div>
    </div>

    <div class="card-actions">
      <button class="btn btn-primary view-details-btn" data-judge-id="${j.id}">View</button>
      <button class="btn btn-secondary add-compare-btn" data-judge-id="${j.id}">Compare</button>
    </div>
  </article>`;
}
