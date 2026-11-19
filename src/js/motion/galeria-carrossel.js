(function () {
  'use strict';

  var section = document.querySelector('.galeria-carrossel');
  if (!section) return;

  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopQuery = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
  var reduceMotion = reducedMotionQuery.matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var canDragRows = desktopQuery.matches;
  var row1 = section.querySelector('.galeria-carrossel__row--1');
  var row2 = section.querySelector('.galeria-carrossel__row--2');
  var suppressNextClick = false;
  var pendingClickCard = null;
  var pendingClickTimer = 0;
  var activeRowDrag = null;
  var rowStates = [];
  var lightboxImagePromises = {};

  function preloadLightboxImage(src) {
    if (!src) return Promise.resolve(src);
    if (lightboxImagePromises[src]) return lightboxImagePromises[src];

    lightboxImagePromises[src] = new Promise(function (resolve) {
      var image = new Image();
      var settled = false;

      function done() {
        if (settled) return;
        settled = true;

        if (image.decode) {
          image.decode().catch(function () {}).then(function () {
            resolve(src);
          });
          return;
        }

        resolve(src);
      }

      image.decoding = 'async';
      image.onload = done;
      image.onerror = done;
      image.src = src;

      if (image.complete) done();
    });

    return lightboxImagePromises[src];
  }

  function attachHoverPan(card) {
    var win = card.querySelector('.galeria-card__window');
    var img = card.querySelector('.galeria-card__img');
    if (!win || !img) return;

    card.addEventListener('pointerenter', function () {
      if (!canHover) return;
      preloadLightboxImage(img.getAttribute('data-full-src') || img.currentSrc || img.src);
    }, { passive: true });

    card.addEventListener('mouseenter', function () {
      if (reduceMotion || !canHover) return;

      var winH = win.offsetHeight;
      var renderedW = win.offsetWidth;
      var renderedH = img.naturalWidth > 0
        ? renderedW * (img.naturalHeight / img.naturalWidth)
        : img.offsetHeight;
      var travel = Math.max(0, renderedH - winH);
      if (!travel) return;

      var dur = Math.min(28, Math.max(14, travel / 55));
      img.style.transition = 'transform ' + dur.toFixed(1) + 's linear';
      img.style.transform = 'translateY(-' + Math.round(travel) + 'px)';
    });

    card.addEventListener('mouseleave', function () {
      img.style.transition = 'transform 0.85s cubic-bezier(0.25, 0, 0.1, 1)';
      img.style.transform = 'translateY(0)';
    });
  }

  section.querySelectorAll('.galeria-card').forEach(attachHoverPan);

  function renderRow(state) {
    state.offset = Math.max(-state.travel, Math.min(0, state.offset));
    state.row.style.transform = 'translate3d(' + state.offset.toFixed(2) + 'px, 0, 0)';
  }

  function updateRowProgress(state, trigger) {
    state.offset = -state.travel * (state.direction < 0 ? trigger.progress : 1 - trigger.progress);
    renderRow(state);
  }

  function createRowState(row, direction, index) {
    var viewport = document.createElement('div');
    viewport.className = 'galeria-carrossel__viewport';
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', 'Sites e interfaces, linha ' + index);
    viewport.setAttribute('tabindex', '0');
    row.before(viewport);
    viewport.appendChild(row);

    var state = {
      row: row,
      viewport: viewport,
      direction: direction,
      travel: 0,
      offset: 0,
      trigger: null
    };

    rowStates.push(state);
    row.addEventListener('dragstart', function (event) {
      event.preventDefault();
    });
    row.addEventListener('pointerdown', startRowDrag);
    row.addEventListener('pointermove', moveRowDrag);
    row.addEventListener('pointerup', endRowDrag);
    row.addEventListener('pointercancel', endRowDrag);
    row.addEventListener('lostpointercapture', endRowDrag);

    viewport.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      var offset = state.trigger ? state.offset : -row.scrollLeft;
      var step = row.clientWidth * 0.75;
      if (event.key === 'ArrowRight') offset -= step;
      else if (event.key === 'ArrowLeft') offset += step;
      else if (event.key === 'Home') offset = 0;
      else if (event.key === 'End') offset = -(row.scrollWidth - row.clientWidth);
      else return;

      event.preventDefault();
      scrollToRowOffset(state, offset);
    });

    viewport.addEventListener('focusin', function (event) {
      var card = event.target.closest('.galeria-card');
      if (!card || !state.trigger) return;

      // O foco em um cartão fora da tela deve acompanhar o mesmo progresso do scroll.
      viewport.scrollLeft = 0;
      var cardRect = card.getBoundingClientRect();
      var rowRect = row.getBoundingClientRect();
      var viewportRect = viewport.getBoundingClientRect();
      if (cardRect.left >= viewportRect.left + 16 && cardRect.right <= viewportRect.right - 16) return;

      scrollToRowOffset(state, (row.clientWidth - cardRect.width) / 2 - (cardRect.left - rowRect.left));
    });
  }

  function syncScrollRows() {
    reduceMotion = reducedMotionQuery.matches;
    canDragRows = desktopQuery.matches;
    canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    activeRowDrag = null;

    rowStates.forEach(function (state) {
      if (state.trigger) state.trigger.kill();
      state.trigger = null;
      state.viewport.classList.remove('is-scroll-driven');
      state.row.classList.remove('is-dragging');
      state.row.style.removeProperty('transform');
      state.row.scrollLeft = 0;
    });

    if (canDragRows && !reduceMotion && window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      rowStates.forEach(function (state, index) {
        state.viewport.classList.add('is-scroll-driven');

        function measure() {
          state.travel = Math.max(0, state.row.scrollWidth - state.row.clientWidth);
        }

        measure();

        // Cada linha fica no centro da tela até mostrar o primeiro e o último cartão por inteiro.
        state.trigger = window.ScrollTrigger.create({
          id: 'galeria-row-' + (index + 1),
          trigger: state.viewport,
          start: function () {
            return 'top ' + Math.max(24, Math.round((window.innerHeight - state.viewport.offsetHeight) / 2)) + 'px';
          },
          end: function () { return '+=' + Math.max(1, state.travel); },
          pin: true,
          pinSpacing: true,
          onRefreshInit: measure,
          onRefresh: function (trigger) { updateRowProgress(state, trigger); },
          onUpdate: function (trigger) { updateRowProgress(state, trigger); }
        });
      });
    }

    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function scrollToRowOffset(state, offset) {
    var travel = state.trigger ? state.travel : Math.max(0, state.row.scrollWidth - state.row.clientWidth);
    offset = Math.max(-travel, Math.min(0, offset));
    if (!state.trigger) {
      state.row.scrollLeft = -offset;
      return;
    }

    var progress = travel ? -offset / travel : 0;
    if (state.direction > 0) progress = 1 - progress;
    var target = state.trigger.start + progress * (state.trigger.end - state.trigger.start);
    if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
    else window.scrollTo({ top: target, behavior: 'instant' });
  }

  if (row1) createRowState(row1, -1, 1);
  if (row2) createRowState(row2, 1, 2);
  desktopQuery.addEventListener('change', syncScrollRows);
  reducedMotionQuery.addEventListener('change', syncScrollRows);
  syncScrollRows();

  function getStateForRow(row) {
    return rowStates.find(function (state) {
      return state.row === row;
    });
  }

  function clearPendingClickCard() {
    if (pendingClickTimer) {
      window.clearTimeout(pendingClickTimer);
      pendingClickTimer = 0;
    }

    pendingClickCard = null;
  }

  function setPendingClickCard(card) {
    clearPendingClickCard();
    pendingClickCard = card;

    if (pendingClickCard) {
      pendingClickTimer = window.setTimeout(clearPendingClickCard, 700);
    }
  }

  function startRowDrag(e) {
    var row = e.currentTarget;
    var state = getStateForRow(row);

    if (!state || !canDragRows || e.button !== 0) return;

    activeRowDrag = {
      state: state,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: state.trigger ? state.offset : -row.scrollLeft,
      moved: false
    };

    suppressNextClick = false;
    setPendingClickCard(e.target.closest('.galeria-card'));
    row.classList.add('is-dragging');

    if (row.setPointerCapture) {
      try { row.setPointerCapture(e.pointerId); } catch (_) {}
    }
  }

  function moveRowDrag(e) {
    var dx;
    var dy;

    if (!activeRowDrag || activeRowDrag.pointerId !== e.pointerId) return;

    dx = e.clientX - activeRowDrag.startX;
    dy = e.clientY - activeRowDrag.startY;

    if (Math.abs(dx) > 6 && Math.abs(dx) >= Math.abs(dy)) {
      activeRowDrag.moved = true;
    }

    if (!activeRowDrag.moved) return;

    e.preventDefault();
    scrollToRowOffset(activeRowDrag.state, activeRowDrag.startOffset + dx);
  }

  function endRowDrag(e) {
    if (!activeRowDrag || activeRowDrag.pointerId !== e.pointerId) return;

    activeRowDrag.state.row.classList.remove('is-dragging');

    if (activeRowDrag.moved) {
      clearPendingClickCard();
      suppressNextClick = true;
      window.setTimeout(function () {
        suppressNextClick = false;
      }, 150);
    }

    activeRowDrag = null;
  }

  var lightbox = document.getElementById('galeriaLightbox');
  if (!lightbox) return;

  var lbImg = lightbox.querySelector('.galeria-lightbox__img');
  var lbScreen = lightbox.querySelector('.galeria-lightbox__screen');
  var lbClose = lightbox.querySelector('.galeria-lightbox__close');
  var lbBg = lightbox.querySelector('.galeria-lightbox__backdrop');
  var smoothTarget = 0;
  var smoothFrame = 0;
  var lightboxOpenToken = 0;
  var lightboxOpenFrame = 0;
  var closeImageTimer = 0;

  function maxLightboxScroll() {
    return Math.max(0, lbScreen.scrollHeight - lbScreen.clientHeight);
  }

  function clampScroll(value) {
    return Math.max(0, Math.min(value, maxLightboxScroll()));
  }

  function cancelSmoothScroll() {
    if (!smoothFrame) return;
    window.cancelAnimationFrame(smoothFrame);
    smoothFrame = 0;
  }

  function resetSmoothScroll(value) {
    cancelSmoothScroll();
    smoothTarget = clampScroll(value || 0);
    lbScreen.scrollTop = smoothTarget;
  }

  function smoothStep() {
    var current = lbScreen.scrollTop;
    var distance = smoothTarget - current;

    if (Math.abs(distance) < 0.5) {
      lbScreen.scrollTop = smoothTarget;
      smoothFrame = 0;
      return;
    }

    lbScreen.scrollTop = current + distance * 0.22;
    smoothFrame = window.requestAnimationFrame(smoothStep);
  }

  function scrollLightboxTo(value, immediate) {
    smoothTarget = clampScroll(value);

    if (immediate || reduceMotion) {
      resetSmoothScroll(smoothTarget);
      return;
    }

    if (!smoothFrame) {
      smoothFrame = window.requestAnimationFrame(smoothStep);
    }
  }

  function cancelLightboxOpenFrame() {
    if (!lightboxOpenFrame) return;
    window.cancelAnimationFrame(lightboxOpenFrame);
    lightboxOpenFrame = 0;
  }

  function revealLightbox(token) {
    cancelLightboxOpenFrame();

    lightboxOpenFrame = window.requestAnimationFrame(function () {
      lightboxOpenFrame = window.requestAnimationFrame(function () {
        if (token !== lightboxOpenToken) return;
        lightbox.classList.add('is-open');
        lightboxOpenFrame = 0;
      });
    });

    window.setTimeout(function () {
      if (token !== lightboxOpenToken || lightbox.classList.contains('is-open')) return;
      lightbox.classList.add('is-open');
      lightboxOpenFrame = 0;
    }, 80);
  }

  function showLightbox(src, alt, token) {
    if (token !== lightboxOpenToken) return;

    if (closeImageTimer) {
      window.clearTimeout(closeImageTimer);
      closeImageTimer = 0;
    }

    lbImg.src = src;
    lbImg.alt = alt || '';
    resetSmoothScroll(0);
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    revealLightbox(token);
  }

  function openLightbox(src, alt) {
    var token = lightboxOpenToken + 1;
    lightboxOpenToken = token;

    preloadLightboxImage(src).then(function () {
      showLightbox(src, alt, token);
    });
  }

  function closeLightbox() {
    lightboxOpenToken += 1;
    cancelLightboxOpenFrame();
    cancelSmoothScroll();
    cancelNotebookDrag();
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (closeImageTimer) {
      window.clearTimeout(closeImageTimer);
    }

    closeImageTimer = window.setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) {
        lbImg.src = '';
      }

      closeImageTimer = 0;
    }, 380);
  }

  function openCardLightbox(card) {
    var img;

    if (!card) return;

    img = card.querySelector('.galeria-card__img');
    if (!img || !img.src) return;

    openLightbox(img.getAttribute('data-full-src') || img.currentSrc || img.src, img.alt);
  }

  section.addEventListener('click', function (e) {
    var card;

    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

    card = e.target.closest('.galeria-card') || pendingClickCard;
    clearPendingClickCard();
    openCardLightbox(card);
  });

  section.addEventListener('keydown', function (e) {
    var trigger = e.target.closest('.galeria-card__open');
    if (!trigger || !section.contains(trigger)) return;
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;

    e.preventDefault();
    openCardLightbox(trigger.closest('.galeria-card'));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBg.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  var isNotebookDragging = false;
  var notebookDragStartY = 0;
  var notebookDragScrollY = 0;
  var notebookDragTargetY = 0;
  var notebookDragFrame = 0;

  function cancelNotebookDrag() {
    if (!notebookDragFrame) return;
    window.cancelAnimationFrame(notebookDragFrame);
    notebookDragFrame = 0;
  }

  function applyNotebookDrag() {
    lbScreen.scrollTop = notebookDragTargetY;
    notebookDragFrame = 0;
  }

  lbScreen.addEventListener('mousedown', function (e) {
    cancelSmoothScroll();
    cancelNotebookDrag();
    isNotebookDragging = true;
    notebookDragStartY = e.clientY;
    notebookDragScrollY = lbScreen.scrollTop;
    lbScreen.classList.add('is-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isNotebookDragging) return;

    notebookDragTargetY = clampScroll(notebookDragScrollY - (e.clientY - notebookDragStartY));
    smoothTarget = notebookDragTargetY;

    if (!notebookDragFrame) {
      notebookDragFrame = window.requestAnimationFrame(applyNotebookDrag);
    }
  });

  document.addEventListener('mouseup', function () {
    if (!isNotebookDragging) return;
    isNotebookDragging = false;
    lbScreen.classList.remove('is-dragging');
  });

  lbScreen.addEventListener('wheel', function (e) {
    var delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 18;
    if (e.deltaMode === 2) delta *= lbScreen.clientHeight;

    e.stopPropagation();
    e.preventDefault();
    scrollLightboxTo(smoothTarget + delta, false);
  }, { passive: false });

  var touchStartY = 0;
  var touchScrollY = 0;

  lbScreen.addEventListener('touchstart', function (e) {
    cancelSmoothScroll();
    touchStartY = e.touches[0].clientY;
    touchScrollY = lbScreen.scrollTop;
  }, { passive: true });

  lbScreen.addEventListener('touchmove', function (e) {
    scrollLightboxTo(touchScrollY - (e.touches[0].clientY - touchStartY), false);
    e.preventDefault();
  }, { passive: false });
}());
