---
layout: default
title: 项目
---

<section class="section-block" style="padding-top: 32px;">
  <div class="wrapper">
    <div class="section-header">
      <div class="section-icon">🚀</div>
      <h2 class="section-title">开源项目</h2>
      <p class="section-subtitle">GitHub 上的所有公开仓库</p>
    </div>

    <div class="project-grid">
      {% assign projects = site.github.public_repositories | sort: 'stargazers_count' | reverse %}
      {% if projects.size > 0 %}
        {% for repo in projects %}
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
            </span>
            <span class="stars"><i class="far fa-star"></i> {{ repo.stargazers_count }}</span>
          </div>
        </a>
        {% endfor %}
      {% else %}
        {% comment %}Since Jekyll GitHub Pages doesn't support site.github.public_repositories natively,
        we show the fallback list.{% endcomment %}
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
          <div class="project-desc">Self-hosted AI platform — RAG chat, image/video generation, voice, self-improving agents.</div>
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
        <a href="https://github.com/Thatgfsj/PowerShell" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> PowerShell</div>
          <div class="project-desc">PowerShell for every system!</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #178600"></span> C#</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/Thatgfsj.web.sky" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> Thatgfsj.web.sky</div>
          <div class="project-desc">个人网站前端项目</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #563D7C"></span> CSS</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/OrgExplorer" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> OrgExplorer</div>
          <div class="project-desc">Intuitive Dashboard to Explore Large GitHub Organizations</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #888"></span> 多语言</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/labo-ai-audio-tools" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> labo-ai-audio-tools</div>
          <div class="project-desc">AI 音频处理工具集</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #888"></span> 多语言</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/aws-sam-cli" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> aws-sam-cli</div>
          <div class="project-desc">CLI tool to build, test, debug, and deploy Serverless applications using AWS SAM</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #888"></span> 多语言</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
        <a href="https://github.com/Thatgfsj/large-task-scheduler" target="_blank" rel="noopener" class="project-card" style="text-decoration: none; color: inherit;">
          <div class="project-name"><i class="fas fa-folder"></i> large-task-scheduler</div>
          <div class="project-desc">OpenClaw技能：大型任务调度器 - 自动识别≥100字任务，拆分任务清单，定时执行</div>
          <div class="project-meta"><span class="lang"><span class="lang-dot" style="background: #888"></span> 多语言</span><span class="stars"><i class="far fa-star"></i> 1</span></div>
        </a>
      {% endif %}
    </div>
  </div>
</section>
