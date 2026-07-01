---
layout: default
title: 项目
---

<section class="section-block" style="padding-top: 32px;">
  <div class="wrapper">
    <div class="section-header">
      <div class="section-icon">🚀</div>
      <h2 class="section-title">开源项目</h2>
      <p class="section-subtitle">精选开源项目 · 点击卡片查看源码</p>
    </div>

    <div class="project-grid">
      {% for p in site.data.projects %}
      <a href="{{ p.url }}" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
        <div class="project-name"><i class="fas fa-folder"></i> {{ p.name }}</div>
        <div class="project-desc">{{ p.desc_full }}</div>
        <div class="project-meta">
          <span class="lang"><span class="lang-dot" style="background:{{ p.lang_color }}"></span> {{ p.lang }}</span>
          <span class="stars"><i class="far fa-star"></i> {{ p.stars }}</span>
        </div>
      </a>
      {% endfor %}
    </div>
  </div>
</section>