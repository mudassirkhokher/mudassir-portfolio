/* ===================================================================
   MUDASSIR TAHIR — AI AUTOMATION ENGINEER
   Enhanced Modern 3D Portfolio - Futuristic Edition
   script-enhanced.js
   =================================================================== */

'use strict';

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTouch =
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ===================================================================
   1. FOOTER YEAR
   =================================================================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===================================================================
   2. ENHANCED PRELOADER
   =================================================================== */
(function preloader() {
  const pre   = document.getElementById('preloader');
  const fill  = document.getElementById('pre-fill');
  const pct   = document.getElementById('pre-pct');
  if (!pre) return;

  let progress = 0;
  let loaded = false;
  let rafId = null;
  const start = performance.now();

  window.addEventListener('load', () => { loaded = true; });

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function tick(now) {
    const elapsed = now - start;
    const timeTarget = easeOutCubic(Math.min(elapsed / 1800, 1)) * 100;

    // never reach 100 until the page has actually loaded
    const ceiling = loaded ? 100 : 94;
    progress = Math.min(Math.max(progress, timeTarget), ceiling);
    if (loaded && progress > 99) progress = 100;

    if (fill) fill.style.width = progress + '%';
    if (pct)  pct.textContent = Math.round(progress);

    if (progress >= 100) {
      setTimeout(() => {
        pre.classList.add('is-done');
        document.documentElement.classList.remove('is-loading');
        setTimeout(() => pre.remove(), 1100);
      }, 300);
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  // safety: force finish after 5s regardless
  setTimeout(() => {
    if (progress < 100) {
      loaded = true;
      progress = 99.5;
    }
  }, 5000);

  rafId = requestAnimationFrame(tick);
})();

/* ===================================================================
   3. ENHANCED CUSTOM CURSOR WITH MAGNETIC EFFECT
   =================================================================== */
(function cursor() {
  if (isTouch || prefersReducedMotion) return;

  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;
  let magneticTarget = null;
  let magnetStrength = 0.38;

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;

    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - mx;
      const dy = cy - my;

      // Pull cursor towards element center
      mx += dx * magnetStrength;
      my += dy * magnetStrength;
    }

    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

    if (!visible) {
      visible = true;
      document.body.classList.add('cursor-ready');
      rx = mx; ry = my;
    }
  }

  function render() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
    requestAnimationFrame(render);
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', () => document.body.classList.add('cursor-down'));
  window.addEventListener('pointerup',   () => document.body.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-ready');
    visible = false;
  });

  // grow on interactive elements + magnetic effect
  const hoverables = 'a, button, .btn, .glass, .tags span, input, textarea, .node-dot';
  document.addEventListener('pointerover', (e) => {
    const target = e.target.closest(hoverables);
    if (target) {
      document.body.classList.add('cursor-hover');
      if (target.classList.contains('btn') || target.classList.contains('mark-glyph')) {
        magneticTarget = target;
      }
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(hoverables)) {
      document.body.classList.remove('cursor-hover');
      magneticTarget = null;
    }
  });

  render();
})();

/* ===================================================================
   4. SCROLL PROGRESS + TOPBAR STATE + SPINE FILL
   =================================================================== */
(function scrollUI() {
  const bar     = document.getElementById('scroll-bar');
  const topbar  = document.querySelector('.topbar');
  const spine   = document.querySelector('.spine-fill');
  const pipe    = document.querySelector('.pipeline');

  let ticking = false;

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY;

    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    if (topbar) topbar.classList.toggle('is-scrolled', y > 24);

    if (spine && pipe) {
      const rect = pipe.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.6;
      const passed = vh * 0.8 - rect.top;
      const p = Math.min(Math.max(passed / total, 0), 1);
      spine.style.height = (p * 100).toFixed(2) + '%';
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

/* ===================================================================
   5. ACTIVE NAV LINK
   =================================================================== */
(function activeNav() {
  const links = Array.from(document.querySelectorAll('.toplinks a'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const map = new Map();
  links.forEach((link) => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#')) {
      const el = document.querySelector(id);
      if (el) map.set(el, link);
    }
  });
  if (!map.size) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.remove('is-active'));
        const link = map.get(entry.target);
        if (link) link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  map.forEach((_, el) => io.observe(el));
})();

/* ===================================================================
   6. REVEAL OBSERVERS
   =================================================================== */
(function reveals() {
  const supportsIO = 'IntersectionObserver' in window;

  if (!supportsIO) {
    document.querySelectorAll('[data-reveal], .stagger, .node')
      .forEach((n) => n.classList.add('revealed', 'in', 'in-view'));
    return;
  }

  // sections
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach((s) => revealIO.observe(s));

  // stagger containers
  const staggerIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        staggerIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.stagger').forEach((s) => staggerIO.observe(s));

  // pipeline nodes
  const nodeIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        nodeIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.node').forEach((n) => nodeIO.observe(n));
})();

/* ===================================================================
   7. ANIMATED COUNTERS
   =================================================================== */
(function counters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    return;
  }

  function run(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  els.forEach((el) => {
    el.textContent = '0' + (el.dataset.suffix || '');
    io.observe(el);
  });
})();

/* ===================================================================
   8. ENHANCED POINTER TILT WITH GYROSCOPE/3D LIGHTING
   =================================================================== */
(function tilt() {
  if (prefersReducedMotion || isTouch) return;

  const MAX_RX = 7;
  const MAX_RY = 9;

  document.querySelectorAll('.tilt').forEach((el) => {
    let raf = null;
    let rect = null;

    function onEnter() {
      rect = el.getBoundingClientRect();
      el.classList.add('is-tilting');
    }

    function onMove(e) {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', (-py * MAX_RX).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (px * MAX_RY).toFixed(2) + 'deg');
        el.style.setProperty('--sc', '1.025');
      });
    }

    function onLeave() {
      if (raf) cancelAnimationFrame(raf);
      rect = null;
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--sc', '1');
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
  });
})();

/* ===================================================================
   9. ADVANCED NEURAL NETWORK BACKGROUND FIELD (Three.js)
   Multi-layered particle constellation with dynamic connections,
   holographic grid matrices, and energy streams
   =================================================================== */
(function backgroundField() {
  const canvas = document.getElementById('bg-field');
  if (!canvas || typeof THREE === 'undefined' || prefersReducedMotion) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070a, 0.022);

  const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    150
  );
  camera.position.set(0, 0, 25);

  /* ---- ADVANCED PARTICLE CONSTELLATION ---- */
  const LAYER_1_COUNT = 280;  // Main particles
  const LAYER_2_COUNT = 150;  // Mid-field particles
  const LAYER_3_COUNT = 80;   // Deep background
  const TOTAL_PARTICLES = LAYER_1_COUNT + LAYER_2_COUNT + LAYER_3_COUNT;

  const SPREAD_X = 55;
  const SPREAD_Y = 35;
  const SPREAD_Z = 40;

  // Main particle system with custom attributes
  const positions = new Float32Array(TOTAL_PARTICLES * 3);
  const velocities = new Float32Array(TOTAL_PARTICLES * 3);
  const phases = new Float32Array(TOTAL_PARTICLES);
  const sizes = new Float32Array(TOTAL_PARTICLES);
  const colors = new Float32Array(TOTAL_PARTICLES * 3);

  // Color palette - Cyberpunk / Sci-Fi HUD High-Contrast
  const colorPalette = [
    new THREE.Color(0x00e5ff), // Cyan
    new THREE.Color(0xff0080), // Magenta
    new THREE.Color(0x00ffcc), // Neon Teal
    new THREE.Color(0xffb84d), // Electric Amber
    new THREE.Color(0xb388ff), // Purple
  ];

  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    const layer = i < LAYER_1_COUNT ? 1 : (i < LAYER_1_COUNT + LAYER_2_COUNT ? 2 : 3);
    const spreadMult = layer === 1 ? 1 : (layer === 2 ? 1.4 : 1.8);
    const zOffset = layer === 1 ? 0 : (layer === 2 ? -15 : -30);

    positions[i * 3]     = (Math.random() - 0.5) * SPREAD_X * spreadMult;
    positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y * spreadMult;
    positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z * spreadMult + zOffset;

    velocities[i * 3]     = (Math.random() - 0.5) * 0.015;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

    phases[i] = Math.random() * Math.PI * 2;
    sizes[i] = layer === 1 ? (0.5 + Math.random() * 0.6) : (layer === 2 ? (0.3 + Math.random() * 0.4) : (0.2 + Math.random() * 0.3));

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3]     = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pointsMat = new THREE.PointsMaterial({
    size: 0.12,
    transparent: true,
    opacity: 0.85,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const pointCloud = new THREE.Points(pointsGeo, pointsMat);
  scene.add(pointCloud);

  /* ---- NEURAL NETWORK CONNECTIONS ---- */
  const MAX_CONNECTIONS = 200;
  const CONNECTION_DIST_SQ = 12;

  const connectionGeo = new THREE.BufferGeometry();
  const connectionPositions = new Float32Array(MAX_CONNECTIONS * 2 * 3);
  const connectionColors = new Float32Array(MAX_CONNECTIONS * 2 * 3);
  connectionGeo.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
  connectionGeo.setAttribute('color', new THREE.BufferAttribute(connectionColors, 3));

  const connectionMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const connections = new THREE.LineSegments(connectionGeo, connectionMat);
  scene.add(connections);

  function rebuildConnections() {
    let idx = 0;
    for (let i = 0; i < LAYER_1_COUNT && idx < MAX_CONNECTIONS; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < LAYER_1_COUNT && idx < MAX_CONNECTIONS; j++) {
        const jx = j * 3;
        const dx = positions[ix] - positions[jx];
        const dy = positions[ix + 1] - positions[jx + 1];
        const dz = positions[ix + 2] - positions[jx + 2];
        const d2 = dx * dx + dy * dy + dz * dz;

        if (d2 < CONNECTION_DIST_SQ) {
          const o = idx * 6;
          connectionPositions[o]     = positions[ix];
          connectionPositions[o + 1] = positions[ix + 1];
          connectionPositions[o + 2] = positions[ix + 2];
          connectionPositions[o + 3] = positions[jx];
          connectionPositions[o + 4] = positions[jx + 1];
          connectionPositions[o + 5] = positions[jx + 2];

          // Color interpolation
          connectionColors[o]     = colors[ix];
          connectionColors[o + 1] = colors[ix + 1];
          connectionColors[o + 2] = colors[ix + 2];
          connectionColors[o + 3] = colors[jx];
          connectionColors[o + 4] = colors[jx + 1];
          connectionColors[o + 5] = colors[jx + 2];

          idx++;
        }
      }
    }
    if (idx < MAX_CONNECTIONS) {
      connectionPositions.fill(0, idx * 6, MAX_CONNECTIONS * 6);
    }
    connectionGeo.attributes.position.needsUpdate = true;
    connectionGeo.attributes.color.needsUpdate = true;
    connectionGeo.setDrawRange(0, idx * 2);
  }
  rebuildConnections();

  /* ---- HOLOGRAPHIC GRID MATRIX ---- */
  const gridGroup = new THREE.Group();
  const gridMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.15,
    depthWrite: false
  });

  // Create 3D grid planes
  for (let i = 0; i < 3; i++) {
    const gridSize = 80;
    const gridDivisions = 30;
    // Glow effect: cyan grid with teal subgrid
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffcc, 0x00e5ff);
    gridHelper.position.y = -18 + i * 18;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.25 - i * 0.05;
    gridGroup.add(gridHelper);
  }
  scene.add(gridGroup);

  /* ---- ENERGY PARTICLE STREAMS ---- */
  const STREAM_COUNT = 12; // More streams
  const streams = [];

  for (let i = 0; i < STREAM_COUNT; i++) {
    const streamGeo = new THREE.BufferGeometry();
    const streamPoints = [];

    const angle = (i / STREAM_COUNT) * Math.PI * 2;
    const radius = 15 + Math.random() * 10;
    const height = (Math.random() - 0.5) * 30;

    for (let j = 0; j < 50; j++) {
      const t = j / 50;
      streamPoints.push(
        Math.cos(angle + t * Math.PI * 4) * radius * (1 - t * 0.5),
        height + t * 20,
        Math.sin(angle + t * Math.PI * 4) * radius * (1 - t * 0.5)
      );
    }

    streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(streamPoints, 3));

    const streamMat = new THREE.LineBasicMaterial({
      color: i % 2 === 0 ? 0x00e5ff : 0xff0080, // Cyan & Magenta streams
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const stream = new THREE.Line(streamGeo, streamMat);
    stream.userData.angle = angle;
    stream.userData.speed = 0.002 + Math.random() * 0.003; // slightly faster
    streams.push(stream);
    scene.add(stream);
  }

  /* ---- FLOATING GEOMETRIC SHAPES ---- */
  const shapes = [];
  const shapeGeometries = [
    new THREE.TetrahedronGeometry(0.5),
    new THREE.OctahedronGeometry(0.4),
    new THREE.IcosahedronGeometry(0.35),
  ];

  for (let i = 0; i < 15; i++) {
    const geo = shapeGeometries[i % shapeGeometries.length];
    const mat = new THREE.MeshBasicMaterial({
      color: colorPalette[i % colorPalette.length],
      transparent: true,
      opacity: 0.15,
      wireframe: true,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * SPREAD_X,
      (Math.random() - 0.5) * SPREAD_Y,
      (Math.random() - 0.5) * SPREAD_Z * 0.5
    );
    mesh.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    };
    shapes.push(mesh);
    scene.add(mesh);
  }

  /* ---- POINTER PARALLAX ---- */
  let targetX = 0, targetY = 0;
  window.addEventListener('pointermove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2.2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.4;
  }, { passive: true });

  /* ---- RESIZE ---- */
  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, { passive: true });

  /* ---- ANIMATION LOOP ---- */
  let frame = 0;
  let running = true;

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) animate();
  });

  function animate() {
    if (!running) return;
    frame++;

    // Update particle positions
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const ix = i * 3;
      positions[ix]     += velocities[ix] + Math.sin(frame * 0.005 + phases[i]) * 0.002;
      positions[ix + 1] += velocities[ix + 1] + Math.cos(frame * 0.004 + phases[i]) * 0.0015;
      positions[ix + 2] += velocities[ix + 2];

      // Wrap around
      if (positions[ix] > SPREAD_X / 2) positions[ix] = -SPREAD_X / 2;
      if (positions[ix] < -SPREAD_X / 2) positions[ix] = SPREAD_X / 2;
      if (positions[ix + 1] > SPREAD_Y / 2) positions[ix + 1] = -SPREAD_Y / 2;
      if (positions[ix + 1] < -SPREAD_Y / 2) positions[ix + 1] = SPREAD_Y / 2;
    }
    pointsGeo.attributes.position.needsUpdate = true;

    // Rebuild connections periodically
    if (frame % 6 === 0) rebuildConnections();

    // Rotate grid
    gridGroup.rotation.y = frame * 0.0003;
    gridGroup.children.forEach((grid, i) => {
      grid.position.y = -18 + i * 18 + Math.sin(frame * 0.002 + i) * 0.5;
    });

    // Animate streams
    streams.forEach((stream) => {
      stream.rotation.y += stream.userData.speed;
      stream.material.opacity = 0.2 + Math.sin(frame * 0.01 + stream.userData.angle) * 0.1;
    });

    // Animate shapes
    shapes.forEach((shape) => {
      shape.rotation.x += shape.userData.rotSpeed.x;
      shape.rotation.y += shape.userData.rotSpeed.y;
      shape.rotation.z += shape.userData.rotSpeed.z;
    });

    // Camera easing
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (-targetY - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -8);

    // Dynamic color shift based on scroll
    const max = document.body.scrollHeight - window.innerHeight || 1;
    const frac = Math.min(Math.max(window.scrollY / max, 0), 1);

    const baseColor = new THREE.Color(0x4dd0c0);
    const targetColor = new THREE.Color(0x9d7ff5);
    pointsMat.color.copy(baseColor).lerp(targetColor, frac);
    connectionMat.opacity = 0.35 + frac * 0.15;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===================================================================
   10. ADVANCED HERO PIPELINE GRAPH (Three.js)
   Complex 3D Holographic Neural Pipeline with Multi-layer Visualization,
   Energy Streams, and Futuristic Cybernetic Aesthetics
   =================================================================== */
(function heroGraph() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 150);
  camera.position.set(0, 1.5, 16);
  const CAM_REST_Z = 11;

  /* ---- SIZING ---- */
  function sizeRenderer() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  sizeRenderer();
  if ('ResizeObserver' in window) {
    new ResizeObserver(sizeRenderer).observe(canvas);
  } else {
    window.addEventListener('resize', sizeRenderer, { passive: true });
  }

  /* ---- FUTURISTIC PALETTE - HIGH CONTRAST NEON ---- */
  const AMBER   = 0xffb84d;
  const TEAL    = 0x00ffcc;
  const PURPLE  = 0xb388ff;
  const CYAN    = 0x00e5ff;
  const MAGENTA = 0xff0080;
  const NEUTRAL = 0x8be9fd;

  /* ---- DYNAMIC LIGHTING SYSTEM ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const keyLight = new THREE.PointLight(CYAN, 2.0, 40);
  keyLight.position.set(6, 7, 8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(MAGENTA, 1.8, 35);
  rimLight.position.set(-7, -3, -6);
  scene.add(rimLight);

  const accentLight1 = new THREE.PointLight(AMBER, 1.2, 30);
  accentLight1.position.set(-6, 5, 5);
  scene.add(accentLight1);

  const accentLight2 = new THREE.PointLight(PURPLE, 1.2, 30);
  accentLight2.position.set(5, -4, 4);
  scene.add(accentLight2);

  /* ---- MAIN HOLOGRAPHIC GROUP ---- */
  const group = new THREE.Group();
  scene.add(group);

  /* ---- ADVANCED MULTI-LAYER HOLOGRAPHIC PLATFORM ---- */
  const platform = new THREE.Group();
  platform.position.y = -3;

  // Primary rotating ring with glow
  const primaryRing = new THREE.Mesh(
    new THREE.RingGeometry(4.0, 4.05, 150),
    new THREE.MeshBasicMaterial({
      color: TEAL, transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    })
  );
  primaryRing.rotation.x = -Math.PI / 2;
  platform.add(primaryRing);

  // Outer glow ring
  const glowRing = new THREE.Mesh(
    new THREE.RingGeometry(4.1, 4.4, 150),
    new THREE.MeshBasicMaterial({
      color: TEAL, transparent: true, opacity: 0.15, side: THREE.DoubleSide,
    })
  );
  glowRing.rotation.x = -Math.PI / 2;
  platform.add(glowRing);

  // Concentric energy rings
  const energyRings = [];
  for (let i = 1; i <= 6; i++) {
    const r = i * 0.65;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r, r + 0.012, 100),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? PURPLE : (i % 3 === 0 ? AMBER : 0x394a68),
        transparent: true,
        opacity: 0.35 - i * 0.03,
        side: THREE.DoubleSide,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.userData.baseRadius = r;
    platform.add(ring);
    energyRings.push(ring);
  }

  // Radial spokes with energy pulses
  const spokesGroup = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(Math.cos(a) * 0.8, 0, Math.sin(a) * 0.8),
      new THREE.Vector3(Math.cos(a) * 3.95, 0, Math.sin(a) * 3.95),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: 0x3d4e70, transparent: true, opacity: 0.28,
    });
    spokesGroup.add(new THREE.Line(geo, mat));
  }
  platform.add(spokesGroup);
  group.add(platform);

  /* ---- HEXAGONAL GRID OVERLAY ---- */
  const hexGridGroup = new THREE.Group();
  const hexRadius = 0.6;
  const hexCount = 25;

  for (let i = 0; i < hexCount; i++) {
    const angle = (i / hexCount) * Math.PI * 2;
    const dist = 1.5 + Math.random() * 2;
    const hexGeo = new THREE.CircleGeometry(hexRadius * 0.3, 6);
    const hexMat = new THREE.MeshBasicMaterial({
      color: 0x3a5a8a,
      transparent: true,
      opacity: 0.1 + Math.random() * 0.1,
      side: THREE.DoubleSide
    });
    const hex = new THREE.Mesh(hexGeo, hexMat);
    hex.position.set(
      Math.cos(angle) * dist,
      -3,
      Math.sin(angle) * dist
    );
    hex.rotation.x = -Math.PI / 2;
    hex.userData.pulseOffset = Math.random() * Math.PI * 2;
    hexGridGroup.add(hex);
  }
  group.add(hexGridGroup);

  /* ---- NODES: ADVANCED NEURAL PIPELINE STRUCTURE ---- */
  const nodeDefs = [
    { pos: [-4.2, 1.8, 0.5],  color: AMBER,   r: 0.35, type: 'trigger' },
    { pos: [-2.0, 0.3, 1.0],  color: NEUTRAL, r: 0.28, type: 'agent' },
    { pos: [0.3, 1.4, -0.4],  color: PURPLE,  r: 0.30, type: 'router' },
    { pos: [3.0, 2.5, 0.6],   color: TEAL,    r: 0.24, type: 'action' },
    { pos: [3.5, 0.4, 1.3],   color: TEAL,    r: 0.24, type: 'action' },
    { pos: [3.0, -1.8, -0.2], color: TEAL,    r: 0.24, type: 'action' },
  ];
  const edgeDefs = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5]];

  const nodeMeshes = nodeDefs.map((def, i) => {
    // Complex geometry based on node role
    let geo;
    if (def.type === 'trigger') {
      geo = new THREE.DodecahedronGeometry(def.r, 1);
    } else if (def.type === 'router') {
      geo = new THREE.OctahedronGeometry(def.r, 1);
    } else {
      geo = new THREE.IcosahedronGeometry(def.r, 1);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: def.color,
      emissive: def.color,
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.45,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
    mesh.userData.baseEmissive = 0.5;
    mesh.userData.flash = 0;
    mesh.userData.index = i;
    mesh.userData.baseY = def.pos[1];
    mesh.userData.floatOffset = i * 1.3;
    mesh.userData.rotSpeed = 0.003 + Math.random() * 0.002;

    // Outer glow aura
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(def.r * 2.2, 20, 20),
      new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    mesh.add(halo);

    // Orbiting particle rings for complex nodes
    if (def.type === 'trigger' || def.type === 'router') {
      const orbitRings = [];
      for (let j = 0; j < 2; j++) {
        const ringGeo = new THREE.RingGeometry(def.r * (1.6 + j * 0.3), def.r * (1.65 + j * 0.3), 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: def.color,
          transparent: true,
          opacity: 0.45 - j * 0.15,
          side: THREE.DoubleSide
        });
        const orbitRing = new THREE.Mesh(ringGeo, ringMat);
        orbitRing.rotation.x = Math.PI / (3 + j);
        orbitRing.userData.rotSpeed = 0.015 * (j + 1);
        mesh.add(orbitRing);
        orbitRings.push(orbitRing);
      }
      mesh.userData.orbitRings = orbitRings;
    }

    // Particle emission points
    const particleCount = 8;
    const particles = [];
    for (let j = 0; j < particleCount; j++) {
      const particleGeo = new THREE.SphereGeometry(0.02, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.userData.angle = (j / particleCount) * Math.PI * 2;
      particle.userData.radius = def.r * 1.2;
      particle.userData.speed = 0.02 + Math.random() * 0.01;
      particle.userData.yOffset = (Math.random() - 0.5) * 0.3;
      mesh.add(particle);
      particles.push(particle);
    }
    mesh.userData.particles = particles;

    group.add(mesh);
    return mesh;
  });

  /* ---- HOLOGRAPHIC ENERGY BEAM EDGES ---- */
  const edgeData = edgeDefs.map(([a, b]) => {
    const pa = new THREE.Vector3(...nodeDefs[a].pos);
    const pb = new THREE.Vector3(...nodeDefs[b].pos);
    const mid = pa.clone().lerp(pb, 0.5).add(new THREE.Vector3(0, 0.3, 0.6));
    const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
    const pts = curve.getPoints(80);

    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    // Base holographic line
    const mat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    group.add(new THREE.Line(geo, mat));

    // Outer glow conduit
    const glowMat = new THREE.LineBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    group.add(new THREE.Line(geo, glowMat));

    return { curve, from: a, to: b, targetColor: nodeDefs[b].color };
  });

  /* ---- ADVANCED PULSE DATA PACKETS WITH TRAILS ---- */
  const packetGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const packets = edgeData.map((edge, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: edge.targetColor,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(packetGeo, mat);
    group.add(mesh);

    // Enhanced glow trail
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({
        color: edge.targetColor,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    mesh.add(glow);

    // Secondary glow
    const glow2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshBasicMaterial({
        color: edge.targetColor,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    mesh.add(glow2);

    return {
      mesh,
      curve: edge.curve,
      target: edge.to,
      offset: i * 0.25,
      speed: 0.25 + (i % 3) * 0.05,
      lastT: 0,
    };
  });

  /* ---- FLOATING CYBERNETIC ELEMENTS ---- */
  const cyberElements = [];

  // Floating pyramids
  for (let i = 0; i < 6; i++) {
    const pyramidGeo = new THREE.TetrahedronGeometry(0.15);
    const pyramidMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? TEAL : PURPLE,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    const pyramid = new THREE.Mesh(pyramidGeo, pyramidMat);
    pyramid.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4
    );
    pyramid.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    };
    pyramid.userData.floatOffset = Math.random() * Math.PI * 2;
    cyberElements.push(pyramid);
    group.add(pyramid);
  }

  // Floating cubes
  for (let i = 0; i < 4; i++) {
    const cubeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: AMBER,
      transparent: true,
      opacity: 0.15,
      wireframe: true
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 3
    );
    cube.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.015,
      y: (Math.random() - 0.5) * 0.015,
      z: (Math.random() - 0.5) * 0.015
    };
    cyberElements.push(cube);
    group.add(cube);
  }

  /* ---- ORIENTATION & MOUSE DYNAMICS ---- */
  const baseRotX = -0.15;
  const baseRotY = -0.4;
  group.rotation.set(baseRotX, baseRotY, 0);

  let targetRotX = baseRotX;
  let targetRotY = baseRotY;

  if (!prefersReducedMotion) {
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = baseRotY + nx * 0.75;
      targetRotX = baseRotX - ny * 0.5;
    }, { passive: true });

    canvas.addEventListener('pointerleave', () => {
      targetRotX = baseRotX;
      targetRotY = baseRotY;
    });
  }

  /* ---- ANIMATION LOOP ---- */
  const clock = new THREE.Clock();
  let running = true;

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) animate();
  });

  function animate() {
    if (!running) return;

    const t = clock.getElapsedTime();

    // Smooth dolly-in
    camera.position.z += (CAM_REST_Z - camera.position.z) * 0.035;

    if (!prefersReducedMotion) {
      // Fluid pointer parallax + organic drift
      group.rotation.x += (targetRotX - group.rotation.x) * 0.055;
      group.rotation.y +=
        (targetRotY + Math.sin(t * 0.15) * 0.08 - group.rotation.y) * 0.055;

      // Platform rotations
      platform.rotation.y += 0.0025;
      spokesGroup.rotation.y -= 0.0015;

      // Animate energy rings
      energyRings.forEach((r, i) => {
        r.material.opacity = 0.25 - i * 0.02 + Math.sin(t * 0.9 + i * 1.5) * 0.12;
        r.scale.setScalar(1 + Math.sin(t * 0.6 + i) * 0.03);
      });

      // Animate hex grid
      hexGridGroup.children.forEach((hex) => {
        hex.material.opacity = 0.1 + Math.sin(t * 1.2 + hex.userData.pulseOffset) * 0.05;
        hex.scale.setScalar(1 + Math.sin(t * 0.8 + hex.userData.pulseOffset) * 0.1);
      });

      primaryRing.material.opacity = 0.5 + Math.sin(t * 1.3) * 0.15;
      glowRing.material.opacity = 0.12 + Math.sin(t * 1.1) * 0.05;

      // Dynamic floating of nodes
      nodeMeshes.forEach((m, i) => {
        m.position.y = m.userData.baseY + Math.sin(t * 1.4 + m.userData.floatOffset) * 0.1;
        m.rotation.x += m.userData.rotSpeed * (i % 2 === 0 ? 1 : -1);
        m.rotation.y += m.userData.rotSpeed * 1.2;

        // Animate orbit rings
        if (m.userData.orbitRings) {
          m.userData.orbitRings.forEach((ring, j) => {
            ring.rotation.z += ring.userData.rotSpeed;
          });
        }

        // Animate node particles
        if (m.userData.particles) {
          m.userData.particles.forEach((p) => {
            p.userData.angle += p.userData.speed;
            p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
            p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
            p.position.y = p.userData.yOffset + Math.sin(p.userData.angle * 2) * 0.1;
          });
        }

        // Emissive decay
        if (m.userData.flash > 0) {
          m.userData.flash = Math.max(0, m.userData.flash - 0.04);
        }
        const target = m.userData.baseEmissive + m.userData.flash * 2.0;
        m.material.emissiveIntensity +=
          (target - m.material.emissiveIntensity) * 0.2;

        const halo = m.children[0];
        if (halo) {
          halo.material.opacity = 0.1 + m.userData.flash * 0.35;
          halo.scale.setScalar(1 + m.userData.flash * 0.3);
        }
      });

      // Data packet motion
      packets.forEach((p) => {
        const tt = ((t * p.speed) + p.offset) % 1;
        p.curve.getPointAt(tt, p.mesh.position);

        const scale = 0.7 + 0.8 * Math.sin(tt * Math.PI);
        p.mesh.scale.setScalar(scale);
        p.mesh.material.opacity = 0.65 + 0.4 * Math.sin(tt * Math.PI);

        // Flash target node when packet lands
        if (tt < p.lastT) {
          const node = nodeMeshes[p.target];
          if (node) node.userData.flash = 1.3;
        }
        p.lastT = tt;
      });

      // Animate cybernetic elements
      cyberElements.forEach((el) => {
        el.rotation.x += el.userData.rotSpeed.x;
        el.rotation.y += el.userData.rotSpeed.y;
        el.rotation.z += el.userData.rotSpeed.z;
        if (el.userData.floatOffset !== undefined) {
          el.position.y += Math.sin(t * 0.8 + el.userData.floatOffset) * 0.002;
        }
      });
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
