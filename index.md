---
layout: default
---

<!-- ==================== Hero Section ==================== -->
<section class="hero-section">
  <div class="wrapper">
    <div class="hero-avatar-wrap reveal">
      <div class="hero-avatar-ring"></div>
      <div class="hero-avatar">
        <img src="https://github.com/{{ site.github_username }}.png" alt="{{ site.author }}">
      </div>
    </div>
    <div class="hero-info">
      <h1 class="reveal">{{ site.author }}</h1>
      <p class="hero-tagline reveal">{{ site.tagline }}</p>
      <p class="hero-bio reveal">
        {{ site.description }}
        AI前沿探索者，OpenClaw，hermes等仓库贡献者。
      </p>
      <div class="hero-actions reveal">
        <a href="{{ '/projects' | relative_url }}" class="btn btn-primary">
          <i class="fas fa-code"></i> 查看项目
        </a>
        <a href="{{ '/about' | relative_url }}" class="btn btn-outline">
          <i class="fas fa-user"></i> 关于我
        </a>
        <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener" class="btn btn-outline">
          <i class="fab fa-github"></i> GitHub
        </a>
      </div>
    </div>
  </div>
  <div class="hero-scroll-cue">
    <span>向下滚动</span>
    <div class="arrow"></div>
  </div>
</section>

<!-- ==================== Skills ==================== -->
<section class="section-block">
  <div class="wrapper">
    <div class="section-header reveal">
      <span class="section-kicker">01 — TECH STACK</span>
      <h2 class="section-title">技术栈</h2>
      <p class="section-subtitle">不只是「会用」，是写过大大小小工具后沉淀下来的偏好组合。</p>
    </div>

    <div class="skills-grid reveal-stagger">
      {% for cat in site.data.skills %}
      <div class="skill-category">
        <div class="skill-category-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <h3>{{ cat.category }}</h3>
        </div>
        <div class="skill-chips">
          {% for skill in cat.items %}
          <span class="skill-chip" title="{{ skill.desc }}">{{ skill.name }}</span>
          {% endfor %}
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<!-- ==================== GitHub Stats ==================== -->
<section class="section-block section-block-alt">
  <div class="wrapper">
    <div class="section-header reveal">
      <span class="section-kicker">02 — OPEN SOURCE</span>
      <h2 class="section-title">开源数据</h2>
      <p class="section-subtitle">在 GitHub 上留下的足迹——谈不上高产，但每个仓库都尽量做到能直接用。</p>
    </div>

    <div class="github-stats reveal-stagger">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-code-branch"></i></div>
        <div class="stat-number">47</div>
        <div class="stat-label">公开仓库</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-star"></i></div>
        <div class="stat-number" id="gh-stars">40</div>
        <div class="stat-label">Stars 总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-number">6</div>
        <div class="stat-label">关注者</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-code"></i></div>
        <div class="stat-number">186 MiB</div>
        <div class="stat-label">代码规模</div>
      </div>
    </div>

    <div class="gh-contrib-img reveal">
      <picture>
        <source srcset="https://ghchart.rshah.org/{{ site.github_username }}" media="(min-width: 600px)">
        <img src="https://ghchart.rshah.org/{{ site.github_username }}" alt="{{ site.github_username }}'s GitHub contribution chart">
      </picture>
    </div>
  </div>
</section>

<!-- ==================== Featured Projects ==================== -->
<section class="section-block">
  <div class="wrapper">
    <div class="section-header reveal">
      <span class="section-kicker">03 — FEATURED WORK</span>
      <h2 class="section-title">精选项目</h2>
      <p class="section-subtitle">最近在折腾的一些东西——从 AI 长期记忆、Agent 技能包到日常效率工具。</p>
    </div>

    <div class="project-grid reveal-stagger">
      {% for p in site.data.projects %}
      <a href="{{ p.url }}" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
        <div class="project-name"><i class="fas fa-folder"></i> {{ p.name }}</div>
        <div class="project-desc">{{ p.desc }}</div>
        <div class="project-meta">
          <span class="lang"><span class="lang-dot" style="background:{{ p.lang_color }}"></span> {{ p.lang }}</span>
          <span class="stars"><i class="far fa-star"></i> {{ p.stars }}</span>
        </div>
      </a>
      {% endfor %}
    </div>

    <div class="section-more-wrap reveal">
      <a href="{{ '/projects' | relative_url }}" class="section-more-link">
        查看全部项目 <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  </div>
</section>

<!-- ==================== Latest Blog Posts ==================== -->
<section class="section-block section-block-alt">
  <div class="wrapper">
    <div class="section-header reveal">
      <span class="section-kicker">04 — WRITING</span>
      <h2 class="section-title">最新文章</h2>
      <p class="section-subtitle">把踩过的坑、抓过的包、写过的工具——尽量写成别人也能复用的笔记。</p>
    </div>

    <div class="blog-preview-list reveal-stagger">
      {% for post in site.posts limit: 4 %}
      <div class="blog-preview-item">
        <div class="bp-date">
          <span class="day">{{ post.date | date: "%d" }}</span>
          <span class="month">{{ post.date | date: "%b" }}</span>
        </div>
        <div class="bp-content">
          <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          {% if post.description %}
          <p>{{ post.description }}</p>
          {% else %}
          <p>{{ post.excerpt | strip_html | truncate: 140 }}</p>
          {% endif %}
        </div>
      </div>
      {% endfor %}
    </div>

    <div class="section-more-wrap reveal">
      <a href="{{ '/blog' | relative_url }}" class="section-more-link">
        阅读更多 <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  </div>
</section>