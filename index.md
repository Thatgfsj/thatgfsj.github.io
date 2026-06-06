---
layout: default
title: "首页"
---

<section class="hero">
  <div class="hero-avatar">
    <img src="https://github.com/{{ site.github_username }}.png" alt="{{ site.author }}">
  </div>
  <h1>{{ site.tagline }}</h1>
  <p>{{ site.description }}</p>
</section>

<section class="post-list">
  <h2>最新文章</h2>
  {% for post in site.posts %}
    <article class="post-item">
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <div class="post-meta">
        <time datetime="{{ post.date | date_to_xmlschema }}">
          {{ post.date | date: "%Y-%m-%d" }}
        </time>
        {% if post.tags %}
          <span class="tags">
            {% for tag in post.tags %}
              <span class="tag">{{ tag }}</span>
            {% endfor %}
          </span>
        {% endif %}
      </div>
      <p class="post-excerpt">
        {{ post.excerpt | strip_html | truncate: 200 }}
      </p>
      <a class="read-more" href="{{ post.url | relative_url }}">阅读全文 →</a>
    </article>
  {% endfor %}
</section>
