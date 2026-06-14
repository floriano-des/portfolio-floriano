(function () {
  "use strict";

  var STORAGE_KEY = "floriano:page-transition";
  var HOLD_MS = 900;       // tempo visível com o label antes de navegar
  var ENTER_MS = 700;      // duração da CSS transition (deve bater com style.motion.css)
  var FAILSAFE_MS = 5000;
  var overlay = document.querySelector("[data-page-transition]");
  var label = document.querySelector("[data-page-transition-label]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var active = false;
  var watchdog = null;

  if (!overlay) return;

  /* ── utilidades ──────────────────────────────────────── */
  function clearWatchdog() {
    if (watchdog) { window.clearTimeout(watchdog); watchdog = null; }
  }

  function resetOverlay() {
    clearWatchdog();
    active = false;
    overlay.classList.remove("is-entering", "is-leaving");
    overlay.style.cssText = "";
    document.documentElement.removeAttribute("data-transition-pending");
    document.dispatchEvent(new CustomEvent("floriano:transition-end"));
  }

  function armWatchdog() {
    clearWatchdog();
    watchdog = window.setTimeout(resetOverlay, FAILSAFE_MS);
  }

  /* ── sessionStorage ──────────────────────────────────── */
  function readState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      var s = raw ? JSON.parse(raw) : null;
      if (!s || s.expiresAt <= Date.now()) { sessionStorage.removeItem(STORAGE_KEY); return null; }
      return s;
    } catch (_) { return null; }
  }

  function writeState(dest, lbl) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        destination: dest, label: lbl, expiresAt: Date.now() + 6000
      }));
    } catch (_) {}
  }

  /* ── label helper ────────────────────────────────────── */
  function getLabel(link, url) {
    var explicit = link.getAttribute("data-transition-label");
    if (explicit) return explicit;

    var pathname = url.pathname.replace(/\/+$/, "") || "/";
    var known = {
      "/": "Início",
      "/sobre": "Sobre",
      "/reflexoes": "Reflexões",
      "/contato": "Contato",
      "/politica-de-privacidade": "Privacidade",
    };
    if (known[pathname]) return known[pathname];

    var m = pathname.match(/^\/projetos\/([^/]+)$/);
    if (m) return m[1].split("-").map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(" ");

    return link.textContent.trim().replace(/\s+/g, " ") || "Próxima página";
  }

  /* ── shouldHandle ────────────────────────────────────── */
  function shouldHandle(event, link, url) {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.hasAttribute("download") || link.hasAttribute("data-no-transition") ||
        link.target === "_blank" || url.origin !== window.location.origin ||
        !/^https?:$/.test(url.protocol)) return false;
    if (url.pathname === window.location.pathname &&
        url.search === window.location.search) return false;
    return true;
  }

  /* ── ENTER: cortina desce (CSS transition, sem GSAP) ─── */
  function navigate(event) {
    var link = event.target.closest("a[href]");
    if (!link || active) return;

    var url;
    try { url = new URL(link.href, window.location.href); } catch (_) { return; }
    if (!shouldHandle(event, link, url)) return;

    event.preventDefault();
    active = true;

    var destination = url.href;
    label.textContent = getLabel(link, url);
    writeState(destination, label.textContent);
    document.dispatchEvent(new CustomEvent("floriano:transition-start"));
    armWatchdog();

    if (reducedMotion) {
      window.location.assign(destination);
      return;
    }

    // Garante que o overlay está resetado, depois ativa a CSS transition
    overlay.classList.remove("is-entering", "is-leaving");
    overlay.style.cssText = "";

    // Força reflow para que a transition dispare
    overlay.getBoundingClientRect();

    overlay.classList.add("is-entering");

    window.setTimeout(function () {
      window.location.assign(destination);
    }, ENTER_MS + HOLD_MS);
  }

  /* ── EXIT: cortina sobe na nova página ───────────────── */
  function revealPage() {
    var state = readState();
    if (!state) { resetOverlay(); return; }

    label.textContent = state.label || "";
    active = true;
    document.dispatchEvent(new CustomEvent("floriano:transition-start"));
    armWatchdog();

    if (reducedMotion) {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
      resetOverlay();
      return;
    }

    // O CSS html[data-transition-pending] já cobre a página (sem transition).
    // Aguarda dois frames para o browser pintar o overlay, depois anima a saída.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        // Remove o atributo que suprimia a transition, restaurando-a
        document.documentElement.removeAttribute("data-transition-pending");
        overlay.classList.add("is-leaving");

        window.setTimeout(function () {
          try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
          resetOverlay();
        }, ENTER_MS + 100);
      });
    });
  }

  /* ── eventos ─────────────────────────────────────────── */
  document.addEventListener("click", navigate);

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
      resetOverlay();
    }
  });

  revealPage();
}());
