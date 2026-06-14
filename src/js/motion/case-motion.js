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

  image.style.transform = 'none';
}());
