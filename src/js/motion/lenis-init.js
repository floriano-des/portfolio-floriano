(function () {
  "use strict";

  var desktopQuery = window.matchMedia("(min-width: 769px) and (pointer: fine)");
  var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lenis = null;
  var tickerCallback = null;

  function canStart() {
    return desktopQuery.matches &&
      !reducedMotionQuery.matches &&
      typeof window.Lenis === "function" &&
      window.gsap &&
      window.ScrollTrigger;
  }

  function getAnchorOffset() {
    var navHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
    ) || 80;

    return -(navHeight + 56);
  }

  function start() {
    if (lenis || !canStart()) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    lenis = new window.Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
    });

    lenis.on("scroll", window.ScrollTrigger.update);

    tickerCallback = function (time) {
      lenis.raf(time * 1000);
    };

    window.gsap.ticker.add(tickerCallback);
    window.gsap.ticker.lagSmoothing(0);

    document.addEventListener("click", onAnchorClick);
    document.addEventListener("floriano:transition-start", stopForTransition);
    document.addEventListener("floriano:transition-end", resumeAfterTransition);
  }

  function stop() {
    if (!lenis) return;

    document.removeEventListener("click", onAnchorClick);
    document.removeEventListener("floriano:transition-start", stopForTransition);
    document.removeEventListener("floriano:transition-end", resumeAfterTransition);

    if (tickerCallback) {
      window.gsap.ticker.remove(tickerCallback);
    }

    lenis.destroy();
    lenis = null;
    tickerCallback = null;
  }

  function onAnchorClick(event) {
    var link = event.target.closest("a[href^='#'], a[href^='/#']");
    if (!link || event.defaultPrevented) return;

    var url = new URL(link.href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;

    var target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target, {
      offset: getAnchorOffset(),
      duration: 1.1,
    });
    window.history.pushState(null, "", url.hash);
  }

  function stopForTransition() {
    if (lenis) lenis.stop();
  }

  function resumeAfterTransition() {
    if (lenis) lenis.start();
  }

  function sync() {
    if (canStart()) {
      start();
    } else {
      stop();
    }
  }

  desktopQuery.addEventListener("change", sync);
  reducedMotionQuery.addEventListener("change", sync);
  sync();
}());

