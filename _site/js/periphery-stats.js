(function () {
  "use strict";

  const counters = Array.from(document.querySelectorAll("[data-count-up]"));
  if (!counters.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.countUp);
      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      }

      element.textContent = "0";
      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: 0.55 });

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
})();
