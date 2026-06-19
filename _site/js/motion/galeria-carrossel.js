(function () {
  'use strict';

  var section = document.querySelector('.galeria-carrossel');
  if (!section) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var canDragRows = canHover && window.matchMedia('(min-width: 769px)').matches;
  var row1 = section.querySelector('.galeria-carrossel__row--1');
  var row2 = section.querySelector('.galeria-carrossel__row--2');
  var pointerMoved = false;
  var suppressNextClick = false;
  var pendingClickCard = null;
  var pendingClickTimer = 0;
  var activeRowDrag = null;
  var isSectionHovering = false;
  var rowStates = [];
  var lastFrameTime = 0;
  var rowDuration = 32;
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
    if (!win || !img || !canHover) return;

    card.addEventListener('pointerenter', function () {
      preloadLightboxImage(img.getAttribute('data-full-src') || img.currentSrc || img.src);
    }, { passive: true });

    card.addEventListener('mouseenter', function () {
      if (reduceMotion) return;

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

  [row1, row2].forEach(function (row) {
    if (!row) return;

    Array.from(row.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      row.appendChild(clone);
      attachHoverPan(clone);
    });
  });

  function getLoopDistance(row) {
    return Math.max(0, row.scrollWidth / 2);
  }

  function getReferenceTravel() {
    return Math.max(1, section.clientWidth / 2);
  }

  function normalizeOffset(state) {
    if (!state.loop) return 0;

    while (state.offset <= -state.loop) {
      state.offset += state.loop;
    }

    while (state.offset > 0) {
      state.offset -= state.loop;
    }

    return state.offset;
  }

  function renderRow(state) {
    normalizeOffset(state);
    state.row.style.transform = 'translate3d(' + state.offset.toFixed(2) + 'px, 0, 0)';
  }

  function refreshRowMetrics(state, isInitial) {
    var oldLoop = state.loop || 0;
    var oldOffset = state.offset || 0;

    state.loop = getLoopDistance(state.row);
    state.speed = getReferenceTravel() / state.duration;

    if (isInitial) {
      state.offset = state.direction > 0 ? -state.loop : 0;
    } else if (oldLoop && state.loop) {
      state.offset = (oldOffset / oldLoop) * state.loop;
    }

    renderRow(state);
  }

  function createRowState(row, direction, duration) {
    var state = {
      row: row,
      direction: direction,
      duration: duration,
      loop: 0,
      speed: 0,
      offset: 0,
      dragging: false
    };

    row.style.animation = 'none';
    rowStates.push(state);
    refreshRowMetrics(state, true);
    return state;
  }

  if (canDragRows) {
    if (row1) createRowState(row1, -1, rowDuration);
    if (row2) createRowState(row2, 1, rowDuration);
  }

  function animateRows(now) {
    var delta = lastFrameTime ? (now - lastFrameTime) / 1000 : 0;
    lastFrameTime = now;

    if (!reduceMotion && canDragRows && !isSectionHovering && delta > 0) {
      rowStates.forEach(function (state) {
        if (state.dragging) return;
        state.offset += state.direction * state.speed * delta;
        renderRow(state);
      });
    }

    window.requestAnimationFrame(animateRows);
  }

  if (canDragRows) {
    window.requestAnimationFrame(animateRows);

    section.addEventListener('mouseenter', function () {
      isSectionHovering = true;
    });

    section.addEventListener('mouseleave', function () {
      isSectionHovering = false;
    });
  }

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
      startOffset: state.offset,
      moved: false
    };

    pointerMoved = false;
    suppressNextClick = false;
    setPendingClickCard(e.target.closest('.galeria-card'));
    state.dragging = true;
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

    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      activeRowDrag.moved = true;
      pointerMoved = true;
    }

    if (!activeRowDrag.moved) return;

    e.preventDefault();
    activeRowDrag.state.offset = activeRowDrag.startOffset + dx;
    renderRow(activeRowDrag.state);
  }

  function endRowDrag(e) {
    if (!activeRowDrag || activeRowDrag.pointerId !== e.pointerId) return;

    activeRowDrag.state.dragging = false;
    activeRowDrag.state.row.classList.remove('is-dragging');
    renderRow(activeRowDrag.state);

    if (activeRowDrag.moved) {
      clearPendingClickCard();
      suppressNextClick = true;
      window.setTimeout(function () {
        suppressNextClick = false;
      }, 150);
    }

    pointerMoved = false;
    activeRowDrag = null;
  }

  if (canDragRows) {
    rowStates.forEach(function (state) {
      state.row.addEventListener('dragstart', function (e) {
        e.preventDefault();
      });
      state.row.addEventListener('pointerdown', startRowDrag);
      state.row.addEventListener('pointermove', moveRowDrag);
      state.row.addEventListener('pointerup', endRowDrag);
      state.row.addEventListener('pointercancel', endRowDrag);
    });

    window.addEventListener('resize', function () {
      rowStates.forEach(function (state) {
        refreshRowMetrics(state, false);
      });
    }, { passive: true });
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

  section.addEventListener('click', function (e) {
    var card;
    var img;

    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

    card = e.target.closest('.galeria-card') || pendingClickCard;
    clearPendingClickCard();
    if (!card) return;

    img = card.querySelector('.galeria-card__img');
    if (!img || !img.src) return;

    openLightbox(img.getAttribute('data-full-src') || img.currentSrc || img.src, img.alt);
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
