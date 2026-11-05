---
layout: page
title: SKY
description: 游戏关卡回放：UE4 关卡解析成 three.js 单文件场景，直接在浏览器里逛。第一关「火试炼」。
kicker: GAME / SKY
prose: false
permalink: /games/sky/
---

<style>
  /* SKY 分区内联样式：只在关卡回放页使用，避免改动全站样式表 */
  .sky-player {
    margin: 18px 0 6px;
  }

  .sky-player iframe {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 2px solid var(--line);
    box-shadow: 6px 6px 0 var(--shadow);
    background: #120d0b;
  }

  .sky-player__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px 16px;
    margin-top: 9px;
    font-family: var(--font-mono);
    font-size: 9.5px;
    color: var(--ink-3);
  }

  .sky-player__acts {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .sky-player__acts button {
    font: inherit;
    padding: 3px 10px;
    color: var(--ink-2);
    background: var(--paper-2);
    border: 1px solid var(--line-soft);
    cursor: pointer;
  }

  .sky-player__acts button:hover {
    color: var(--ink);
    border-color: var(--line);
  }

  .sky-player__acts a {
    color: var(--accent);
    text-decoration: none;
  }

  .sky-player__acts a:hover {
    text-decoration: underline;
  }
</style>

<p class="page-note">关卡回放 · 共 {{ site.data.sky_levels.size }} 个 · 数据截至 {{ site.data.sky_levels[0].updated }}</p>

<div class="game-readouts">
  <div>
    <span class="game-readouts__value">{{ site.data.sky_levels.size }}</span>
    <span class="game-readouts__label">LEVELS / 3D 关卡</span>
  </div>
  <div>
    <span class="game-readouts__value">UE4</span>
    <span class="game-readouts__label">SOURCE / 4.25.4 关卡</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.sky_levels[0].triangles }}</span>
    <span class="game-readouts__label">TRIANGLES / 地形面数</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.sky_levels[0].sprites }}</span>
    <span class="game-readouts__label">CANDLES / 烛火精灵</span>
  </div>
</div>

<p class="game-body-text">把游戏关卡搬进浏览器：UE4 关卡二进制解析成 three.js 场景，压成单个 HTML 文件，没有外部依赖。下面嵌的是<strong>自动巡游</strong>演示；想自己走，点「单独打开」进入<strong>自由移动</strong>。</p>

{% for l in site.data.sky_levels %}
<h2 class="game-section-title">{{ l.title }} <span class="game-note">{{ l.en }}</span></h2>

<div class="sky-player">
  <iframe id="sky-{{ l.id }}" src="{{ l.file | relative_url }}?t=8" title="{{ l.title }} 3D 场景" allow="fullscreen" allowfullscreen></iframe>
  <div class="sky-player__bar">
    <span>{{ l.source }} · {{ l.engine }} · {{ l.triangles }} 三角形 · {{ l.instances }} 实例 · {{ l.sprites }} 烛火</span>
    <span class="sky-player__acts">
      <button type="button" data-sky-fullscreen="sky-{{ l.id }}">全屏</button>
      <a href="{{ l.file | relative_url }}" target="_blank" rel="noopener">单独打开 ↗</a>
    </span>
  </div>
</div>

<p class="game-body-text">{{ l.desc }}</p>

<ul class="repo-card__features repo-card__features--wide">
  {% for f in l.features %}<li>{{ f }}</li>{% endfor %}
</ul>

<ul class="chips layer-chips">
  {% for c in l.controls %}<li class="chip">{{ c }}</li>{% endfor %}
</ul>
{% endfor %}

<p class="game-note">场景为 UE4 关卡「{{ site.data.sky_levels[0].source }}」解析后的网页回放，不含游戏本体；点一下画面再操作，键盘指令才会生效。</p>

<p class="post-back"><a href="{{ '/games/' | relative_url }}">← 返回游戏</a></p>

<script>
  document.querySelectorAll('[data-sky-fullscreen]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = document.getElementById(btn.getAttribute('data-sky-fullscreen'));
      if (!frame) return;
      var request = frame.requestFullscreen || frame.webkitRequestFullscreen || frame.msRequestFullscreen;
      if (request) request.call(frame);
    });
  });
</script>
