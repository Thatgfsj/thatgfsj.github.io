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
        AI前沿探索者，OpenClaw等热门仓库贡献者。
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
        <div class="stat-number">42</div>
        <div class="stat-label">公开仓库</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-star"></i></div>
        <div class="stat-number" id="gh-stars">40</div>
        <div class="stat-label">Stars 总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-number">5</div>
        <div class="stat-label">关注者</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fab fa-python"></i></div>
        <div class="stat-number">407.8k</div>
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