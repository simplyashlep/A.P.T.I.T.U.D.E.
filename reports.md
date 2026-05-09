---
layout: page
title: Reports
permalink: /reports/
---

# Reports

Our comprehensive reports provide in-depth analysis and documentation of public institutions and processes.

{% if site.reports.size > 0 %}
<div class="reports-list">
  {% for report in site.reports %}
  <div class="report-item">
    <h3><a href="{{ report.url | relative_url }}">{{ report.title }}</a></h3>
    <p class="report-meta">
      {% if report.date %}<span class="date">{{ report.date | date: "%B %d, %Y" }}</span>{% endif %}
      {% if report.category %}<span class="category">{{ report.category }}</span>{% endif %}
    </p>
    {% if report.excerpt %}
    <p class="report-excerpt">{{ report.excerpt }}</p>
    {% endif %}
  </div>
  {% endfor %}
</div>
{% else %}
<p>Reports will be published here as they become available. Check back soon for our latest findings and analysis.</p>
{% endif %}

---

## About Our Reports

Our reports are the result of thorough investigation and analysis. Each report includes:

- **Executive Summary**: Key findings and recommendations
- **Methodology**: How the investigation was conducted
- **Evidence**: Supporting documentation and data
- **Analysis**: What the findings mean for the public
- **Recommendations**: Suggested actions or policy changes

All reports are fact-checked and reviewed before publication to ensure accuracy and reliability.