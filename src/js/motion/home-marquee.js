(function () {
  'use strict';

  var track = document.querySelector('[data-marquee-track]');

  if (!track ||
      !window.gsap ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var marquee = window.gsap.to(track, {
    xPercent: -50,
    duration: 18,
    repeat: -1,
    ease: 'none'
  });

  if (!window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  window.ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: function (self) {
      var velocity = Math.abs(self.getVelocity());
      var boost = Math.min(3.2, 1 + velocity / 900);
      var direction = self.direction < 0 ? -1 : 1;

      window.gsap.to(marquee, {
        timeScale: boost * direction,
        duration: 0.22,
        overwrite: true,
        onComplete: function () {
          window.gsap.to(marquee, {
            timeScale: direction,
            duration: 0.7,
            ease: 'power2.out'
          });
        }
      });
    }
  });
}());
