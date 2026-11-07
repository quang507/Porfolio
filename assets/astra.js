/**
 * Astra Genuine Motion & Interaction Engine (Framer 1:1)
 * Directly extracted from https://astralab.framer.website/
 * 
 * 1. Framer Appear Animation System
 * 2. Hero Big Title & Celestial Sphere Entrance & Parallax
 * 3. Sticky Timeline Stacking Cards
 * 4. Services Accordion Expand / Collapse & Rotation
 * 5. Decelerated Stat Counters
 * 6. Full-screen Menu Overlay (00_Menu_Overlay) with radial reveal & stagger
 * 7. Cinematic Film Grain Atmosphere
 * 8. Live Timezone Clock Widget (Asia/Ho_Chi_Minh • GMT+7)
 * 9. Deep-Dive UX & Product Case Study Drawer (openCaseStudy / closeCaseStudy)
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    setTimeout(() => {
      const p = document.querySelector('.hero-planet');
      if (p) p.style.transition = 'none';
    }, 850);
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
  // 4. HERO SERVICE STEP SELECTION & SMOOTH NAVIGATION
  // =========================================================================
  const heroServiceItems = document.querySelectorAll('.hero-service-item');
  const serviceSection = document.getElementById('services');
  const accordionItemsList = document.querySelectorAll('.accordion-item');

  heroServiceItems.forEach((item, idx) => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', item.innerText.replace(/\s+/g, ' ').trim());

    const handleSelect = () => {
      heroServiceItems.forEach((x) => x.classList.remove('active'));
      item.classList.add('active');

      if (serviceSection) {
        const headerOffset = 90;
        const targetTop = serviceSection.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

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
        handleSelect();
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

        accordionItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            const h = other.querySelector('.accordion-header');
            if (h) h.setAttribute('aria-expanded', 'false');
          }
        });

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
  // 8. LIVE TIMEZONE CLOCK (Asia/Ho_Chi_Minh • GMT+7)
  // =========================================================================
  function updateLiveClock() {
    const bottomBar = document.querySelector('.footer-bottom-bar');
    if (!bottomBar) return;

    let clockEl = bottomBar.querySelector('.live-clock');
    if (!clockEl) {
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
  // 9. CAREER STAGES & PLANET ORBS INTERACTIVE SELECTION (Hành trình)
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

    activateStage(0);
  }

  // =========================================================================
  // 10. COSMIC BACKGROUND VIDEOS (Autoplay Safeguard)
  // =========================================================================
  const bgVideos = document.querySelectorAll('.hero-cosmos-video, .footer-cosmos-video');
  bgVideos.forEach((vid) => {
    vid.muted = true;
    vid.setAttribute('playsinline', '');
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
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
  // 11. PROJECT TIMELINE & GALLERY CARDS INTERACTIVITY
  // =========================================================================
  document.querySelectorAll('.project-work-card').forEach((card) => {
    const link = card.querySelector('.cs-trigger-btn') || card.querySelector('.project-work-link');
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

  // =========================================================================
  // 12. BRAND PARTNERS & PROJECTS INTERACTION
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

        targetEl.classList.add('partner-highlight');
        setTimeout(() => {
          targetEl.classList.remove('partner-highlight');
        }, 1800);
      }
    });
  });

  // =========================================================================
  // 13. HEURISTIC INTERACTION EXPANSIONS (Timeline Cards & Tool Popover)
  // =========================================================================
  document.querySelectorAll('.timeline-card-row').forEach((row) => {
    const card = row.querySelector('.timeline-card');
    const csBtn = row.querySelector('[data-casestudy]');
    const link = row.querySelector('.timeline-view-link');
    if (card) {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        if (csBtn) {
          csBtn.click();
        } else if (link) {
          link.click();
        }
      });
    }
  });

  const toolBadgeMore = document.getElementById('toolBadgeMore');
  const toolsPopover = document.getElementById('toolsPopover');

  if (toolBadgeMore && toolsPopover) {
    toolBadgeMore.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toolsPopover.classList.toggle('open');
      toolsPopover.setAttribute('aria-hidden', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!toolsPopover.contains(e.target) && e.target !== toolBadgeMore) {
        toolsPopover.classList.remove('open');
        toolsPopover.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toolsPopover.classList.contains('open')) {
        toolsPopover.classList.remove('open');
        toolsPopover.setAttribute('aria-hidden', 'true');
      }
    });
  }

  const footerWatermark = document.querySelector('.footer-giant-brand-link');
  if (footerWatermark) {
    footerWatermark.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 14. DEEP-DIVE UX & PRODUCT CASE STUDY ENGINE (Framer Case Study Architecture)
  // =========================================================================
  const CASE_STUDIES = {
    nyah: {
      kicker: 'CASE STUDY 01 · BẤT ĐỘNG SẢN CAO CẤP & TỐI ƯU CHUYỂN ĐỔI (CRO)',
      title: 'Compound Ny\'ah Phú Định & Villa Ny\'ah: Thiết kế trải nghiệm mở bán dựa trên dữ liệu hành vi',
      subtitle: 'Từ việc chụp ảnh kiến trúc HDR nguồn, xây dựng hệ thống giao diện trên Figma đến đo lường bản đồ nhiệt Microsoft Clarity, GA4 và Google Search Console để giải quyết điểm nghẽn tâm lý của khách mua nhà phân khúc 8 – 15 tỷ.',
      year: '2025 – Nay',
      role: 'Lead Visual & Design Engineer (UI/UX, SEO/CRO, Nhiếp ảnh HDR)',
      scope: 'UX Research · User Journey · Figma UI · Clarity / GA4 / GSC · AI Visual Search',
      platform: 'Web Responsive & Sales Gallery Interactive',
      cover: 'media/nyah-photo-2.jpg',
      liveUrl: 'https://polite-hamster-cf3510.netlify.app/',
      liveLabel: 'Xem Landing Page Villa Ny\'ah ↗',
      context: 'Trong thị trường bất động sản nhà phố compound và biệt thự ven sông tại TP.HCM, khách hàng có giá trị giao dịch lớn (high-ticket) ngày càng cảnh giác với các hình vẽ phối cảnh 3D bóng bẩy nhưng thiếu thực tế. Khi phụ trách toàn bộ hình ảnh và giao diện số cho hai dự án trọng điểm của Nhã Đạt (Compound 50 căn Ny\'ah Phú Định Quận 8 và Villa Ny\'ah Ven Sông), bài toán không chỉ là làm một trang web đẹp, mà là xây dựng niềm tin thị giác đủ lớn để khách hàng sẵn sàng để lại số điện thoại đặt lịch tham quan nhà mẫu.',
      problemQuote: 'Problem Statement: Khách hàng phân khúc cao cấp thoát trang sớm vì nghi ngờ ảnh phối cảnh 3D ảo, bị ngợp bởi thông tin quy hoạch rời rạc và ngần ngại điền form đăng ký khi chưa biết rõ giá trị thực tế cũng như chính sách thanh toán.',
      painPoints: [
        {
          title: 'Điểm đau 01 · Khoảng cách niềm tin thị giác (Visual Trust Gap)',
          desc: 'Phần lớn landing page bất động sản dùng ảnh render 3D hoặc ảnh chụp bị cháy sáng cửa sổ, méo góc rộng, khiến người xem cảm thấy không gian giả tạo và rời trang ngay ở 15 giây đầu tiên.'
        },
        {
          title: 'Điểm đau 02 · Đứt gãy luồng đọc trên thiết bị di động',
          desc: 'Qua theo dõi Microsoft Clarity (session recordings & scroll heatmaps), hơn 75% lưu lượng đến từ điện thoại nhưng người dùng thường dừng cuộn ở các khối văn bản giới thiệu dài dòng trước khi kịp nhìn thấy mặt bằng căn mẫu và nút đặt lịch.'
        },
        {
          title: 'Điểm đau 03 · Chậm trễ trong khâu cung cấp tư liệu cho đội Sales',
          desc: 'Kho hình chụp tiến độ công trình và nội thất lên tới hơn 10.000 file RAW/JPEG khiến đội ngũ kinh doanh mất 15 – 20 phút mỗi lần tìm đúng góc chụp khách hàng yêu cầu.'
        },
        {
          title: 'Điểm đau 04 · Rào cản tâm lý ở bước để lại thông tin (Form Friction)',
          desc: 'Khách hàng ngại điền form truyền thống vì sợ bị làm phiền nếu chưa được giải đáp nhanh các câu hỏi cơ bản về diện tích, hướng nhà và lịch thanh toán.'
        }
      ],
      flowTitle: 'Tư duy thiết kế & Mô hình chuyển đổi 4 bước (Hook & Trust Loop)',
      flowSteps: [
        {
          num: '01 · TRIGGER (KÍCH HOẠT)',
          title: 'Ấn tượng thị giác thật 100%',
          desc: 'Thay thế hoàn toàn ảnh 3D bằng bộ ảnh chụp kiến trúc HDR thực tế (kéo sáng cửa sổ, nắn thẳng trục đứng) ngay tại màn hình đầu tiên (Above the Fold).'
        },
        {
          num: '02 · ACTION (HÀNH ĐỘNG)',
          title: 'Luồng khám phá không ma sát',
          desc: 'Tái cấu trúc Information Architecture (IA): gom nhóm Mặt bằng – Tiện ích – Tiến độ thực tế thành các thẻ trực quan dễ lướt bằng một ngón cái trên di động.'
        },
        {
          num: '03 · VARIABLE REWARD',
          title: 'Phản hồi tức thì bằng AI',
          desc: 'Tích hợp trợ lý AI trả lời ngay bảng giá, chính sách chiết khấu bằng tiếng Việt tự nhiên thay vì bắt khách hàng chờ nhân viên gọi lại.'
        },
        {
          num: '04 · INVESTMENT (CHUYỂN ĐỔI)',
          title: 'Đặt lịch tham quan 1 chạm',
          desc: 'Đặt cụm CTA cố định (Sticky Action) và form đăng ký rút gọn chỉ 2 trường thông tin đúng tại điểm dừng mắt (Heatmap Hotspot).'
        }
      ],
      solutions: [
        {
          title: '1. Tối ưu UI/UX & CRO dựa trên dữ liệu Microsoft Clarity, GA4 và GSC',
          desc: 'Cài đặt Microsoft Clarity để xem lại video phiên truy cập (session recordings) và bản đồ nhiệt (click/scroll heatmaps), kết hợp Google Analytics 4 (GA4) theo dõi sự kiện cuộn trang và Google Search Console (GSC) để tối ưu từ khóa tìm kiếm địa phương (nhà phố Quận 8, compound Phú Định). Từ dữ liệu thực tế, tôi rút gọn độ dài khối chữ đầu trang, đưa bộ ảnh thực tế căn mẫu Cosmo lên vị trí vàng và tinh chỉnh lại độ tương phản của nút CTA.'
        },
        {
          title: '2. Chủ động nhiếp ảnh kiến trúc HDR & Chuẩn hóa thẩm mỹ thực tế',
          desc: 'Trực tiếp bấm máy toàn bộ ngoại thất, ban công xanh, phòng khách và bếp căn mẫu bằng kỹ thuật phơi sáng đa lớp (HDR Bracketing), giữ trọn chi tiết cảnh quan bên ngoài cửa sổ và độ ấm của vật liệu nội thất.'
        },
        {
          title: '3. Xây dựng công cụ AI tìm kiếm thị giác (CLIP + FAISS) cho kho 10.000+ ảnh',
          desc: 'Để giải quyết bài toán vận hành nội bộ, tôi tự viết ứng dụng Tìm Hình Quang bằng Python, Streamlit, mô hình thị giác CLIP và cơ sở dữ liệu vector FAISS. Đội ngũ chỉ cần gõ mô tả tiếng Việt tự nhiên (ví dụ: "phòng khách căn mẫu có nắng chiều") là lấy được đúng ảnh dưới 2 giây.'
        }
      ],
      metrics: [
        { num: 'Clarity + GA4', label: 'Đo lường trực tiếp bản đồ nhiệt (heatmap), tỷ lệ cuộn trang và phễu sự kiện chuyển đổi.' },
        { num: '< 2 Giây', label: 'Thời gian truy vấn chính xác hình ảnh trong kho 10.000+ file kiến trúc bằng AI CLIP/FAISS.' },
        { num: '50 Căn', label: 'Compound Ny\'ah Phú Định & phân khu Villa được đồng bộ 100% nhận diện, web và ấn phẩm mở bán.' }
      ]
    },
    goi: {
      kicker: 'CASE STUDY 02 · B2B E-COMMERCE, DESIGN SYSTEM & AI AUTOMATION',
      title: 'Xưởng bao bì GÓI: Từ Design System đến Website 11 trang & Bot báo giá hộp giấy tự động',
      subtitle: 'Giải quyết điểm nghẽn báo giá thủ công chậm trễ của ngành in bao bì truyền thống bằng hệ thống thiết kế đồng bộ, luồng tra cứu quy cách trực quan và động cơ tính giá AI kiểm chứng trên 1.400 đơn hàng.',
      year: '2025 – 2026',
      role: 'Design Engineer (Brand Identity, Figma Design System, Frontend & AI Bot)',
      scope: 'UX Research · Design Tokens · Web 11 Trang · Python & Gemini Quoting Bot',
      platform: 'Web Thương mại B2B & Hệ thống Báo giá Tự động',
      cover: 'media/goi-1.jpg',
      liveUrl: 'https://goi-v2.vercel.app',
      liveLabel: 'Truy cập Website GÓI ↗',
      context: 'Trong ngành sản xuất bao bì hộp giấy B2B, khách hàng doanh nghiệp nhỏ và các chủ thương hiệu (local brands) thường rất lúng túng trước hàng loạt thuật ngữ kỹ thuật: định lượng giấy (Ivory, Duplex, Kraft), sóng carton (sóng E, sóng B), cán màng, ép kim và khổ trải khuôn bế (dieline). Ở chiều ngược lại, bộ phận kinh doanh của xưởng mất từ 30 phút đến vài giờ để tính toán chi phí giấy, kẽm in và gia công cho mỗi yêu cầu hỏi giá, dẫn đến tỷ lệ rớt khách cao.',
      problemQuote: 'Problem Statement: Khách đặt in hộp không hiểu thông số kỹ thuật nên gửi yêu cầu thiếu dữ liệu, trong khi xưởng in mất quá nhiều thời gian tính giá thủ công trên Excel khiến khách hàng rời đi chọn đối thủ phản hồi nhanh hơn.',
      painPoints: [
        {
          title: 'Điểm đau 01 · Rào cản thuật ngữ kỹ thuật in ấn (Cognitive Overload)',
          desc: 'Khách hàng mới không phân biệt được các kiểu nắp hộp (hộp âm dương, hộp nắp gài, hộp rút) và chất liệu giấy nếu chỉ đọc bảng chữ thông thường.'
        },
        {
          title: 'Điểm đau 02 · Quy trình báo giá thủ công rời rạc, dễ sai sót',
          desc: 'Mỗi đơn hàng phụ thuộc vào kích thước 3 chiều (Dài × Rộng × Cao), số lượng in và quy cách gia công sau in; tính nhẩm hoặc tra bảng thủ công rất chậm và thiếu nhất quán.'
        },
        {
          title: 'Điểm đau 03 · Thiếu hệ thống hình ảnh sản phẩm chuẩn mực',
          desc: 'Các xưởng in truyền thống thường dùng ảnh chụp điện thoại thiếu sáng hoặc ảnh lấy trên mạng, không thể hiện được độ sắc nét của đường cấn bế và chất lượng bề mặt giấy.'
        },
        {
          title: 'Điểm đau 04 · Giao diện web B2B khô khan, thiếu luồng dẫn dắt',
          desc: 'Người dùng truy cập website không biết bắt đầu từ việc chọn kiểu hộp, chọn ngành hàng hay gửi kích thước trước.'
        }
      ],
      flowTitle: 'Kiến trúc thông tin (IA) & Luồng đặt in 4 bước giảm tải nhận thức',
      flowSteps: [
        {
          num: '01 · VISUAL CATALOG',
          title: 'Chọn kiểu hộp qua hình thật',
          desc: 'Trực quan hóa toàn bộ danh mục hộp bằng ảnh chụp studio và mockup 3D sắc nét, phân loại theo ngành hàng (mỹ phẩm, F&B, quà tặng).'
        },
        {
          num: '02 · GUIDED SPECS',
          title: 'Nhập quy cách có gợi ý',
          desc: 'Hướng dẫn người dùng nhập kích thước Dài × Rộng × Cao và số lượng kèm gợi ý chất liệu giấy tối ưu chi phí.'
        },
        {
          num: '03 · AI PARSING ENGINE',
          title: 'Bóc tách & Tính giá tự động',
          desc: 'Bot Python + Gemini API tự động đọc tin nhắn tự nhiên của khách, quy đổi khổ trải giấy, tính số lượng con trên tờ in và áp công thức giá xưởng.'
        },
        {
          num: '04 · INSTANT QUOTE',
          title: 'Nhận báo giá & Chốt khuôn bế',
          desc: 'Trả bảng báo giá chi tiết theo từng mốc số lượng ngay lập tức, chuyển thẳng sang bước duyệt file thiết kế chuẩn in.'
        }
      ],
      solutions: [
        {
          title: '1. Xây dựng Figma Design System & Website thương mại 11 trang hoàn chỉnh',
          desc: 'Thiết lập hệ thống Design Tokens (màu sắc lấy cảm hứng từ chất liệu giấy mộc và mực in công nghiệp, hệ thống lưới 12 cột và các component thẻ sản phẩm tái sử dụng). Trực tiếp lập trình toàn bộ 11 trang web thương mại với tốc độ tải nhanh và trải nghiệm mượt mà trên cả máy tính lẫn điện thoại.'
        },
        {
          title: '2. Phát triển Bot báo giá AI tự động (Python + Gemini API)',
          desc: 'Kết hợp kinh nghiệm thực tế trong ngành kỹ thuật in với lập trình Python và Gemini API để xây dựng luồng tính giá tự động: nhận diện yêu cầu viết tự do của khách hàng, tự động tính diện tích khổ trải, hao hụt giấy và chi phí gia công.'
        },
        {
          title: '3. Kiểm thử thực nghiệm trên 1.400 đơn hàng mẫu (Validation)',
          desc: 'Chạy đối soát kết quả tính giá của hệ thống với 1.400 đơn hàng thực tế của xưởng để tinh chỉnh các trường hợp biên (edge cases) như hộp kích thước quá khổ phải ghép bài in hoặc đơn hàng số lượng ít.'
        }
      ],
      metrics: [
        { num: '11 Trang', label: 'Website thương mại hoàn chỉnh từ trang chủ, danh mục quy cách đến luồng đặt hàng.' },
        { num: '1.400 Đơn', label: 'Đơn hàng mẫu được chạy kiểm thử đối soát để đảm bảo độ chính xác của thuật toán báo giá.' },
        { num: 'Tức thì', label: 'Rút ngắn thời gian phản hồi báo giá sơ bộ từ hàng chục phút xuống chỉ còn vài giây.' }
      ]
    },
    radar: {
      kicker: 'CASE STUDY 03 · AI PRODUCT DESIGN, CONVERSATION UI & SPATIAL DATA',
      title: 'NhaDat Radar & AI Chatbot: Giải quyết bài toán "tin rác, giá ảo" trên thị trường bất động sản',
      subtitle: 'Nghiên cứu nỗi đau của người tìm mua nhà trước ma trận tin đăng trùng lặp, từ đó thiết kế nền tảng bản đồ số PostGIS kết hợp trợ lý hội thoại AI (Gemini RAG) và điều khiển slide bằng giọng nói.',
      year: '2025',
      role: 'Product Designer & Full-stack AI Builder',
      scope: 'Problem Deconstruction · Spatial UX · Conversation Design · Next.js 15 / PostGIS / pgvector',
      platform: 'Web App Bản đồ Số & AI Voice/Chat Assistant',
      cover: 'media/thumb/radar-diagram.jpg',
      liveUrl: 'https://nha-dat-chatbot.vercel.app',
      liveLabel: 'Dùng thử AI Chatbot & Live Slide ↗',
      repoUrl: 'https://github.com/quang507/NhaDat-Radar',
      context: 'Tương tự như cách người mua vé sự kiện sợ "vé chợ đen, QR giả" (trong bài toán OneSeat), người đi tìm mua nhà thực tại Việt Nam luôn đối mặt với tâm lý bất an trước "tin mồi, giá ảo và tin đăng trùng lặp". Cùng một căn nhà nhưng có tới hàng chục môi giới đăng lại trên nhiều trang khác nhau với mức giá và diện tích sai lệch, khiến người dùng mất hàng tuần lọc tin mà vẫn không nắm được mặt bằng giá thật của khu vực.',
      problemQuote: 'Problem Statement: Người mua nhà bị quá tải thông tin bởi hàng nghìn tin đăng trùng lặp, thiếu vị trí thực tế trên bản đồ và phải đọc các mô tả quảng cáo phóng đại thay vì dữ liệu đã được kiểm chứng.',
      painPoints: [
        {
          title: 'Điểm đau 01 · Nhiễu loạn tin trùng lặp từ nhiều nguồn (Duplicate Noise)',
          desc: 'Một bất động sản bị đăng đi đăng lại trên 5 – 6 sàn tin với tiêu đề giật tít khác nhau, làm loãng kết quả tìm kiếm của người mua thực.'
        },
        {
          title: 'Điểm đau 02 · Mù mờ về không gian & Tọa độ địa lý',
          desc: 'Danh sách tin dạng thẻ truyền thống không cho phép người dùng hình dung ngay căn nhà nằm ở vị trí nào, cách trục đường chính bao xa và giá các căn lân cận trong bán kính 1km ra sao.'
        },
        {
          title: 'Điểm đau 03 · Bộ lọc cứng nhắc, thiếu ngữ cảnh tự nhiên',
          desc: 'Người mua thường có nhu cầu phức hợp (ví dụ: "tìm nhà gần trường học Quận 8 tài chính dưới 9 tỷ có chỗ đậu ô tô"), nhưng bộ lọc dropdown truyền thống đòi hỏi quá nhiều bước bấm.'
        },
        {
          title: 'Điểm đau 04 · Gián đoạn khi tư vấn trực tiếp tại Sales Gallery',
          desc: 'Chuyên viên tư vấn khi đang nói chuyện với khách phải liên tục dùng chuột tìm slide mặt bằng hoặc bảng tính dòng tiền, làm ngắt mạch cảm xúc của buổi thuyết trình.'
        }
      ],
      flowTitle: 'Kiến trúc giải pháp 2 tầng: Làm sạch dữ liệu nguồn & Giao diện hội thoại thông minh',
      flowSteps: [
        {
          num: '01 · MULTI-SOURCE CRAWL',
          title: 'Thu thập tự động 2 lần/ngày',
          desc: 'Hệ thống Playwright tự động quét dữ liệu từ 5 sàn bất động sản lớn nhất theo lịch cố định.'
        },
        {
          num: '02 · AI NORMALIZATION',
          title: 'Bóc tách & Khử trùng lặp',
          desc: 'Dùng Gemini API trích xuất cấu trúc chuẩn (giá/m², diện tích, pháp lý, tọa độ) và loại bỏ các tin đăng trùng hoặc có dấu hiệu giá ảo.'
        },
        {
          num: '03 · SPATIAL MAP UI',
          title: 'Trực quan hóa trên PostGIS',
          desc: 'Hiển thị trực tiếp hơn 7.700 bất động sản lên bản đồ tương tác, cho phép khoanh vùng bán kính và so sánh mặt bằng giá khu vực.'
        },
        {
          num: '04 · CONVERSATION & VOICE',
          title: 'Hỏi đáp RAG & Lật slide giọng nói',
          desc: 'Trợ lý AI trả lời tiếng Việt có trích dẫn nguồn rõ ràng (Trust & Transparency) và tự động chuyển slide thuyết trình khi nghe từ khóa của nhân viên tư vấn.'
        }
      ],
      solutions: [
        {
          title: '1. Thiết kế giao diện Bản đồ làm trung tâm (Map-First UX)',
          desc: 'Thay vì bắt người dùng mở từng trang chi tiết, giao diện kết hợp song song bản đồ không gian PostGIS và bảng tóm tắt thông số cốt lõi (giá quy đổi trên mỗi m², chiều ngang, lộ giới hẻm/đường), giúp người xem đánh giá nhanh giá trị bất động sản chỉ trong một ánh nhìn.'
        },
        {
          title: '2. Thiết kế hội thoại (Conversation Design) minh bạch, chống ảo giác AI',
          desc: 'Áp dụng nguyên tắc Trust & Transparency của AI UX: mọi câu trả lời của Chatbot về giá bán, tiến độ thanh toán và chiết khấu đều truy xuất trực tiếp từ cơ sở dữ liệu vector (pgvector RAG), kèm gợi ý câu hỏi tiếp theo và nút chuyển tiếp gặp chuyên viên tư vấn thật khi cần thương lượng sâu.'
        },
        {
          title: '3. Tính năng Live Slide điều khiển bằng giọng nói tại Sales Gallery',
          desc: 'Tích hợp nhận diện giọng nói tiếng Việt thời gian thực: khi nhân viên tư vấn nhắc tới "mặt bằng tầng trệt", "chính sách ngân hàng" hay "vị trí kết nối", màn hình trình chiếu tự động chuyển đúng slide tương ứng mà không cần chạm tay vào máy tính.'
        }
      ],
      metrics: [
        { num: '7.700+ Tin', label: 'Dữ liệu bất động sản được chuẩn hóa, khử trùng lặp và định vị trên bản đồ PostGIS.' },
        { num: '5 Nguồn lớn', label: 'Tự động thu thập và cập nhật dữ liệu 2 lượt mỗi ngày qua pipeline Playwright & Python.' },
        { num: 'RAG + Voice', label: 'Kết hợp hỏi đáp ngôn ngữ tự nhiên tiếng Việt và điều khiển slide rảnh tay theo thời gian thực.' }
      ]
    },
    tiles: {
      kicker: 'CASE STUDY 04 · THIẾT KẾ SẢN PHẨM MŨI NHỌN & TĂNG TRƯỞNG B2B NHÀ MÁY',
      title: 'Piramic Saigon & Đức Phát: Thiết kế tranh gạch 3D dẫn dắt thị trường & Mở rộng mạng lưới đại lý',
      subtitle: 'Hành trình 7 năm biến kỹ thuật thiết kế đồ họa khổ lớn và quản trị màu sắc in UV/in men công nghiệp thành đòn bẩy thương mại, giúp nhà máy thu hút đại lý mới và tăng trưởng doanh thu bền vững.',
      year: '2017 – 2024',
      role: 'Chuyên viên Thiết kế Sản phẩm & Kỹ thuật In Công nghiệp',
      scope: 'Market Research · 3D Tile Mural Design · ICC Color Management · Digital Catalogue',
      platform: 'Sản xuất Công nghiệp (UV / Ceramic Glaze) & Hệ thống Phân phối Đại lý',
      cover: 'media/social-2.jpg',
      context: 'Trong ngành vật liệu trang trí nội thất (gạch ốp tường, tranh gạch 3D khổ lớn và thảm gạch sảnh biệt thự), phần lớn các xưởng sản xuất nhỏ chỉ sao chép lại các mẫu có sẵn trên mạng với chất lượng ảnh vỡ nét và màu sắc sau khi nung/in UV bị sai lệch nặng so với bản vẽ. Để nhà máy Piramic Saigon và Đức Phát thuyết phục được các đại lý vật liệu xây dựng lớn nhập hàng, sản phẩm thiết kế phải đủ độc đáo để tạo xu hướng và đạt độ chính xác kỹ thuật tuyệt đối khi sản xuất hàng loạt.',
      problemQuote: 'Problem Statement: Các đại lý vật liệu xây dựng ngại nhập mẫu mới vì sợ tồn kho, khách mua lẻ khó hình dung tranh gạch khổ lớn khi lên tường thực tế, trong khi sai lệch màu sắc giữa màn hình thiết kế và lò in công nghiệp gây thiệt hại chi phí phế phẩm lớn cho nhà máy.',
      painPoints: [
        {
          title: 'Điểm đau 01 · Mẫu mã đại trà, thiếu tính dẫn dắt thị trường',
          desc: 'Thị trường tràn ngập các mẫu tranh gạch cũ kỹ, độ phân giải thấp, không đáp ứng được gu thẩm mỹ của các căn biệt thự và sảnh khách sạn hiện đại.'
        },
        {
          title: 'Điểm đau 02 · Sai lệch màu sắc giữa file RGB và máy in UV / lò nung',
          desc: 'Màu men gạch và mực UV phản ứng khác hoàn toàn màn hình máy tính; chỉ cần lệch tông màu da hoặc màu vàng kim là toàn bộ lô gạch khổ lớn phải hủy bỏ.'
        },
        {
          title: 'Điểm đau 03 · Đại lý thiếu công cụ tư vấn trực quan cho chủ nhà',
          desc: 'Nhân viên tại các cửa hàng đại lý không có kỹ năng thiết kế, rất khó thuyết phục chủ nhà chốt đơn nếu chỉ cho xem ảnh phẳng rời rạc.'
        }
      ],
      flowTitle: 'Quy trình 4 bước từ Nghiên cứu thị hiếu đến Mở rộng mạng lưới đại lý',
      flowSteps: [
        {
          num: '01 · TREND RESEARCH',
          title: 'Nắm bắt gu nội thất mới',
          desc: 'Phân tích xu hướng kiến trúc biệt thự, tân cổ điển và phong thủy Á Đông để sáng tạo các dòng tranh 3D & thảm gạch sảnh có chiều sâu thị giác cao.'
        },
        {
          num: '02 · HIGH-RES CRAFT',
          title: 'Vẽ & Tái tạo chi tiết siêu thực',
          desc: 'Thiết kế và xử lý file độ phân giải cực lớn (hàng chục GB), đảm bảo khi ghép hàng chục viên gạch 80×80cm vẫn sắc nét ở cự ly gần.'
        },
        {
          num: '03 · ICC CALIBRATION',
          title: 'Chuẩn hóa màu in nhà máy',
          desc: 'Xây dựng ICC Profile riêng cho từng dòng máy in UV phẳng và chất liệu men kính, đạt tỷ lệ duyệt mẫu ngay từ lần in đầu tiên.'
        },
        {
          num: '04 · DEALER ENABLEMENT',
          title: 'Catalogue số & Phối cảnh 3D',
          desc: 'Đóng gói thư viện 200+ mẫu độc quyền thành bộ catalogue số hóa kèm phối cảnh không gian thực tế để đại lý chốt khách nhanh.'
        }
      ],
      solutions: [
        {
          title: '1. Sáng tạo các dòng tranh gạch 3D & thảm gạch sảnh dẫn dắt thị trường',
          desc: 'Trực tiếp thiết kế hơn 200 mẫu tranh gạch 3D dán tường, tranh giả ngọc điêu khắc và thảm gạch trang trí sảnh chính độc quyền. Các bộ sưu tập này trở thành sản phẩm mũi nhọn tạo sự khác biệt rõ rệt với hàng đại trà, thu hút nhiều nhà phân phối và đại lý mới ký hợp đồng nhập hàng.'
        },
        {
          title: '2. Chuẩn hóa kỹ thuật bình file, chia viên và quản trị màu CMYK/UV',
          desc: 'Thiết lập quy trình kiểm soát chất lượng file tiền kỳ in ấn nghiêm ngặt: tính toán chính xác độ hụt đường ron giữa các viên gạch, tách lớp mực trắng/bóng (varnish) trên máy in UV công nghiệp, giảm tối đa tỷ lệ in lỗi tại xưởng.'
        },
        {
          title: '3. Số hóa công cụ bán hàng giúp tăng doanh thu cho hệ thống đại lý',
          desc: 'Biên tập bộ catalogue phân loại theo từng không gian (phòng khách, sảnh biệt thự, cầu thang, phòng thờ) và hỗ trợ dựng phối cảnh ghép mẫu trực tiếp lên ảnh chụp nhà thật của khách, giúp rút ngắn 40% thời gian từ lúc tư vấn đến khi đặt cọc sản xuất.'
        }
      ],
      metrics: [
        { num: '200+ Mẫu', label: 'Thư viện mẫu tranh gạch 3D và thảm gạch sảnh độc quyền dẫn dắt thị hiếu thị trường.' },
        { num: '-40% Thời gian', label: 'Rút ngắn thời gian tư vấn và chốt đơn cho hệ thống đại lý nhờ bộ catalogue phối cảnh số hóa.' },
        { num: 'Mở rộng Đại lý', label: 'Đóng góp trực tiếp vào việc phát triển mạng lưới đại lý phân phối mới và tăng trưởng doanh thu nhà máy.' }
      ]
    }
  };

  function ensureCaseStudyModal() {
    let modal = document.getElementById('csModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'csModal';
    modal.className = 'cs-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Case Study Chi Tiết');
    modal.innerHTML = `
      <div class="cs-sheet" id="csSheet">
        <div class="cs-topbar">
          <span class="cs-topbar-tag" id="csTopTag">UX &amp; DESIGN ENGINEERING CASE STUDY</span>
          <button type="button" class="cs-close-btn" id="csCloseBtn">Đóng Case Study ✕</button>
        </div>
        <div id="csContentMount"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCaseStudy();
    });
    modal.querySelector('#csCloseBtn').addEventListener('click', closeCaseStudy);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeCaseStudy();
      }
    });

    return modal;
  }

  window.openCaseStudy = function (key) {
    const data = CASE_STUDIES[key];
    if (!data) return;

    const modal = ensureCaseStudyModal();
    const mount = modal.querySelector('#csContentMount');
    const topTag = modal.querySelector('#csTopTag');
    if (topTag) topTag.textContent = data.kicker;

    const painCardsHtml = data.painPoints.map((p) => `
      <div class="cs-mini-card">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `).join('');

    const flowStepsHtml = data.flowSteps.map((s) => `
      <div class="cs-flow-step">
        <div class="cs-flow-step-num">${s.num}</div>
        <div class="cs-flow-step-title">${s.title}</div>
        <div class="cs-flow-step-desc">${s.desc}</div>
      </div>
    `).join('');

    const solutionsHtml = data.solutions.map((sol) => `
      <div style="margin-bottom: 14px;">
        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 6px; color: #000;">${sol.title}</h4>
        <p style="font-size: 15px; line-height: 1.65; color: #262625;">${sol.desc}</p>
      </div>
    `).join('');

    const metricsHtml = data.metrics.map((m) => `
      <div class="cs-metric-box">
        <div class="cs-metric-num">${m.num}</div>
        <div class="cs-metric-label">${m.label}</div>
      </div>
    `).join('');

    const actionLinksHtml = `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        ${data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noopener" class="pricing-btn" style="background:#000; color:#FAFAFA; padding: 12px 24px; font-size: 14px;">${data.liveLabel}</a>` : ''}
        ${data.repoUrl ? `<a href="${data.repoUrl}" target="_blank" rel="noopener" class="pricing-btn" style="background:#FAFAFA; color:#000; border: 1px solid #000; padding: 12px 24px; font-size: 14px;">Xem mã nguồn GitHub ↗</a>` : ''}
      </div>
    `;

    mount.innerHTML = `
      <div class="cs-hero">
        <div class="cs-kicker">${data.kicker}</div>
        <h2 class="cs-title">${data.title}</h2>
        <p class="cs-subtitle">${data.subtitle}</p>
        <div class="cs-meta-strip">
          <div>
            <div class="cs-meta-label">THỜI GIAN</div>
            <div class="cs-meta-val">${data.year}</div>
          </div>
          <div>
            <div class="cs-meta-label">VAI TRÒ</div>
            <div class="cs-meta-val">${data.role}</div>
          </div>
          <div>
            <div class="cs-meta-label">PHẠM VI CHUYÊN MÔN</div>
            <div class="cs-meta-val">${data.scope}</div>
          </div>
          <div>
            <div class="cs-meta-label">NỀN TẢNG</div>
            <div class="cs-meta-val">${data.platform}</div>
          </div>
        </div>
      </div>

      <div class="cs-cover-wrap">
        <img src="${data.cover}" alt="${data.title}" class="cs-cover-img">
      </div>

      <div class="cs-body">
        <!-- 01. Context & Overview -->
        <div class="cs-section">
          <div>
            <div class="cs-sec-index">I / BỐI CẢNH &amp; THỰC TRẠNG</div>
            <h3 class="cs-sec-heading">Bối cảnh dự án &amp; Bài toán thương mại</h3>
          </div>
          <div class="cs-sec-content">
            <p>${data.context}</p>
            <div class="cs-callout">
              <strong>${data.problemQuote}</strong>
            </div>
          </div>
        </div>

        <!-- 02. Research & Pain Points -->
        <div class="cs-section">
          <div>
            <div class="cs-sec-index">II / NGHIÊN CỨU &amp; ĐIỂM ĐAU</div>
            <h3 class="cs-sec-heading">Bóc tách hành vi &amp; Pain Points người dùng</h3>
          </div>
          <div class="cs-sec-content">
            <p>Thay vì thiết kế dựa trên cảm tính, tôi phân tích trực tiếp những rào cản khiến khách hàng chần chừ hoặc bỏ cuộc giữa chừng trong hành trình trải nghiệm:</p>
            <div class="cs-cards-2col">
              ${painCardsHtml}
            </div>
          </div>
        </div>

        <!-- 03. Strategy & User Flow -->
        <div class="cs-section">
          <div>
            <div class="cs-sec-index">III / TƯ DUY HỆ THỐNG &amp; LUỒNG TRẢI NGHIỆM</div>
            <h3 class="cs-sec-heading">${data.flowTitle}</h3>
          </div>
          <div class="cs-sec-content">
            <p>Cấu trúc luồng trải nghiệm được thiết kế để dẫn dắt tâm lý người dùng tự nhiên từ lúc tiếp cận đến khi thực hiện hành động chuyển đổi:</p>
            <div class="cs-flow-steps">
              ${flowStepsHtml}
            </div>
          </div>
        </div>

        <!-- 04. Design & Engineering Execution -->
        <div class="cs-section">
          <div>
            <div class="cs-sec-index">IV / GIẢI PHÁP &amp; THỰC THI KỸ THUẬT</div>
            <h3 class="cs-sec-heading">Từ bản vẽ Figma đến sản phẩm chạy thật</h3>
          </div>
          <div class="cs-sec-content">
            ${solutionsHtml}
          </div>
        </div>

        <!-- 05. Impact & Results -->
        <div class="cs-section">
          <div>
            <div class="cs-sec-index">V / KẾT QUẢ &amp; TÁC ĐỘNG THỰC TẾ</div>
            <h3 class="cs-sec-heading">Đo lường hiệu quả vận hành</h3>
          </div>
          <div class="cs-sec-content">
            <div class="cs-metrics-grid">
              ${metricsHtml}
            </div>
          </div>
        </div>
      </div>

      <div class="cs-footer-bar">
        <div>
          <div style="font-size: 12px; color: var(--text-dark-subtle); font-weight: 600;">TRẢI NGHIỆM SẢN PHẨM THỰC TẾ</div>
          <div style="font-size: 15px; font-weight: 600; color: #000;">Mọi giải pháp trong Case Study đều đang vận hành thật</div>
        </div>
        ${actionLinksHtml}
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  };

  window.closeCaseStudy = function () {
    const modal = document.getElementById('csModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

})();
