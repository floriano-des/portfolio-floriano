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

  window.gsap.set(preview, {
    xPercent: -50,
    yPercent: -50
  });

  Array.prototype.forEach.call(rows, function (row) {
    var source = row.getAttribute('data-project-image');
    var preload = new Image();
    preload.src = source;

    row.addEventListener('pointerenter', function (event) {
      image.src = source;
      moveX(event.clientX);
      moveY(event.clientY);
      window.gsap.to(preview, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: true
      });
    });

    row.addEventListener('pointermove', function (event) {
      var halfWidth = preview.offsetWidth / 2;
      var halfHeight = preview.offsetHeight / 2;
      var x = Math.max(halfWidth + 28, Math.min(window.innerWidth - halfWidth - 54, event.clientX));
      var y = Math.max(halfHeight + 28, Math.min(window.innerHeight - halfHeight - 54, event.clientY));

      moveX(x);
      moveY(y);
    });

    row.addEventListener('pointerleave', function () {
      window.gsap.to(preview, {
        autoAlpha: 0,
        scale: 0.84,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: true
      });
    });
  });
}());
