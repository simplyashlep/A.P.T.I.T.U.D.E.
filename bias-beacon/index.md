---
layout: page
title: "Bias Beacon - System Index"
permalink: /bias-beacon/
description: "Bias Beacon is the analytical index for actor-level anomalies, disparities, reversals, and procedural irregularities across Oregon justice records."
body_class: archive-page
---

<section class="archive-shell">
  <div class="archive-header">
    <div>
      <p class="archive-kicker">System View</p>
      <h1 class="archive-title">Where separate public records either reinforce one another or start to fall apart.</h1>
      <p class="archive-deck">
        System View places law enforcement intake, prosecutor pressure, courtroom outcomes, appellate movement,
        and supervision return points onto the same civic surface. The record is allowed to align where it aligns
        and diverge where it diverges, without forcing causation beyond what the source layers can support.
      </p>
      <div class="archive-actions">
        <a href="/bias-beacon/judges/" class="button button-primary">Open Actor Records</a>
        <a href="/bias-beacon/dashboard/" class="button button-secondary">Open Watchtower</a>
      </div>
    </div>

    <aside class="archive-rail">
      <p class="archive-kicker">Evidence Chain</p>
      <div class="spine-lines">
        <span>Behavior becomes data.</span>
        <span>Data becomes pattern.</span>
        <span>Pattern becomes evidence.</span>
        <span>Evidence becomes accountability.</span>
      </div>
      <p class="archive-meta">The point is not to narrate ahead of the evidence. The point is to make the evidence legible enough to ask better questions.</p>
    </aside>
  </div>

  <div class="archive-index-grid">
    <article class="archive-index-card">
      <p class="archive-chip">Signals</p>
      <span class="archive-value">5</span>
      <h3>Core detection classes</h3>
      <p>Anomalies, disparities, procedural irregularities, reversal trends, and actor-level outlier conduct.</p>
    </article>
    <article class="archive-index-card">
      <p class="archive-chip">Layers</p>
      <span class="archive-value">4</span>
      <h3>Aggregation environments</h3>
      <p>Individual, court, county, and statewide views designed to preserve traceability while widening context.</p>
    </article>
    <article class="archive-index-card">
      <p class="archive-chip">Coverage</p>
      <span class="archive-value">{{ site.data.bias-beacon.oregon-judicial-data.metadata.total_cases_analyzed | divided_by: 1000 }}k</span>
      <h3>Records already normalized</h3>
      <p>{{ site.data.bias-beacon.oregon-judicial-data.metadata.data_period }} across {{ site.data.bias-beacon.oregon-judicial-data.metadata.total_counties }} counties and {{ site.data.bias-beacon.oregon-judicial-data.metadata.total_judges }} tracked judges.</p>
    </article>
  </div>
</section>

## What Bias Beacon Does

<div class="tracking-metrics">
  <div class="archive-index-card">
    <p class="archive-chip">01</p>
    <h3>Reads intake against outcome</h3>
    <p>Lets stop, arrest, charging, conviction, reversal, and supervision signals sit in sequence instead of in separate silos.</p>
  </div>

  <div class="archive-index-card">
    <p class="archive-chip">02</p>
    <h3>Preserves difference without forcing a story</h3>
    <p>Shows where counties or actors move together and where they separate without pretending every divergence has the same cause.</p>
  </div>

  <div class="archive-index-card">
    <p class="archive-chip">03</p>
    <h3>Surfaces pressure points</h3>
    <p>Highlights the places where public systems tighten: searches, charges, sentencing, reversals, and revocations.</p>
  </div>

  <div class="archive-index-card">
    <p class="archive-chip">04</p>
    <h3>Connects upstream and downstream layers</h3>
    <p>Makes it easier to notice when later outcomes do not square with the shape of the earlier intake record.</p>
  </div>

  <div class="archive-index-card">
    <p class="archive-chip">05</p>
    <h3>Builds actor-level comparison</h3>
    <p>Every page can be filtered, compared, and opened deeper so the archive remains useful instead of ornamental.</p>
  </div>

  <div class="archive-index-card">
    <p class="archive-chip">06</p>
    <h3>Keeps the record scalable</h3>
    <p>Each pattern stays readable at the person, office, county, and statewide level without losing the trace back to the source layer.</p>
  </div>
</div>

## Analytical Environments

<div class="tracking-metrics">
  <div class="archive-index-card">
    <h3>Judges</h3>
    <p>Sentencing deviations, appellate reversals, suppression rulings, bail decisions, and demographic disparities.</p>
  </div>

  <div class="archive-index-card">
    <h3>Prosecutors</h3>
    <p>Charge stacking frequency, plea bargaining patterns, dismissal rates, recommendation drift, and asymmetry.</p>
  </div>

  <div class="archive-index-card">
    <h3>Probation / Parole</h3>
    <p>Violation filings, revocation rates, enforcement patterns, and the distinction between technical and substantive conduct.</p>
  </div>

  <div class="archive-index-card">
    <h3>Law Enforcement</h3>
    <p>STOP-related disparities, arrest-to-charge patterns, suppression exposure, complaints, and force-adjacent indicators.</p>
  </div>
</div>

## What System View Compares

<div class="tracking-metrics">
  <div class="archive-index-card">
    <h3>Street intake against courtroom outcome</h3>
    <p>Read stop, search, and arrest pressure beside conviction, sentencing, and reversal patterns without assuming the same explanation in every county.</p>
  </div>

  <div class="archive-index-card">
    <h3>Office behavior against judicial behavior</h3>
    <p>Notice where charging intensity and courtroom outcomes appear to move together, and where they do not, so the next question is earned by the record.</p>
  </div>

  <div class="archive-index-card">
    <h3>County environment against statewide drift</h3>
    <p>Compare each local system to the statewide distribution so the archive can show whether a signal is isolated, regional, or systemic.</p>
  </div>
</div>

## System Logic

<div class="archive-shell">
  <div class="evidence-chain">
    <article class="chain-step">
      <p class="archive-chip">Ingest</p>
      <p>Collect Oregon dashboards, court materials, opinions, and other public records.</p>
    </article>
    <div class="chain-arrow" aria-hidden="true">-&gt;</div>
    <article class="chain-step">
      <p class="archive-chip">Normalize</p>
      <p>Standardize county, court, actor, date, source, metric type, metric value, and coverage note.</p>
    </article>
    <div class="chain-arrow" aria-hidden="true">-&gt;</div>
    <article class="chain-step">
      <p class="archive-chip">Compare</p>
      <p>Measure behavior against peers, local baselines, and statewide distributions.</p>
    </article>
    <div class="chain-arrow" aria-hidden="true">-&gt;</div>
    <article class="chain-step">
      <p class="archive-chip">Publish</p>
      <p>Expose patterns as evidence surfaces, profiles, reports, and accountability records.</p>
    </article>
  </div>
</div>

## Entry Points

<div class="cta-section">
  <div class="archive-index-card">
    <h3><a href="/bias-beacon/judges/">Judge Profiles</a></h3>
    <p>Actor-level dossiers with score snapshots, reversal history, disparity markers, and accountability flags.</p>
  </div>

  <div class="archive-index-card">
    <h3><a href="/bias-beacon/counties/">County Comparisons</a></h3>
    <p>Regional views that show where local enforcement culture and sentencing conditions diverge materially.</p>
  </div>

  <div class="archive-index-card">
    <h3><a href="/bias-beacon/dashboard/">System Dashboard</a></h3>
    <p>Comparative statewide monitoring for high-level patterns, current signals, and data coverage direction.</p>
  </div>
</div>

## Available Oregon Datasets

These are the actual source environments currently represented in the repo's data layer.

{% for source in site.data.bias-beacon.oregon-judicial-data.metadata.data_sources %}
- {{ source }}
{% endfor %}

{% for source in site.data.bias-beacon.live-oregon-data.data_sources.primary %}
- {{ source.name }}: {{ source.type | replace: "_", " " }}, {{ source.update_frequency }} cadence
{% endfor %}

## Record Foundation

The first normalized dataset should privilege traceability over fake completeness.

- County
- Court
- Actor name
- Role
- Date
- Source
- Metric type
- Metric value
- Confidence / coverage note

## Coverage Note

Current statewide STOP summary in the repo covers {{ site.data.bias-beacon.live-oregon-data.oregon_stop_data.statewide_summary.total_stops_2024 | number_with_delimiter }} stops across {{ site.data.bias-beacon.live-oregon-data.oregon_stop_data.statewide_summary.reporting_agencies }} reporting agencies and {{ site.data.bias-beacon.live-oregon-data.oregon_stop_data.statewide_summary.counties_covered }} counties. Judicial coverage currently spans {{ site.data.bias-beacon.oregon-judicial-data.metadata.total_cases_analyzed | number_with_delimiter }} analyzed cases.

## Notice

Bias Beacon is designed to support evidence-based scrutiny of institutional behavior. Findings are strongest when tied to primary records, transparent methodology, and comparative context rather than isolated anecdotes.
