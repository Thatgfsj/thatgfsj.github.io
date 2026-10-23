(function () {
  'use strict';

  var root = document.documentElement;
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var themeLabel = document.querySelector('[data-theme-label]');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function paintTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function storedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (error) {
      return null;
    }
  }

  paintTheme(currentTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        /* 忽略隐私模式下的存储失败 */
      }
      paintTheme(next);
    });
  }

  function followSystem(event) {
    if (!storedTheme()) {
      paintTheme(event.matches ? 'dark' : 'light');
    }
  }

  if (typeof systemDark.addEventListener === 'function') {
    systemDark.addEventListener('change', followSystem);
  } else if (typeof systemDark.addListener === 'function') {
    systemDark.addListener(followSystem);
  }

  /* 菜单栏时钟 */
  var clock = document.querySelector('[data-clock]');
  if (clock) {
    var pad = function (value) {
      return value < 10 ? '0' + value : String(value);
    };
    var tick = function () {
      var now = new Date();
      clock.textContent =
        now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
        ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
      var holder = clock.closest('time');
      if (holder) {
        holder.setAttribute('datetime', now.toISOString());
      }
    };
    tick();
    window.setInterval(tick, 1000);
  }

  /* 移动端导航 */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    var closeNav = function () {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeNav();
      }
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) {
        return;
      }
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
        closeNav();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  /* 阅读时长：中文按 400 字/分，拉丁词按 220 词/分 */
  var readingTime = document.querySelector('[data-reading-time]');
  var article = document.querySelector('.post-content');
  if (readingTime && article) {
    var text = article.innerText || article.textContent || '';
    var cjk = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
    var latin = (text.match(/[A-Za-z0-9_]+/g) || []).length;
    var minutes = Math.max(1, Math.round(cjk / 400 + latin / 220));
    readingTime.textContent = minutes + ' 分钟阅读';
    var minutesBadge = document.querySelector('[data-reading-min]');
    if (minutesBadge) {
      minutesBadge.textContent = minutes;
    }
  }

  /* 可横向滚动的代码块：键盘用户也能滚动（WCAG 2.1.1） */
  var scrollables = document.querySelectorAll('.prose pre');
  Array.prototype.forEach.call(scrollables, function (pre) {
    if (pre.scrollWidth <= pre.clientWidth + 1) {
      return;
    }
    var box = pre.closest('.highlighter-rouge') || pre;
    if (!box.hasAttribute('tabindex')) {
      box.setAttribute('tabindex', '0');
      box.setAttribute('role', 'region');
      box.setAttribute('aria-label', '代码块，可横向滚动');
    }
  });
})();
