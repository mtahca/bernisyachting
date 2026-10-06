(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* sticky header */
  var header = $('.site-header');
  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 90); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile menu */
  var burger = $('.burger'), nav = $('#nav');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* language menu */
  var lang = $('.lang'), langBtn = $('.lang__btn');
  if (lang) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = lang.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function () { lang.classList.remove('open'); langBtn.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lang.classList.remove('open'); });
  }

  /* image slider */
  $$('[data-slider]').forEach(function (s) {
    var track = $('.slider__track', s), slides = $$('.slide', s), i = 0, startX = null;
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * i) + '%)';
    }
    $('.slider__btn--prev', s).addEventListener('click', function () { go(i - 1); });
    $('.slider__btn--next', s).addEventListener('click', function () { go(i + 1); });
    s.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    s.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      startX = null;
    });
    s.setAttribute('tabindex', '0');
    s.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
  });

  /* gallery lightbox */
  var lb = $('.lightbox');
  if (lb) {
    var links = $$('[data-lightbox]'), img = $('img', lb), cur = 0;
    function show(n) {
      cur = (n + links.length) % links.length;
      img.src = links[cur].getAttribute('href');
      img.alt = $('img', links[cur]).alt;
    }
    function open(n) { show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lightbox__close', lb).focus(); }
    function close() { lb.hidden = true; img.removeAttribute('src'); document.body.style.overflow = ''; }
    links.forEach(function (a, n) { a.addEventListener('click', function (e) { e.preventDefault(); open(n); }); });
    $('.lightbox__close', lb).addEventListener('click', close);
    $('.lightbox__nav--prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lightbox__nav--next', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* video modal (self-hosted MP4) */
  $$('[data-video]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var m = document.createElement('div');
      m.className = 'video-modal';
      m.innerHTML = '<div class="video-modal__box"><video controls autoplay playsinline preload="metadata" poster="' + btn.dataset.poster + '" src="' + btn.dataset.video + '"></video></div><button type="button" aria-label="Close"><svg class="ico"><use href="#i-x"/></svg></button>';
      function close() { m.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esc); btn.focus(); }
      function esc(e) { if (e.key === 'Escape') close(); }
      m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('button')) close(); });
      document.addEventListener('keydown', esc);
      document.body.appendChild(m);
      document.body.style.overflow = 'hidden';
    });
  });
})();
