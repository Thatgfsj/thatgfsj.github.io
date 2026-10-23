---
layout: page
title: 我的世界
description: 本机 HMCL · Fabulously Optimized · Minecraft 1.21.11 / Fabric，86 个 jar、去重后 85 个模组，按用途整理。
kicker: GAME / MINECRAFT
prose: false
permalink: /games/minecraft/
---

<p class="page-note">本机安装 · FABRIC 1.21.11 · FABULOUSLY OPTIMIZED · 86 个 jar / 85 个模组（1 个旧版本残留）</p>

<div class="game-readouts">
  <div>
    <span class="game-readouts__value">{{ site.data.minecraft_mods.size | default: 85 }}</span>
    <span class="game-readouts__label">MODS / 已装模组</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.minecraft_categories.size | default: 10 }}</span>
    <span class="game-readouts__label">CATEGORIES / 分类</span>
  </div>
  <div>
    <span class="game-readouts__value">1.21.11</span>
    <span class="game-readouts__label">MINECRAFT / 版本</span>
  </div>
  <div>
    <span class="game-readouts__value">FABRIC</span>
    <span class="game-readouts__label">LOADER / 加载器</span>
  </div>
</div>

<nav class="game-toc" aria-label="模组分类">
  {% for cat in site.data.minecraft_categories %}
  {% assign cat_mods = site.data.minecraft_mods | where: 'category_id', cat.id %}
  <a href="#cat-{{ cat.id }}">{{ cat.name }}<span>{{ cat_mods.size }}</span></a>
  {% endfor %}
</nav>

{% for cat in site.data.minecraft_categories %}
{% assign cat_mods = site.data.minecraft_mods | where: 'category_id', cat.id | sort: 'name' %}
<section class="mod-section" id="cat-{{ cat.id }}">
  <header class="mod-section__head">
    <h2>{{ cat.name }}</h2>
    <p>{{ cat.desc }}</p>
  </header>
  <div class="mod-grid">
    {% for m in cat_mods %}
    <article class="mod-card">
      <div class="mod-card__head">
        {% if m.icon %}
        <img class="mod-card__icon" src="{{ m.icon | relative_url }}" alt="" width="32" height="32" loading="lazy">
        {% else %}
        <span class="mod-card__icon mod-card__icon--fallback" aria-hidden="true">{{ m.name | slice: 0 }}</span>
        {% endif %}
        <div class="mod-card__identity">
          <h3 class="mod-card__name">{{ m.name }}</h3>
          <p class="mod-card__meta">{{ m.version }}{% if m.authors %} · {{ m.authors }}{% endif %}</p>
        </div>
      </div>
      {% if m.desc %}<p class="mod-card__desc">{{ m.desc }}</p>{% endif %}
      {% if m.homepage %}<a class="mod-card__link" href="{{ m.homepage }}" target="_blank" rel="noopener">主页 ↗</a>{% endif %}
    </article>
    {% endfor %}
  </div>
</section>
{% endfor %}

<p class="post-back"><a href="{{ '/games/' | relative_url }}">← 返回游戏</a></p>
