---
layout: page
title: Posts
permalink: /posts/
---

# Latest Posts

Stay informed with our latest findings, updates, and analysis.

{% if site.posts.size > 0 %}
<div class="posts-list">
  {% for post in site.posts %}
  <article class="post-item">
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p class="post-meta">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
      {% if post.author %} • {{ post.author }}{% endif %}
      {% if post.categories.size > 0 %} • {% for category in post.categories %}{{ category }}{% unless forloop.last %}, {% endunless %}{% endfor %}{% endif %}
    </p>
    {% if post.excerpt %}
    <div class="post-excerpt">
      {{ post.excerpt }}
    </div>
    {% endif %}
    <p><a href="{{ post.url | relative_url }}">Read more →</a></p>
  </article>
  {% endfor %}
</div>
{% else %}
<p>Posts will appear here as they are published. Check back soon for updates and analysis.</p>
{% endif %}

---

## Categories

Our posts cover various aspects of public accountability:

- **Investigations**: Updates on ongoing investigative work
- **Analysis**: In-depth analysis of public policy and institutional practices  
- **News**: Breaking news and developments related to our work
- **Resources**: Tools and information for citizen engagement
- **Updates**: General project updates and announcements