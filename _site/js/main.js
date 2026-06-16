/* ===================================================
   main.js , Floriano Silva Portfolio
   =================================================== */

(function () {
  'use strict';

  // ─── Constantes ──────────────────────────────────────
  var SCROLL_TRIGGER     = 40;   // px , threshold para classe .scrolled no header
  var ACTIVE_LINK_OFFSET = 120;  // px , offset do topo para detecção de seção ativa
  var CAROUSEL_GAP       = 24;   // px , gap entre itens do carrossel (deve bater com CSS)
  var RESIZE_DEBOUNCE    = 150;  // ms , debounce no resize do carrossel

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

  // ─── Carrossel genérico ───────────────────────────────
  // mode: 'multi' (padrão) , exibe perView itens por vez
  // mode: 'full'           , cada slide ocupa 100% da largura
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

    function targetIndex(index) {
      var lastIndex = maxIndex();
      if (!slideMode) return Math.max(0, Math.min(index, lastIndex));
      if (index < 0) return lastIndex;
      if (index > lastIndex) return 0;
      return index;
    }

    function updateViewportHeight() {
      if (!slideMode || !trackEl.parentElement || !items.length) return;
      var height = 0;
      items.forEach(function (item) {
        height = Math.max(height, item.offsetHeight);
      });
      trackEl.parentElement.style.height = height + 'px';
    }

    function goTo(index) {
      current = targetIndex(index);
      trackEl.style.transform = 'translateX(-' + (current * itemWidth()) + 'px)';
      updateViewportHeight();
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
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.setAttribute('tabindex', i === 0 ? '0' : '-1');
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
        var isCurrent = i === current;
        d.classList.toggle('active', isCurrent);
        d.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        d.setAttribute('tabindex', isCurrent ? '0' : '-1');
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

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!slideMode) {
          perView  = window.innerWidth <= 768 ? 1 : 2;
          current  = Math.min(current, maxIndex());
          buildDots();
        }
        goTo(current);
      }, RESIZE_DEBOUNCE);
    }, { passive: true });

    buildDots();
    goTo(0);
    window.addEventListener('load', updateViewportHeight, { once: true });
  }

  // Carrossel , Explorações (projetos.html)
  initCarousel(
    document.getElementById('carouselTrack'),
    document.getElementById('carouselPrev'),
    document.getElementById('carouselNext'),
    document.getElementById('carouselDots'),
    'multi'
  );

  // Slider , Depoimentos (sobre.html)
  initCarousel(
    document.getElementById('testimonialsTrack'),
    document.getElementById('testimonialsPrev'),
    document.getElementById('testimonialsNext'),
    document.getElementById('testimonialsDots'),
    'full'
  );

  function initQuantumResearchCarousels() {
    var carousels = document.querySelectorAll('[data-research-carousel]');
    if (!carousels.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function closeCaptions(carousel) {
      carousel.querySelectorAll('details[open]').forEach(function (details) {
        details.removeAttribute('open');
      });
    }

    carousels.forEach(function (carousel) {
      var track = carousel.querySelector('[data-research-track]');
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-research-slide]'));
      var prev = carousel.querySelector('[data-research-prev]');
      var next = carousel.querySelector('[data-research-next]');
      var dotsContainer = carousel.querySelector('[data-research-dots]');
      var current = 0;
      var timer = null;
      var autoplayAttr = carousel.getAttribute('data-autoplay');
      var autoplayEnabled = autoplayAttr !== null && Number(autoplayAttr) > 0;
      var interval = Number(autoplayAttr) || 5600;

      if (!track || !slides.length) return;

      function hasOpenCaption() {
        return Boolean(carousel.querySelector('details[open]'));
      }

      function stop() {
        if (!timer) return;
        window.clearInterval(timer);
        timer = null;
      }

      function start() {
        if (!autoplayEnabled || reduceMotion || slides.length < 2 || hasOpenCaption() || timer) return;
        timer = window.setInterval(function () {
          goTo(current + 1, false);
        }, interval);
      }

      function restart() {
        stop();
        start();
      }

      function normalize(index) {
        if (index < 0) return slides.length - 1;
        if (index >= slides.length) return 0;
        return index;
      }

      function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.cs-quantum-v2__research-dot').forEach(function (dot, index) {
          var active = index === current;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
      }

      function goTo(index, userAction) {
        current = normalize(index);
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        slides.forEach(function (slide, slideIndex) {
          var active = slideIndex === current;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
          if (active) {
            slide.removeAttribute('inert');
          } else {
            slide.setAttribute('inert', '');
          }
        });
        closeCaptions(carousel);
        updateDots();
        if (userAction) restart();
      }

      function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach(function (_slide, index) {
          var dot = document.createElement('button');
          dot.className = 'cs-quantum-v2__research-dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Ver slide ' + (index + 1));
          dot.addEventListener('click', function () {
            goTo(index, true);
          });
          dotsContainer.appendChild(dot);
        });
      }

      if (prev) {
        prev.addEventListener('click', function () {
          goTo(current - 1, true);
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          goTo(current + 1, true);
        });
      }

      carousel.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goTo(current - 1, true);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goTo(current + 1, true);
        }
      });

      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      carousel.addEventListener('focusin', stop);
      carousel.addEventListener('focusout', function () {
        window.setTimeout(function () {
          if (!carousel.contains(document.activeElement)) start();
        }, 0);
      });

      carousel.querySelectorAll('details').forEach(function (details) {
        details.addEventListener('toggle', function () {
          if (details.open) {
            stop();
          } else if (!hasOpenCaption()) {
            start();
          }
        });
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          stop();
        } else {
          start();
        }
      });

      buildDots();
      goTo(0, false);
      start();
    });
  }

  function initAboutParallax() {
    var images = document.querySelectorAll('.about-parallax__image');
    if (!images.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function updateParallax() {
      ticking = false;

      if (reduceMotion) {
        images.forEach(function (image) {
          image.style.setProperty('--parallax-y', '0px');
        });
        return;
      }

      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      images.forEach(function (image) {
        var section = image.closest('.about-parallax');
        if (!section) return;

        var rect = section.getBoundingClientRect();
        var range = viewportHeight + rect.height;
        var progress = clamp((viewportHeight - rect.top) / range, 0, 1);
        var travel = Math.min(240, Math.max(150, rect.height * 0.34));
        var y = (0.5 - progress) * travel;

        image.style.setProperty('--parallax-y', y.toFixed(2) + 'px');
      });
    }

    function requestParallaxUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate, { passive: true });
    window.addEventListener('load', updateParallax, { once: true });
    updateParallax();
  }

  function initCaseImageLightbox() {
    var triggers = document.querySelectorAll([
      '.case-redesign .case-overview__cover img',
      '.case-redesign .cs-case-figure img',
      '.case-redesign .cs-gallery img',
      '.case-redesign .cs-quantum-v2__figure img',
      '.case-redesign .cs-quantum-v2__wide-figure img',
      '.case-redesign .cs-md-content figure img'
    ].join(','));

    if (!triggers.length) return;

    var lightbox = document.createElement('div');
    lightbox.className = 'case-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Imagem ampliada');
    lightbox.innerHTML = [
      '<button class="case-lightbox__close" type="button" aria-label="Fechar imagem ampliada">Fechar</button>',
      '<figure class="case-lightbox__figure">',
      '<img class="case-lightbox__img" alt="">',
      '<figcaption class="case-lightbox__caption"></figcaption>',
      '</figure>',
      '<a class="case-lightbox__original" href="#" target="_blank" rel="noopener">Abrir imagem original</a>'
    ].join('');

    document.body.appendChild(lightbox);

    var image = lightbox.querySelector('.case-lightbox__img');
    var caption = lightbox.querySelector('.case-lightbox__caption');
    var closeButton = lightbox.querySelector('.case-lightbox__close');
    var originalLink = lightbox.querySelector('.case-lightbox__original');
    var lastTrigger = null;

    function imageLabel(trigger) {
      var figure = trigger.closest('figure');
      var figcaption = figure ? figure.querySelector('figcaption') : null;
      return (figcaption && figcaption.textContent.trim()) || trigger.alt || 'Imagem do projeto';
    }

    function openLightbox(trigger) {
      var src = trigger.getAttribute('data-zoom-src') || trigger.currentSrc || trigger.src;
      lastTrigger = trigger;
      image.src = src;
      image.alt = trigger.alt || '';
      caption.textContent = imageLabel(trigger);
      originalLink.href = src;
      lightbox.hidden = false;
      document.body.classList.add('case-lightbox-open');
      closeButton.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      image.removeAttribute('src');
      document.body.classList.remove('case-lightbox-open');
      if (lastTrigger) lastTrigger.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.classList.add('case-lightbox-trigger');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-label', 'Ampliar imagem: ' + imageLabel(trigger));

      trigger.addEventListener('click', function () {
        openLightbox(trigger);
      });

      trigger.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openLightbox(trigger);
      });
    });

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  initAboutParallax();
  initCaseImageLightbox();
  initQuantumResearchCarousels();

  // ─── Botão voltar ao topo ─────────────────────────────
  (function () {
    var btn = document.querySelector('[data-back-to-top]');
    if (!btn) return;

    var THRESHOLD = 400;
    var visible = false;

    function setVisible(show) {
      if (show === visible) return;
      visible = show;
      btn.classList.toggle('is-visible', show);
    }

    function checkScroll() {
      setVisible(window.scrollY > THRESHOLD);
    }

    // Evento nativo (funciona sem Lenis)
    window.addEventListener('scroll', checkScroll, { passive: true });

    // Após load, conecta ao evento do Lenis se disponível (mais confiável com smooth scroll)
    window.addEventListener('load', function () {
      if (window.__lenis) {
        window.__lenis.on('scroll', checkScroll);
      }
      checkScroll(); // checa posição atual após load completo
    }, { once: true });

    // Verificação imediata (restauração de scroll pelo browser)
    checkScroll();

    btn.addEventListener('click', function () {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }());

}());
