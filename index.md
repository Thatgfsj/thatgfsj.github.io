---
layout: default
---

<!-- ==================== Hero ==================== -->
<section class="hero">
  <div class="shell">
    <div class="hero__grid">
      <div class="hero__main">
        <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>PERSONAL WORKSTATION · ONLINE</p>
        <h1 class="hero__title">Thatgfsj</h1>
        <p class="hero__tagline">孙政<span class="sep" aria-hidden="true">/</span>全栈开发者<span class="sep" aria-hidden="true">/</span>DSH 插件与工具链</p>
        <p class="hero__bio">
          把想法变成能跑的东西。日常借助 AI 直接开工，也坚持把系统底层弄明白；折腾工具链、自动化流程和 AI 工程化，DSH 插件与技能维护在 thatgfsj-dsh 组织。
        </p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="{{ '/projects/' | relative_url }}">查看项目 <span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn" href="{{ '/about/' | relative_url }}">关于我</a>
          <a class="btn" href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <aside class="terminal" aria-label="系统信息">
        <div class="terminal__bar"><span>USER.TXT</span><span>READ ONLY</span></div>
        <div class="terminal__body">
          <div class="terminal__user">
            <img class="terminal__avatar" src="{{ '/assets/img/avatar.png' | relative_url }}" alt="Thatgfsj 的头像" width="64" height="64">
            <div>
              <p class="terminal__id">Thatgfsj</p>
              <p class="terminal__sub">孙政 · 全栈开发者</p>
            </div>
          </div>
          <dl class="specs">
            <dt>ROLE</dt><dd>Full-stack Developer</dd>
            <dt>STACK</dt><dd>Python · Rust · TypeScript</dd>
            <dt>FOCUS</dt><dd>AI Agent / DSH 插件 / 工具链</dd>
            <dt>ORG</dt><dd><a href="https://github.com/thatgfsj-dsh" target="_blank" rel="noopener">thatgfsj-dsh</a></dd>
            <dt>LOC</dt><dd>{{ site.data.stats.location }}</dd>
            <dt>STATUS</dt><dd><span class="status-dot" aria-hidden="true"></span>在线 · 开放交流</dd>
          </dl>
          <p class="terminal__prompt">thatgfsj@workstation:~$ <span class="cursor" aria-hidden="true"></span></p>
        </div>
      </aside>
    </div>

    <div class="readouts" role="list" aria-label="GitHub 数据概览">
      <div class="readout" role="listitem">
        <span class="readout__value">{{ site.data.stats.repos }}</span>
        <span class="readout__label">公开仓库 / REPOS</span>
      </div>
      <div class="readout" role="listitem">
        <span class="readout__value">{{ site.data.stats.stars }}</span>
        <span class="readout__label">Stars 总数 / STARS</span>
      </div>
      <div class="readout" role="listitem">
        <span class="readout__value">{{ site.data.stats.followers }}</span>
        <span class="readout__label">关注者 / FOLLOWERS</span>
      </div>
      <div class="readout" role="listitem">
        <span class="readout__value">{{ site.data.stats.code_size }}<small>{{ site.data.stats.code_unit }}</small></span>
        <span class="readout__label">源码体积 / SOURCE</span>
      </div>
    </div>
    <p class="readouts-note" title="源码体积按 GitHub Languages 统计">数据截至 {{ site.data.stats.updated }} · {{ site.data.stats.scope_note }}</p>
  </div>
</section>

<!-- ==================== 精选项目 ==================== -->
<section class="section" id="projects">
  <div class="shell">
    <div class="panel">
      {% assign featured_projects = site.data.projects | where: 'featured', true %}
      <div class="panel__bar">
        <span class="panel__path">~/projects</span>
        <span class="panel__meta">{{ featured_projects.size }} / {{ site.data.projects.size }} FEATURED</span>
      </div>
      <div class="panel__body">
        <header class="section-head">
          <h2>精选项目</h2>
          <p>从 AI 长期记忆、DSH 插件到桌面小工具——都在实际使用中打磨。</p>
        </header>

        <div class="file-list">
          <div class="file-list__head" aria-hidden="true">
            <span>#</span><span>名称 / 描述</span><span>语言</span><span>★</span><span></span>
          </div>
          {% for p in featured_projects %}
          <a class="file-row" href="{{ p.url }}" target="_blank" rel="noopener">
            <span class="file-row__idx">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
            <span class="file-row__main">
              <span class="file-row__name">{{ p.name }}</span>
              <span class="file-row__desc">{{ p.desc }}</span>
            </span>
            <span class="file-row__meta">
              <span class="file-row__lang">{{ p.lang }}</span>
              <span class="file-row__stars">{% if p.stars > 0 %}★ {{ p.stars_label | default: p.stars }}{% else %}—{% endif %}</span>
            </span>
            <span class="file-row__arrow" aria-hidden="true">↗</span>
          </a>
          {% endfor %}
        </div>

        <p class="section-more"><a href="{{ '/projects/' | relative_url }}">查看全部 {{ site.data.projects.size }} 个项目 →</a></p>
      </div>
    </div>
  </div>
</section>

<!-- ==================== 技术栈 ==================== -->
<section class="section" id="stack">
  <div class="shell">
    <div class="panel">
      <div class="panel__bar">
        <span class="panel__path">~/stack</span>
        <span class="panel__meta">{{ site.data.skills.size }} GROUPS</span>
      </div>
      <div class="panel__body">
        <header class="section-head">
          <h2>技术栈</h2>
          <p>按应用领域整理的工具箱，不按熟练度打星级。</p>
        </header>
        {% include stack.html %}
      </div>
    </div>
  </div>
</section>

<!-- ==================== 开源 ==================== -->
<section class="section" id="opensource">
  <div class="shell">
    <div class="panel">
      <div class="panel__bar">
        <span class="panel__path">~/github</span>
        <span class="panel__meta">LAST 12 MONTHS</span>
      </div>
      <div class="panel__body">
        <header class="section-head">
          <h2>开源足迹</h2>
          <p>过去一年的提交记录，以及给常用仓库提的几个 PR。</p>
        </header>

        <div class="opensource-grid">
          <div class="contrib">
            <div class="contrib__head">
              <span>CONTRIBUTIONS · {{ site.data.stats.contrib_window }}</span>
              <span class="contrib__count">{{ site.data.stats.contributions }}</span>
            </div>
            <div class="contrib__scroll" tabindex="0" role="region" aria-label="GitHub 贡献热力图，可横向滚动">
              {% include contributions.svg %}
            </div>
            <div class="contrib__legend" aria-hidden="true">
              <span>LESS</span>
              <span class="legend__cell lv0"></span>
              <span class="legend__cell lv1"></span>
              <span class="legend__cell lv2"></span>
              <span class="legend__cell lv3"></span>
              <span class="legend__cell lv4"></span>
              <span>MORE</span>
            </div>
          </div>

          <div class="prs">
            <h3 class="prs__title">RECENT PULL REQUESTS</h3>
            {% include pr-list.html %}
            <p class="section-more"><a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">在 GitHub 查看完整记录 ↗</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ==================== 文章 ==================== -->
<section class="section" id="writing">
  <div class="shell">
    <div class="panel">
      <div class="panel__bar">
        <span class="panel__path">~/notes</span>
        <span class="panel__meta">{{ site.posts.size }} POSTS</span>
      </div>
      <div class="panel__body">
        <header class="section-head">
          <h2>最新文章</h2>
          <p>把踩过的坑、抓过的包、写过的工具，尽量写成别人也能复用的笔记。</p>
        </header>

        <div class="post-list">
          {% for post in site.posts limit: 4 %}
          <a class="post-row" href="{{ post.url | relative_url }}">
            <time class="post-row__date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time>
            <span class="post-row__body">
              <span class="post-row__title">{{ post.title }}</span>
              <span class="post-row__desc">{{ post.description | default: post.excerpt | strip_html | truncate: 110 }}</span>
            </span>
            <span class="post-row__arrow" aria-hidden="true">→</span>
          </a>
          {% endfor %}
        </div>

        <p class="section-more"><a href="{{ '/blog/' | relative_url }}">阅读全部文章 →</a></p>
      </div>
    </div>
  </div>
</section>
