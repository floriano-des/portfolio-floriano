(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sections = document.querySelectorAll('[data-cs-section]');
  if (!sections.length) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  sections.forEach(function (section) {
    var rect = section.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      // Already visible on load: activate instantly (no transition)
      section.classList.add('section-bg-instant');
      section.classList.add('section-bg-active');
    } else {
      window.ScrollTrigger.create({
        trigger: section,
        start: 'top 72%',
        once: true,
        onEnter: function () {
          section.classList.add('section-bg-active');
        }
      });
    }
  });
}());
