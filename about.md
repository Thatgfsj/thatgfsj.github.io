---
layout: default
title: 关于
---

<div class="wrapper" style="padding-top: 32px;">
  <div class="section-header reveal">
    <span class="section-kicker">ABOUT</span>
    <h2 class="section-title">关于我</h2>
    <p class="section-subtitle">全栈开发者 · 开源贡献者</p>
  </div>

<!-- Bio -->
  <div class="resume-section reveal">
    <div class="about-bio">
      <p>
        我是 <strong>Thatgfsj</strong>（孙政），一名把想法变成可运行工具的，借助AI的全栈开发能力与个人系统理解的全栈开发者。
      </p>
      <p>
        目前主用 <strong style="color: var(--text);">Python / Rust / TypeScript</strong>，
        业余时间给常用开源仓库提 PR。
        相信好的工具应该简洁、高效。
      </p>
    </div>
  </div>

  <!-- Core Skills -->
  <div class="resume-section reveal">
    <h2><span class="icon">🎯</span> 核心技术领域</h2>

    <div class="reveal-stagger">
      <div class="resume-item">
        <h3>🐍 Python 生态</h3>
        <div class="resume-meta">爬虫 · 自动化 · 数据处理 · AI 集成</div>
        <ul>
          <li>Playwright / Scrapy 爬虫开发，熟悉浏览器抓包与协议逆向</li>
          <li>做过 excelfind、Excel-Date-Error-Fixer 等 Excel/CSV 数据处理工具</li>
          <li>AI Agent 系统与 RAG 流水线（neuroweave-cortex 海马体启发的长期记忆）</li>
          <li>CLI 工具与自动化脚本（claude-email-cli 等邮件驱动 AI 工具）</li>
        </ul>
      </div>

      <div class="resume-item">
        <h3>🦀 Rust 系统编程</h3>
        <div class="resume-meta">CLI 工具 · 性能敏感模块 · Python-Rust 互操作</div>
        <ul>
          <li>跨平台命令行工具开发（rsklls 等 OpenClaw 技能包）</li>
          <li>Python ↔ Rust 互操作（PyO3），把关键路径下沉到原生</li>
          <li>高性能数据处理组件与流式计算</li>
        </ul>
      </div>

      <div class="resume-item">
        <h3>📱 Android 开发</h3>
        <div class="resume-meta">Gradle 构建 · Jetpack Compose · 原生应用</div>
        <ul>
          <li>基于 Gradle 的 Android 项目配置与构建优化</li>
          <li>版本目录（Version Catalog）管理依赖</li>
          <li>构建变体（Build Variants）与多渠道打包</li>
          <li>为 OpenClaw 维护 android-gradle-skills 技能包</li>
        </ul>
      </div>

      <div class="resume-item">
        <h3>🤖 AI 工程与自动化</h3>
        <div class="resume-meta">RAG · Agent · 开源生态</div>
        <ul>
          <li>Self-hosted AI 平台（Ollama 本地部署、私有模型推理）</li>
          <li>神经记忆系统：neuroweave-cortex（锚点 + 扩散激活 + 睡眠巩固循环）</li>
          <li>OpenClaw / hermes 等热门仓库贡献者（技能包与生态适配）</li>
          <li>AI 音频工具与多媒体生成 pipeline</li>
        </ul>
      </div>

      <div class="resume-item">
        <h3>🔧 其他技能</h3>
        <div class="resume-meta">数据库 · DevOps · 工具链</div>
        <ul>
          <li><strong>数据库</strong>：MySQL 设计、查询优化、数据迁移</li>
          <li><strong>CI/CD</strong>：GitHub Actions、自动化部署流水线</li>
          <li><strong>容器</strong>：Docker 容器化部署、开发环境</li>
          <li><strong>版本控制</strong>：Git 工作流、PR 审查、GitHub API</li>
          <li><strong>嵌入式 / 桌面</strong>：Win32 + WinHTTP 单文件工具、GDI+ 自绘 UI</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Languages -->
  <div class="resume-section reveal">
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
  <div class="resume-section reveal">
    <h2><span class="icon">🌐</span> 开源贡献</h2>

    <div class="about-bio" style="margin-bottom: 24px;">
      <p>
        业余时间主要给常用仓库根据自己体验到的问题进行精准维护适配。下面这几个是近期比较有代表性的：
      </p>
    </div>

    <div class="pr-buttons">
      <a href="https://github.com/openclaw/openclaw/pull/69056" target="_blank" rel="noopener" class="pr-btn">
        <span class="pr-repo">openclaw / openclaw</span>
        <span class="pr-title">fix(gateway): handle SIGUSR1 gracefully on Windows</span>
        <span class="pr-meta">#69056 · 2026-04 · merged</span>
      </a>

      <a href="https://github.com/esengine/DeepSeek-Reasonix/pull/3380" target="_blank" rel="noopener" class="pr-btn">
        <span class="pr-repo">esengine / DeepSeek-Reasonix</span>
        <span class="pr-title">feat(serve): add i18n, stats dashboard, and session management</span>
        <span class="pr-meta">#3380 · 2026-06 · merged</span>
      </a>

      <a href="https://github.com/NousResearch/hermes-agent/pull/19137" target="_blank" rel="noopener" class="pr-btn">
        <span class="pr-repo">NousResearch / hermes-agent</span>
        <span class="pr-title">fix(title): prevent stale background title generation from reloading unloaded Ollama models</span>
        <span class="pr-meta">#19137 · merged via #66078</span>
      </a>
    </div>

    <div class="github-stats reveal-stagger" style="margin-top: 24px;">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-code-branch"></i></div>
        <div class="stat-number">47</div>
        <div class="stat-label">公开仓库</div>
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
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-map-pin"></i></div>
        <div class="stat-number">中国</div>
        <div class="stat-label">所在地</div>
      </div>
    </div>

    <p style="text-align: center; margin-top: 24px;">
      <a href="https://github.com/Thatgfsj" target="_blank" rel="noopener" class="btn btn-primary">
        <i class="fab fa-github"></i> 访问 GitHub 主页
      </a>
    </p>
  </div>

  <!-- Contact -->
  <div class="resume-section reveal">
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
