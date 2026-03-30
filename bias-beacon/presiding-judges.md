---
layout: default
title: Presiding Judges - Bias Beacon
permalink: /bias-beacon/presiding-judges/
body_class: archive-page actor-directory-page judges-page
---

<div class="actor-directory actor-directory--judges" data-directory-root data-directory-label="presiding judges">
  <section class="actor-directory-hero">
    <div class="actor-hero-copy">
      <p class="archive-kicker">Bias Beacon</p>
      <h1 class="actor-page-title">Presiding Judges</h1>
      <p class="actor-page-deck">
        Official presiding-judge roster for Oregon judicial districts, with photos, term dates,
        district assignment, and the current Bias Beacon analytic layer where that match exists.
      </p>
      <div class="actor-hero-search">
        <label class="visually-hidden" for="judge-search">Search presiding judges, counties, or districts</label>
        <div class="search-wrapper">
          <input type="text" id="judge-search" class="search-input-enhanced" placeholder="Search presiding judges, counties, or districts">
          <span class="search-icon">&#128269;</span>
        </div>
      </div>
    </div>
    <aside class="actor-hero-panel">
      <p class="archive-kicker">Official Scope</p>
      <p class="actor-hero-note">
        This page is sourced from Oregon Judicial Department roster records and Oregon Blue Book photography.
        Analytic metrics appear only where a current presiding judge matched the existing local score layer.
      </p>
      <div class="actor-chain-mini">
        <span>District leadership</span>
        <span>Term dates</span>
        <span>Official bio links</span>
        <span>Photo-backed identity</span>
      </div>
    </aside>
  </section>

  <div class="actor-directory-layout">
    <aside class="actor-sidebar">
      <div class="sidebar-panel sidebar-panel-emphasis">
        <h2>Directory Filters</h2>
        <p class="sidebar-copy">Presiding judges only, filtered by county, district, and analytic status.</p>
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
          <label for="risk-filter">Analytic Status</label>
          <select id="risk-filter" class="filter-select">
            <option value="all">All Profiles</option>
            <option value="critical">Critical</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low Risk</option>
            <option value="excellent">Excellent</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="sort-by">Sort By</label>
          <select id="sort-by" class="filter-select">
            <option value="name">Name</option>
            <option value="county">County</option>
            <option value="score">Bias Score</option>
            <option value="reversal_rate">Reversal Rate</option>
          </select>
        </div>
        <button id="sort-order" class="sort-order-btn" title="Toggle sort order">&#8595;</button>
      </div>

      <nav class="sidebar-panel directory-cross-nav" aria-label="Actor navigation">
        <h3>Open Another Actor View</h3>
        <a class="directory-cross-link" href="{{ '/bias-beacon/judges/' | relative_url }}">Judges</a>
        <a class="directory-cross-link active" href="{{ '/bias-beacon/presiding-judges/' | relative_url }}">Presiding Judges</a>
        <a class="directory-cross-link" href="{{ '/bias-beacon/pro-tem-judges/' | relative_url }}">Pro Tem Judges</a>
        <a class="directory-cross-link" href="{{ '/prosecutors.html' | relative_url }}">Prosecutors</a>
      </nav>
    </aside>

    <section class="actor-main">
      <div class="actor-toolbar">
        <div class="results-info">
          <span id="results-count" class="results-count">Loading presiding judges...</span>
        </div>
        <a href="https://www.courts.oregon.gov/courts/pages/presiding-judges.aspx" class="btn btn-outline" target="_blank" rel="noreferrer">Official Source</a>
      </div>

      <div id="bias-stats" class="bias-stats-bar"></div>

      <div id="judges-grid" class="flip-cards-grid actor-card-grid" data-directory-grid>
        {% assign judge_directory = site.data.bias-beacon.judges-directory.judges | where: "isPresiding", true %}
        {% for judge_data in judge_directory %}
          {% assign score_display = judge_data.score | default: 'Pending' %}
          {% assign accent = '#6f7b8c' %}
          {% assign accent_text = '#FFFFFF' %}
          {% if judge_data.riskLevel == 'critical' %}{% assign accent = '#5F0F40' %}
          {% elsif judge_data.riskLevel == 'high' %}{% assign accent = '#9A031E' %}
          {% elsif judge_data.riskLevel == 'moderate' %}{% assign accent = '#666666' %}
          {% elsif judge_data.riskLevel == 'low' %}{% assign accent = '#9FA8FF' %}
          {% elsif judge_data.riskLevel == 'excellent' %}{% assign accent = '#A3FF05' %}{% assign accent_text = '#0B0F12' %}
          {% endif %}
          {% capture flags_joined %}{% if judge_data.flags %}{% for flag in judge_data.flags %}{% unless forloop.first %} | {% endunless %}{{ flag }}{% endfor %}{% endif %}{% endcapture %}
          <article class="flip-card"
                   data-id="{{ judge_data.id }}"
                   data-name="{{ judge_data.name }}"
                   data-county="{{ judge_data.county | downcase }}"
                   data-level="{{ judge_data.riskLevel }}"
                   data-score="{{ judge_data.score | default: 0 }}"
                   data-score-display="{{ score_display }}"
                   data-prison-rate="{{ judge_data.prisonUsage | default: 0 }}"
                   data-reversal-rate="{{ judge_data.reversalRate | default: 0 }}"
                   data-counsel-disparity="{{ judge_data.counselDisparity | default: 0 }}"
                   data-summary="{{ judge_data.summary }}"
                   data-court="{{ judge_data.category }}"
                   data-tenure="{{ judge_data.tenureDisplay }}"
                   data-caseload="{{ judge_data.caseload2024 | default: 'Pending verification' }}"
                   data-flags="{{ flags_joined | strip }}"
                   data-focus="{{ judge_data.focus }}"
                   data-actor-type="presiding judge"
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
                <div class="card-front-content">
                  <div class="judge-name-container">
                    <h2 class="judge-name-display">{{ judge_data.name }}</h2>
                    <div class="county-label">{{ judge_data.county }} County</div>
                  </div>
                  <div class="bias-score-indicator">
                    <div class="score-circle" style="background: {{ accent }}; color: {{ accent_text }};"><span class="score-value">{{ score_display }}</span></div>
                    <span class="score-label">{{ judge_data.scoreLabel }}</span>
                  </div>
                  <p class="card-front-summary">{{ judge_data.summary }}</p>
                  <div class="card-front-metrics">
                    <div class="front-metric-chip"><span class="front-metric-label">Prison Usage</span><strong class="front-metric-value">{% if judge_data.prisonUsage %}{{ judge_data.prisonUsage }}%{% else %}Pending{% endif %}</strong></div>
                    <div class="front-metric-chip"><span class="front-metric-label">Reversal Rate</span><strong class="front-metric-value">{% if judge_data.reversalRate %}{{ judge_data.reversalRate }}%{% else %}Pending{% endif %}</strong></div>
                    <div class="front-metric-chip"><span class="front-metric-label">Bench Term</span><strong class="front-metric-value">{{ judge_data.termExpiresDisplay | default: 'Unknown' }}</strong></div>
                  </div>
                </div>
              </div>
              <div class="flip-card-back">
                <div class="card-back-header">
                  <h3>{{ judge_data.name }}</h3>
                  <p class="card-back-subtitle">{{ judge_data.roleTitle }} | District {{ judge_data.district }}</p>
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
                    <h4>Official profile</h4>
                    <div class="metric-grid-mini">
                      <div class="metric-mini"><span class="metric-label">District</span><span class="metric-value">{{ judge_data.district }}</span></div>
                      <div class="metric-mini"><span class="metric-label">Position</span><span class="metric-value">{{ judge_data.position }}</span></div>
                      <div class="metric-mini"><span class="metric-label">Term Expires</span><span class="metric-value">{{ judge_data.termExpiresDisplay | default: 'Unknown' }}</span></div>
                      <div class="metric-mini"><span class="metric-label">Analytics</span><span class="metric-value">{% if judge_data.metricsVerified %}Matched{% else %}Pending{% endif %}</span></div>
                    </div>
                  </div>
                </div>
                <div class="card-back-actions">
                  <button class="btn btn-primary view-details-btn" data-profile-trigger>Full Profile</button>
                </div>
              </div>
            </div>
          </article>
        {% endfor %}
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
          <h2>Presiding Judge Comparison</h2>
          <div id="comparison-results"></div>
        </div>
      </div>
    </section>
  </div>
</div>
