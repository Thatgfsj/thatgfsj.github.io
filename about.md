---
layout: page
title: 关于
description: Thatgfsj（孙政），全栈开发者。写代码、折腾工具链、给开源仓库提 PR。
kicker: README.MD
hide_lede: true
permalink: /about/
---

<div class="about-intro">
  <img class="about-intro__avatar" src="{{ '/assets/img/avatar.png' | relative_url }}" alt="Thatgfsj 的头像" width="96" height="96" loading="lazy">
  <div>
    <p class="about-intro__lead">我是 <strong>Thatgfsj</strong>（孙政），一个把想法做成能跑的工具的全栈开发者。</p>
    <p>日常借助 AI 直接开工，也坚持把系统底层弄明白。目前主用 Python / Rust / TypeScript，业余时间给常用开源仓库提 PR。相信好的工具应该简洁、高效，并且能直接解决问题。</p>
  </div>
</div>

## 核心技术领域

<div class="about-grid">
  <section class="about-card">
    <h3><span>01</span>Python 生态</h3>
    <p class="about-card__meta">爬虫 · 自动化 · 数据处理 · AI 集成</p>
    <ul>
      <li>Playwright / Scrapy 爬虫开发，熟悉浏览器抓包与协议逆向</li>
      <li>Excel / CSV 数据处理工具（excelfind、Excel-Date-Error-Fixer）</li>
      <li>AI Agent 长期记忆系统（neuroweave-cortex，非 RAG 的星图 / 激活扩散架构）</li>
      <li>CLI 工具与自动化脚本（claude-email-cli 等）</li>
    </ul>
  </section>

  <section class="about-card">
    <h3><span>02</span>Rust 系统编程</h3>
    <p class="about-card__meta">CLI 工具 · 性能敏感模块 · Python-Rust 互操作</p>
    <ul>
      <li>Rust / FFI 技能包与跨平台 CLI 工具（rsklls 等）</li>
      <li>Python ↔ Rust 互操作（PyO3），把关键路径下沉到原生</li>
      <li>高性能数据处理组件与流式计算</li>
    </ul>
  </section>

  <section class="about-card">
    <h3><span>03</span>Android 开发</h3>
    <p class="about-card__meta">Gradle 构建 · Jetpack Compose · 原生应用</p>
    <ul>
      <li>基于 Gradle 的 Android 项目配置与构建优化</li>
      <li>版本目录（Version Catalog）管理依赖</li>
      <li>构建变体（Build Variants）与多渠道打包</li>
      <li>为 OpenClaw 维护 android-gradle-skills 技能包</li>
    </ul>
  </section>

  <section class="about-card">
    <h3><span>04</span>AI 工程与自动化</h3>
    <p class="about-card__meta">Agent · 长期记忆 · 开源生态</p>
    <ul>
      <li>Self-hosted AI 平台（Ollama 本地部署、私有模型推理）</li>
      <li>神经记忆系统：neuroweave-cortex（锚点 + 扩散激活 + 睡眠巩固）</li>
      <li>OpenClaw / hermes-agent 等大型仓库贡献者（技能包与生态适配）</li>
      <li>AI 音频工具与多媒体生成 pipeline</li>
    </ul>
  </section>
</div>

## 其他技能

<div class="about-grid">
  <section class="about-card">
    <h3><span>05</span>数据库与后端</h3>
    <p class="about-card__meta">MySQL · Redis · 消息队列</p>
    <ul>
      <li><strong>数据库</strong>：MySQL 设计、查询优化、数据迁移</li>
      <li><strong>缓存与队列</strong>：Redis、Kafka 在秒杀 / 高并发场景的实践</li>
      <li><strong>可观测性</strong>：Prometheus + Grafana + SkyWalking</li>
    </ul>
  </section>

  <section class="about-card">
    <h3><span>06</span>DevOps 与工具链</h3>
    <p class="about-card__meta">CI/CD · 容器 · 版本控制</p>
    <ul>
      <li><strong>CI/CD</strong>：GitHub Actions、自动化部署流水线</li>
      <li><strong>容器</strong>：Docker 容器化部署、开发环境</li>
      <li><strong>版本控制</strong>：Git 工作流、PR 审查、GitHub API</li>
      <li><strong>桌面 / 嵌入式</strong>：Win32 + WinHTTP 单文件工具、GDI+ 自绘 UI</li>
    </ul>
  </section>
</div>

## 开源贡献

<p>业余时间主要给常用仓库做精准维护与适配。下面这几个是近期比较有代表性的：</p>

{% include pr-list.html %}

<p class="section-more"><a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">访问 GitHub 主页 ↗</a></p>

## 联系方式

<p>欢迎通过 GitHub 联系我，讨论技术问题或开源合作。没有公开邮箱，站内也没有留言板——直接开 issue 或 PR 是最快的方式。</p>

<ul>
  <li>GitHub：<a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">github.com/Thatgfsj</a></li>
  <li>本站：<a href="{{ '/feed.xml' | relative_url }}">RSS 订阅</a></li>
</ul>

## 关于本站

<p>这个站点用 <a href="https://jekyllrb.com" target="_blank" rel="noopener">Jekyll</a> 构建，部署在 <a href="https://pages.github.com" target="_blank" rel="noopener">GitHub Pages</a> 上，源码在 <a href="https://github.com/{{ site.repository }}" target="_blank" rel="noopener">thatgfsj.github.io</a>。</p>

<p class="colophon">
  设计：90s workstation 风格 · 暖灰纸面 + 琥珀色终端<br>
  字体：IBM Plex Mono / IBM Plex Sans（自托管）· 中文使用系统字体<br>
  无追踪、无广告、无第三方脚本。
</p>
