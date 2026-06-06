/**
 * 粒子连线动画 v2
 * - 全站 20-30 个淡蓝色粒子
 * - 鼠标靠近时连最近的 5 个，并吸引（不超过锚点 10%）
 * - 每 30 秒刷新一轮
 * - 生成方式：先 10 个，之后每秒 +5 个直到 50 个
 * - 旧点淡出，新点淡入
 */
(function () {
  'use strict';

  /* ========================
     Canvas 挂载
     ======================== */
  var canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  var ctx = canvas.getContext('2d');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9999;';

  function mount() {
    document.body.appendChild(canvas);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  /* ========================
     尺寸
     ======================== */
  var W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* ========================
     配置
     ======================== */
  var CYCLE_MS = 30000; // 30 秒一轮
  var SPAWN_INTERVAL = 1000; // 每秒一批
  var INITIAL_BATCH = 10;
  var BATCH_SIZE = 5;
  var MAX_PARTICLES = 50;

  var CONNECT_LIMIT = 5;
  var CONNECT_RADIUS = 300;
  var ATTRACT_RADIUS = 220;
  var MAX_OFFSET_RATIO = 0.10; // 锚点偏移上限（相对于视口短边）
  var LINE_OPACITY_MAX = 0.35;
  var LINE_WIDTH = 1.5;
  var PARTICLE_RADIUS = 3.6;
  var FADE_SPEED = 0.025;
  var COLOR = [147, 197, 253]; // 淡蓝色 tailwind blue-300

  /* ── 点击扩散 ── */
  var EXPLOSION_RADIUS = 320;
  var EXPLOSION_FORCE = 5;
  var EXPLOSION_DURATION = 700; // ms
  var explosions = [];

  /* ========================
     鼠标
     ======================== */
  var mouse = { x: W / 2, y: H / 2, active: false };

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  document.addEventListener('mouseleave', function () {
    mouse.active = false;
  });
  document.addEventListener(
    'touchmove',
    function (e) {
      var t = e.touches[0];
      if (t) {
        mouse.x = t.clientX;
        mouse.y = t.clientY;
        mouse.active = true;
      }
    },
    { passive: true }
  );
  document.addEventListener(
    'touchend',
    function () {
      mouse.active = false;
    },
    { passive: true }
  );

  /* ========================
     点击 → 爆散发散
     ======================== */
  canvas.addEventListener('click', function (e) {
    explosions.push({
      x: e.clientX,
      y: e.clientY,
      startTime: performance.now(),
    });
  });

  canvas.addEventListener(
    'touchstart',
    function (e) {
      var t = e.touches[0];
      if (t) {
        explosions.push({
          x: t.clientX,
          y: t.clientY,
          startTime: performance.now(),
        });
      }
    },
    { passive: true }
  );

  /* ========================
     粒子
     ======================== */
  function createParticle() {
    var ax = Math.random() * W;
    var ay = Math.random() * H;
    return {
      x: ax,
      y: ay,
      anchorX: ax,
      anchorY: ay,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 0,
      alive: true,
    };
  }

  var particles = [];
  var cycleTimer = 0;
  var spawnTimer = 0;
  var spawnPhase = true;

  function resetCycle() {
    // 标记现有粒子为"消亡中"
    for (var i = 0; i < particles.length; i++) {
      particles[i].alive = false;
    }
    // 重置生成状态
    spawnPhase = true;
    spawnTimer = 0;
    // 第一批
    for (var i = 0; i < INITIAL_BATCH; i++) {
      particles.push(createParticle());
    }
  }

  resetCycle();

  /* ========================
     工具
     ======================== */
  function distSq(a, b) {
    var dx = a.x - b.x,
      dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  /* ========================
     主循环
     ======================== */
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // ── 时间驱动 ──
    cycleTimer += 16;

    // 生成阶段
    if (spawnPhase) {
      spawnTimer += 16;
      if (spawnTimer >= SPAWN_INTERVAL) {
        spawnTimer -= SPAWN_INTERVAL;
        var aliveCount = 0;
        for (var i = 0; i < particles.length; i++) {
          if (particles[i].alive) aliveCount++;
        }
        var toSpawn = Math.min(BATCH_SIZE, MAX_PARTICLES - aliveCount);
        for (var i = 0; i < toSpawn; i++) {
          particles.push(createParticle());
        }
        if (aliveCount + toSpawn >= MAX_PARTICLES) {
          spawnPhase = false;
        }
      }
    }

    // 30 秒刷新
    if (cycleTimer >= CYCLE_MS) {
      cycleTimer = 0;
      resetCycle();
    }

    // ── 更新粒子 ──
    var maxOffset = Math.min(W, H) * MAX_OFFSET_RATIO;

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      // 透明度
      if (p.alive) {
        p.alpha = Math.min(1, p.alpha + FADE_SPEED);
      } else {
        p.alpha -= FADE_SPEED;
        if (p.alpha <= 0.005) {
          particles.splice(i, 1);
          continue;
        }
      }

      // 鼠标吸引（仅 alive 粒子受吸引）
      if (p.alive && mouse.active) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < ATTRACT_RADIUS && dist > 0.5) {
          var force = (1 - dist / ATTRACT_RADIUS) * 0.06;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // 点击爆散
      var now = performance.now();
      for (var ei = 0; ei < explosions.length; ei++) {
        var exp = explosions[ei];
        var elapsed = now - exp.startTime;
        if (elapsed > EXPLOSION_DURATION) continue;
        var dx = p.x - exp.x;
        var dy = p.y - exp.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < EXPLOSION_RADIUS && dist > 1) {
          var strength = (1 - elapsed / EXPLOSION_DURATION) *
                         (1 - dist / EXPLOSION_RADIUS) *
                         EXPLOSION_FORCE;
          p.vx += (dx / dist) * strength;
          p.vy += (dy / dist) * strength;
        }
      }

      // 弹性回归锚点
      p.vx += (p.anchorX - p.x) * 0.018;
      p.vy += (p.anchorY - p.y) * 0.018;

      // 阻尼
      p.vx *= 0.88;
      p.vy *= 0.88;

      // 限速
      var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 3) {
        p.vx = (p.vx / spd) * 3;
        p.vy = (p.vy / spd) * 3;
      }

      p.x += p.vx;
      p.y += p.vy;

      // 钳位：不超过锚点 maxOffset
      var dxa = p.x - p.anchorX;
      var dya = p.y - p.anchorY;
      var da = Math.sqrt(dxa * dxa + dya * dya);
      if (da > maxOffset) {
        p.x = p.anchorX + (dxa / da) * maxOffset;
        p.y = p.anchorY + (dya / da) * maxOffset;
        p.vx *= -0.4;
        p.vy *= -0.4;
      }
    }

    // ── 画线 ──
    var visible = [];
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].alpha > 0.02) visible.push(i);
    }

    for (var vi = 0; vi < visible.length; vi++) {
      var i = visible[vi];
      var p = particles[i];
      if (p.alpha <= 0.02) continue;

      var neighbors = [];
      for (var vj = 0; vj < visible.length; vj++) {
        if (vi === vj) continue;
        var j = visible[vj];
        var d2 = distSq(p, particles[j]);
        if (d2 < CONNECT_RADIUS * CONNECT_RADIUS) {
          neighbors.push({ idx: j, d2: d2 });
        }
      }
      neighbors.sort(function (a, b) { return a.d2 - b.d2; });

      var limit = Math.min(neighbors.length, CONNECT_LIMIT);
      for (var k = 0; k < limit; k++) {
        // 只画一次 (i < neighbor.idx 避免重复)
        if (i < neighbors[k].idx) {
          var n = particles[neighbors[k].idx];
          var dist = Math.sqrt(neighbors[k].d2);
          var alpha =
            (1 - dist / CONNECT_RADIUS) *
            LINE_OPACITY_MAX *
            Math.min(p.alpha, n.alpha);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle =
            'rgba(' + COLOR[0] + ',' + COLOR[1] + ',' + COLOR[2] + ',' + alpha + ')';
          ctx.lineWidth = LINE_WIDTH;
          ctx.stroke();
        }
      }
    }

    // ── 画粒子 ──
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (p.alpha <= 0.02) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle =
        'rgba(' +
        COLOR[0] +
        ',' +
        COLOR[1] +
        ',' +
        COLOR[2] +
        ',' +
        0.85 * p.alpha +
        ')';
      ctx.fill();
    }

    // ── 点击波纹 ──
    var now = performance.now();
    for (var ei = explosions.length - 1; ei >= 0; ei--) {
      var exp = explosions[ei];
      var elapsed = now - exp.startTime;
      if (elapsed > EXPLOSION_DURATION) {
        explosions.splice(ei, 1);
        continue;
      }
      var progress = elapsed / EXPLOSION_DURATION;
      var radius = EXPLOSION_RADIUS * progress;
      var alpha = (1 - progress) * 0.5;
      ctx.beginPath();
      ctx.arc(exp.x, exp.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle =
        'rgba(' + COLOR[0] + ',' + COLOR[1] + ',' + COLOR[2] + ',' + alpha + ')';
      ctx.lineWidth = 2 * (1 - progress) + 0.5;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
