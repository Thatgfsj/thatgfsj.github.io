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
        <div class="stat-number" id="gh-stars">…</div>
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
      {% assign projects = site.github.public_repositories | sort: 'stargazers_count' | reverse %}
      {% if projects.size > 0 %}
        {% for repo in projects limit: 6 %}
        <a href="{{ repo.html_url }}" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name">
            <i class="fas fa-folder"></i> {{ repo.name }}
          </div>
          <div class="project-desc">
            {{ repo.description | default: '暂无描述' | truncate: 120 }}
          </div>
          <div class="project-meta">
            <span class="lang">
              {% if repo.language %}
              <span class="lang-dot" style="background: {{ repo.language | downcase | replace: 'python', '#3572A5' | replace: 'rust', '#DEA584' | replace: 'java', '#B07219' | replace: 'kotlin', '#A97BFF' | replace: 'go', '#00ADD8' | replace: 'c#', '#178600' | replace: 'c++', '#f34b7d' | replace: 'javascript', '#F7DF1E' | replace: 'typescript', '#3178C6' | replace: 'css', '#563D7C' | replace: 'html', '#E34F26' | replace: 'shell', '#89E051' | default: '#888' }}"></span>
              {{ repo.language }}
              {% endif %}
            </span>
            <span class="stars"><i class="far fa-star"></i> {{ repo.stargazers_count }}</span>
          </div>
        </a>
        {% endfor %}
      {% else %}
        {% comment %}Fallback: display hardcoded projects{% endcomment %}
        <a href="https://github.com/Thatgfsj/neuroweave-cortex" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> neuroweave-cortex</div>
          <div class="project-desc">海马体启发的星图记忆系统，带睡眠巩固。AI 长期记忆——锚点、扩散激活、夜间回放/合并/修剪/桥接。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #3572A5"></span> Python</span><span class="stars"><i class="far fa-star"></i> 2</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/playwright-crawler-helper" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> playwright-crawler-helper</div>
          <div class="project-desc">Playwright爬虫辅助工具，通过分析浏览器网络请求辅助编写爬虫脚本。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #3572A5"></span> Python</span><span class="stars"><i class="far fa-star"></i> 2</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/Excel-Date-Error-Fixer" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> Excel-Date-Error-Fixer</div>
          <div class="project-desc">批量纠正 Excel 表格中的不规则日期格式，转换为标准格式。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #3572A5"></span> Python</span><span class="stars"><i class="far fa-star"></i> 2</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/guaardvark" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> guaardvark</div>
          <div class="project-desc">Self-hosted AI platform — RAG chat, image/video generation, voice, self-improving agents. Runs locally via Ollama.</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #888"></span> 多语言</span><span class="stars"><i class="far fa-star"></i> 2</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/rsklls" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> rsklls</div>
          <div class="project-desc">Rust Skills for OpenClaw — Rust 编程、Python-Rust 互操作。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #89E051"></span> Shell</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/excelfind" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> excelfind</div>
          <div class="project-desc">轻量级桌面工具，批量搜索 Excel/CSV 表格内容，自动复制匹配文件并生成汇总报告。</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #3572A5"></span> Python</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
      {% endif %}
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
          <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
        </div>
      </div>
      {% endfor %}
    </div>

    <a href="{{ '/blog' | relative_url }}" class="section-more-link">
      阅读更多 <i class="fas fa-arrow-right"></i>
    </a>
  </div>
</section>
