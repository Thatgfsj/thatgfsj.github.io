---
layout: page
title: 我的世界
description: Thatgfsj-minecraft 组织下的 4 个自研仓库：3 个 Fabric 模组 + 1 个 AI agent 技能包。
kicker: GAME / MINECRAFT
prose: false
permalink: /games/minecraft/
---

<p class="page-note">只收录自研仓库 · 数据截至 2026-10-23</p>

<div class="game-readouts">
  <div>
    <span class="game-readouts__value">{{ site.data.minecraft_repos.size }}</span>
    <span class="game-readouts__label">REPOS / 自研仓库</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.minecraft_repos | where: 'type', 'MOD' | size }}</span>
    <span class="game-readouts__label">MODS / Fabric 模组</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.minecraft_repos | where: 'type', 'SKILL' | size }}</span>
    <span class="game-readouts__label">SKILL / Agent 技能</span>
  </div>
  <div>
    <span class="game-readouts__value">GPL-3.0</span>
    <span class="game-readouts__label">LICENSE / 代码许可</span>
  </div>
</div>

<div class="repo-grid">
  {% for r in site.data.minecraft_repos %}
  <article class="repo-card">
    <div class="repo-card__top">
      <span class="repo-card__type">{{ r.type }}</span>
      <a class="repo-card__ext" href="{{ r.url }}" target="_blank" rel="noopener">GITHUB ↗</a>
    </div>
    <h2 class="repo-card__name"><a href="{{ r.url }}" target="_blank" rel="noopener">{{ r.name }}</a></h2>
    <p class="repo-card__meta">{{ r.lang }} · {{ r.platform }} · {{ r.version }} · {{ r.license }}</p>
    <p class="repo-card__desc">{{ r.desc }}</p>
    <ul class="repo-card__features">
      {% for f in r.features %}<li>{{ f }}</li>{% endfor %}
    </ul>
    <div class="repo-card__actions">
      <a href="{{ r.releases }}" target="_blank" rel="noopener">Release {{ r.version }} ↗</a>
      <span>UPDATED {{ r.updated }}</span>
    </div>
  </article>
  {% endfor %}
</div>

<p class="game-note">组织：<a href="https://github.com/Thatgfsj-minecraft" target="_blank" rel="noopener">Thatgfsj-minecraft</a> · 全部仓库开源 · 数据按 GitHub 当前状态整理。</p>
<p class="post-back"><a href="{{ '/games/' | relative_url }}">← 返回游戏</a></p>
