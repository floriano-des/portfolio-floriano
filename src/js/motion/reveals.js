(function () {
  "use strict";

  var elements = document.querySelectorAll("[data-animate]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAll() {
    elements.forEach(function (element) {
      element.classList.add("visible");
    });
  }

  if (!elements.length) {
    window.__florianoRevealsReady = true;
    return;
  }

  if (reducedMotion || !window.gsap || !window.ScrollTrigger) {
    showAll();
    window.__florianoRevealsReady = true;
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);

  elements.forEach(function (element) {
    var rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add("visible");
      return;
    }

    window.ScrollTrigger.create({
      trigger: element,
      start: "top bottom-=40px",
      once: true,
      onEnter: function () {
        element.classList.add("visible");
      },
    });
  });

  window.addEventListener("load", function () {
    window.ScrollTrigger.refresh();
  }, { once: true });

  window.__florianoRevealsReady = true;
}());
