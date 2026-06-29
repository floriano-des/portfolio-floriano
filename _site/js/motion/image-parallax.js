(function () {
  'use strict';

  if (!window.gsap) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Target figures inside case study content that have images
  var figures = document.querySelectorAll(
    '.cs-md-content figure img, .cs-gallery figure img, .cs-case-figure img, .case-overview__cover img'
  );

  figures.forEach(function (img) {
    var figure = img.closest('figure') || img.parentElement;
    if (!figure) return;

    // Ensure figure clips the overflow from the parallax shift
    figure.style.overflow = 'hidden';

    function onMove(e) {
      var bounds = figure.getBoundingClientRect();
      var cx = e.clientX - bounds.left - bounds.width / 2;
      var cy = e.clientY - bounds.top  - bounds.height / 2;

      window.gsap.to(img, {
        x: cx * -0.04,
        y: cy * -0.04,
        scale: 1.06,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: true
      });
    }

    function onLeave() {
      window.gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: true
      });
    }

    figure.addEventListener('pointermove', onMove);
    figure.addEventListener('pointerleave', onLeave);
  });
}());
