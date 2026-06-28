(function () {
  'use strict';

  var paths = document.querySelectorAll('[data-section-curve-path]');

  if (!paths.length ||
      !window.gsap ||
      !window.ScrollTrigger ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);

  Array.prototype.forEach.call(paths, function (path) {
    window.gsap.to(path, {
      attr: {
        d: 'M0 100 Q300 100 600 100 T1200 100 V100 H0Z'
      },
      ease: 'none',
      scrollTrigger: {
        trigger: path.closest('section'),
        start: 'top bottom',
        end: 'top 55%',
        scrub: true
      }
    });
  });
}());
