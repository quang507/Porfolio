/* Dark editorial — hiệu ứng tối thiểu, không thư viện ngoài.
   1. Hiện dần khi cuộn tới   2. Đếm số   3. Ảnh xem trước theo chuột ở danh sách dự án */

document.documentElement.classList.add('js');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1 — hiện dần */
const revealables = document.querySelectorAll('.reveal');
if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('in'));
} else {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => entry.target.classList.add('in'), i * 70);
            io.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(el => io.observe(el));
}

/* 2 — đếm số trong phần thống kê */
const counters = document.querySelectorAll('[data-count]');
const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target.toLocaleString('vi-VN') + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = value.toLocaleString('vi-VN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            runCount(entry.target);
            co.unobserve(entry.target);
        });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
} else {
    counters.forEach(runCount);
}

/* 3 — ảnh xem trước bám theo chuột */
const thumb = document.querySelector('.work__thumb');
if (thumb && window.matchMedia('(hover: hover)').matches) {
    let raf = null, x = 0, y = 0;

    const place = () => {
        thumb.style.left = x + 'px';
        thumb.style.top = y + 'px';
        raf = null;
    };

    document.querySelectorAll('.work__item[data-thumb]').forEach(item => {
        item.addEventListener('mouseenter', () => {
            thumb.src = item.dataset.thumb;
            thumb.alt = item.dataset.thumbAlt || '';
            thumb.classList.add('on');
        });
        item.addEventListener('mouseleave', () => thumb.classList.remove('on'));
        item.addEventListener('mousemove', (e) => {
            x = e.clientX; y = e.clientY;
            if (!raf) raf = requestAnimationFrame(place);
        });
    });
}

/* 4 — hero: khung media thu dần + khối tròn trôi ngược khi cuộn.
   Đọc scroll trong rAF, chỉ ghi biến CSS nên trình duyệt chỉ phải vẽ lại transform. */
const hero = document.querySelector('.hero');
const sphere = document.querySelector('.hero__sphere');
const video = document.querySelector('.hero__moon video');

if (hero && sphere && !reduced) {
    let ticking = false;

    const moon = document.querySelector('.hero__moon');

    /* Tính bằng vị trí thật của hero so với khung nhìn, không dùng window.scrollY —
       để chạy đúng cả khi trang nằm trong một khung cuộn (iframe, khung xem trước). */
    const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        const h = rect.height || 1;
        const p = Math.min(Math.max(-rect.top / h, 0), 1);   // 0 ở đỉnh → 1 khi hero trôi hết
        sphere.style.setProperty('--sphere-scale', (1 + 0.16 * p).toFixed(4));
        sphere.style.setProperty('--sphere-shift', (p * 90).toFixed(2) + 'px');
        if (moon) moon.style.setProperty('--moon-shift', (p * -180).toFixed(2) + 'px');
        ticking = false;
    };

    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
    window.addEventListener('scroll', request, { passive: true, capture: true });
    window.addEventListener('resize', request, { passive: true });

    onScroll();
}

/* video chỉ chạy khi còn trong tầm nhìn, đỡ tốn pin */
if (video && 'IntersectionObserver' in window) {
    const vo = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { video.play().catch(() => {}); }
            else { video.pause(); }
        });
    }, { threshold: 0.05 });
    vo.observe(video);
}

/* năm hiện tại ở chân trang */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
