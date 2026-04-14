/* ===================================================
   main.js — Floriano Silva Portfolio
   =================================================== */

(function () {
  'use strict';

  // ─── Constantes ──────────────────────────────────────
  var SCROLL_TRIGGER     = 40;   // px — threshold para classe .scrolled no header
  var ACTIVE_LINK_OFFSET = 120;  // px — offset do topo para detecção de seção ativa
  var CAROUSEL_GAP       = 24;   // px — gap entre itens do carrossel (deve bater com CSS)
  var IO_THRESHOLD       = 0.12; // fração visível para disparar animação
  var IO_ROOT_MARGIN     = '0px 0px -40px 0px'; // margem do Intersection Observer
  var RESIZE_DEBOUNCE    = 150;  // ms — debounce no resize do carrossel

  // ─── Navbar: scroll effect ────────────────────────────
  var header   = document.getElementById('header');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  function onScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > SCROLL_TRIGGER);
    }
    if (sections.length > 0) {
      var scrollY = window.scrollY + ACTIVE_LINK_OFFSET;
      sections.forEach(function (section) {
        var top    = section.offsetTop;
        var height = section.offsetHeight;
        var id     = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active',
              href === '/' + id || (id === 'home' && href === '/'));
          });
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Navbar: mobile menu toggle ──────────────────────
  var navToggle = document.getElementById('navToggle');
  var navMenu   = document.getElementById('navMenu');

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (header) header.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (header) header.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Fecha menu com Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  // ─── Animações de entrada (Intersection Observer) ────
  var animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animateEls.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: IO_THRESHOLD, rootMargin: IO_ROOT_MARGIN });

    animateEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  } else {
    animateEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ─── Carrossel genérico ───────────────────────────────
  // mode: 'multi' (padrão) — exibe perView itens por vez
  // mode: 'full'           — cada slide ocupa 100% da largura
  function initCarousel(trackEl, prevBtn, nextBtn, dotsContainer, mode) {
    if (!trackEl) return;

    var slideMode = mode === 'full';
    var items     = trackEl.querySelectorAll(slideMode ? '.testimonial-slide' : '.carousel__item');
    var total     = items.length;
    var perView   = slideMode ? 1 : (window.innerWidth <= 768 ? 1 : 2);
    var current   = 0;
    var resizeTimer;

    function maxIndex() {
      return Math.max(0, total - perView);
    }

    function itemWidth() {
      if (slideMode) return trackEl.offsetWidth;
      return items[0] ? items[0].offsetWidth + CAROUSEL_GAP : 0;
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      trackEl.style.transform = 'translateX(-' + (current * itemWidth()) + 'px)';
      updateDots();
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var dotClass  = slideMode ? 'testimonials__dot' : 'carousel__dot';
      var count     = maxIndex() + 1;
      for (var i = 0; i < count; i++) {
        var dot = document.createElement('button');
        dot.className = dotClass + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
        dot.setAttribute('role', 'tab');
        (function (idx) {
          dot.addEventListener('click', function () { goTo(idx); });
        }(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      var dotClass = slideMode ? 'testimonials__dot' : 'carousel__dot';
      dotsContainer.querySelectorAll('.' + dotClass).forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () { goTo(current - 1); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { goTo(current + 1); });
    }

    // Navegação por teclado no track do carrossel
    trackEl.setAttribute('tabindex', '0');
    trackEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    if (!slideMode) {
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          perView  = window.innerWidth <= 768 ? 1 : 2;
          current  = Math.min(current, maxIndex());
          buildDots();
          goTo(current);
        }, RESIZE_DEBOUNCE);
      }, { passive: true });
    }

    buildDots();
    goTo(0);
  }

  // Carrossel — Explorações (projetos.html)
  initCarousel(
    document.getElementById('carouselTrack'),
    document.getElementById('carouselPrev'),
    document.getElementById('carouselNext'),
    document.getElementById('carouselDots'),
    'multi'
  );

  // Slider — Depoimentos (sobre.html)
  initCarousel(
    document.getElementById('testimonialsTrack'),
    document.getElementById('testimonialsPrev'),
    document.getElementById('testimonialsNext'),
    document.getElementById('testimonialsDots'),
    'full'
  );

})();
