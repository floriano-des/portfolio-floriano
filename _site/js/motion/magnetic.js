(function () {
  'use strict';

  if (!window.gsap ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var items = document.querySelectorAll('[data-magnetic]');

  Array.prototype.forEach.call(items, function (item) {
    var inner = item.querySelector('[data-magnetic-inner]');

    item.addEventListener('pointermove', function (event) {
      var bounds = item.getBoundingClientRect();
      var x = event.clientX - bounds.left - bounds.width / 2;
      var y = event.clientY - bounds.top - bounds.height / 2;

      window.gsap.to(item, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: true
      });

      if (inner) {
        window.gsap.to(inner, {
          x: x * 0.12,
          y: y * 0.12,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: true
        });
      }
    });

    item.addEventListener('pointerleave', function () {
      window.gsap.to(item, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'elastic.out(1, 0.45)'
      });

      if (inner) {
        window.gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.45)'
        });
      }
    });
  });
}());
