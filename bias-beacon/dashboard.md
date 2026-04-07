---
layout: default
title: Statewide Dashboard - Bias Beacon
permalink: /bias-beacon/dashboard/
body_class: archive-page dashboard-page
---

<section class="dashboard-hero dashboard-hero-neon">
  <div class="dashboard-hero-grid">
    <div class="dashboard-hero-copy">
      <p class="archive-kicker">Watchtower</p>
      <h1 class="dashboard-page-title">Statewide Dashboard</h1>
      <p class="dashboard-narrative">
        One statewide surface for concentration, drift, reversal pressure, charging posture,
        supervision load, and the cross-actor patterns that only appear once the record is read as a system.
      </p>
      <div class="dashboard-search-shell">
        <label class="visually-hidden" for="dashboard-search">Search dashboard views</label>
        <input id="dashboard-search" class="search-input-enhanced" type="search" placeholder="Search county, judge, office, agency, or metric">
      </div>
      <div class="dashboard-hero-actions">
        <a class="btn btn-outline" href="{{ '/bias-beacon/judges/' | relative_url }}">Judiciary</a>
        <a class="btn btn-outline" href="{{ '/prosecutors.html' | relative_url }}">Prosecutor's Office</a>
        <a class="btn btn-outline" href="{{ '/law-enforcement.html' | relative_url }}">Law Enforcement</a>
        <a class="btn btn-outline" href="{{ '/parole-probation.html' | relative_url }}">Community Supervision</a>
      </div>
    </div>

    <aside class="dashboard-hero-panel">
      <p class="archive-kicker">System Read</p>
      <div class="dashboard-panel-stack">
        <div class="dashboard-panel-stat">
          <span class="dashboard-panel-label">Official judges</span>
          <strong>{{ site.data.bias-beacon.judges-directory.counts.officialJudges }}</strong>
        </div>
        <div class="dashboard-panel-stat">
          <span class="dashboard-panel-label">Counties visible</span>
          <strong>{{ site.data.bias-beacon.live-oregon-data.county_summary.total_counties }}</strong>
        </div>
        <div class="dashboard-panel-stat">
          <span class="dashboard-panel-label">Profiles with current analytics</span>
          <strong>{{ site.data.bias-beacon.judges-directory.counts.judgesWithMetrics }}</strong>
        </div>
      </div>
      <p class="dashboard-panel-note">
        This dashboard is where the archive stops behaving like separate pages and begins behaving like one continuous record.
      </p>
    </aside>
  </div>
</section>

<section class="dashboard-ribbon-grid">
  <article class="dashboard-ribbon-card">
    <p class="eyebrow">Judiciary</p>
    <h2>Bench pressure</h2>
    <p>Score distribution, reversal heat, and where judicial profiles cluster statewide.</p>
  </article>
  <article class="dashboard-ribbon-card">
    <p class="eyebrow">Charging</p>
    <h2>Office posture</h2>
    <p>County prosecution environments compared by pressure, leverage, and dismissal drift.</p>
  </article>
  <article class="dashboard-ribbon-card">
    <p class="eyebrow">Intake</p>
    <h2>Street entry</h2>
    <p>Stops, searches, arrests, and the intake side of the system in a single statewide pass.</p>
  </article>
  <article class="dashboard-ribbon-card">
    <p class="eyebrow">Supervision</p>
    <h2>Return pressure</h2>
    <p>Monitoring intensity, violation flow, and revocation exposure after sentencing.</p>
  </article>
</section>

<section class="dashboard-grid-cluster">
  <article class="dashboard-spotlight-card dashboard-spotlight-card-wide">
    <div class="dashboard-card-header">
      <p class="eyebrow">Command Surface</p>
      <h2>Statewide concentration map</h2>
    </div>
    <div class="dashboard-heat-grid">
      {% for county in site.data.bias-beacon.live-oregon-data.county_summary.by_county limit: 12 %}
        {% assign county_name = county[0] | replace: '_', ' ' | capitalize %}
        {% assign county_count = county[1] %}
        <div class="dashboard-heat-cell" style="--intensity: {{ county_count | times: 2 | plus: 12 }}%;">
          <span>{{ county_name }}</span>
          <strong>{{ county_count }}</strong>
        </div>
      {% endfor %}
    </div>
  </article>

  <article class="dashboard-spotlight-card">
    <div class="dashboard-card-header">
      <p class="eyebrow">Live Distribution</p>
      <h2>Roster status</h2>
    </div>
    <div class="dashboard-mini-stack">
      <div class="dashboard-mini-metric"><span>Presiding judges</span><strong>{{ site.data.bias-beacon.judges-directory.counts.presidingJudges }}</strong></div>
      <div class="dashboard-mini-metric"><span>Official photos</span><strong>{{ site.data.bias-beacon.judges-directory.counts.officialJudges | minus: 25 }}</strong></div>
      <div class="dashboard-mini-metric"><span>Analytics pending</span><strong>{{ site.data.bias-beacon.judges-directory.counts.officialJudges | minus: site.data.bias-beacon.judges-directory.counts.judgesWithMetrics }}</strong></div>
    </div>
  </article>

  <article class="dashboard-spotlight-card">
    <div class="dashboard-card-header">
      <p class="eyebrow">Evidence Chain</p>
      <h2>Cross-actor sequence</h2>
    </div>
    <div class="dashboard-sequence-list">
      <span>Stops &amp; searches</span>
      <span>Arrests</span>
      <span>Charging</span>
      <span>Convictions</span>
      <span>Reversals</span>
      <span>Supervision</span>
    </div>
  </article>
</section>

<section class="dashboard-grid-cluster dashboard-grid-cluster-secondary">
  <article class="dashboard-chart-card">
    <div class="dashboard-card-header">
      <p class="eyebrow">Counties</p>
      <h2>Visible pressure bands</h2>
    </div>
    <div class="dashboard-line-list">
      {% for county in site.data.bias-beacon.live-oregon-data.county_summary.by_county limit: 8 %}
        {% assign county_name = county[0] | replace: '_', ' ' | capitalize %}
        {% assign county_count = county[1] %}
        <div class="dashboard-line-item">
          <span>{{ county_name }}</span>
          <div class="dashboard-line-track"><span style="width: {{ county_count | times: 2 | plus: 10 }}%;"></span></div>
          <strong>{{ county_count }}</strong>
        </div>
      {% endfor %}
    </div>
  </article>

  <article class="dashboard-chart-card">
    <div class="dashboard-card-header">
      <p class="eyebrow">Official Source Layer</p>
      <h2>What is source-backed now</h2>
    </div>
    <div class="dashboard-source-list">
      <div><span>Judicial roster</span><strong>Official</strong></div>
      <div><span>Photos</span><strong>Blue Book</strong></div>
      <div><span>Judge bios</span><strong>Official court links</strong></div>
      <div><span>Analytic scores</span><strong>Provisional layer</strong></div>
    </div>
  </article>
</section>

<section class="dashboard-method-note">
  <p>
    Watchtower is not here to force a conclusion. It exists to hold the statewide surfaces together long enough
    for concentration, congruence, and breakpoints to become visible.
  </p>
</section>
