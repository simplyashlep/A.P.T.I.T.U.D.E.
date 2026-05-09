---
layout: page
title: Investigations
permalink: /investigations/
---

# Active Investigations

Our ongoing investigative work into matters of public interest.

{% if site.investigations.size > 0 %}
<div class="investigations-list">
  {% for investigation in site.investigations %}
  <div class="investigation-item">
    <h3><a href="{{ investigation.url | relative_url }}">{{ investigation.title }}</a></h3>
    <p class="investigation-meta">
      {% if investigation.status %}<span class="status status-{{ investigation.status | downcase }}">{{ investigation.status }}</span>{% endif %}
      {% if investigation.date %}<span class="date">Started: {{ investigation.date | date: "%B %Y" }}</span>{% endif %}
    </p>
    {% if investigation.excerpt %}
    <p class="investigation-excerpt">{{ investigation.excerpt }}</p>
    {% endif %}
  </div>
  {% endfor %}
</div>
{% else %}
<p>Information about ongoing investigations will be published here as appropriate, balancing transparency with the need to protect the integrity of our investigative work.</p>
{% endif %}

---

## How We Investigate

Our investigative process follows rigorous standards:

### 1. Initial Assessment
Every tip or lead is carefully evaluated to determine its credibility and public interest value.

### 2. Research & Verification
We use multiple sources and methods to verify information, including:
- Public records requests
- Document analysis
- Expert consultation
- Data analysis

### 3. Fact-Checking
All findings are thoroughly fact-checked and cross-verified before publication.

### 4. Legal Review
Complex investigations may undergo legal review to ensure compliance with applicable laws and ethical standards.

---

## Submit a Tip

If you have information about matters of public concern, we want to hear from you. All communications are treated confidentially.

**Contact Methods:**
- Email: [tips@example.com](mailto:tips@example.com)
- Secure messaging: [Instructions for secure communication]

**What to Include:**
- Detailed description of the issue
- Any supporting documents or evidence
- Contact information (optional but helpful)

*Note: We cannot guarantee that every tip will result in a full investigation, but all credible information is carefully reviewed.*