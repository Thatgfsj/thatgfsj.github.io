---
layout: page
title: 自创作品
description: 自己写的游戏与应用仓库：象棋、塔罗、易经、快递管理、电视直播。当前为无图版式预览。
kicker: GAME / ORIGINAL WORKS
prose: false
permalink: /games/original/
---

<p class="page-note">无图版式预览 · 只收录自研仓库 · 共 {{ site.data.original_works.size }} 项（含 1 个占位）</p>

<div class="game-poster game-poster--banner" aria-hidden="true">
  <span class="game-poster__stamp">NO IMAGES YET</span>
  <span class="game-poster__cn">自创</span>
  <span class="game-poster__en">ORIGINAL<br>WORKS</span>
  <span class="game-poster__rule"></span>
  <span class="game-poster__note">先把结构做出来，图之后再补</span>
</div>

<p class="game-body-text">这里是自己写的游戏与应用仓库。第一版只做文字索引：仓库、类型、状态和一句话说明；等截图和演示准备好，再把视觉补上。</p>

<div class="works-list">
  {% for w in site.data.original_works %}
  <article class="work-item{% if w.status == 'SOON' %} work-item--soon{% endif %}">
    <span class="work-item__idx">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
    <div class="work-item__body">
      <div class="work-item__top">
        <h2 class="work-item__title">{{ w.title }}</h2>
        <span class="badge{% if w.status == 'RELEASED' %} badge--ok{% endif %}">{{ w.status }}</span>
      </div>
      <p class="work-item__meta">{{ w.type }}{% if w.note %} · {{ w.note }}{% endif %}</p>
      <p class="work-item__desc">{{ w.desc }}</p>
    </div>
    <span class="work-item__arrow">
      {% if w.href %}<a href="{{ w.href }}" target="_blank" rel="noopener" aria-label="打开 {{ w.title }}">↗</a>{% else %}<span aria-hidden="true">—</span>{% endif %}
    </span>
  </article>
  {% endfor %}
</div>

<p class="post-back"><a href="{{ '/games/' | relative_url }}">← 返回游戏</a></p>
