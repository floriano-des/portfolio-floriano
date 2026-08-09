(function () {
  'use strict';

  var track = document.querySelector('[data-marquee-track]');
  var marquee = track ? (track.closest('[data-marquee]') || track) : null;

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
  var isReady     = false;
  var isInView    = typeof window.IntersectionObserver === 'undefined';
  var isPageVisible = !document.hidden;
  var isTickerActive = false;

  function shouldRun() {
    return isReady && isInView && isPageVisible;
  }

  function pauseTicker() {
    if (isTickerActive) {
      window.gsap.ticker.remove(tick);
      isTickerActive = false;
    }

    if (settleCall) {
      settleCall.kill();
      settleCall = null;
    }

    window.gsap.killTweensOf(velocity);
    velocity.value = velocity.value < 0 ? -baseScale : baseScale;
  }

  function syncTicker() {
    if (!shouldRun()) {
      pauseTicker();
      return;
    }

    if (isTickerActive) return;
    isTickerActive = true;
    window.gsap.ticker.add(tick);
  }

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
    isReady = true;
    syncTicker();
  }

  function updateDirection(dir, vel) {
    if (!isTickerActive) return;

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

  if (typeof window.IntersectionObserver !== 'undefined') {
    new window.IntersectionObserver(function (entries) {
      isInView = entries[0].isIntersecting;
      syncTicker();
    }).observe(marquee);
  }

  document.addEventListener('visibilitychange', function () {
    isPageVisible = !document.hidden;
    syncTicker();
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
