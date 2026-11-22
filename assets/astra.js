/**
 * Tương tác của trang portfolio
 *
 * 1. Lớp hạt phim
 * 2. Hiện dần khi cuộn tới
 * 3. Hero: vào trang và parallax
 * 4. Menu toàn màn hình, header khi cuộn
 * 5. Đồng hồ giờ TP.HCM ở footer
 * 6. Link tới dự án, danh sách công cụ
 * 7. Popup case study (openCaseStudy / closeCaseStudy)
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
  // 2. HIỆN DẦN KHI CUỘN TỚI
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

  // Hero: bật hiệu ứng vào trang
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
  // 5. ACCORDION (mở/đóng, hỗ trợ bàn phím)
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
  // 7. MENU TOÀN MÀN HÌNH
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
  // 9. LINK TỚI DỰ ÁN (ảnh tròn và dòng kinh nghiệm ở mục Kinh nghiệm)
  //    Thẻ dự án là position: sticky nên đo trực tiếp sẽ lệch khi đang đứng
  //    bên dưới; tính vị trí tự nhiên từ đầu danh sách rồi cuộn tới đó.
  // =========================================================================
  document.querySelectorAll('[data-project]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const row = document.getElementById(link.getAttribute('data-project'));
      const stack = row && row.parentElement;
      if (!row || !stack) return;
      e.preventDefault();

      const gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
      let top = stack.getBoundingClientRect().top + window.scrollY;
      for (const sib of stack.children) {
        if (sib === row) break;
        top += sib.offsetHeight + (parseFloat(getComputedStyle(sib).marginBottom) || 0) + gap;
      }

      window.scrollTo({ top: Math.max(top - 100, 0), behavior: prefersReduced ? 'auto' : 'smooth' });
      row.classList.add('partner-highlight');
      setTimeout(() => row.classList.remove('partner-highlight'), 1800);
    });
  });

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

  const toolBadges = document.querySelectorAll('.tools-badges-cluster .tool-badge');
  const toolsPopover = document.getElementById('toolsPopover');

  if (toolBadges.length && toolsPopover) {
    const setPopover = (open) => {
      toolsPopover.classList.toggle('open', open);
      toolsPopover.setAttribute('aria-hidden', String(!open));
    };

    toolBadges.forEach((badge) => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        setPopover(!toolsPopover.classList.contains('open'));
      });
    });

    document.addEventListener('click', (e) => {
      if (!toolsPopover.contains(e.target) && !e.target.closest('.tool-badge')) setPopover(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setPopover(false);
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
  // 14. CASE STUDY (popup: Vấn đề / Cách làm / Kết quả)
  // =========================================================================
  const CASE_STUDIES = {
    nyah: {
      kicker: 'Case study · Bất động sản',
      title: 'Ny\'ah Phú Định và Villa Ny\'ah',
      subtitle: 'Ảnh thật, landing page và công cụ tìm ảnh cho hai dự án nhà ở của Nhã Đạt.',
      year: '2025 – nay',
      role: 'Lead Visual & Design Engineer',
      scope: 'Chụp ảnh kiến trúc, thiết kế giao diện, dựng landing page, đo hành vi người xem',
      tools: 'Figma · Clarity · GA4 · Search Console · Python (CLIP, FAISS)',
      cover: 'media/nyah-photo-2.jpg',
      liveUrl: 'https://polite-hamster-cf3510.netlify.app/',
      liveLabel: 'Xem landing page Villa Ny\'ah ↗',
      context: 'Nhã Đạt bán nhà phố compound ở Quận 8 và biệt thự ven sông. Người mua nhà giá trị lớn thường không tin ảnh phối cảnh 3D, nên trang web phải cho họ thấy căn nhà thật trước khi họ chịu để lại số điện thoại. Tôi phụ trách hình ảnh và giao diện cho cả hai dự án.',
      problems: [
        {
          title: 'Ảnh 3D không tạo được niềm tin',
          desc: 'Ảnh render, hoặc ảnh chụp cháy sáng và méo góc, làm không gian trông giả. Người xem rời trang sớm.'
        },
        {
          title: 'Chữ nhiều, ảnh căn mẫu nằm quá sâu',
          desc: 'Xem lại các phiên truy cập trên Clarity, tôi thấy người dùng điện thoại hay dừng cuộn ở đoạn giới thiệu dài, chưa tới mặt bằng và nút đặt lịch.'
        },
        {
          title: 'Tìm ảnh cho đội kinh doanh rất chậm',
          desc: 'Kho ảnh công trình có hơn 10.000 file. Mỗi lần khách hỏi một góc chụp là phải lục thư mục bằng tay.'
        },
        {
          title: 'Khách ngại điền form',
          desc: 'Họ muốn biết diện tích, hướng nhà và lịch thanh toán trước khi để lại thông tin.'
        }
      ],
      steps: [
        {
          title: 'Chụp lại bằng ảnh thật',
          desc: 'Tôi chụp ngoại thất, ban công, phòng khách và bếp căn mẫu bằng HDR bracketing để giữ được cảnh ngoài cửa sổ. Ảnh thật thay ảnh 3D ngay ở màn hình đầu tiên.'
        },
        {
          title: 'Rút chữ, đưa căn mẫu lên trên',
          desc: 'Dựa vào heatmap, bản ghi phiên trên Clarity và số liệu GA4, tôi cắt đoạn chữ đầu trang và gom mặt bằng, tiện ích, tiến độ thành các thẻ dễ lướt trên điện thoại. Từ khóa tìm kiếm theo khu vực thì chỉnh theo Search Console.'
        },
        {
          title: 'Form ngắn, nút đặt lịch luôn hiện',
          desc: 'Form chỉ còn 2 trường. Nút đặt lịch tham quan nằm cố định trên màn hình.'
        },
        {
          title: 'Viết công cụ tìm ảnh bằng mô tả',
          desc: 'Tôi viết Tìm Hình Quang bằng Python, Streamlit, CLIP và FAISS. Gõ mô tả tiếng Việt như “phòng khách căn mẫu có nắng chiều” là ra đúng ảnh.'
        }
      ],
      results: [
        { num: '< 2 giây', label: 'để tìm một ảnh trong kho hơn 10.000 file.' },
        { num: '50 căn', label: 'compound Ny\'ah Phú Định dùng chung một bộ ảnh thật cho web và ấn phẩm mở bán.' },
        { num: '2 trường', label: 'là tất cả những gì form đặt lịch hỏi.' }
      ]
    },
    goi: {
      kicker: 'Case study · Bao bì',
      title: 'Xưởng bao bì GÓI',
      subtitle: 'Nhận diện, website 11 trang và bot báo giá hộp giấy cho một xưởng in.',
      year: '2025 – 2026',
      role: 'Design Engineer',
      scope: 'Nhận diện thương hiệu, design system, ảnh sản phẩm, code website, viết bot báo giá',
      tools: 'Figma · Python · Gemini API',
      cover: 'media/goi-1.jpg',
      liveUrl: 'https://goi-v2.vercel.app',
      liveLabel: 'Mở website GÓI ↗',
      context: 'Khách đặt hộp giấy thường là chủ thương hiệu nhỏ, không rành định lượng giấy, sóng carton hay khuôn bế, nên gửi yêu cầu thiếu thông tin. Phía xưởng thì tính giá bằng tay trên Excel cho từng yêu cầu. Khách chờ lâu và bỏ đi.',
      problems: [
        {
          title: 'Khách không hiểu thuật ngữ in',
          desc: 'Chỉ đọc chữ thì khó phân biệt hộp âm dương, hộp nắp gài, hộp rút hay các loại giấy.'
        },
        {
          title: 'Báo giá bằng tay chậm và dễ lệch',
          desc: 'Giá phụ thuộc kích thước ba chiều, số lượng và gia công sau in. Tính nhẩm hay tra bảng đều chậm, mỗi người ra một con số.'
        },
        {
          title: 'Ảnh sản phẩm kém',
          desc: 'Ảnh chụp điện thoại thiếu sáng không cho thấy đường cấn bế và bề mặt giấy.'
        },
        {
          title: 'Vào web không biết bắt đầu từ đâu',
          desc: 'Chọn kiểu hộp trước, chọn ngành hàng trước, hay gửi kích thước trước?'
        }
      ],
      steps: [
        {
          title: 'Cho khách chọn hộp bằng hình',
          desc: 'Danh mục hộp dùng ảnh chụp studio và mockup, chia theo ngành hàng: mỹ phẩm, đồ ăn uống, quà tặng.'
        },
        {
          title: 'Design system và website 11 trang',
          desc: 'Tôi dựng bộ token màu, lưới 12 cột và các thẻ sản phẩm dùng lại được trên Figma, rồi tự code cả 11 trang cho máy tính lẫn điện thoại.'
        },
        {
          title: 'Bot báo giá',
          desc: 'Bot viết bằng Python và Gemini API. Nó đọc tin nhắn viết tự do của khách, quy ra khổ trải giấy, tính số con trên tờ in, hao hụt và gia công, rồi trả giá theo từng mốc số lượng.'
        },
        {
          title: 'Đối chiếu với đơn thật',
          desc: 'Tôi chạy bot trên 1.400 đơn mẫu của xưởng để sửa các trường hợp khó, như hộp quá khổ phải ghép bài in hay đơn số lượng ít.'
        }
      ],
      results: [
        { num: '11 trang', label: 'website, từ trang chủ, danh mục đến luồng đặt hàng.' },
        { num: '1.400 đơn', label: 'mẫu đã dùng để đối chiếu giá bot tính ra.' },
        { num: 'Vài giây', label: 'để có báo giá sơ bộ, thay vì chờ người tính.' }
      ]
    },
    radar: {
      kicker: 'Case study · Sản phẩm tự làm',
      title: 'NhaDat Radar',
      subtitle: 'Trang tìm nhà đất gom tin từ nhiều nguồn, lọc trùng, đưa lên bản đồ, kèm chatbot trả lời bằng tiếng Việt.',
      year: '2025',
      role: 'Thiết kế và code toàn bộ',
      scope: 'Luồng người dùng, design system, prototype mobile, giao diện bản đồ, code full-stack',
      tools: 'Figma · Next.js 15 · TypeScript · Supabase (PostGIS, pgvector) · Playwright · Gemini',
      cover: 'media/shot-nhadat-radar.jpg',
      liveUrl: 'https://nhadatradar.com',
      liveLabel: 'Mở nhadatradar.com ↗',
      repoUrl: 'https://github.com/quang507/NhaDat-Radar',
      figmaUrl: 'https://www.figma.com/design/ovoxnSrm4hFhFnfjiI5UTA/Nhadatradar.com',
      context: 'Cùng một căn nhà có thể được nhiều môi giới đăng lại trên nhiều trang, mỗi nơi một giá và một diện tích. Người mua mất rất nhiều thời gian lọc tin mà vẫn không biết mặt bằng giá thật của khu vực.',
      problems: [
        {
          title: 'Tin trùng',
          desc: 'Một căn bị đăng lại trên 5, 6 trang với tiêu đề khác nhau, làm loãng kết quả tìm kiếm.'
        },
        {
          title: 'Không thấy vị trí',
          desc: 'Danh sách dạng thẻ không cho biết căn nhà nằm ở đâu, cách đường chính bao xa, các căn quanh đó giá bao nhiêu.'
        },
        {
          title: 'Bộ lọc cứng',
          desc: 'Nhu cầu thật thường là một câu dài, kiểu “nhà gần trường ở Quận 8, dưới 9 tỷ, có chỗ đậu ô tô”. Bộ lọc dropdown bắt bấm quá nhiều bước.'
        },
        {
          title: 'Tư vấn viên bị ngắt mạch khi trình chiếu',
          desc: 'Đang nói chuyện với khách mà phải cầm chuột tìm slide mặt bằng hay bảng dòng tiền.'
        }
      ],
      steps: [
        {
          title: 'Vẽ luồng từ tìm phòng tới chốt lịch xem',
          desc: 'Trên Figma tôi chia hai loại tin. Tin do Radar giữ thì Radar là đầu mối: nút Zalo chép sẵn câu nhắn kèm mã phòng, người trực tra mã là biết khách hỏi căn nào. Tin gom từ web thì dẫn về bài gốc, số điện thoại chỉ hiện sau khi đăng nhập.'
        },
        {
          title: 'Thiết kế cho điện thoại trước',
          desc: 'Prototype 9 màn ở khổ 375px, từ trang chủ, bộ lọc, chi tiết tin tới đăng nhập. Nút Gọi và Zalo luôn nằm ở đáy màn hình, vùng chạm tối thiểu 44px.'
        },
        {
          title: 'Bộ token và component',
          desc: 'Màu Emerald và Slate có cả chế độ sáng và tối, chữ Inter, lưới 4pt, bo góc 2–4px. Component bọc lại từ bộ ZEN Kaiz.'
        },
        {
          title: 'Đặt chỉ số để đo',
          desc: 'Ba sự kiện được ghi lại: xem tin, gọi, nhắn Zalo. Mục tiêu đặt ra là ít nhất 6% lượt xem tin thành liên hệ.'
        },
        {
          title: 'Gom tin, lọc trùng, đưa lên bản đồ',
          desc: 'Playwright quét 9 nguồn tin, 2 lần mỗi ngày. Gemini tách từng tin thành giá trên m², diện tích, pháp lý, tọa độ; tin trùng và tin có dấu hiệu giá ảo bị loại. Hơn 22.700 tin ở 116 quận huyện hiện trên bản đồ PostGIS.'
        },
        {
          title: 'Chatbot và trình chiếu bằng giọng nói',
          desc: 'Câu trả lời về giá, tiến độ thanh toán và chiết khấu đều lấy từ cơ sở dữ liệu (pgvector) và có dẫn nguồn. Khi tư vấn viên nói “mặt bằng tầng trệt” hay “chính sách ngân hàng”, màn hình tự chuyển sang đúng slide.'
        }
      ],
      results: [
        { num: '22.735 tin', label: 'từ 9 nguồn, ở 116 quận huyện, đã lọc trùng và có vị trí trên bản đồ.' },
        { num: '19.800', label: 'lượt hiển thị trên Google trong 3 tháng, từ 20/8 đến 18/11/2026 (Search Console).' },
        { num: '190', label: 'lượt nhấp từ Google trong cùng 3 tháng, vị trí trung bình 17,5.' }
      ]
    },
    vslv: {
      kicker: 'Case study · App học tập',
      title: 'VSLV, app học ngôn ngữ ký hiệu Việt Nam',
      subtitle: 'Học ký hiệu tại nhà: xem mẫu, làm theo trước camera, máy chấm đúng sai ngay.',
      year: '2026',
      role: 'Lead nhóm 3 người: lên ý tưởng, dẫn phần thiết kế, tự code',
      scope: 'Nghiên cứu người dùng, luồng học, design system, prototype, code web app',
      tools: 'Figma · Next.js 14 · MediaPipe · TensorFlow.js · Capacitor',
      cover: 'media/vslv-flow.jpg',
      liveUrl: 'https://quang507.github.io/VSL/',
      liveLabel: 'Mở app trên web ↗',
      repoUrl: 'https://github.com/quang507/VSL',
      figmaUrl: 'https://www.figma.com/design/1MxaKSyYEyPMvSVKUTJ3IZ/?node-id=2-4',
      context: 'Người thân, bạn bè, đồng nghiệp của người khiếm thính muốn học ngôn ngữ ký hiệu thường chỉ có video để xem. Ký hiệu lại khác nhau giữa Hà Nội, Hải Phòng và TP.HCM, và có ngữ pháp riêng chứ không phải dịch từng từ tiếng Việt.',
      problems: [
        {
          title: 'Không có chỗ luyện',
          desc: 'Xem video xong thì không có cách nào thực hành ngay trên máy.'
        },
        {
          title: 'Không biết mình sai ở đâu',
          desc: 'Người học khó tự nhận ra lỗi về hình bàn tay, vị trí và chuyển động.'
        },
        {
          title: 'Nội dung không theo vùng',
          desc: 'Người học cần đúng ký hiệu của vùng mình sẽ dùng, và một lộ trình hợp với mục tiêu của mình.'
        }
      ],
      steps: [
        {
          title: 'Vào app trong ba bước',
          desc: 'Đăng nhập, chọn vùng ký hiệu (chuẩn toàn quốc, TP.HCM, Hà Nội, Hải Phòng), chọn mục tiêu 5 hoặc 10 phút mỗi ngày. Quyền camera chỉ hỏi khi vào bài học, từ chối vẫn học được.'
        },
        {
          title: 'Xem mẫu rồi làm theo trước camera',
          desc: 'Video mẫu xem chậm được và có ba góc nhìn. Sau đó người học làm theo một bóng mờ hình tay; độ khớp hiện liên tục, từ 80% là đạt.'
        },
        {
          title: 'Sai thì chỉ đúng chỗ lệch',
          desc: 'Mũi tên vàng chỉ chỗ lệch kèm một câu gợi ý. Quá ba lần thì lưu vào mục cần ôn lại và cho đi tiếp. Camera không thấy tay thì không tính là sai.'
        },
        {
          title: 'Phản hồi không cần âm thanh',
          desc: 'Đúng, sai, chưa đạt đều báo bằng màu, icon, chữ và nhịp rung khác nhau, để người khiếm thính và người mù màu đều nhận ra.'
        },
        {
          title: 'Code cho chạy trong trình duyệt',
          desc: 'Tôi viết web app bằng Next.js. MediaPipe bắt 21 điểm khớp bàn tay, TensorFlow.js phân loại ký hiệu ngay trên máy người dùng, không cần server. Capacitor đóng gói thành app iOS và Android.'
        }
      ],
      results: [
        { num: '3 luồng', label: 'chính đã thiết kế xong: thiết lập, học một bài, tra từ điển.' },
        { num: '10 trang', label: 'trong bản web đang chạy, từ lộ trình đến từ điển.' },
        { num: '21 điểm', label: 'khớp bàn tay được theo dõi qua camera, không gửi hình lên server.' }
      ]
    },
    tiles: {
      kicker: 'Case study · In công nghiệp',
      title: 'Tranh gạch 3D cho Piramic Saigon và Đức Phát',
      subtitle: 'Bảy năm thiết kế tranh gạch khổ lớn và giữ màu in đúng với bản thiết kế.',
      year: '2017 – 2024',
      role: 'Thiết kế sản phẩm và kỹ thuật in',
      scope: 'Thiết kế tranh gạch 3D, xử lý file in khổ lớn, quản lý màu, làm catalogue',
      tools: 'Photoshop · Illustrator · ICC profile · máy in UV',
      cover: 'media/social-2.jpg',
      context: 'Nhiều xưởng tranh gạch chỉ chép lại mẫu trên mạng: ảnh vỡ nét, màu sau khi in UV hoặc nung lệch xa bản vẽ. Muốn đại lý vật liệu chịu nhập hàng thì mẫu phải khác hàng đại trà, và in hàng loạt phải đúng màu.',
      problems: [
        {
          title: 'Mẫu trên thị trường cũ và giống nhau',
          desc: 'Độ phân giải thấp, không hợp với biệt thự và sảnh khách sạn mới.'
        },
        {
          title: 'Màu trên màn hình khác màu in',
          desc: 'Men gạch và mực UV lên màu khác hẳn màn hình. Lệch tông da hay tông vàng kim là phải bỏ cả lô gạch.'
        },
        {
          title: 'Đại lý khó tư vấn',
          desc: 'Nhân viên cửa hàng không biết thiết kế, chỉ có ảnh phẳng rời rạc để cho chủ nhà xem.'
        }
      ],
      steps: [
        {
          title: 'Thiết kế mẫu riêng',
          desc: 'Tôi thiết kế hơn 200 mẫu tranh gạch 3D, tranh giả ngọc và thảm gạch sảnh, theo gu biệt thự, tân cổ điển và phong thủy.'
        },
        {
          title: 'File đủ nét cho khổ lớn',
          desc: 'File nặng hàng chục GB, ghép hàng chục viên 80×80 cm vẫn nét khi đứng gần. Tôi tính độ hụt đường ron giữa các viên và tách lớp mực trắng, lớp bóng cho máy in UV.'
        },
        {
          title: 'Giữ màu đúng',
          desc: 'Mỗi dòng máy in UV và mỗi loại men có một ICC profile riêng.'
        },
        {
          title: 'Catalogue cho đại lý',
          desc: 'Catalogue chia theo không gian: phòng khách, sảnh, cầu thang, phòng thờ. Tôi cũng ghép mẫu lên ảnh nhà thật của khách để đại lý dễ tư vấn.'
        }
      ],
      results: [
        { num: '200+ mẫu', label: 'tranh gạch 3D và thảm gạch sảnh do tôi thiết kế.' },
        { num: '7 năm', label: 'làm việc với máy in UV và lò nung.' },
        { num: '80×80 cm', label: 'mỗi viên, ghép hàng chục viên vẫn nét.' }
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
    modal.setAttribute('aria-label', 'Case study');
    modal.innerHTML = `
      <div class="cs-sheet" id="csSheet">
        <div class="cs-topbar">
          <span class="cs-topbar-tag" id="csTopTag">Case study</span>
          <button type="button" class="cs-close-btn" id="csCloseBtn">Đóng ✕</button>
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

    const problemsHtml = data.problems.map((p) => `
      <div class="cs-mini-card">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `).join('');

    const stepsHtml = data.steps.map((s) => `
      <li>
        <div>
          <h4>${s.title}</h4>
          <p>${s.desc}</p>
        </div>
      </li>
    `).join('');

    const resultsHtml = data.results.map((m) => `
      <div class="cs-metric-box">
        <div class="cs-metric-num">${m.num}</div>
        <div class="cs-metric-label">${m.label}</div>
      </div>
    `).join('');

    const linksHtml = [
      data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noopener" class="pricing-btn" style="background:#000; color:#FAFAFA; padding: 12px 24px; font-size: 14px;">${data.liveLabel}</a>` : '',
      data.repoUrl ? `<a href="${data.repoUrl}" target="_blank" rel="noopener" class="pricing-btn" style="background:#FAFAFA; color:#000; border: 1px solid #000; padding: 12px 24px; font-size: 14px;">Mã nguồn trên GitHub ↗</a>` : '',
      data.figmaUrl ? `<a href="${data.figmaUrl}" target="_blank" rel="noopener" class="pricing-btn" style="background:#FAFAFA; color:#000; border: 1px solid #000; padding: 12px 24px; font-size: 14px;">File Figma ↗</a>` : ''
    ].join('');

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
            <div class="cs-meta-label">VIỆC TÔI LÀM</div>
            <div class="cs-meta-val">${data.scope}</div>
          </div>
          <div>
            <div class="cs-meta-label">CÔNG CỤ</div>
            <div class="cs-meta-val">${data.tools}</div>
          </div>
        </div>
      </div>

      <div class="cs-cover-wrap">
        <img src="${data.cover}" alt="${data.title}" class="cs-cover-img">
      </div>

      <div class="cs-body">
        <div class="cs-section">
          <div>
            <div class="cs-sec-index">01</div>
            <h3 class="cs-sec-heading">Vấn đề</h3>
          </div>
          <div class="cs-sec-content">
            <p>${data.context}</p>
            <div class="cs-cards-2col">
              ${problemsHtml}
            </div>
          </div>
        </div>

        <div class="cs-section">
          <div>
            <div class="cs-sec-index">02</div>
            <h3 class="cs-sec-heading">Cách làm</h3>
          </div>
          <div class="cs-sec-content">
            <ol class="cs-steps">
              ${stepsHtml}
            </ol>
          </div>
        </div>

        <div class="cs-section">
          <div>
            <div class="cs-sec-index">03</div>
            <h3 class="cs-sec-heading">Kết quả</h3>
          </div>
          <div class="cs-sec-content">
            <div class="cs-metrics-grid">
              ${resultsHtml}
            </div>
          </div>
        </div>
      </div>

      ${linksHtml ? `<div class="cs-footer-bar"><div style="display: flex; gap: 12px; flex-wrap: wrap;">${linksHtml}</div></div>` : ''}
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
