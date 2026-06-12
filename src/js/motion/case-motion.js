(function () {
  'use strict';

  var cover = document.querySelector('[data-case-cover]');

  if (!cover ||
      !window.gsap ||
      !window.ScrollTrigger ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var image = cover.querySelector('img');
  if (!image) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.fromTo(image, {
    scale: 1.07,
    yPercent: -2
  }, {
    scale: 1,
    yPercent: 4,
    ease: 'none',
    scrollTrigger: {
      trigger: cover,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}());
