---
layout: page
title: 博客
description: 技术笔记与踩坑记录。抓过的包、修过的 bug、写过的工具，尽量整理成别人也能复用的样子。
kicker: NOTES.DIR
prose: false
permalink: /blog/
---

<p class="page-note">{{ site.posts.size }} 篇文章 · 按时间倒序 · 更新于 {{ site.time | date: '%Y.%m' }}</p>

<div class="post-list">
  {% for post in site.posts %}
  <a class="post-row" href="{{ post.url | relative_url }}">
    <time class="post-row__date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time>
    <span class="post-row__body">
      <span class="post-row__title">{{ post.title }}</span>
      <span class="post-row__desc">{{ post.description | default: post.excerpt | strip_html | truncate: 130 }}</span>
      {% if post.tags %}
      <span class="post-row__tags">
        {% for tag in post.tags %}<span class="tag">{{ tag }}</span>{% endfor %}
      </span>
      {% endif %}
    </span>
    <span class="post-row__arrow" aria-hidden="true">→</span>
  </a>
  {% endfor %}
</div>
