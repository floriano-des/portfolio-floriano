(function () {
  'use strict';

  var preview = document.querySelector('[data-project-preview]');
  var image = document.querySelector('[data-project-preview-image]');
  var rows = document.querySelectorAll('[data-project-row]');

  if (!preview ||
      !image ||
      !rows.length ||
      !window.gsap ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var moveX = window.gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3.out' });
  var moveY = window.gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3.out' });

  function getClampedPoint(event) {
    var halfWidth = preview.offsetWidth / 2;
    var halfHeight = preview.offsetHeight / 2;

    return {
      x: Math.max(halfWidth + 28, Math.min(window.innerWidth - halfWidth - 28, event.clientX)),
      y: Math.max(halfHeight + 28, Math.min(window.innerHeight - halfHeight - 28, event.clientY))
    };
  }

  window.gsap.set(preview, {
    xPercent: -50,
    yPercent: -50
  });

  Array.prototype.forEach.call(rows, function (row) {
    var source = row.getAttribute('data-project-image');

    row.addEventListener('pointerenter', function (event) {
      var point = getClampedPoint(event);

      if (image.getAttribute('src') !== source) {
        image.src = source;
      }

      window.gsap.set(preview, {
        x: point.x,
        y: point.y
      });

      window.gsap.to(preview, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });

    row.addEventListener('pointermove', function (event) {
      var point = getClampedPoint(event);

      moveX(point.x);
      moveY(point.y);
    });

    row.addEventListener('pointerleave', function () {
      window.gsap.to(preview, {
        autoAlpha: 0,
        scale: 0.84,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });
}());
