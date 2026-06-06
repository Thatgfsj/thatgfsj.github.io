/**
 * 粒子连线交互效果
 * - 鼠标附近 15 个粒子，缓慢漂移
 * - 每个粒子与最近的 5 个连线
 * - 线条透明度随距离衰减
 */
(function() {
  'use strict';

  var canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  var ctx = canvas.getContext('2d');

  // --- 样式 & 挂载 ---
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9999;';

  // 等 body 加载完再挂载
  if (document.body) {
    document.body.appendChild(canvas);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(canvas);
    });
  }

  // --- 尺寸 ---
  var W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // --- 配置 ---
  var PARTICLE_COUNT = 15;
  var CONNECT_LIMIT = 5;       // 每个粒子最多连几个
  var CONNECT_RADIUS = 250;    // 连线最大距离 (px)
  var LINE_OPACITY_MAX = 0.35; // 线条最大透明度
  var LINE_WIDTH = 1.2;
  var PARTICLE_RADIUS = 2.5;
  var DRIFT_SPEED = 0.25;      // 漂移速度

  // --- 鼠标位置 ---
  var mouse = { x: W / 2, y: H / 2, active: false };

  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  document.addEventListener('mouseleave', function() {
    mouse.active = false;
  });

  // 触摸设备支持
  document.addEventListener('touchmove', function(e) {
    var t = e.touches[0];
    if (t) {
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.active = true;
    }
  }, { passive: true });

  document.addEventListener('touchend', function() {
    mouse.active = false;
  }, { passive: true });

  // --- 粒子 ---
  var particles = [];

  function randomAroundMouse(range) {
    range = range || 180;
    return {
      x: mouse.x + (Math.random() - 0.5) * range * 2,
      y: mouse.y + (Math.random() - 0.5) * range * 2
    };
  }

  function initParticles() {
    particles = [];
    var cx = mouse.x;
    var cy = mouse.y;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var pos = randomAroundMouse(200);
      particles.push({
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        // 每个粒子独立小偏移，让它围绕鼠标有不同的"轨道"
        ox: (Math.random() - 0.5) * 120,
        oy: (Math.random() - 0.5) * 120
      });
    }
  }
  initParticles();

  // --- 工具函数：距离平方（避免 sqrt） ---
  function distSq(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  // --- 动画循环 ---
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // 1. 更新粒子位置
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = particles[i];

      // 目标位置：围绕鼠标 + 个体偏移
      var tx = mouse.x + p.ox;
      var ty = mouse.y + p.oy;

      // 缓动回到鼠标附近
      var dx = tx - p.x;
      var dy = ty - p.y;
      p.vx += dx * 0.008;
      p.vy += dy * 0.008;

      // 随机漂移（布朗运动）
      p.vx += (Math.random() - 0.5) * DRIFT_SPEED * 0.1;
      p.vy += (Math.random() - 0.5) * DRIFT_SPEED * 0.1;

      // 阻尼
      p.vx *= 0.92;
      p.vy *= 0.92;

      // 限速
      var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 2.5) {
        p.vx = (p.vx / spd) * 2.5;
        p.vy = (p.vy / spd) * 2.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      // 边界约束（飘太远就拉回）
      var margin = 500;
      if (p.x < -margin) p.x = -margin;
      if (p.x > W + margin) p.x = W + margin;
      if (p.y < -margin) p.y = -margin;
      if (p.y > H + margin) p.y = H + margin;
    }

    // 2. 画连线（每个粒子连最近的 CONNECT_LIMIT 个）
    var lineColor = '67, 97, 238';

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = particles[i];

      // 计算到所有其他粒子的距离
      var neighbors = [];
      for (var j = 0; j < PARTICLE_COUNT; j++) {
        if (i === j) continue;
        var d2 = distSq(p, particles[j]);
        if (d2 < CONNECT_RADIUS * CONNECT_RADIUS) {
          neighbors.push({ idx: j, d2: d2 });
        }
      }

      // 按距离排序，取最近的 CONNECT_LIMIT 个
      neighbors.sort(function(a, b) { return a.d2 - b.d2; });
      var count = Math.min(neighbors.length, CONNECT_LIMIT);

      for (var k = 0; k < count; k++) {
        var n = particles[neighbors[k].idx];
        var dist = Math.sqrt(neighbors[k].d2);
        var alpha = (1 - dist / CONNECT_RADIUS) * LINE_OPACITY_MAX;
        // 只画一次（i < j 避免重复）
        if (i < neighbors[k].idx) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = 'rgba(' + lineColor + ', ' + alpha + ')';
          ctx.lineWidth = LINE_WIDTH;
          ctx.stroke();
        }
      }
    }

    // 3. 画粒子
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(67, 97, 238, 0.55)';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
