---
layout: page
title: 项目
description: 全部开源项目，按最近折腾的顺序排列。点击任意条目进入 GitHub 仓库。
kicker: PROJECTS.DIR
prose: false
permalink: /projects/
---

<p class="page-note">{{ site.data.projects.size }} 个公开项目 · 数据截至 {{ site.data.stats.updated }}</p>

<div class="file-list">
  <div class="file-list__head" aria-hidden="true">
    <span>#</span><span>名称 / 描述</span><span>语言</span><span>★</span><span></span>
  </div>
  {% for p in site.data.projects %}
  <a class="file-row" href="{{ p.url }}" target="_blank" rel="noopener">
    <span class="file-row__idx">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
    <span class="file-row__main">
      <span class="file-row__name">{{ p.name }}</span>
      <span class="file-row__desc">{{ p.desc_full | default: p.desc }}</span>
    </span>
    <span class="file-row__meta">
      <span class="file-row__lang">{{ p.lang }}</span>
      <span class="file-row__stars">{% if p.stars > 0 %}★ {{ p.stars }}{% else %}—{% endif %}</span>
    </span>
    <span class="file-row__arrow" aria-hidden="true">↗</span>
  </a>
  {% endfor %}
</div>

<p class="section-more"><a href="https://github.com/{{ site.github_username }}?tab=repositories" target="_blank" rel="noopener">在 GitHub 查看全部仓库 ↗</a></p>
