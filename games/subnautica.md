---
layout: page
title: 深海迷航
description: 自研 Subnautica SNMap 小地图插件仓库，以及从仓库 maps/ 提取的 1:1 中文地图。
kicker: GAME / SUBNAUTICA
prose: false
permalink: /games/subnautica/
---

<p class="page-note">仓库：<a href="{{ site.data.subnautica.repo }}" target="_blank" rel="noopener">{{ site.data.subnautica.repo_name }}</a> · {{ site.data.subnautica.version }} · {{ site.data.subnautica.license }}</p>

<div class="game-readouts">
  <div>
    <span class="game-readouts__value">{{ site.data.subnautica.version }}</span>
    <span class="game-readouts__label">VERSION / 插件版本</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.subnautica.language }}</span>
    <span class="game-readouts__label">LANGUAGE / 实现语言</span>
  </div>
  <div>
    <span class="game-readouts__value">{{ site.data.subnautica.license }}</span>
    <span class="game-readouts__label">LICENSE / 代码许可</span>
  </div>
  <div>
    <span class="game-readouts__value">4546B</span>
    <span class="game-readouts__label">PLANET / 星球编号</span>
  </div>
</div>

<figure class="map-frame">
  <img src="{{ site.data.subnautica.map | relative_url }}" alt="{{ site.data.subnautica.map_alt }}" width="1800" height="1800" loading="lazy">
  <figcaption class="map-credit">
    {{ site.data.subnautica.map_credit }}
    {% if site.data.subnautica.map_source_url %}<a href="{{ site.data.subnautica.map_source_url }}" target="_blank" rel="noopener">原始来源 ↗</a>{% endif %}
  </figcaption>
</figure>

<h2 class="game-section-title">插件信息</h2>
<p class="game-body-text">Subnautica SNMap 是一个修改器式注入的小地图 + 独立大地图工具：不随游戏启动、不依赖任何模组框架；启动游戏后运行注入器即可使用。下面是仓库里已实现的功能。</p>
<ul class="repo-card__features repo-card__features--wide">
  {% for f in site.data.subnautica.features %}<li>{{ f }}</li>{% endfor %}
</ul>

<h2 class="game-section-title">地图图层</h2>
<p class="game-body-text">仓库的 <code>maps/</code> 目录包含多个图层，按文件名排序加载，可在游戏内用 <code>＋ / －</code> 切换。站内只展示主地图；完整图层与插件下载见仓库。</p>
<ul class="chips layer-chips">
  {% for l in site.data.subnautica.layers %}<li class="chip">{{ l }}</li>{% endfor %}
</ul>

<div class="game-info__actions">
  <a class="btn btn--primary" href="{{ site.data.subnautica.repo }}" target="_blank" rel="noopener">查看仓库 <span aria-hidden="true">↗</span></a>
  <a class="btn" href="{{ site.data.subnautica.repo }}/releases" target="_blank" rel="noopener">下载 Release {{ site.data.subnautica.version }}</a>
  <span class="game-info__updated">UPDATED {{ site.data.subnautica.updated }}</span>
</div>

<p class="post-back"><a href="{{ '/games/' | relative_url }}">← 返回游戏</a></p>
