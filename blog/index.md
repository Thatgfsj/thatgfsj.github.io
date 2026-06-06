---
layout: default
title: 博客
---

<div class="wrapper">
  <div class="blog-page-header">
    <h1><i class="fas fa-pen-fancy" style="color: var(--primary); margin-right: 10px;"></i> 博客</h1>
    <p style="color: var(--text-light);">记录思考，分享知识，留下足迹</p>
  </div>

  <div class="blog-list">
    {% for post in site.posts %}
    <div class="blog-list-item">
      <div class="blog-list-meta">
        <i class="far fa-calendar-alt"></i> {{ post.date | date: "%Y 年 %m 月 %d 日" }}
        {% if post.tags %}
          <span style="margin-left: 12px;">
            {% for tag in post.tags %}
              <span class="tag">{{ tag }}</span>
            {% endfor %}
          </span>
        {% endif %}
      </div>
      <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <p class="blog-list-excerpt">{{ post.excerpt | strip_html | truncate: 200 }}</p>
    </div>
    {% endfor %}
  </div>
</div>
