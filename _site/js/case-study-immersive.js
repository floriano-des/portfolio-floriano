(function () {
  "use strict";

  // Interações exclusivas do template imersivo. Este arquivo não deve assumir
  // a estrutura dos cases que continuam usando case-study-md.njk.
  var root = document.querySelector("[data-immersive-case]");
  if (!root) return;

  var closeButton = document.querySelector("[data-case-close]");
  var modeButtons = Array.from(root.querySelectorAll("[data-case-mode-button]"));
  var modePanels = Array.from(root.querySelectorAll("[data-case-mode-panel]"));
  var modeSwitch = root.querySelector("[data-case-mode-switch]");
  var backToTop = document.querySelector("[data-back-to-top]");

  function prepareMotion() {
    var selector = [
      ".immersive-case__cover",
      ".immersive-case__meta",
      ".immersive-case__cta",
      ".case-mode-switch",
      ".case-lead",
      ".case-overview-title",
      ".case-facts",
      ".case-copy",
      ".case-callout",
      ".case-figure",
      ".case-wide",
      ".case-matrix",
      ".case-carousel",
      ".case-video",
      ".case-quote",
      ".case-footer-cta"
    ].join(",");

    root.querySelectorAll(selector).forEach(function (element) {
      if (element.classList.contains("case-copy") && element.closest(".case-callout")) return;
      element.setAttribute("data-animate", "");
    });

    var heroMotion = [
      root.querySelector(".immersive-case__cover"),
      root.querySelector(".immersive-case__meta"),
      root.querySelector(".immersive-case__cta"),
      modeSwitch
    ];

    heroMotion.forEach(function (element, index) {
      if (!element || index === 0) return;
      element.setAttribute("data-delay", String(index));
    });

    // O PDF possui rolagem própria. Os carrosséis não recebem esta marcação,
    // pois ela interrompe a rolagem vertical do Lenis sob o ponteiro.
    root.querySelectorAll(".case-pdf").forEach(function (element) {
      element.setAttribute("data-lenis-prevent", "");
    });

    root.querySelectorAll(".immersive-case__cta, .case-footer-cta").forEach(function (element) {
      element.setAttribute("data-magnetic", "");
    });
  }

  prepareMotion();

  function closeCase() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "/projetos/";
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeCase);
  }

  if (backToTop) {
    function updateBackToTop() {
      backToTop.classList.toggle("is-visible", window.scrollY > 400);
    }

    backToTop.addEventListener("click", function () {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    window.addEventListener("pageshow", updateBackToTop);
    updateBackToTop();
  }

  function setMode(mode, options) {
    var nextMode = mode === "tldr" ? "tldr" : "detailed";
    var config = options || {};

    modeButtons.forEach(function (button) {
      var active = button.getAttribute("data-case-mode-button") === nextMode;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.tabIndex = active ? 0 : -1;
    });

    modePanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-case-mode-panel") !== nextMode;
    });

    root.setAttribute("data-case-mode", nextMode);

    if (config.updateUrl !== false) {
      var url = new URL(window.location.href);
      if (nextMode === "detailed") {
        url.searchParams.delete("mode");
      } else {
        url.searchParams.set("mode", "tldr");
      }
      window.history.replaceState(null, "", url.toString());
    }

    window.requestAnimationFrame(function () {
      centerCarousels();
    });
  }

  modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var switchTop = modeSwitch.getBoundingClientRect().top;
      setMode(button.getAttribute("data-case-mode-button"));

      if (switchTop < 0) {
        modeSwitch.scrollIntoView({ block: "start" });
      }
    });

    button.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      var currentIndex = modeButtons.indexOf(button);
      var offset = event.key === "ArrowRight" ? 1 : -1;
      var nextIndex = (currentIndex + offset + modeButtons.length) % modeButtons.length;
      modeButtons[nextIndex].focus();
      modeButtons[nextIndex].click();
    });
  });

  function centerCarousel(carousel) {
    if (!carousel.hasAttribute("data-carousel-centered")) return;
    carousel.scrollLeft = Math.max(0, (carousel.scrollWidth - carousel.clientWidth) / 2);
  }

  function centerCarousels() {
    root.querySelectorAll("[data-carousel-centered]").forEach(centerCarousel);
  }

  root.querySelectorAll("[data-case-carousel]").forEach(function (carousel) {
    var drag = {
      active: false,
      startX: 0,
      startScrollLeft: 0
    };

    carousel.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      drag.active = true;
      drag.startX = event.clientX;
      drag.startScrollLeft = carousel.scrollLeft;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener("pointermove", function (event) {
      if (!drag.active) return;
      carousel.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
    });

    function stopDragging(event) {
      if (!drag.active) return;
      drag.active = false;
      carousel.classList.remove("is-dragging");
      if (event && carousel.hasPointerCapture(event.pointerId)) {
        carousel.releasePointerCapture(event.pointerId);
      }
    }

    carousel.addEventListener("pointerup", stopDragging);
    carousel.addEventListener("pointercancel", stopDragging);
    carousel.addEventListener("lostpointercapture", stopDragging);
  });

  function createZoomButton(label, action, icon) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "case-zoom__button";
    button.setAttribute("aria-label", label);
    button.setAttribute("data-case-zoom-action", action);
    button.innerHTML = icon;
    return button;
  }

  function initializeZoomViewer(viewer, index) {
    var image = viewer.querySelector(":scope > img");
    if (!image) return;

    var state = {
      scale: 1,
      x: 0,
      y: 0,
      panning: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0
    };
    var minScale = 1;
    var maxScale = 4;
    var scaleStep = 0.5;
    var controls = document.createElement("div");
    var zoomOut = createZoomButton(
      "Diminuir zoom",
      "out",
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12"/></svg>'
    );
    var reset = document.createElement("button");
    var zoomIn = createZoomButton(
      "Aumentar zoom",
      "in",
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>'
    );

    viewer.classList.add("case-zoom");
    viewer.tabIndex = viewer.hasAttribute("tabindex") ? viewer.tabIndex : 0;
    viewer.setAttribute("aria-label", "Imagem ampliável: " + image.alt);
    image.draggable = false;

    controls.className = "case-zoom__controls";
    controls.setAttribute("aria-label", "Controles de zoom");
    reset.type = "button";
    reset.className = "case-zoom__level";
    reset.setAttribute("aria-label", "Restaurar zoom para 100%");
    reset.setAttribute("data-case-zoom-action", "reset");
    reset.textContent = "100%";
    controls.append(zoomOut, reset, zoomIn);
    viewer.appendChild(controls);

    function getBounds() {
      return {
        x: Math.max(0, (image.offsetWidth * state.scale - viewer.clientWidth) / 2),
        y: Math.max(0, (image.offsetHeight * state.scale - viewer.clientHeight) / 2)
      };
    }

    function clampPan() {
      var bounds = getBounds();
      state.x = Math.min(bounds.x, Math.max(-bounds.x, state.x));
      state.y = Math.min(bounds.y, Math.max(-bounds.y, state.y));
    }

    function render() {
      clampPan();
      image.style.transform = "translate3d(" + state.x + "px, " + state.y + "px, 0) scale(" + state.scale + ")";
      reset.textContent = Math.round(state.scale * 100) + "%";
      zoomOut.disabled = state.scale <= minScale;
      zoomIn.disabled = state.scale >= maxScale;
      viewer.classList.toggle("is-zoomed", state.scale > minScale);

      if (state.scale === minScale) {
        state.x = 0;
        state.y = 0;
        image.style.transform = "";
      }
    }

    function setScale(nextScale) {
      state.scale = Math.min(maxScale, Math.max(minScale, nextScale));
      render();
    }

    controls.addEventListener("pointerdown", function (event) {
      event.stopPropagation();
    });

    controls.addEventListener("click", function (event) {
      var button = event.target.closest("[data-case-zoom-action]");
      if (!button) return;
      event.stopPropagation();

      var action = button.getAttribute("data-case-zoom-action");
      if (action === "in") setScale(state.scale + scaleStep);
      if (action === "out") setScale(state.scale - scaleStep);
      if (action === "reset") setScale(minScale);
    });

    viewer.addEventListener("pointerdown", function (event) {
      if (state.scale <= minScale || event.target.closest(".case-zoom__controls")) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();
      state.panning = true;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.originX = state.x;
      state.originY = state.y;
      viewer.classList.add("is-panning");
      viewer.setPointerCapture(event.pointerId);
    });

    viewer.addEventListener("pointermove", function (event) {
      if (!state.panning || event.pointerId !== state.pointerId) return;
      event.preventDefault();
      state.x = state.originX + event.clientX - state.startX;
      state.y = state.originY + event.clientY - state.startY;
      render();
    });

    function stopPanning(event) {
      if (!state.panning) return;
      state.panning = false;
      viewer.classList.remove("is-panning");

      if (event && viewer.hasPointerCapture(event.pointerId)) {
        viewer.releasePointerCapture(event.pointerId);
      }
    }

    viewer.addEventListener("pointerup", stopPanning);
    viewer.addEventListener("pointercancel", stopPanning);
    viewer.addEventListener("lostpointercapture", stopPanning);

    viewer.addEventListener("dblclick", function (event) {
      if (event.target.closest(".case-zoom__controls")) return;
      event.preventDefault();
      event.stopPropagation();
      setScale(state.scale === minScale ? 2 : minScale);
    });

    viewer.addEventListener("keydown", function (event) {
      var panStep = 40;

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setScale(state.scale + scaleStep);
      } else if (event.key === "-") {
        event.preventDefault();
        setScale(state.scale - scaleStep);
      } else if (event.key === "0") {
        event.preventDefault();
        setScale(minScale);
      } else if (state.scale > minScale && event.key.indexOf("Arrow") === 0) {
        event.preventDefault();
        if (event.key === "ArrowLeft") state.x += panStep;
        if (event.key === "ArrowRight") state.x -= panStep;
        if (event.key === "ArrowUp") state.y += panStep;
        if (event.key === "ArrowDown") state.y -= panStep;
        render();
      }
    });

    viewer.setAttribute("data-case-zoom-index", String(index + 1));
    render();

    window.addEventListener("resize", render);
  }

  root.querySelectorAll("[data-case-zoom]").forEach(initializeZoomViewer);

  var initialMode = new URLSearchParams(window.location.search).get("mode");
  setMode(initialMode === "tldr" ? "tldr" : "detailed", { updateUrl: false });

  window.addEventListener("resize", centerCarousels);
  window.addEventListener("pageshow", centerCarousels);
}());
