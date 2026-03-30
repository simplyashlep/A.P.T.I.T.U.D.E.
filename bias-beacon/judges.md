---
layout: default
title: Judge Profiles - Bias Beacon
permalink: /bias-beacon/judges/
body_class: archive-page actor-directory-page judges-page
---

<div class="actor-directory actor-directory--judges" data-directory-root data-directory-label="judges">
  <section class="actor-directory-hero">
    <div class="actor-hero-copy">
      <p class="archive-kicker">Bias Beacon</p>
      <h1 class="actor-page-title actor-page-title-image-wrap">
        <img class="actor-page-title-image"
             src="{{ '/assets/images/titles/THE-JUDICIARY-3-29-2026.png' | relative_url }}"
             alt="The Judiciary">
        <span class="visually-hidden">The Judiciary</span>
      </h1>
      <p class="actor-page-deck">
        Judicial profiles arranged for quick comparison across counties, courtrooms, and outcome patterns,
        with deeper layers for reversals, disparity signals, and accountability flags.
      </p>
      <div class="actor-hero-search">
        <label class="visually-hidden" for="judge-search">Search judges, counties, or focus areas</label>
        <div class="search-wrapper">
          <input type="text"
                 id="judge-search"
                 class="search-input-enhanced"
                 placeholder="Search judges, counties, or focus areas">
          <span class="search-icon">&#128269;</span>
        </div>
      </div>
      <div class="actor-hero-actions">
        <button class="btn btn-secondary actor-sidebar-toggle" type="button" data-sidebar-toggle aria-expanded="true">Filters</button>
      </div>
    </div>
    <aside class="actor-hero-panel">
      <p class="archive-kicker">Evidence Chain</p>
      <p class="actor-hero-note">
        Courtroom discretion leaves a pattern when enough rulings, sentences, and reversals are read together.
        The directory keeps that pattern visible without flattening the judge, the county, or the record that produced it.
      </p>
      <div class="actor-chain-mini">
        <span>Sentencing</span>
        <span>Reversal history</span>
        <span>Representation disparities</span>
        <span>Accountability flags</span>
      </div>
    </aside>
  </section>

  <div class="actor-directory-layout">
    <aside class="actor-sidebar">
      <div class="sidebar-panel sidebar-panel-emphasis">
        <h2>Directory Filters</h2>
        <p class="sidebar-copy">Glass-filter controls stay pinned so the cards remain the focus.</p>
      </div>

      <div class="sidebar-panel sidebar-filters">
        <div class="filter-group">
          <label for="county-filter">County</label>
          <select id="county-filter" class="filter-select">
            <option value="all">All Counties</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="district-filter">District</label>
          <select id="district-filter" class="filter-select">
            <option value="all">All Districts</option>
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
            <option value="score">Bias Score</option>
            <option value="name">Name</option>
            <option value="county">County</option>
            <option value="prison_rate">Prison Rate</option>
            <option value="reversal_rate">Reversal Rate</option>
          </select>
        </div>

        <button id="sort-order" class="sort-order-btn" title="Toggle sort order">&#8595;</button>
      </div>

      <div class="sidebar-panel comparison-panel-visible">
        <div class="compare-panel-header">
          <div>
            <h3>Compare Judges</h3>
            <p class="comparison-help">Select two or more judges to isolate them and generate live comparison insights.</p>
          </div>
          <button id="compare-btn" disabled class="btn btn-primary">Compare</button>
        </div>
        <div id="selected-judges" class="selected-judges-area"></div>
        <button id="clear-comparison" class="btn btn-secondary">Clear Selection</button>
      </div>

      <nav class="sidebar-panel directory-cross-nav" aria-label="Actor navigation">
        <h3>Open Another Actor View</h3>
        <a class="directory-cross-link active" href="{{ '/bias-beacon/judges/' | relative_url }}">Judges</a>
        <a class="directory-cross-link" href="{{ '/bias-beacon/presiding-judges/' | relative_url }}">Presiding Judges</a>
        <a class="directory-cross-link" href="{{ '/bias-beacon/pro-tem-judges/' | relative_url }}">Pro Tem Judges</a>
        <a class="directory-cross-link" href="{{ '/prosecutors.html' | relative_url }}">Prosecutors</a>
        <a class="directory-cross-link" href="{{ '/law-enforcement.html' | relative_url }}">Law Enforcement</a>
        <a class="directory-cross-link" href="{{ '/parole-probation.html' | relative_url }}">Community Supervision</a>
      </nav>
    </aside>

    <section class="actor-main">
      <div class="actor-top-panels">
        <section class="bias-legend-bar actor-top-panel">
          <div>
            <p class="eyebrow">Scoring Legend</p>
            <h2>Bias Beacon Score at a glance</h2>
          </div>
          <div class="legend-items-horizontal legend-items-stacked">
            <div class="legend-chip excellent"><span class="legend-color"></span><span class="legend-text">0-20 Excellent</span></div>
            <div class="legend-chip low"><span class="legend-color"></span><span class="legend-text">21-40 Low Risk</span></div>
            <div class="legend-chip moderate"><span class="legend-color"></span><span class="legend-text">41-60 Moderate</span></div>
            <div class="legend-chip high"><span class="legend-color"></span><span class="legend-text">61-80 High Risk</span></div>
            <div class="legend-chip critical"><span class="legend-color"></span><span class="legend-text">81-100 Critical</span></div>
          </div>
        </section>
        <section class="actor-top-panel actor-top-panel--evidence">
          <p class="eyebrow">Evidence Chain</p>
          <h2>How the surface opens up</h2>
          <p>
            Start with the score and spectrum, flip for the pressure points, then open the full profile
            for the deeper context that gives each signal its weight.
          </p>
        </section>
        <section class="actor-top-panel actor-top-panel--sources">
          <p class="eyebrow">Source Stack</p>
          <h2>Roster and photos are official. Metrics still need verification.</h2>
          <p>
            Judge names, roles, districts, and photos are now being matched against Oregon Judicial Department and Oregon Blue Book
            records. The prison-usage, reversal, and counsel-disparity figures remain the site's analytic layer and should be treated
            as provisional until each metric is tied to a reviewable source trail.
          </p>
          <div class="source-link-row">
            <a class="btn btn-outline" href="https://www.courts.oregon.gov/courts/Pages/judges.aspx?wp9116=so:[[42569,0]]" target="_blank" rel="noreferrer">Official Judges</a>
            <a class="btn btn-outline" href="https://www.courts.oregon.gov/courts/Pages/presiding-judges.aspx" target="_blank" rel="noreferrer">Presiding Judges</a>
            <a class="btn btn-outline" href="https://www.courts.oregon.gov/courts/Pages/pro-tem.aspx" target="_blank" rel="noreferrer">Pro Tem Judges</a>
          </div>
        </section>
      </div>

      <div class="actor-toolbar">
        <div class="results-info">
          <span id="results-count" class="results-count">Loading judge cards...</span>
        </div>
        <a href="{{ '/bias-beacon/methodology/' | relative_url }}" class="btn btn-outline">Methodology</a>
      </div>

      <div id="bias-stats" class="bias-stats-bar"></div>

      <div id="judges-grid" class="flip-cards-grid actor-card-grid" data-directory-grid>
        {% assign judge_directory = site.data.bias-beacon.judges-directory.judges %}
        {% for judge_data in judge_directory %}
            {% assign score = judge_data.score %}
            {% assign score_display = score | default: 'Pending' %}
            {% assign accent = '#6f7b8c' %}
            {% assign accent_text = '#FFFFFF' %}
            {% if judge_data.riskLevel == 'critical' %}
              {% assign accent = '#5F0F40' %}
            {% elsif judge_data.riskLevel == 'high' %}
              {% assign accent = '#9A031E' %}
            {% elsif judge_data.riskLevel == 'moderate' %}
              {% assign accent = '#666666' %}
            {% elsif judge_data.riskLevel == 'low' %}
              {% assign accent = '#9FA8FF' %}
            {% elsif judge_data.riskLevel == 'excellent' %}
              {% assign accent = '#A3FF05' %}
              {% assign accent_text = '#0B0F12' %}
            {% endif %}
            {% capture flags_joined %}{% if judge_data.flags %}{% for flag in judge_data.flags %}{% unless forloop.first %} | {% endunless %}{{ flag }}{% endfor %}{% endif %}{% endcapture %}
            <article class="flip-card"
                     data-card-id="{{ judge_data.id }}"
                     data-id="{{ judge_data.id }}"
                     data-name="{{ judge_data.name }}"
                     data-county="{{ judge_data.county | downcase }}"
                     data-level="{{ judge_data.riskLevel }}"
                     data-score="{{ judge_data.score | default: 0 }}"
                     data-score-display="{{ score_display }}"
                     data-prison-rate="{{ judge_data.prisonUsage | default: 0 }}"
                     data-reversal-rate="{{ judge_data.reversalRate | default: 0 }}"
                     data-counsel-disparity="{{ judge_data.counselDisparity | default: 0 }}"
                     data-specialization="{{ judge_data.focus | downcase }}"
                     data-summary="{{ judge_data.summary }}"
                     data-court="{{ judge_data.category | default: 'Judicial Officer' }}"
                     data-tenure="{{ judge_data.tenureDisplay }}"
                     data-caseload="{{ judge_data.caseload2024 | default: 'Pending verification' }}"
                     data-flags="{{ flags_joined | strip }}"
                     data-focus="{{ judge_data.focus }}"
                     data-actor-type="judge"
                     data-official-role="{{ judge_data.roleTitle }}"
                     data-official-district="{{ judge_data.district }}"
                     data-photo-url="{{ judge_data.officialPhotoUrl }}"
                     data-bio-url="{{ judge_data.bioUrl }}"
                     data-email="{{ judge_data.email }}"
                     data-phone="{{ judge_data.phone }}"
                     data-term-expires="{{ judge_data.termExpiresDisplay }}"
                     data-metrics-verified="{{ judge_data.metricsVerified }}">
              <div class="flip-card-inner">
                <div class="flip-card-front" style="--card-accent: {{ accent }};">
                  <div class="card-selection-bar">
                    <label class="compare-toggle-pill">
                      <input class="compare-toggle-input" type="checkbox" data-compare-toggle value="{{ judge_data.id }}">
                      <span>Compare</span>
                    </label>
                    <div class="status-indicator active">
                      {% if judge_data.metricsVerified %}Scored{% else %}Official{% endif %}
                    </div>
                  </div>

                  <div class="card-front-content">
                    <div class="judge-name-container">
                      <h2 class="judge-name-display">{{ judge_data.name }}</h2>
                      <div class="county-label">{{ judge_data.county }}{% unless judge_data.county == 'Statewide' %} County{% endunless %}</div>
                    </div>

                    <div class="bias-score-indicator">
                      <div class="score-circle" style="background: {{ accent }}; color: {{ accent_text }};">
                        <span class="score-value">{{ score_display }}</span>
                      </div>
                      <span class="score-label">{{ judge_data.scoreLabel }}</span>
                    </div>

                    <div class="spectrum-mini">
                      <div class="spectrum-track">
                        <span class="spectrum-marker" style="left: {{ judge_data.score | default: 4 }}%; background: {{ accent }};"></span>
                      </div>
                      <div class="spectrum-labels">
                        <span>Equity</span>
                        <span>Concern</span>
                      </div>
                    </div>

                    <p class="card-front-summary">{{ judge_data.summary }}</p>
                    <div class="card-front-metrics">
                      <div class="front-metric-chip">
                        <span class="front-metric-label">Score</span>
                        <strong class="front-metric-value">{{ score_display }}</strong>
                      </div>
                      <div class="front-metric-chip">
                        <span class="front-metric-label">Prison Usage</span>
                        <strong class="front-metric-value">{% if judge_data.prisonUsage %}{{ judge_data.prisonUsage }}%{% else %}Pending{% endif %}</strong>
                      </div>
                      <div class="front-metric-chip">
                        <span class="front-metric-label">Reversal Rate</span>
                        <strong class="front-metric-value">{% if judge_data.reversalRate %}{{ judge_data.reversalRate }}%{% else %}Pending{% endif %}</strong>
                      </div>
                      <div class="front-metric-chip">
                        <span class="front-metric-label">Bench Term</span>
                        <strong class="front-metric-value">{{ judge_data.termExpiresDisplay | default: 'Unknown' }}</strong>
                      </div>
                    </div>
                    <div class="card-front-footer"><span class="hover-hint">Flip for evidence and profile links</span></div>
                  </div>
                </div>

                <div class="flip-card-back">
                  <div class="card-selection-bar card-selection-bar-back">
                    <label class="compare-toggle-pill">
                      <input class="compare-toggle-input" type="checkbox" data-compare-toggle value="{{ judge_data.id }}">
                      <span>Compare</span>
                    </label>
                    <div class="score-badge" style="background: {{ accent }}; color: {{ accent_text }};">
                      {{ judge_data.scoreLabel }}
                    </div>
                  </div>

                  <div class="card-back-header">
                    <h3>{{ judge_data.name }}</h3>
                    <p class="card-back-subtitle">{{ judge_data.county }}{% unless judge_data.county == 'Statewide' %} County{% endunless %} | {{ judge_data.roleTitle }}</p>
                    <div class="judge-photo-shell" data-photo-slot>
                      {% if judge_data.officialPhotoUrl %}
                        <img src="{{ judge_data.officialPhotoUrl }}" alt="{{ judge_data.name }}" loading="lazy">
                      {% else %}
                        <span class="judge-photo-placeholder">Official photo pending match</span>
                      {% endif %}
                    </div>
                  </div>

                  <div class="card-back-content">
                    <div class="flip-metric-group">
                      <h4>Profile</h4>
                      <div class="metric-grid-mini">
                        <div class="metric-mini"><span class="metric-label">Term / Coverage</span><span class="metric-value">{{ judge_data.tenureDisplay }}</span></div>
                        <div class="metric-mini"><span class="metric-label">Bench Position</span><span class="metric-value">{% if judge_data.position %}{{ judge_data.position }}{% else %}N/A{% endif %}</span></div>
                        <div class="metric-mini"><span class="metric-label">Focus</span><span class="metric-value truncate">{{ judge_data.focus }}</span></div>
                        <div class="metric-mini"><span class="metric-label">Appeals</span><span class="metric-value">{{ judge_data.appeals2024 | default: "Pending" }}</span></div>
                      </div>
                    </div>

                    <div class="flip-metric-group">
                      <h4>Bias Signals</h4>
                      <div class="bias-metrics-grid">
                        <div class="bias-metric-item"><span class="bias-metric-label">Prison Usage</span><span class="bias-metric-value">{% if judge_data.prisonUsage %}{{ judge_data.prisonUsage }}%{% else %}Pending{% endif %}</span></div>
                        <div class="bias-metric-item"><span class="bias-metric-label">Racial Disparity</span><span class="bias-metric-value">{{ judge_data.racialDisparity | default: "Pending" }}</span></div>
                        <div class="bias-metric-item"><span class="bias-metric-label">Counsel Disparity</span><span class="bias-metric-value">{{ judge_data.counselDisparity | default: "Pending" }}</span></div>
                        <div class="bias-metric-item"><span class="bias-metric-label">Reversal Rate</span><span class="bias-metric-value">{% if judge_data.reversalRate %}{{ judge_data.reversalRate }}%{% else %}Pending{% endif %}</span></div>
                      </div>
                    </div>

                    {% if judge_data.flags and judge_data.flags.size > 0 %}
                      <div class="flip-metric-group flags-section">
                        <h4>Evidence Chain Flags</h4>
                        <ul class="flags-list">
                          {% for flag in judge_data.flags %}
                            <li>{{ flag }}</li>
                          {% endfor %}
                        </ul>
                      </div>
                    {% else %}
                      <div class="flip-metric-group flags-section">
                        <h4>Verification Status</h4>
                        <ul class="flags-list">
                          <li>Official roster, role, term, and photo are source-backed.</li>
                          <li>Analytic metrics are {% if judge_data.metricsVerified %}present but still require source-by-source audit{% else %}still pending verification for this judge{% endif %}.</li>
                        </ul>
                      </div>
                    {% endif %}
                  </div>

                  <div class="card-back-actions">
                    <button class="btn btn-primary view-details-btn" data-profile-trigger>Full Profile</button>
                    <button class="btn btn-secondary add-compare-btn">Add to Compare</button>
                  </div>
                </div>
              </div>
            </article>
        {% endfor %}
      </div>

      <section class="directory-visualization">
        <div class="section-heading">
          <p class="eyebrow">Spectrum View</p>
          <h2>Where the visible judges sit right now</h2>
        </div>
        <div id="directory-viz" class="directory-viz-grid">
          <div class="viz-card">
            <h3>Bias Spectrum</h3>
            <div class="viz-spectrum-shell"><div id="directory-spectrum" class="viz-spectrum"></div></div>
          </div>
          <div class="viz-card">
            <h3>Visible Distribution</h3>
            <div id="directory-distribution" class="viz-bars"></div>
          </div>
        </div>
      </section>

      <section class="score-explainer compact-explainer">
        <div class="section-heading">
          <p class="eyebrow">Understanding Judge Score</p>
          <h2>Compact guide to the Bias Beacon model</h2>
        </div>
        <div class="metrics-explanation compact-grid">
          <div class="metric-item"><h3>Racial disparity</h3><p>Sentencing differences for similar cases.</p></div>
          <div class="metric-item"><h3>Counsel disparity</h3><p>Outcome gaps tied to representation type.</p></div>
          <div class="metric-item"><h3>Prison rate</h3><p>How often incarceration is imposed versus alternatives.</p></div>
          <div class="metric-item"><h3>Reversal trend</h3><p>Appeal outcomes that show decisions being disturbed.</p></div>
        </div>
      </section>

      <section class="directory-visualization">
        <div class="section-heading">
          <p class="eyebrow">Verification Path</p>
          <h2>What is official and what still needs audit</h2>
        </div>
        <div class="directory-viz-grid">
          <article class="viz-card">
            <h3>Official layer</h3>
            <p>Roster identity, judicial role, district, term dates, and photo space are sourced from Oregon State Courts and Oregon Blue Book records.</p>
          </article>
          <article class="viz-card">
            <h3>Analytic layer</h3>
            <p>Prison usage, reversal rate, counsel disparity, and the proprietary score currently come from the local Bias Beacon analytic layer where a current official judge could be matched. Unmatched judges remain visible with pending analytics instead of being omitted.</p>
          </article>
        </div>
      </section>
    </section>
  </div>

  <div id="judge-detail-modal" class="modal">
    <div class="modal-content judge-detail-content">
      <span class="close judge-modal-close">&times;</span>
      <div id="judge-detail-content"></div>
    </div>
  </div>

  <div id="comparison-modal" class="modal">
    <div class="modal-content comparison-modal-content">
      <span class="close">&times;</span>
      <h2>Judge Comparison</h2>
      <div id="comparison-results"></div>
    </div>
  </div>
</div>
