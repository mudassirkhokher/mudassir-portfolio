/* ===================================================================
   MUDASSIR TAHIR — AI AUTOMATION ENGINEER
   Redirect to Enhanced Script
   =================================================================== */

// Load the enhanced script
(function() {
  const script = document.createElement('script');
  script.src = 'js/script-enhanced.js';
  script.async = false;
  document.head.appendChild(script);
})();
      setTimeout(() => {
        pre.classList.add('is-done');
        document.documentElement.classList.remove('is-loading');
        setTimeout(() => pre.remove(), 800);
      }, 220);
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  // safety: force finish after 4s regardless
  setTimeout(() => {
    if (progress < 100) {
      loaded = true;
      progress = 99.5;
    }
  }, 4000);

  rafId = requestAnimationFrame(tick);
})();

/* ===================================================================
   3. CUSTOM CURSOR
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

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;

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

  // grow on interactive elements
  const hoverables = 'a, button, .btn, .glass, .tags span, input, textarea, .node-dot';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(hoverables)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(hoverables)) document.body.classList.remove('cursor-hover');
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
      // progress of the spine through the viewport
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
    const duration = 1400;
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
   8. POINTER TILT
   =================================================================== */
(function tilt() {
  if (prefersReducedMotion || isTouch) return;

  const MAX_RX = 5.5;
  const MAX_RY = 7.5;

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
        el.style.setProperty('--sc', '1.012');
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
   9. AMBIENT BACKGROUND FIELD  (Three.js)
   Sparse constellation of drifting points with proximity links.
   Reads as "always-on network" behind the whole page.
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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080c, 0.028);

  const camera = new THREE.PerspectiveCamera(
    58,
    window.innerWidth / window.innerHeight,
    0.1,
    80
  );
  camera.position.set(0, 0, 18);

  const COUNT = 150;
  const SPREAD_X = 36;
  const SPREAD_Y = 22;
  const SPREAD_Z = 20;

  const positions = new Float32Array(COUNT * 3);
  const speeds = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * SPREAD_X;
    positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z - 6;
    speeds[i] = 0.015 + Math.random() * 0.05;
    phases[i] = Math.random() * Math.PI * 2;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const pointsMat = new THREE.PointsMaterial({
    color: 0x6f83a8,
    size: 0.06,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const pointCloud = new THREE.Points(pointsGeo, pointsMat);
  scene.add(pointCloud);

  /* --- proximity links --- */
  const MAX_LINES = 110;
  const LINK_DIST_SQ = 7.0;

  const lineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(MAX_LINES * 2 * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x394a68,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });

  const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineMesh);

  function rebuildLines() {
    let idx = 0;
    for (let i = 0; i < COUNT && idx < MAX_LINES; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < COUNT && idx < MAX_LINES; j++) {
        const jx = j * 3;
        const dx = positions[ix] - positions[jx];
        const dy = positions[ix + 1] - positions[jx + 1];
        const dz = positions[ix + 2] - positions[jx + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < LINK_DIST_SQ) {
          const o = idx * 6;
          linePositions[o]     = positions[ix];
          linePositions[o + 1] = positions[ix + 1];
          linePositions[o + 2] = positions[ix + 2];
          linePositions[o + 3] = positions[jx];
          linePositions[o + 4] = positions[jx + 1];
          linePositions[o + 5] = positions[jx + 2];
          idx++;
        }
      }
    }
    // clear leftover slots
    if (idx < MAX_LINES) {
      linePositions.fill(0, idx * 6, MAX_LINES * 6);
    }
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, idx * 2);
  }
  rebuildLines();

  /* --- pointer parallax --- */
  let targetX = 0, targetY = 0;
  window.addEventListener('pointermove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  }, { passive: true });

  /* --- resize --- */
  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, { passive: true });

  /* --- loop --- */
  let frame = 0;
  let running = true;

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) animate();
  });

  const baseColor = { r: 0.435, g: 0.514, b: 0.658 }; // 0x6f83a8

  function animate() {
    if (!running) return;
    frame++;

    // drift + wrap
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      positions[ix] += speeds[i] * 0.0032;
      positions[ix + 1] += Math.sin(frame * 0.0035 + phases[i]) * 0.0009;
      if (positions[ix] > SPREAD_X / 2) positions[ix] = -SPREAD_X / 2;
    }
    pointsGeo.attributes.position.needsUpdate = true;

    if (frame % 5 === 0) rebuildLines();

    // camera easing
    camera.position.x += (targetX - camera.position.x) * 0.022;
    camera.position.y += (-targetY - camera.position.y) * 0.022;
    camera.lookAt(0, 0, -4);

    // hue drifts toward teal as the page scrolls
    const max = document.body.scrollHeight - window.innerHeight || 1;
    const frac = Math.min(Math.max(window.scrollY / max, 0), 1);
    pointsMat.color.setRGB(
      baseColor.r - frac * 0.10,
      baseColor.g + frac * 0.16,
      baseColor.b + frac * 0.03
    );
    lineMat.opacity = 0.22 + frac * 0.10;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===================================================================
   10. HERO PIPELINE GRAPH  (Three.js)
   trigger → reason → route, with packets travelling the edges.
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
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.1, 13.5);
  const CAM_REST_Z = 9.2;

  /* ---- sizing ---- */
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

  /* ---- palette ---- */
  const AMBER   = 0xe3a857;
  const TEAL    = 0x57c2b0;
  const NEUTRAL = 0x8ea3c9;
  const LINE    = 0x394260;

  /* ---- lights ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const keyLight = new THREE.PointLight(0xffffff, 1.15, 26);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(TEAL, 0.75, 24);
  rimLight.position.set(-5, -2, -4);
  scene.add(rimLight);

  const amberLight = new THREE.PointLight(AMBER, 0.5, 22);
  amberLight.position.set(-4, 3, 3);
  scene.add(amberLight);

  /* ---- group ---- */
  const group = new THREE.Group();
  scene.add(group);

  /* ---- platform rings ---- */
  const platform = new THREE.Group();
  platform.position.y = -2.35;

  const outerRing = new THREE.Mesh(
    new THREE.RingGeometry(2.85, 2.875, 96),
    new THREE.MeshBasicMaterial({
      color: TEAL, transparent: true, opacity: 0.32, side: THREE.DoubleSide,
    })
  );
  outerRing.rotation.x = -Math.PI / 2;
  platform.add(outerRing);

  const gridRings = [];
  for (let i = 1; i <= 3; i++) {
    const r = i * 0.88;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r, r + 0.006, 96),
      new THREE.MeshBasicMaterial({
        color: 0x394a68, transparent: true, opacity: 0.24, side: THREE.DoubleSide,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    platform.add(ring);
    gridRings.push(ring);
  }

  // radial spokes
  const spokes = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9),
      new THREE.Vector3(Math.cos(a) * 2.82, 0, Math.sin(a) * 2.82),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: 0x394a68, transparent: true, opacity: 0.18,
    });
    spokes.add(new THREE.Line(geo, mat));
  }
  platform.add(spokes);

  group.add(platform);

  /* ---- nodes: trigger → agent → router → 3 actions ---- */
  const nodeDefs = [
    { pos: [-3.6, 1.35, 0.2],  color: AMBER,   r: 0.27 },  // 0 trigger
    { pos: [-1.55, 0.05, 0.7], color: NEUTRAL, r: 0.22 },  // 1 agent
    { pos: [0.45, 1.05, -0.5], color: NEUTRAL, r: 0.23 },  // 2 router
    { pos: [2.7, 2.15, 0.4],   color: TEAL,    r: 0.19 },  // 3 action 1
    { pos: [3.0, 0.15, 0.95],  color: TEAL,    r: 0.19 },  // 4 action 2
    { pos: [2.55, -1.6, -0.2], color: TEAL,    r: 0.19 },  // 5 action 3
  ];
  const edgeDefs = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5]];

  const nodeMeshes = nodeDefs.map((def, i) => {
    const geo = new THREE.IcosahedronGeometry(def.r, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: def.color,
      emissive: def.color,
      emissiveIntensity: 0.35,
      roughness: 0.38,
      metalness: 0.2,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
    mesh.userData.baseEmissive = 0.35;
    mesh.userData.flash = 0;
    mesh.userData.index = i;

    // faint halo shell
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(def.r * 1.85, 16, 16),
      new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
      })
    );
    mesh.add(halo);

    group.add(mesh);
    return mesh;
  });

  /* ---- edges ---- */
  const edgeData = edgeDefs.map(([a, b]) => {
    const pa = new THREE.Vector3(...nodeDefs[a].pos);
    const pb = new THREE.Vector3(...nodeDefs[b].pos);
    const mid = pa.clone().lerp(pb, 0.5).add(new THREE.Vector3(0, 0.18, 0.45));
    const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
    const pts = curve.getPoints(48);

    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: LINE, transparent: true, opacity: 0.65,
    });
    group.add(new THREE.Line(geo, mat));

    return { curve, from: a, to: b, targetColor: nodeDefs[b].color };
  });

  /* ---- travelling packets ---- */
  const packetGeo = new THREE.SphereGeometry(0.055, 10, 10);
  const packets = edgeData.map((edge, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: edge.targetColor,
      transparent: true,
      opacity: 0.95,
    });
    const mesh = new THREE.Mesh(packetGeo, mat);
    group.add(mesh);

    // trailing glow
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 10, 10),
      new THREE.MeshBasicMaterial({
        color: edge.targetColor,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    );
    mesh.add(glow);

    return {
      mesh,
      curve: edge.curve,
      target: edge.to,
      offset: i * 0.31,
      speed: 0.20 + (i % 3) * 0.035,
      lastT: 0,
    };
  });

  /* ---- orientation ---- */
  const baseRotX = -0.13;
  const baseRotY = -0.38;
  group.rotation.set(baseRotX, baseRotY, 0);

  let targetRotX = baseRotX;
  let targetRotY = baseRotY;

  if (!prefersReducedMotion) {
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = baseRotY + nx * 0.55;
      targetRotX = baseRotX - ny * 0.32;
    }, { passive: true });

    canvas.addEventListener('pointerleave', () => {
      targetRotX = baseRotX;
      targetRotY = baseRotY;
    });
  }

  /* ---- loop ---- */
  const clock = new THREE.Clock();
  let running = true;

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) animate();
  });

  function animate() {
    if (!running) return;

    const t = clock.getElapsedTime();

    // one-time dolly-in
    camera.position.z += (CAM_REST_Z - camera.position.z) * 0.028;

    if (!prefersReducedMotion) {
      // pointer parallax + autonomous drift
      group.rotation.x += (targetRotX - group.rotation.x) * 0.045;
      group.rotation.y +=
        (targetRotY + Math.sin(t * 0.11) * 0.055 - group.rotation.y) * 0.045;

      platform.rotation.y += 0.0016;
      spokes.rotation.y -= 0.0009;
      gridRings.forEach((r, i) => {
        r.material.opacity = 0.16 + Math.sin(t * 0.7 + i * 1.1) * 0.08;
      });
      outerRing.material.opacity = 0.26 + Math.sin(t * 0.9) * 0.09;

      // packets
      packets.forEach((p) => {
        const tt = ((t * p.speed) + p.offset) % 1;
        p.curve.getPointAt(tt, p.mesh.position);

        const scale = 0.55 + 0.65 * Math.sin(tt * Math.PI);
        p.mesh.scale.setScalar(scale);
        p.mesh.material.opacity = 0.55 + 0.45 * Math.sin(tt * Math.PI);

        // wrap detection → flash the destination node
        if (tt < p.lastT) {
          const node = nodeMeshes[p.target];
          if (node) node.userData.flash = 1;
        }
        p.lastT = tt;
      });

      // node spin + flash decay
      nodeMeshes.forEach((m, i) => {
        m.rotation.x += 0.0026 * (i % 2 === 0 ? 1 : -1);
        m.rotation.y += 0.0032;

        if (m.userData.flash > 0) {
          m.userData.flash = Math.max(0, m.userData.flash - 0.045);
        }
        const target = m.userData.baseEmissive + m.userData.flash * 1.5;
        m.material.emissiveIntensity +=
          (target - m.material.emissiveIntensity) * 0.18;

        const halo = m.children[0];
        if (halo) {
          halo.material.opacity = 0.05 + m.userData.flash * 0.22;
          halo.scale.setScalar(1 + m.userData.flash * 0.16);
        }
      });
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();