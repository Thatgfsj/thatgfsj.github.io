---
layout: default
title: 关于
---

<div class="wrapper" style="padding-top: 32px;">
  <div class="section-header">
    <div class="section-icon">👤</div>
    <h2 class="section-title">关于我</h2>
    <p class="section-subtitle">全栈开发者 · 开源贡献者</p>
  </div>

  <!-- Bio -->
  <div class="resume-section">
    <div class="about-bio">
      <p>
        我是 <strong>Thatgfsj</strong>，一名热爱编程的全栈开发者。
        从底层系统到上层应用，从爬虫脚本到 AI 工程，我享受把想法变成可靠工具的过程。
      </p>
      <p>
        技术栈覆盖 Python、Rust、Java/Kotlin、Go 等多种语言，
        AI前沿探索者，OpenClaw等热门仓库贡献者。
        我相信好的工具应该简洁、高效、开箱即用。
      </p>
    </div>
  </div>

  <!-- Core Skills -->
  <div class="resume-section">
    <h2><span class="icon">🎯</span> 核心技术领域</h2>

    <div class="resume-item">
      <h3>🐍 Python 生态</h3>
      <div class="resume-meta">爬虫 · 自动化 · 数据处理 · AI 集成</div>
      <ul>
        <li>Playwright/Scrapy 爬虫开发，网络抓包分析</li>
        <li>Excel/CSV 批量数据处理工具（如 excelfind、Excel-Date-Error-Fixer）</li>
        <li>AI Agent 系统与 RAG 流水线</li>
        <li>CLI 工具与自动化脚本</li>
      </ul>
    </div>

    <div class="resume-item">
      <h3>🦀 Rust 系统编程</h3>
      <div class="resume-meta">CLI 工具 · 性能敏感模块 · Python-Rust 互操作</div>
      <ul>
        <li>跨平台命令行工具开发</li>
        <li>Python 调用 Rust 扩展模块（PyO3）</li>
        <li>高性能数据处理组件</li>
      </ul>
    </div>

    <div class="resume-item">
      <h3>📱 Android 开发</h3>
      <div class="resume-meta">Gradle 构建 · Jetpack Compose · 原生应用</div>
      <ul>
        <li>基于 Gradle 的 Android 项目配置与构建优化</li>
        <li>版本目录（Version Catalog）管理依赖</li>
        <li>构建变体（Build Variants）与多渠道打包</li>
      </ul>
    </div>

    <div class="resume-item">
      <h3>🤖 AI 工程与自动化</h3>
      <div class="resume-meta">RAG · Agent · 开源生态</div>
      <ul>
        <li>Self-hosted AI 平台（Ollama 本地部署）</li>
        <li>神经记忆系统（neuroweave-cortex）</li>
        <li>OpenClaw 等热门仓库贡献者</li>
        <li>AI 音频工具与多媒体生成</li>
      </ul>
    </div>

    <div class="resume-item">
      <h3>🔧 其他技能</h3>
      <div class="resume-meta">数据库 · DevOps · 工具链</div>
      <ul>
        <li><strong>数据库</strong>：MySQL 设计、查询优化、数据迁移</li>
        <li><strong>CI/CD</strong>：GitHub Actions、自动化部署流水线</li>
        <li><strong>容器</strong>：Docker 容器化部署</li>
        <li><strong>版本控制</strong>：Git 工作流、PR 审查、GitHub API</li>
      </ul>
    </div>
  </div>

  <!-- Languages -->
  <div class="resume-section">
    <h2><span class="icon">📊</span> 编程语言熟练度</h2>

    <div class="skills-grid" style="grid-template-columns: 1fr;">
      <div class="skill-category">
        <div class="skill-chips">
          {% for cat in site.data.skills %}
            {% for skill in cat.items %}
            <span class="skill-chip" title="{{ skill.desc }}">{{ skill.name }}</span>
            {% endfor %}
          {% endfor %}
        </div>
      </div>
    </div>
  </div>

  <!-- GitHub -->
  <div class="resume-section">
    <h2><span class="icon">🌐</span> 开源贡献</h2>

    <div class="about-bio" style="margin-bottom: 20px;">
      <p>AI前沿探索者，OpenClaw等热门仓库贡献者。</p>
    </div>

    <div class="github-stats" style="margin-top: 20px;">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-code-branch"></i></div>
        <div class="stat-number">42</div>
        <div class="stat-label">公开仓库</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-number">5</div>
        <div class="stat-label">关注者</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-code"></i></div>
        <div class="stat-number">1.5M+</div>
        <div class="stat-label">代码行数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-map-pin"></i></div>
        <div class="stat-number">中国</div>
        <div class="stat-label">所在地</div>
      </div>
    </div>

    <p style="text-align: center; margin-top: 16px;">
      <a href="https://github.com/Thatgfsj" target="_blank" rel="noopener" class="btn btn-primary">
        <i class="fab fa-github"></i> 访问 GitHub 主页
      </a>
    </p>
  </div>

  <!-- Contact -->
  <div class="resume-section">
    <h2><span class="icon">📬</span> 联系我</h2>
    <div class="about-bio">
      <p>欢迎通过 GitHub 与我联系，讨论技术问题或开源合作。</p>
      <ul>
        <li>GitHub: <a href="https://github.com/Thatgfsj" target="_blank">github.com/Thatgfsj</a></li>
      </ul>
    </div>
  </div>

  <hr style="border: none; border-top: 1px solid var(--border); margin: 40px 0;">

  <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem;">
    这个站点使用 <a href="https://jekyllrb.com">Jekyll</a> 构建，部署在 <a href="https://pages.github.com">GitHub Pages</a> 上。
    源码可在 <a href="https://github.com/Thatgfsj/thatgfsj.github.io">thatgfsj.github.io</a> 仓库查看。
  </p>
</div>
