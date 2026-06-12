(function () {
  "use strict";

  var STORAGE_KEY = "floriano:page-transition";
  var FAILSAFE_MS = 2500;
  var overlay = document.querySelector("[data-page-transition]");
  var label = document.querySelector("[data-page-transition-label]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var active = false;
  var watchdog = null;

  if (!overlay) return;

  function dispatch(name) {
    document.dispatchEvent(new CustomEvent(name));
  }

  function clearWatchdog() {
    if (!watchdog) return;
    window.clearTimeout(watchdog);
    watchdog = null;
  }

  function resetOverlay() {
    clearWatchdog();
    active = false;
    overlay.classList.remove("is-active");
    overlay.style.removeProperty("transform");
    overlay.style.removeProperty("opacity");
    overlay.style.removeProperty("visibility");
    overlay.style.removeProperty("pointer-events");
    document.documentElement.removeAttribute("data-transition-pending");
    dispatch("floriano:transition-end");
  }

  function armWatchdog(destination) {
    clearWatchdog();
    watchdog = window.setTimeout(function () {
      resetOverlay();
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}

      if (destination && window.location.href !== destination) {
        window.location.assign(destination);
      }
    }, FAILSAFE_MS);
  }

  function readState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      var state = raw ? JSON.parse(raw) : null;

      if (!state || state.expiresAt <= Date.now()) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch (_) {
      return null;
    }
  }

  function writeState(destination, transitionLabel) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        destination: destination,
        label: transitionLabel,
        expiresAt: Date.now() + 5000,
      }));
    } catch (_) {}
  }

  function getLabel(link, url) {
    var explicit = link.getAttribute("data-transition-label");
    if (explicit) return explicit;

    var pathname = url.pathname.replace(/\/+$/, "") || "/";
    var knownPages = {
      "/": "Início",
      "/sobre": "Sobre",
      "/reflexoes": "Reflexões",
      "/politica-de-privacidade": "Privacidade",
    };

    if (knownPages[pathname]) return knownPages[pathname];

    var projectMatch = pathname.match(/^\/projetos\/([^/]+)$/);
    if (projectMatch) {
      return projectMatch[1]
        .split("-")
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }

    return link.textContent.trim().replace(/\s+/g, " ") || "Próxima página";
  }

  function shouldHandle(event, link, url) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return false;

    if (
      link.hasAttribute("download") ||
      link.hasAttribute("data-no-transition") ||
      link.target === "_blank" ||
      url.origin !== window.location.origin ||
      !/^https?:$/.test(url.protocol)
    ) return false;

    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) return false;

    return true;
  }

  function runWithNativeTransition(update, complete) {
    if (reducedMotion || typeof document.startViewTransition !== "function") {
      update();
      complete();
      return;
    }

    try {
      var transition = document.startViewTransition(update);
      transition.ready.catch(function () {});
      transition.finished.catch(function () {});
      transition.updateCallbackDone.then(complete, complete);
    } catch (_) {
      update();
      complete();
    }
  }

  function navigate(event) {
    var link = event.target.closest("a[href]");
    if (!link || active) return;

    var url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (_) {
      return;
    }

    if (!shouldHandle(event, link, url)) return;

    event.preventDefault();

    var destination = url.href;
    var transitionLabel = getLabel(link, url);
    active = true;
    label.textContent = "• " + transitionLabel;
    dispatch("floriano:transition-start");
    armWatchdog(destination);
    writeState(destination, transitionLabel);

    runWithNativeTransition(
      function () {
        overlay.classList.add("is-active");
      },
      function () {
        if (reducedMotion || !window.gsap) {
          window.location.assign(destination);
          return;
        }

        try {
          window.gsap.fromTo(
            overlay,
            { yPercent: -112, autoAlpha: 1 },
            {
              yPercent: 0,
              duration: 0.72,
              ease: "power4.inOut",
              onComplete: function () {
                window.location.assign(destination);
              },
            }
          );
        } catch (_) {
          /* O watchdog conclui a navegação e libera o overlay. */
        }
      }
    );
  }

  function revealPage() {
    var state = readState();
    if (!state) {
      resetOverlay();
      return;
    }

    label.textContent = "• " + (state.label || "Próxima página");
    active = true;
    dispatch("floriano:transition-start");
    armWatchdog();

    if (reducedMotion || !window.gsap) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
      resetOverlay();
      return;
    }

    try {
      window.gsap.fromTo(
        overlay,
        { yPercent: 0, autoAlpha: 1 },
        {
          yPercent: 112,
          duration: 0.82,
          ease: "power4.inOut",
          onComplete: function () {
            try {
              sessionStorage.removeItem(STORAGE_KEY);
            } catch (_) {}
            resetOverlay();
          },
        }
      );
    } catch (_) {
      /* O watchdog remove o overlay mesmo com falha durante o reveal. */
    }
  }

  document.addEventListener("click", navigate);

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
      resetOverlay();
    }
  });

  revealPage();
}());
