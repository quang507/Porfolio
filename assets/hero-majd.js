/* ============================================================
   Hero "Majd" interactions — Lenis + GSAP + Three.js
   Requires (loaded before this file):
     Lenis, gsap, ScrollTrigger, THREE
   ============================================================ */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- 1. Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
    window.mjLenis = lenis; // exposed for anchor links / debugging
  }

  /* ---------- 2. WebGL 3D star ---------- */
  function initWebGL() {
    const canvas = document.getElementById('mj-webgl');
    if (!canvas || !window.THREE) return;
    const THREE = window.THREE;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    // ---- build a 4-point glossy star ----
    function starShape(outer, inner) {
      const shape = new THREE.Shape();
      const points = 4, step = Math.PI / points;
      for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? outer : inner;
        const a = i * step - Math.PI / 2;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
      }
      shape.closePath();
      return shape;
    }
    const geo = new THREE.ExtrudeGeometry(starShape(1, 0.34), {
      depth: 0.5, bevelEnabled: true, bevelThickness: 0.18,
      bevelSize: 0.16, bevelSegments: 6, curveSegments: 24,
    });
    geo.center();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c, metalness: 0.85, roughness: 0.22,
    });

    const stars = [];
    function addStar(x, y, s) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, 0); m.scale.setScalar(s);
      m.rotation.z = Math.random() * Math.PI;
      scene.add(m); stars.push(m);
    }
    addStar(-3.4, 3.1, 0.92);   // top strip, big (above the headline)
    addStar(4.4, -3.0, 0.55);   // bottom strip, small

    // ---- lights: white key + purple rim = the iridescent edge ----
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.PointLight(0x6b53ff, 6, 40); rim.position.set(-5, -2, 4); scene.add(rim);
    const rim2 = new THREE.PointLight(0x3aa0ff, 4, 40); rim2.position.set(6, 3, 2); scene.add(rim2);

    // ---- responsive sizing ----
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize); resize();

    // ---- mouse parallax ----
    const mouse = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let scrollN = 0;
    if (lenis) lenis.on('scroll', ({ progress }) => { scrollN = progress || 0; });

    const clock = new THREE.Clock();
    function tick() {
      const t = clock.getElapsedTime();
      mouse.x += (target.x - mouse.x) * 0.05;   // lerp
      mouse.y += (target.y - mouse.y) * 0.05;
      stars.forEach((m, i) => {
        m.rotation.y = t * 0.45 + i + mouse.x * 0.6;
        m.rotation.x = Math.sin(t * 0.5 + i) * 0.35 + mouse.y * 0.4;
        m.position.y += Math.sin(t + i * 2) * 0.0016;   // gentle float
      });
      camera.position.x = mouse.x * 0.6;
      camera.position.y = -mouse.y * 0.4 - scrollN * 2.5; // drift on scroll
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }
  initWebGL();

  /* ---------- 3. Intro loader + hero reveal ---------- */
  function intro() {
    if (reduce || !window.gsap) { const l = $('#mj-loader'); if (l) l.remove(); return; }
    const gsap = window.gsap;
    const loader = $('#mj-loader');
    const tl = gsap.timeline();

    if (loader) {
      const count = { v: 0 };
      tl.to(count, {
        v: 100, duration: 1.1, ease: 'power1.inOut',
        onUpdate: () => { const c = $('#mj-count'); if (c) c.textContent = Math.round(count.v); },
      })
      .to('#mj-loader .mj-load-word', { yPercent: -110, duration: .6, ease: 'power3.in' }, '-=.15')
      .to(loader, { yPercent: -100, duration: .8, ease: 'power4.inOut',
        onComplete: () => loader.remove() }, '-=.2');
    }

    // headline lines rise from their masks
    tl.from('.mj-line span', { yPercent: 115, duration: 1, ease: 'power4.out', stagger: .12 }, '-=.5')
      .from('.mj-pill', { yPercent: -160, opacity: 0, duration: .8, ease: 'power3.out' }, '-=.7')
      .from('.mj-portrait', { scale: .6, opacity: 0, duration: .9, ease: 'power3.out' }, '-=.8')
      .from('.mj-meta, .mj-side, .mj-scroll', { opacity: 0, y: 16, duration: .7, stagger: .1 }, '-=.6');
  }
  intro();

  /* ---------- 4. Scroll-driven: pill morph + parallax + reveals ---------- */
  if (!reduce && window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    gsap.registerPlugin(ScrollTrigger);

    // pill shrinks + gains a shadow as you leave the hero
    gsap.to('.mj-pill', {
      scale: .92, boxShadow: '0 10px 30px rgba(0,0,0,.22)',
      scrollTrigger: { trigger: '.mj-hero', start: 'top top', end: '+=320', scrub: true },
    });

    // headline drifts up slower than scroll (parallax)
    gsap.to('.mj-title', {
      yPercent: -18, ease: 'none',
      scrollTrigger: { trigger: '.mj-hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.mj-portrait', {
      yPercent: 40, ease: 'none',
      scrollTrigger: { trigger: '.mj-hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // fade/slide-in every section block
    $$('[data-reveal]').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
  }
})();
