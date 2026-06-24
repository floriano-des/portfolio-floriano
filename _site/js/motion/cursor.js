(function () {
  'use strict';

  if (!window.gsap) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
  document.documentElement.classList.add('has-custom-cursor');

  window.gsap.set(cursor, { xPercent: -50, yPercent: -50 });

  var moveX = window.gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3.out' });
  var moveY = window.gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3.out' });

  var INTERACTIVE = 'a, button, label, [role="button"], [data-magnetic], [data-case-zoom], [data-case-carousel], summary, input, textarea, select';
  var COMPACT = '.case-zoom__controls, .case-zoom__controls *';

  function setCursorSize(size) {
    window.gsap.to(cursor, {
      width: size,
      height: size,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }

  function updateCursorState(target) {
    if (target.closest(COMPACT)) {
      setCursorSize(16);
      return;
    }

    if (target.closest(INTERACTIVE)) {
      setCursorSize(56);
      return;
    }

    setCursorSize(20);
  }

  // Appear on first move
  window.addEventListener('mousemove', function (e) {
    moveX(e.clientX);
    moveY(e.clientY);
    if (!cursor._shown) {
      cursor._shown = true;
      window.gsap.to(cursor, { opacity: 1, duration: 0.4 });
    }
    updateCursorState(e.target);
  }, { passive: true });

  // Press feedback
  window.addEventListener('mousedown', function () {
    window.gsap.to(cursor, { scale: 0.72, duration: 0.12, ease: 'power2.out' });
  });

  window.addEventListener('mouseup', function () {
    window.gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
  });

  // Hide when leaving the window
  document.addEventListener('mouseleave', function () {
    window.gsap.to(cursor, { opacity: 0, duration: 0.25 });
  });

  document.addEventListener('mouseenter', function () {
    window.gsap.to(cursor, { opacity: 1, duration: 0.25 });
  });
}());
