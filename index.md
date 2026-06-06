---
layout: default
---

<!-- ==================== Hero Section ==================== -->
<section class="hero-section">
  <div class="wrapper">
    <div class="hero-avatar">
      <img src="https://github.com/{{ site.github_username }}.png" alt="{{ site.author }}">
    </div>
    <div class="hero-info">
      <h1>{{ site.author }}</h1>
      <p class="hero-tagline">{{ site.tagline }}</p>
      <p class="hero-bio">
        {{ site.description }}
        擅长 Python 自动化、Rust 系统编程、Android 原生开发。
        热爱开源，喜欢把想法变成好用的工具。
      </p>
      <div class="hero-actions">
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
</section>

<!-- ==================== Skills ==================== -->
<section class="section-block">
  <div class="wrapper">
    <div class="section-header">
      <div class="section-icon">🛠</div>
      <h2 class="section-title">技术栈</h2>
      <p class="section-subtitle">多年积累，持续精进</p>
    </div>

    <div class="skills-grid">
      {% for cat in site.data.skills %}
      <div class="skill-category">
        <div class="skill-category-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <h3>{{ cat.category }}</h3>
        </div>
        <div class="skill-items">
          {% for skill in cat.items %}
          <div class="skill-item">
            <div class="skill-name-row">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-bar-fill" style="width: {{ skill.level }}%"></div>
            </div>
            <div class="skill-desc">{{ skill.desc }}</div>
          </div>
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
    <div class="section-header">
      <div class="section-icon">📊</div>
      <h2 class="section-title">开源数据</h2>
      <p class="section-subtitle">GitHub 上的足迹</p>
    </div>

    <div class="github-stats">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-code-branch"></i></div>
        <div class="stat-number">34</div>
        <div class="stat-label">公开仓库</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-star"></i></div>
        <div class="stat-number" id="gh-stars">16</div>
        <div class="stat-label">Stars 总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-number">5</div>
        <div class="stat-label">关注者</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fab fa-python"></i></div>
        <div class="stat-number">18.7k</div>
        <div class="stat-label">Python 代码行</div>
      </div>
    </div>

    <div class="gh-contrib-img">
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
    <div class="section-header">
      <div class="section-icon">🚀</div>
      <h2 class="section-title">精选项目</h2>
      <p class="section-subtitle">最近在折腾的一些东西</p>
    </div>

    <div class="project-grid">
        <!-- neuroweave-cortex -->
        <a href="https://github.com/Thatgfsj/neuroweave-cortex" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> neuroweave-cortex</div>
          <div class="project-desc">海马体启发的星图记忆系统，带睡眠巩固。AI 长期记忆通过锚点、扩散激活和夜间回放/合并/修剪/桥接循环实现自我整合。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background:#3572A5"></span> Python</span><span class="stars"><i class="far fa-star"></i> 2</span></div>
        </a>

        <!-- claude-email-cli -->
        <a href="https://github.com/Thatgfsj/claude-email-cli" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> claude-email-cli</div>
          <div class="project-desc">通过邮件控制 Claude AI 的 CLI 工具。无需打开浏览器，发一封邮件就能与 AI 交互，适合自动化工作流。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background:#3572A5"></span> Python</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>

        <!-- rsklls -->
        <a href="https://github.com/Thatgfsj/rsklls" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> rsklls</div>
          <div class="project-desc">Rust Skills 技能包 — 为 OpenClaw 提供 Rust 编程能力，涵盖 Rust 核心编程和 Python-Rust 互操作（PyO3）。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background:#89E051"></span> Shell</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>

        <!-- playwright-crawler-helper -->
        <a href="https://github.com/Thatgfsj/playwright-crawler-helper" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> playwright-crawler-helper</div>
          <div class="project-desc">Playwright 爬虫辅助工具 — 通过分析浏览器网络请求（Network Panel）来辅助编写爬虫脚本，让抓包过程半自动化。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background:#3572A5"></span> Python</span><span class="stars"><i class="far fa-star"></i> 2</span></div>
        </a>

        <!-- thatgfsj-code -->
        <a href="https://github.com/Thatgfsj/thatgfsj-code" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> thatgfsj-code</div>
          <div class="project-desc">个人代码片段库与工具集合。TypeScript 实现，累积日常开发中提炼的实用代码和组件。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background:#3178C6"></span> TypeScript</span><span class="stars"><i class="far fa-star"></i> 0</span></div>
        </a>
    </div>

    <a href="{{ '/projects' | relative_url }}" class="section-more-link">
      查看全部项目 <i class="fas fa-arrow-right"></i>
    </a>
  </div>
</section>

<!-- ==================== Latest Blog Posts ==================== -->
<section class="section-block section-block-alt">
  <div class="wrapper">
    <div class="section-header">
      <div class="section-icon">📝</div>
      <h2 class="section-title">最新文章</h2>
      <p class="section-subtitle">记录思考，分享知识</p>
    </div>

    <div class="blog-preview-list">
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

    <a href="{{ '/blog' | relative_url }}" class="section-more-link">
      阅读更多 <i class="fas fa-arrow-right"></i>
    </a>
  </div>
</section>
