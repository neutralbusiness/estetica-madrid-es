/* Estética Madrid — JS mínimo, sin dependencias. */
(function () {
  'use strict';

  // 1 · Navegación móvil
  var toggle = document.querySelector('.hamburger');
  var nav = document.getElementById('nav-principal');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open && window.innerWidth <= 1024 ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // 2 · Submenú Tratamientos
  var subs = document.querySelectorAll('.sub-toggle');
  for (var i = 0; i < subs.length; i++) {
    subs[i].addEventListener('click', function () {
      var parent = this.closest('.nav-dropdown');
      var open = parent.classList.toggle('is-open');
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024) return;
    var open = document.querySelector('.nav-dropdown.is-open');
    if (open && !open.contains(e.target)) {
      open.classList.remove('is-open');
      var t = open.querySelector('.sub-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.nav-dropdown.is-open');
    if (open) open.classList.remove('is-open');
    if (nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // 3 · Borde de la cabecera al hacer scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 4 · Año en el pie
  var year = document.getElementById('footerYear');
  if (year) year.textContent = new Date().getFullYear();

  // 5 · Entrada al scroll
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (var j = 0; j < reveals.length; j++) reveals[j].classList.add('is-visible');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  for (var k = 0; k < reveals.length; k++) io.observe(reveals[k]);
})();
