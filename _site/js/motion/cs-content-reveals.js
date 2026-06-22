(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Reveal all paragraphs in case study pages.
  // Headings and figures are handled by text-reveal.js / reveals.js.
  var items = document.querySelectorAll('p');

  if (!items.length) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  Array.prototype.forEach.call(items, function (el) {
    var rect = el.getBoundingClientRect();

    // Already in viewport or scrolled past — show immediately
    if ((rect.top < window.innerHeight && rect.bottom > 0) || rect.bottom <= 0) {
      return;
    }

    window.gsap.set(el, { opacity: 0, y: 14 });

    window.ScrollTrigger.create({
      trigger: el,
      start: 'top bottom-=50px',
      once: true,
      onEnter: function () {
        window.gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out'
        });
      }
    });
  });
}());
