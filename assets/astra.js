/**
 * Astra Genuine Motion & Interaction Engine (Framer 1:1)
 * Directly extracted from https://astralab.framer.website/
 * 
 * 1. Framer Appear Animation System:
 *    - Slide in from y: -41px with opacity 0.001 -> 1
 *    - Transition: 0.8s ease-in-out with 0.2s / 0.4s / 0.6s stagger
 * 2. Hero Big Title & Celestial Sphere Entrance & Parallax
 * 3. Sticky Timeline Stacking Cards
 * 4. Services Accordion Expand / Collapse & Rotation
 * 5. Decelerated Stat Counters
 * 6. Full-screen Menu Overlay (00_Menu_Overlay) with radial reveal & stagger
 * 7. Cinematic Film Grain Atmosphere
 * 8. Astra Magnetic Cursor & Interactive Follower (Desktop only)
 * 9. Live Timezone Clock Widget (Asia/Ho_Chi_Minh • GMT+7)
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  // =========================================================================
  // 1. CINEMATIC FILM GRAIN ATMOSPHERE (Automatic Injection)
  // =========================================================================
  if (!document.querySelector('.grain-overlay')) {
    const grain = document.createElement('div');
    grain.className = 'grain-overlay';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  }

  // =========================================================================
  // 2. FRAMER ASTRA APPEAR ANIMATION ENGINE
  // =========================================================================
  const targets = document.querySelectorAll(
    '.stat-card, .timeline-card-row, .accordion-item, .founder-editorial-row, .pricing-card, .dash-card, .stage-item, .project-work-card'
  );

  targets.forEach((el, idx) => {
    el.classList.add('framer-appear');
    const delay = (idx % 3) + 1;
    el.classList.add(`framer-delay-${delay}`);
  });

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const appearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            appearObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('.framer-appear').forEach((el) => {
      appearObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.framer-appear').forEach((el) => {
      el.classList.add('in-view');
    });
  }

  // Hero entrance trigger on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.querySelector('.hero-planet')?.classList.add('in-view');
      document.querySelector('.hero-title-wrap')?.classList.add('in-view');
    }, 60);
  });

  // =========================================================================
  // 3. HERO PARALLAX ON SCROLL
  // =========================================================================
  const hero = document.querySelector('.hero-section');
  const heroPlanet = document.querySelector('.hero-planet');
  const heroTitle = document.querySelector('.hero-title-wrap');

  if (hero && heroPlanet && !prefersReduced) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const heroHeight = rect.height || 1;
          const progress = Math.min(Math.max(-rect.top / heroHeight, 0), 1);

          const scale = 1 - 0.12 * progress;
          const translateY = progress * 90;
          heroPlanet.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;

          if (heroTitle) {
            const titleY = progress * 40;
            heroTitle.style.transform = `translate3d(0, ${titleY.toFixed(1)}px, 0)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // =========================================================================
  // 4. HERO SERVICE STEP SELECTION
  // =========================================================================
  const heroServiceItems = document.querySelectorAll('.hero-service-item');
  heroServiceItems.forEach((item) => {
    item.addEventListener('click', () => {
      heroServiceItems.forEach((x) => x.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // =========================================================================
  // 5. SERVICES ACCORDION (Astra 1:1 Expand & Rotate)
  // =========================================================================
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        accordionItems.forEach((other) => {
          if (other !== item) other.classList.remove('open');
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    });
  }

  // =========================================================================
  // 6. STAT COUNTER ANIMATION
  // =========================================================================
  const counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1200;

    if (prefersReduced || isNaN(target)) {
      el.textContent = prefix + target.toLocaleString('vi-VN') + suffix;
      return;
    }

    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * ease);
      el.textContent = prefix + current.toLocaleString('vi-VN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + target.toLocaleString('vi-VN') + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  // =========================================================================
  // 7. FULL-SCREEN MENU OVERLAY (00_Menu_Overlay - Astra Genuine Fluid Reveal)
  // =========================================================================
  const menuTrigger = document.querySelector('.menu-trigger-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.menu-close-btn');

  function openMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.add('is-open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.remove('is-open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (menuTrigger) menuTrigger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  if (menuOverlay) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) closeMenu();
    });

    const navLinks = menuOverlay.querySelectorAll('.menu-overlay-nav a');
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  }

  // Header scroll state
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // =========================================================================
  // 8. ASTRA MAGNETIC CURSOR & INTERACTIVE FOLLOWER (Desktop fine pointer)
  // =========================================================================
  if (isFinePointer && !prefersReduced) {
    document.body.classList.add('has-custom-cursor');

    const cursorDot = document.createElement('div');
    cursorDot.className = 'astra-cursor-dot';
    cursorDot.setAttribute('aria-hidden', 'true');

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'astra-cursor-follower';
    cursorFollower.setAttribute('aria-hidden', 'true');

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorFollower);

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function animateCursor() {
      // Smooth lerp trailing physics
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      cursorFollower.style.left = `${followerX.toFixed(2)}px`;
      cursorFollower.style.top = `${followerY.toFixed(2)}px`;

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Interactive Hover States
    const interactiveSelectors = 'a, button, .contact-pill, .menu-trigger-btn, .menu-close-btn, .accordion-header, [data-cursor], .pricing-card-btn';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorFollower.classList.add('is-hovered'));
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('is-hovered'));
    });

    const viewSelectors = '.timeline-card-row, .hero-planet, .dash-card';
    document.querySelectorAll(viewSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorFollower.classList.add('is-view'));
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('is-view'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorFollower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorFollower.style.opacity = '1';
    });
  }

  // =========================================================================
  // 9. LIVE TIMEZONE CLOCK (Asia/Ho_Chi_Minh • GMT+7)
  // =========================================================================
  function updateLiveClock() {
    const bottomBar = document.querySelector('.footer-bottom-bar');
    if (!bottomBar) return;

    let clockEl = bottomBar.querySelector('.live-clock');
    if (!clockEl) {
      // Find the second child of footer-bottom-bar (the location text)
      const children = bottomBar.children;
      if (children.length >= 2) {
        children[1].innerHTML = `<div class="live-clock"><span class="clock-dot"></span> TP. Hồ Chí Minh, VN · <span id="clockTime">--:--:--</span> GMT+7</div>`;
      }
    }

    const timeSpan = document.getElementById('clockTime');
    if (!timeSpan) return;

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    timeSpan.textContent = formatter.format(now);
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();


  // =========================================================================
  // 10. CAREER STAGES & PLANET ORBS INTERACTIVE SELECTION (Hành trình)
  // =========================================================================
  const stageItems = document.querySelectorAll('.stage-item');
  const planetImages = document.querySelectorAll('.planets-arc-wrap img');

  function activateStage(index) {
    if (!stageItems.length) return;
    stageItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (planetImages.length) {
      planetImages.forEach((img, i) => {
        // Index 0: Stage 0 (Lead Visual -> portrait & villa photo)
        // Index 1: Stage 0 villa photo
        // Index 2: Stage 1 Gói packaging
        // Index 3: Stage 2 Web landing
        const isMatch = (index === 0 && (i === 0 || i === 1)) ||
                        (index === 1 && i === 2) ||
                        (index === 2 && i === 3);
        if (isMatch) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    }
  }

  if (stageItems.length > 0) {
    stageItems.forEach((item, idx) => {
      item.addEventListener('click', () => activateStage(idx));
    });

    if (planetImages.length > 0) {
      planetImages.forEach((img, idx) => {
        img.addEventListener('click', () => {
          const target = idx <= 1 ? 0 : (idx === 2 ? 1 : 2);
          activateStage(target);
        });
      });
    }

    // Initialize first stage
    activateStage(0);
  }

})();
