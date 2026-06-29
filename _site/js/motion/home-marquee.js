(function () {
  'use strict';

  var track = document.querySelector('[data-marquee-track]');

  if (!track ||
      !window.gsap ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var groupWidth  = 0;
  var xPos        = 0;
  var baseScale   = 0.9;
  // velocity.value: positivo = move esquerda, negativo = move direita
  var velocity    = { value: baseScale };
  var settleCall  = null;

  function tick(time, deltaTime) {
    // deltaTime em ms; pxPerMs = largura do grupo em 18 segundos
    var pxPerMs = groupWidth / 18000;
    xPos -= velocity.value * pxPerMs * deltaTime;
    // Mantém xPos em [-groupWidth, 0) sem jamais bater em boundary
    xPos = ((xPos % groupWidth) + groupWidth) % groupWidth - groupWidth;
    window.gsap.set(track, { x: xPos });
  }

  function startMarquee() {
    groupWidth = track.children[0].offsetWidth;
    if (!groupWidth) return;
    xPos = 0;
    window.gsap.ticker.add(tick);
  }

  function updateDirection(dir, vel) {
    // dir: +1 = esquerda, -1 = direita
    var boost = Math.min(3.2, baseScale + Math.abs(vel || 0) / 900);
    var peak  = dir * Math.max(baseScale, boost);

    if (settleCall) settleCall.kill();
    window.gsap.killTweensOf(velocity);
    velocity.value = peak;

    settleCall = window.gsap.delayedCall(0.18, function () {
      window.gsap.to(velocity, {
        value: dir * baseScale,
        duration: 0.7,
        ease: 'power2.out',
        overwrite: true
      });
    });
  }

  // Roda wheel: scroll down = esquerda, scroll up = direita
  window.addEventListener('wheel', function (e) {
    if (!e.deltaY) return;
    updateDirection(e.deltaY > 0 ? 1 : -1, e.deltaY);
  }, { passive: true });

  // Aguarda dois frames para o layout estabilizar
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(startMarquee);
  });

  if (!window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  window.ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: function (self) {
      updateDirection(self.direction > 0 ? 1 : -1, self.getVelocity());
    }
  });
}());
