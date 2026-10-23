---
layout: default
title: 游戏
description: 玩过的、改过的、自己做的东西：我的世界模组、深海迷航地图与自创作品。
permalink: /games/
---

<section class="games-hero">
  <div class="shell">
    <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>GAME LIBRARY · {{ site.data.games.size }} ENTRIES</p>
    <h1 class="games-hero__title">游戏</h1>
    <p class="games-hero__lede">玩过的、改过的、自己做的东西。每个板块点进去，是一份可以翻的记录。</p>
    <p class="games-hero__meta">
      <span>MINECRAFT MODS</span>
      <span aria-hidden="true">/</span>
      <span>SUBNautICA 4546B</span>
      <span aria-hidden="true">/</span>
      <span>ORIGINAL WORKS</span>
    </p>
  </div>
</section>

<div class="shell games-list">
  {% for g in site.data.games %}
  <article class="game-panel">
    <div class="panel">
      <div class="panel__bar">
        <span class="panel__path">~/games/{{ g.id }}</span>
        <span class="panel__meta">{{ g.platform }}</span>
      </div>
      <div class="game-panel__body">
        <div class="game-cover{% if g.poster %} game-cover--poster{% endif %}{% if g.fit == 'contain' %} game-cover--contain{% endif %}">
          {% if g.poster %}
          <div class="game-poster" aria-hidden="true">
            <span class="game-poster__stamp">{{ g.poster_stamp | default: 'NO IMAGES YET' }}</span>
            <span class="game-poster__cn">{{ g.poster_cn | default: '自创' }}</span>
            <span class="game-poster__en">{{ g.poster_en | default: 'ORIGINAL<br>WORKS' }}</span>
            <span class="game-poster__rule"></span>
            <span class="game-poster__note">{{ g.poster_note | default: '排版预览' }}</span>
          </div>
          {% else %}
          <img src="{{ g.cover | relative_url }}" alt="{{ g.cover_alt }}" loading="lazy">
          {% endif %}
          <a class="game-cover__link" href="{{ g.href | relative_url }}" aria-label="进入 {{ g.title }}"><span class="sr-only">进入 {{ g.title }}</span></a>
          {% unless g.poster %}<span class="game-cover__status" aria-hidden="true"><span class="status-dot" aria-hidden="true"></span>{{ g.status }}</span>{% endunless %}
          {% if g.cover_credit %}<span class="game-cover__credit" aria-hidden="true">{{ g.cover_credit }}</span>{% endif %}
          <span class="game-cover__enter" aria-hidden="true">ENTER ↗</span>
        </div>

        <div class="game-info">
          <p class="eyebrow">{{ g.kicker }}</p>
          <h2 class="game-info__title">{{ g.title }}</h2>
          <p class="game-info__en">{{ g.en }}</p>
          <p class="game-info__summary">{{ g.summary }}</p>
          <dl class="game-stats">
            {% for s in g.stats %}
            <div>
              <dt>{{ s.label }}</dt>
              <dd>{{ s.value }}<small>{{ s.note }}</small></dd>
            </div>
            {% endfor %}
          </dl>
          <div class="game-info__actions">
            <a class="btn btn--primary" href="{{ g.href | relative_url }}">{{ g.link_label }} <span class="btn__arrow" aria-hidden="true">→</span></a>
            <span class="game-info__updated">UPDATED {{ g.updated }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
  {% endfor %}
  <p class="games-more">更多板块陆续添加中……</p>
</div>
