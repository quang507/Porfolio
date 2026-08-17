/* Shared behaviour: mobile nav, work-index preview, project filters, lightbox, contact form. */
(function () {
    'use strict';

    // ---- mobile nav
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // ---- home: work index hover preview
    var index = document.querySelector('.work-index');
    var preview = document.querySelector('.index-preview');
    if (index && preview) {
        var frame = preview.querySelector('.frame');
        var cap = preview.querySelector('figcaption');
        var links = Array.prototype.slice.call(index.querySelectorAll('a'));
        var imgs = {};
        links.forEach(function (a, i) {
            var img = document.createElement('img');
            img.src = a.dataset.preview;
            img.alt = '';
            img.loading = i === 0 ? 'eager' : 'lazy';
            frame.appendChild(img);
            imgs[i] = img;
        });
        function show(i) {
            links.forEach(function (a, j) {
                a.classList.toggle('is-active', j === i);
                imgs[j].classList.toggle('is-on', j === i);
            });
            cap.textContent = links[i].dataset.caption || '';
        }
        links.forEach(function (a, i) {
            a.addEventListener('mouseenter', function () { show(i); });
            a.addEventListener('focus', function () { show(i); });
        });
        show(0);
    }

    // ---- projects: filters
    var filterBar = document.querySelector('.filters');
    if (filterBar) {
        var buttons = filterBar.querySelectorAll('button');
        var cards = document.querySelectorAll('.card[data-cat]');
        var groups = document.querySelectorAll('[data-group]');
        buttons.forEach(function (b) {
            b.addEventListener('click', function () {
                buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
                var f = b.dataset.filter;
                cards.forEach(function (c) {
                    c.classList.toggle('hidden', !(f === 'all' || c.dataset.cat === f));
                });
                groups.forEach(function (g) {
                    var visible = g.querySelectorAll('.card:not(.hidden)').length;
                    g.style.display = visible ? '' : 'none';
                });
            });
        });
    }

    // ---- lightbox
    var lb = document.getElementById('lightbox');
    if (lb) {
        var stage = lb.querySelector('.lb-stage-media');
        var count = lb.querySelector('.lb-count');
        var title = lb.querySelector('.lb-title');
        var thumbs = lb.querySelector('.lb-thumbs');
        var items = [], idx = 0, name = '';

        function render(i) {
            idx = i;
            var src = items[i];
            var isVideo = /\.(mp4|webm)$/i.test(src);
            stage.innerHTML = '';
            var el = document.createElement(isVideo ? 'video' : 'img');
            el.src = src;
            if (isVideo) { el.controls = true; el.autoplay = true; el.playsInline = true; }
            else { el.alt = name; }
            stage.appendChild(el);
            count.textContent = (i + 1) + ' / ' + items.length;
            title.textContent = name;
            Array.prototype.forEach.call(thumbs.children, function (t, j) { t.classList.toggle('on', j === i); });
        }
        function open(card) {
            try { items = JSON.parse(card.dataset.images || '[]'); } catch (e) { items = []; }
            if (!items.length) return;
            name = card.dataset.title || '';
            thumbs.innerHTML = '';
            items.forEach(function (src, j) {
                var t = document.createElement('img');
                t.src = /\.(mp4|webm)$/i.test(src) ? (card.dataset.poster || '') : src;
                t.alt = '';
                t.addEventListener('click', function () { render(j); });
                thumbs.appendChild(t);
            });
            thumbs.style.display = items.length > 1 ? '' : 'none';
            lb.classList.toggle('single', items.length < 2);
            lb.classList.add('open');
            document.body.classList.add('lb-locked');
            render(0);
            lb.querySelector('.lb-close').focus();
        }
        function close() {
            lb.classList.remove('open');
            document.body.classList.remove('lb-locked');
            stage.innerHTML = '';
        }
        document.querySelectorAll('.card[data-images]').forEach(function (c) {
            c.addEventListener('click', function () { open(c); });
        });
        lb.querySelector('.lb-close').addEventListener('click', close);
        lb.querySelector('.lb-nav.prev').addEventListener('click', function () { render((idx - 1 + items.length) % items.length); });
        lb.querySelector('.lb-nav.next').addEventListener('click', function () { render((idx + 1) % items.length); });
        lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') render((idx - 1 + items.length) % items.length);
            if (e.key === 'ArrowRight') render((idx + 1) % items.length);
        });
    }

    // ---- contact form (Formspree, no page reload)
    var form = document.getElementById('contactForm');
    if (form) {
        var msg = document.getElementById('formMsg');
        var btn = form.querySelector('button[type=submit]');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            btn.disabled = true;
            msg.className = 'form-msg';
            msg.textContent = 'Đang gửi…';
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(function (r) {
                if (r.ok) {
                    form.reset();
                    msg.className = 'form-msg ok';
                    msg.textContent = 'Đã gửi. Tôi sẽ trả lời qua email trong vòng 1–2 ngày.';
                } else { throw new Error(); }
            }).catch(function () {
                msg.className = 'form-msg err';
                msg.textContent = 'Không gửi được. Bạn nhắn Zalo hoặc email trực tiếp giúp mình nhé.';
            }).finally(function () { btn.disabled = false; });
        });
    }
})();
