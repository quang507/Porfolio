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
  // 2. FRAMER ASTRA APPEAR ANIMATION ENGINE (Safe, non-blocking)
  // =========================================================================
  const targets = document.querySelectorAll(
    '.stat-card, .timeline-card-row, .accordion-item, .founder-editorial-row, .pricing-card, .dash-card, .stage-item, .project-work-card'
  );

  targets.forEach((el, idx) => {
    el.classList.add('framer-appear', 'will-animate');
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
      { threshold: 0.05, rootMargin: '50px 0px 0px 0px' }
    );

    document.querySelectorAll('.framer-appear').forEach((el) => {
      appearObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.framer-appear').forEach((el) => {
      el.classList.add('in-view');
    });
  }

  // Hero entrance trigger (Framer Astra 1:1 Majestic Cascade)
  function triggerHeroEntrance() {
    const heroElements = document.querySelectorAll(
      '.site-header, .hero-planet, .hero-lens-ring-outer, .hero-lens-ring-inner, ' +
      '.hero-satellite-wrap, .hero-satellite-orb, .hero-streak, .hero-title-wrap, .hero-subtitle-wrap, ' +
      '.hero-slogan-block, .hero-services-list'
    );
    heroElements.forEach((el) => el.classList.add('hero-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(triggerHeroEntrance, 80));
  } else {
    setTimeout(triggerHeroEntrance, 80);
  }

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
  // 4. HERO SERVICE STEP SELECTION & SMOOTH NAVIGATION (Heuristic #3 & #7)
  // =========================================================================
  const heroServiceItems = document.querySelectorAll('.hero-service-item');
  const serviceSection = document.getElementById('services');
  const accordionItemsList = document.querySelectorAll('.accordion-item');

  heroServiceItems.forEach((item, idx) => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', item.innerText.replace(/\s+/g, ' ').trim());

    const handleSelect = (e) => {
      heroServiceItems.forEach((x) => x.classList.remove('active'));
      item.classList.add('active');

      if (serviceSection) {
        const headerOffset = 90;
        const targetTop = serviceSection.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Expand corresponding accordion item
        if (accordionItemsList[idx]) {
          accordionItemsList.forEach((other) => other.classList.remove('open'));
          accordionItemsList[idx].classList.add('open');
          const header = accordionItemsList[idx].querySelector('.accordion-header');
          if (header) header.setAttribute('aria-expanded', 'true');
        }
      }
    };

    item.addEventListener('click', handleSelect);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(e);
      }
    });
  });

  // =========================================================================
  // 5. SERVICES ACCORDION (Astra 1:1 Expand & Rotate, ARIA & Keyboard support)
  // =========================================================================
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach((item, index) => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;

      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      header.setAttribute('aria-controls', `accordion-panel-${index}`);

      const body = item.querySelector('.accordion-body');
      if (body) body.id = `accordion-panel-${index}`;

      const toggleAccordion = () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        accordionItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            const h = other.querySelector('.accordion-header');
            if (h) h.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      };

      header.addEventListener('click', toggleAccordion);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAccordion();
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
    const duration = 1000;
    const isYear = (target >= 1900 && target <= 2100 && !suffix);

    if (prefersReduced || isNaN(target)) {
      el.textContent = prefix + (isYear ? target.toString() : target.toLocaleString('vi-VN')) + suffix;
      return;
    }

    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * ease);
      el.textContent = prefix + (isYear ? current.toString() : current.toLocaleString('vi-VN')) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + (isYear ? target.toString() : target.toLocaleString('vi-VN')) + suffix;
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

  // Header dynamic blur and brand color transition on scroll
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 50) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // =========================================================================
  // 8. SYSTEM NATIVE CURSOR PRESERVED (Custom cursor disabled per design specs)
  // =========================================================================

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


  // =========================================================================
  // 11. COSMIC BACKGROUND VIDEOS (Autoplay Safeguard)
  // =========================================================================
  const bgVideos = document.querySelectorAll('.hero-cosmos-video, .footer-cosmos-video');
  bgVideos.forEach((vid) => {
    vid.muted = true;
    vid.setAttribute('playsinline', '');
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: play on first user interaction
        const startPlay = () => {
          vid.play().catch(() => {});
          window.removeEventListener('click', startPlay);
          window.removeEventListener('scroll', startPlay);
          window.removeEventListener('touchstart', startPlay);
        };
        window.addEventListener('click', startPlay, { once: true });
        window.addEventListener('scroll', startPlay, { once: true });
        window.addEventListener('touchstart', startPlay, { once: true });
      });
    }
  });


  // =========================================================================
  // 12. PROJECT TIMELINE & GALLERY CARDS INTERACTIVITY (Full card clickable)
  // =========================================================================
  document.querySelectorAll('.timeline-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on a link inside, let it follow naturally
      if (e.target.closest('a')) return;
      window.location.href = 'projects.html';
    });
  });

  document.querySelectorAll('.project-work-card').forEach((card) => {
    const link = card.querySelector('.project-work-link');
    const thumb = card.querySelector('.project-work-thumb');
    const title = card.querySelector('.project-work-title');
    if (link) {
      if (thumb) {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          link.click();
        });
      }
      if (title) {
        title.addEventListener('click', (e) => {
          e.stopPropagation();
          link.click();
        });
      }
    }
  });

  // Lightbox backdrop click to dismiss
  const lightboxEl = document.getElementById('lightbox');
  if (lightboxEl) {
    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl || e.target.classList.contains('lightbox')) {
        const closeBtn = lightboxEl.querySelector('.lb-close') || lightboxEl.querySelector('button');
        if (closeBtn) closeBtn.click();
      }
    });
  }

  // Quick contact floating button removed per user request


  // =========================================================================
  // 14. BRAND PARTNERS & PROJECTS INTERACTION
  // =========================================================================
  document.querySelectorAll('.brand-tag[data-target]').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      const targetId = tag.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Add highlight pulse
        targetEl.classList.add('partner-highlight');
        setTimeout(() => {
          targetEl.classList.remove('partner-highlight');
        }, 1800);
      }
    });
  });

})();
