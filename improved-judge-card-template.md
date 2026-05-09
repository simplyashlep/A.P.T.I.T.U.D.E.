{% assign judge_directory = site.data.bias-beacon.judges-directory.judges %}
{% for judge_data in judge_directory %}
  {% assign score = judge_data.score %}
  {% assign score_display = score | default: 'Pending' %}
  
  {% assign accent = '#6B7280' %}
  {% assign accent_text = '#FFFFFF' %}
  {% if judge_data.riskLevel == 'critical' %}
    {% assign accent = '#7C3AED' %}
  {% elsif judge_data.riskLevel == 'high' %}
    {% assign accent = '#EF4444' %}
  {% elsif judge_data.riskLevel == 'moderate' %}
    {% assign accent = '#6B7280' %}
  {% elsif judge_data.riskLevel == 'low' %}
    {% assign accent = '#3B82F6' %}
  {% elsif judge_data.riskLevel == 'excellent' %}
    {% assign accent = '#10B981' %}
    {% assign accent_text = '#0C1218' %}
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
           data-focus="{{ judge_data.focus }}"
           data-actor-type="judge"
           data-official-role="{{ judge_data.roleTitle }}"
           data-official-district="{{ judge_data.district }}"
           data-photo-url="{{ judge_data.officialPhotoUrl }}"
           data-bio-url="{{ judge_data.bioUrl }}"
           data-term-expires="{{ judge_data.termExpiresDisplay }}"
           data-metrics-verified="{{ judge_data.metricsVerified }}">
    
    <div class="flip-card-inner">
      
      <!-- SIMPLIFIED FRONT CARD -->
      <div class="flip-card-front">
        <!-- Compare toggle -->
        <div class="compare-toggle">
          <input type="checkbox" class="compare-checkbox" id="compare-{{ judge_data.id }}" data-compare-toggle value="{{ judge_data.id }}">
          <label for="compare-{{ judge_data.id }}" class="compare-label"></label>
        </div>
        
        <div class="card-front-simplified">
          <!-- Judge name -->
          <h2 class="judge-front-name">{{ judge_data.name }}</h2>
          
          <!-- County -->
          <div class="judge-front-county">{{ judge_data.county }}{% unless judge_data.county == 'Statewide' %} County{% endunless %}</div>
          
          <!-- Single most important metric -->
          <div class="front-score-circle" style="background: {{ accent }}; color: {{ accent_text }}">
            <span class="front-score-value">{{ score_display }}</span>
          </div>
          
          <!-- Score label -->
          <div class="front-score-label">{{ judge_data.scoreLabel }}</div>
          
          <!-- Hover hint -->
          <div class="front-hover-hint">Flip for details</div>
        </div>
      </div>
      
      <!-- BACK CARD -->
      <div class="flip-card-back">
        <!-- Compare toggle -->
        <div class="compare-toggle">
          <input type="checkbox" class="compare-checkbox" id="compare-back-{{ judge_data.id }}" data-compare-toggle value="{{ judge_data.id }}">
          <label for="compare-back-{{ judge_data.id }}" class="compare-label"></label>
        </div>
        
        <div class="card-back-header">
          <h3 class="card-back-name">{{ judge_data.name }}</h3>
          <p class="card-back-subtitle">{{ judge_data.county }}{% unless judge_data.county == 'Statewide' %} County{% endunless %} | {{ judge_data.roleTitle }}</p>
          
          <!-- Judge photo -->
          <div class="judge-photo-container">
            {% if judge_data.officialPhotoUrl %}
              <img src="{{ judge_data.officialPhotoUrl }}" alt="{{ judge_data.name }}" class="judge-photo" loading="lazy">
            {% else %}
              <div class="photo-placeholder">
                Photo from Oregon Blue Book pending upload
              </div>
            {% endif %}
          </div>
        </div>
        
        <!-- Profile metrics -->
        <div class="metric-section">
          <h4 class="metric-section-title">Profile</h4>
          <div class="metric-grid">
            <div class="metric-item">
              <span class="metric-label">Bench Term</span>
              <span class="metric-value">{{ judge_data.termExpiresDisplay | default: 'Unknown' }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Tenure</span>
              <span class="metric-value">{{ judge_data.tenureDisplay }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Focus</span>
              <span class="metric-value">{{ judge_data.focus }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Caseload</span>
              <span class="metric-value">{{ judge_data.caseload2024 | default: 'Pending' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Bias metrics -->
        <div class="metric-section">
          <h4 class="metric-section-title">Bias Metrics</h4>
          <div class="metric-grid">
            <div class="metric-item">
              <span class="metric-label">Prison Usage</span>
              <span class="metric-value">{% if judge_data.prisonUsage %}{{ judge_data.prisonUsage }}%{% else %}Pending{% endif %}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Counsel Disparity</span>
              <span class="metric-value">{{ judge_data.counselDisparity | default: 'Pending' }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Reversal Rate</span>
              <span class="metric-value">{% if judge_data.reversalRate %}{{ judge_data.reversalRate }}%{% else %}Pending{% endif %}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Racial Disparity</span>
              <span class="metric-value">{{ judge_data.racialDisparity | default: 'Pending' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="card-actions">
          <button class="btn-profile" data-profile-trigger>Full Profile</button>
          <button class="btn-compare">Add to Compare</button>
        </div>
      </div>
    </div>
  </article>
{% endfor %}