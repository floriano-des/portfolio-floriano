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

  // Appear on first move
  window.addEventListener('mousemove', function (e) {
    moveX(e.clientX);
    moveY(e.clientY);
    if (!cursor._shown) {
      cursor._shown = true;
      window.gsap.to(cursor, { opacity: 1, duration: 0.4 });
    }
  }, { passive: true });

  // Expand over interactive elements
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(INTERACTIVE)) {
      window.gsap.to(cursor, {
        width: 56,
        height: 56,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(INTERACTIVE)) {
      window.gsap.to(cursor, {
        width: 20,
        height: 20,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  });

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
