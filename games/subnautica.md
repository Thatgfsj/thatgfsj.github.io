---
layout: page
title: 深海迷航
description: 4546B 的海洋生存记录：1:1 地图与 5 个本地存档。
kicker: GAME / SUBNAUTICA
prose: false
permalink: /games/subnautica/
---

<p class="page-note">PC · STEAM · 4546B · 深海迷航（2018）· 地图与存档均为本地数据</p>

<figure class="map-frame">
  <img src="{{ site.data.subnautica.map | relative_url }}" alt="{{ site.data.subnautica.map_alt }}" width="1800" height="1800" loading="lazy">
  <figcaption class="map-credit">
    {{ site.data.subnautica.map_credit }}
    {% if site.data.subnautica.map_source_url %}<a href="{{ site.data.subnautica.map_source_url }}" target="_blank" rel="noopener">原始来源 ↗</a>{% endif %}
  </figcaption>
</figure>

<div class="game-readouts">
  <div>
    <span class="game-readouts__value">{{ site.data.subnautica_saves.size | default: 5 }}</span>
    <span class="game-readouts__label">SAVES / 本地存档</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.subnautica.playtime }}</span>
    <span class="game-readouts__label">PLAYTIME / 小时</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.subnautica.modes }}</span>
    <span class="game-readouts__label">MODES / 生存 + 创造</span>
  </div>
  <div>
    <span class="game-readouts__value">4546B</span>
    <span class="game-readouts__label">PLANET / 星球编号</span>
  </div>
</div>

<h2 class="game-section-title">存档记录</h2>
{% if site.data.subnautica_saves %}
<table class="game-table">
  <thead>
    <tr><th>SLOT</th><th>MODE</th><th>PLAYTIME</th><th>进度</th><th>保存于</th></tr>
  </thead>
  <tbody>
    {% for s in site.data.subnautica_saves %}
    <tr>
      <td>{{ s.slot }}</td>
      <td>{{ s.mode }}</td>
      <td>{% if s.hours < 0.01 %}< 0.01{% else %}{{ s.hours }}{% endif %} h</td>
      <td>{{ s.progress }}</td>
      <td>{{ s.saved }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
{% else %}
<p class="game-note">存档数据整理中。</p>
{% endif %}

<h2 class="game-section-title">关于这张地图</h2>
<p class="game-body-text">地图是 KT411 的 2024 中文全标注版，经自己写的 Subnautica SNMap 小地图插件收录。它是 1:1 方图，四周标注了 ±2000 的世界坐标；站内保留完整方形，方便按区域查看。地图版权归原作者所有，这里仅作非商业展示。</p>
<p class="game-note">插件：subnautica-snmap v2.7（C#，MIT）· 图层目录：maps/01_主地图-2024.png · 地图作者：KT411</p>

<p class="post-back"><a href="{{ '/games/' | relative_url }}">← 返回游戏</a></p>
