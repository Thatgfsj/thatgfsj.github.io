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
        我是 <strong>Thatgfsj</strong>（孙政），一名热衷于把想法变成可运行工具的全栈开发者。
        从底层网络协议到上层 AI 应用，从浏览器抓包到编译型 GUI 工具，都在我的折腾范围之内。
      </p>
      <p>
        折腾代码的第七个年头，写过 Playwright 爬虫辅助、写过 1.5 MB 的 Win32 单文件网速监控、
        写过海马体启发的 AI 长期记忆系统、也给 <strong style="color: var(--primary-2);">OpenClaw</strong> 写过 Rust / Android Gradle 技能包。
      </p>
      <p>
        目前主用 <strong style="color: var(--text);">Python / Rust / TypeScript</strong>，
        业余时间给 OpenClaw / hermes 等开源仓库提 PR、做贡献。
        相信好的工具应该简洁、高效、开箱即用——最好一行命令就能跑起来。
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
        业余时间主要给 <strong style="color: var(--primary-2);">OpenClaw / hermes</strong> 等热门 AI Agent 仓库写技能包与生态适配，
        也自己维护一些「解决某个具体问题」的小工具。下面这几个是近期比较有代表性的：
      </p>
      <ul style="margin-top: 12px; padding-left: 22px; color: var(--text-light);">
        <li><strong>neuroweave-cortex</strong> — 海马体启发的 AI 长期记忆系统，带睡眠巩固循环</li>
        <li><strong>playwright-crawler-helper</strong> — 浏览器 Network Panel 半自动化抓包，辅助写爬虫</li>
        <li><strong>claude-email-cli</strong> — 发邮件就能调 Claude，适合自动化工作流</li>
        <li><strong>rsklls</strong> — 给 OpenClaw 用的 Rust 技能包，含 PyO3 互操作</li>
        <li><strong>android-gradle-skills</strong> — OpenClaw Android Gradle 构建技能包</li>
      </ul>
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
