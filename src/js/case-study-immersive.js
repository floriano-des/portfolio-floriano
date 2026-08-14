(function () {
  "use strict";

  // Interações exclusivas do template imersivo usado pelos cases do portfólio.
  var root = document.querySelector("[data-immersive-case]");
  if (!root) return;

  var closeButton = document.querySelector("[data-case-close]");
  var modeButtons = Array.from(root.querySelectorAll("[data-case-mode-button]"));
  var modePanels = Array.from(root.querySelectorAll("[data-case-mode-panel]"));
  var modeSwitch = root.querySelector("[data-case-mode-switch]");
  var modeStage = root.querySelector("[data-case-mode-stage]");
  var backToTop = document.querySelector("[data-back-to-top]");
  var modeAnimationId = 0;
  var modeAnimationTimer = 0;
  var modePreferenceKey = "portfolio-case-mode";

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
      ".case-stats",
      ".case-compare",
      ".case-table-wrap",
      ".case-footer-cta"
    ].join(",");

    root.querySelectorAll(selector).forEach(function (element) {
      if (element.classList.contains("case-copy") && element.closest(".case-callout")) return;
      element.setAttribute("data-animate", "");
    });

    var heroMotion = [
      root.querySelector(".immersive-case__cover"),
      modeSwitch,
      root.querySelector(".immersive-case__meta"),
      root.querySelector(".immersive-case__cta")
    ];

    heroMotion.filter(Boolean).forEach(function (element, index) {
      if (index === 0) return;
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

  function getModePanel(mode) {
    return modePanels.find(function (panel) {
      return panel.getAttribute("data-case-mode-panel") === mode;
    });
  }

  function normalizeMode(mode) {
    return mode === "tldr" || mode === "detailed" ? mode : null;
  }

  function getCurrentMode() {
    var rootMode = normalizeMode(root.getAttribute("data-case-mode"));
    if (rootMode) return rootMode;

    var selectedButton = modeButtons.find(function (button) {
      return button.getAttribute("aria-selected") === "true";
    });

    if (selectedButton) {
      return normalizeMode(selectedButton.getAttribute("data-case-mode-button"));
    }

    var visiblePanel = modePanels.find(function (panel) {
      return !panel.hidden;
    });

    return visiblePanel
      ? normalizeMode(visiblePanel.getAttribute("data-case-mode-panel"))
      : "tldr";
  }

  function getStoredMode() {
    try {
      return normalizeMode(window.sessionStorage.getItem(modePreferenceKey));
    } catch (error) {
      return null;
    }
  }

  function storeMode(mode) {
    try {
      window.sessionStorage.setItem(modePreferenceKey, mode);
    } catch (error) {
      // A preferência é opcional quando o armazenamento está indisponível.
    }
  }

  function trackCaseModeEvent(eventName, data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({
      event: eventName,
      case_path: window.location.pathname
    }, data || {}));
  }

  function prepareModeRelationships() {
    modeButtons.forEach(function (button, index) {
      var mode = normalizeMode(button.getAttribute("data-case-mode-button"));
      var panel = mode && getModePanel(mode);
      if (!panel) return;

      if (!button.id) button.id = "case-mode-tab-" + mode + "-" + index;
      if (!panel.id) panel.id = "case-mode-panel-" + mode + "-" + index;
      button.setAttribute("aria-controls", panel.id);
      panel.setAttribute("aria-labelledby", button.id);
    });
  }

  function updateModePanelAccessibility(nextMode) {
    modePanels.forEach(function (panel) {
      var active = panel.getAttribute("data-case-mode-panel") === nextMode;
      panel.setAttribute("aria-hidden", active ? "false" : "true");
      panel.inert = !active;

      if (active) {
        panel.removeAttribute("inert");
      } else {
        panel.setAttribute("inert", "");
      }
    });
  }

  function updateModeControls(nextMode) {
    modeButtons.forEach(function (button) {
      var active = button.getAttribute("data-case-mode-button") === nextMode;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.tabIndex = active ? 0 : -1;
    });
  }

  function updateModeUrl(nextMode, config) {
    if (config.updateUrl === false) return;
    var url = new URL(window.location.href);
    if (nextMode === "detailed") {
      url.searchParams.delete("mode");
    } else {
      url.searchParams.set("mode", "tldr");
    }
    window.history.replaceState(null, "", url.toString());
  }

  function resetModePanel(panel) {
    panel.classList.remove("is-entering", "is-exiting");
    panel.style.position = "";
    panel.style.inset = "";
    panel.style.width = "";
  }

  function showModeImmediately(nextMode) {
    updateModePanelAccessibility(nextMode);

    modePanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-case-mode-panel") !== nextMode;
      resetModePanel(panel);
    });

    if (modeStage) {
      modeStage.classList.remove("is-switching");
      modeStage.style.height = "";
    }
  }

  function finishModeAnimation() {
    if (!modeStage || !modeStage.classList.contains("is-switching")) return;

    window.clearTimeout(modeAnimationTimer);
    modeAnimationTimer = 0;
    modeAnimationId += 1;
    showModeImmediately(getCurrentMode());
  }

  function setMode(mode, options) {
    var nextMode = mode === "tldr" ? "tldr" : "detailed";
    var config = options || {};
    var nextPanel = getModePanel(nextMode);
    var previousMode = getCurrentMode();

    if (!nextPanel) return;
    finishModeAnimation();

    var currentPanel = modePanels.find(function (panel) {
      return !panel.hidden;
    });
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    updateModeControls(nextMode);
    updateModePanelAccessibility(nextMode);
    root.setAttribute("data-case-mode", nextMode);
    updateModeUrl(nextMode, config);

    if (config.manual === true) {
      storeMode(nextMode);
      trackCaseModeEvent("case_mode_select", {
        previous_mode: previousMode,
        selected_mode: nextMode,
        selection_changed: previousMode !== nextMode
      });
    }

    modeAnimationId += 1;

    if (config.animate === false || reducedMotion || !modeStage || !currentPanel || currentPanel === nextPanel) {
      showModeImmediately(nextMode);
      window.requestAnimationFrame(centerCarousels);
      return;
    }

    var animationId = modeAnimationId;
    var startHeight = currentPanel.offsetHeight;

    modeStage.classList.add("is-switching");
    modeStage.style.height = startHeight + "px";
    resetModePanel(currentPanel);
    resetModePanel(nextPanel);

    currentPanel.hidden = false;
    nextPanel.hidden = false;
    currentPanel.style.position = "absolute";
    currentPanel.style.inset = "0 0 auto 0";
    currentPanel.style.width = "100%";
    nextPanel.style.position = "absolute";
    nextPanel.style.inset = "0 0 auto 0";
    nextPanel.style.width = "100%";
    nextPanel.classList.add("is-entering");

    var nextHeight = nextPanel.scrollHeight;

    window.requestAnimationFrame(function () {
      if (animationId !== modeAnimationId) return;
      modeStage.style.height = nextHeight + "px";
      currentPanel.classList.add("is-exiting");
      nextPanel.classList.remove("is-entering");
      centerCarousels();
    });

    modeAnimationTimer = window.setTimeout(function () {
      if (animationId !== modeAnimationId) return;

      modePanels.forEach(function (panel) {
        panel.hidden = panel !== nextPanel;
        resetModePanel(panel);
      });

      modeStage.classList.remove("is-switching");
      modeStage.style.height = "";
      modeAnimationTimer = 0;
      centerCarousels();
    }, 560);
  }

  modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var switchTop = modeSwitch.getBoundingClientRect().top;
      setMode(button.getAttribute("data-case-mode-button"), { manual: true });

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

  function observeModeSelectorImpression() {
    if (!modeSwitch) return;

    var impressionTimer = 0;
    var selectorIsVisible = false;
    var impressionTracked = false;
    var observer;

    function clearImpressionTimer() {
      window.clearTimeout(impressionTimer);
      impressionTimer = 0;
    }

    function stopObserving() {
      clearImpressionTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (observer) observer.disconnect();
    }

    function startImpressionTimer() {
      if (impressionTracked || impressionTimer || !selectorIsVisible || document.hidden) return;

      impressionTimer = window.setTimeout(function () {
        impressionTimer = 0;
        if (!selectorIsVisible || document.hidden || impressionTracked) return;

        impressionTracked = true;
        trackCaseModeEvent("case_mode_selector_impression", {
          selected_mode: getCurrentMode()
        });
        stopObserving();
      }, 1000);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearImpressionTimer();
      } else {
        startImpressionTimer();
      }
    }

    if (!("IntersectionObserver" in window)) return;

    observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      selectorIsVisible = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= 0.5);

      if (selectorIsVisible) {
        startImpressionTimer();
      } else {
        clearImpressionTimer();
      }
    }, { threshold: [0, 0.5, 1] });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    observer.observe(modeSwitch);
  }

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

  // Lightbox: clique numa imagem marcada com [data-case-zoom] para vê-la ampliada
  // em tela cheia, com navegação entre imagens do mesmo carrossel e zoom por scroll.
  function setupLightbox(scope) {
    // Toda imagem dentro do case vira um gatilho do lightbox. Quando a imagem já
    // está num contêiner [data-case-zoom], usamos esse contêiner; senão, a própria
    // imagem. Ignoramos imagens dentro de links (para o link continuar funcionando)
    // e da UI do seletor de modo.
    var triggers = [];
    Array.prototype.forEach.call(scope.querySelectorAll("img"), function (img) {
      if (img.closest("a")) return;
      if (img.closest(".case-mode-switch")) return;
      var trigger = img.closest("[data-case-zoom]") || img;
      if (triggers.indexOf(trigger) === -1) triggers.push(trigger);
    });
    if (!triggers.length) return;

    var overlay = document.createElement("div");
    overlay.className = "immersive-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Imagem ampliada");
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="immersive-lightbox__backdrop" data-lb-close></div>' +
      '<div class="immersive-lightbox__dialog">' +
        '<button class="immersive-lightbox__close" type="button" aria-label="Fechar" data-lb-close>' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        "</button>" +
        '<button class="immersive-lightbox__nav immersive-lightbox__nav--prev" type="button" aria-label="Imagem anterior" data-lb-prev hidden>' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>' +
        "</button>" +
        '<figure class="immersive-lightbox__figure">' +
          '<div class="immersive-lightbox__stage" data-lb-stage>' +
            '<img class="immersive-lightbox__image" alt="" data-lb-image>' +
          "</div>" +
          '<figcaption class="immersive-lightbox__caption" data-lb-caption></figcaption>' +
        "</figure>" +
        '<button class="immersive-lightbox__nav immersive-lightbox__nav--next" type="button" aria-label="Próxima imagem" data-lb-next hidden>' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
        "</button>" +
      "</div>";
    document.body.appendChild(overlay);

    var lbImage = overlay.querySelector("[data-lb-image]");
    var lbCaption = overlay.querySelector("[data-lb-caption]");
    var lbStage = overlay.querySelector("[data-lb-stage]");
    var prevButton = overlay.querySelector("[data-lb-prev]");
    var nextButton = overlay.querySelector("[data-lb-next]");

    var group = [];
    var current = 0;
    var lastFocus = null;

    var zoom = { scale: 1, x: 0, y: 0, panning: false, pointerId: null, lastX: 0, lastY: 0 };
    var minScale = 1;
    var maxScale = 4;
    var scaleStep = 0.6;

    function imageOf(trigger) {
      return trigger.tagName === "IMG" ? trigger : trigger.querySelector("img");
    }

    function captionOf(trigger) {
      var figure = trigger.closest("figure");
      var caption = figure ? figure.querySelector(".case-caption, figcaption") : null;
      if (caption && caption.textContent.trim()) return caption.textContent.trim();
      var img = imageOf(trigger);
      return img && img.alt ? img.alt : "";
    }

    function groupOf(trigger) {
      var carousel = trigger.closest("[data-case-carousel]");
      if (!carousel) return [trigger];
      // Agrupa todos os gatilhos que estão dentro do mesmo carrossel, na ordem do DOM.
      return triggers.filter(function (item) {
        return carousel.contains(item);
      });
    }

    function renderZoom() {
      lbImage.style.transform =
        "translate(" + zoom.x + "px, " + zoom.y + "px) scale(" + zoom.scale + ")";
      lbStage.classList.toggle("is-zoomed", zoom.scale > minScale);
    }

    function resetZoom() {
      zoom.scale = 1;
      zoom.x = 0;
      zoom.y = 0;
      zoom.panning = false;
      lbImage.style.transform = "";
      lbStage.classList.remove("is-zoomed", "is-panning");
    }

    function setScale(next) {
      zoom.scale = Math.min(maxScale, Math.max(minScale, next));
      if (zoom.scale === minScale) {
        zoom.x = 0;
        zoom.y = 0;
      }
      renderZoom();
    }

    function show(index) {
      if (!group.length) return;
      current = (index + group.length) % group.length;
      var trigger = group[current];
      var img = imageOf(trigger);
      resetZoom();
      lbImage.src = img.currentSrc || img.src;
      lbImage.alt = img.alt || "";
      var caption = captionOf(trigger);
      lbCaption.textContent = caption;
      lbCaption.hidden = !caption;
      var many = group.length > 1;
      prevButton.hidden = !many;
      nextButton.hidden = !many;
    }

    function open(trigger) {
      group = groupOf(trigger);
      var index = group.indexOf(trigger);
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add("is-immersive-lightbox-open");
      show(index < 0 ? 0 : index);
      overlay.querySelector("[data-lb-close]").focus();
    }

    function close() {
      overlay.hidden = true;
      document.body.classList.remove("is-immersive-lightbox-open");
      resetZoom();
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    overlay.addEventListener("click", function (event) {
      if (event.target.closest("[data-lb-close]")) close();
    });

    prevButton.addEventListener("click", function () {
      show(current - 1);
    });

    nextButton.addEventListener("click", function () {
      show(current + 1);
    });

    lbStage.addEventListener(
      "wheel",
      function (event) {
        event.preventDefault();
        setScale(zoom.scale + (event.deltaY < 0 ? scaleStep : -scaleStep));
      },
      { passive: false }
    );

    lbImage.addEventListener("dblclick", function (event) {
      event.preventDefault();
      setScale(zoom.scale > minScale ? minScale : 2.4);
    });

    lbStage.addEventListener("pointerdown", function (event) {
      if (zoom.scale <= minScale) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      zoom.panning = true;
      zoom.pointerId = event.pointerId;
      zoom.lastX = event.clientX;
      zoom.lastY = event.clientY;
      lbStage.classList.add("is-panning");
      lbStage.setPointerCapture(event.pointerId);
    });

    lbStage.addEventListener("pointermove", function (event) {
      if (!zoom.panning || event.pointerId !== zoom.pointerId) return;
      zoom.x += event.clientX - zoom.lastX;
      zoom.y += event.clientY - zoom.lastY;
      zoom.lastX = event.clientX;
      zoom.lastY = event.clientY;
      renderZoom();
    });

    function stopPan(event) {
      if (!zoom.panning) return;
      zoom.panning = false;
      lbStage.classList.remove("is-panning");
      if (event && lbStage.hasPointerCapture(event.pointerId)) {
        lbStage.releasePointerCapture(event.pointerId);
      }
    }

    lbStage.addEventListener("pointerup", stopPan);
    lbStage.addEventListener("pointercancel", stopPan);
    lbStage.addEventListener("lostpointercapture", stopPan);

    document.addEventListener("keydown", function (event) {
      if (overlay.hidden) return;
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft" && group.length > 1) {
        show(current - 1);
      } else if (event.key === "ArrowRight" && group.length > 1) {
        show(current + 1);
      } else if (event.key === "+" || event.key === "=") {
        setScale(zoom.scale + scaleStep);
      } else if (event.key === "-") {
        setScale(zoom.scale - scaleStep);
      } else if (event.key === "0") {
        setScale(minScale);
      }
    });

    triggers.forEach(function (trigger) {
      var img = imageOf(trigger);
      if (!img) return;

      trigger.classList.add("case-zoomable");
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute(
        "aria-label",
        "Ampliar imagem" + (img.alt ? ": " + img.alt : "")
      );

      // Diferencia clique de arraste ouvindo o movimento no documento (funciona
      // mesmo quando o carrossel captura o ponteiro durante o arraste).
      var startX = 0;
      var startY = 0;
      var dragged = false;

      function onDocMove(event) {
        if (
          Math.abs(event.clientX - startX) > 8 ||
          Math.abs(event.clientY - startY) > 8
        ) {
          dragged = true;
        }
      }

      function onDocUp() {
        document.removeEventListener("pointermove", onDocMove, true);
        document.removeEventListener("pointerup", onDocUp, true);
      }

      trigger.addEventListener("pointerdown", function (event) {
        startX = event.clientX;
        startY = event.clientY;
        dragged = false;
        document.addEventListener("pointermove", onDocMove, true);
        document.addEventListener("pointerup", onDocUp, true);
      });

      trigger.addEventListener("click", function (event) {
        if (dragged) return;
        event.preventDefault();
        open(trigger);
      });

      trigger.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(trigger);
        }
      });
    });
  }

  // Adiciona setas e indicadores (dots) abaixo de cada carrossel. Os controles só
  // aparecem quando há imagens além das visíveis, e se ajustam ao redimensionar
  // (inclusive quando o painel "Case completo" deixa de estar oculto).
  function setupCarouselControls(scope) {
    Array.prototype.forEach.call(
      scope.querySelectorAll("[data-case-carousel]"),
      function (carousel) {
        var items = carousel.querySelectorAll(".case-carousel__item");
        if (items.length < 2) return;

        var controls = document.createElement("div");
        controls.className = "case-carousel__controls";
        controls.hidden = true;

        var prev = document.createElement("button");
        prev.type = "button";
        prev.className = "case-carousel__arrow case-carousel__arrow--prev";
        prev.setAttribute("aria-label", "Imagem anterior");
        prev.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';

        var dots = document.createElement("div");
        dots.className = "case-carousel__dots";
        var dotList = [];
        Array.prototype.forEach.call(items, function (item, index) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "case-carousel__dot";
          dot.setAttribute("aria-label", "Ir para a imagem " + (index + 1));
          dot.addEventListener("click", function () {
            goTo(index);
          });
          dots.appendChild(dot);
          dotList.push(dot);
        });

        var next = document.createElement("button");
        next.type = "button";
        next.className = "case-carousel__arrow case-carousel__arrow--next";
        next.setAttribute("aria-label", "Próxima imagem");
        next.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

        controls.appendChild(prev);
        controls.appendChild(dots);
        controls.appendChild(next);
        carousel.insertAdjacentElement("afterend", controls);

        function currentIndex() {
          var carRect = carousel.getBoundingClientRect();
          var center = carRect.left + carRect.width / 2;
          var best = 0;
          var bestDist = Infinity;
          Array.prototype.forEach.call(items, function (item, index) {
            var r = item.getBoundingClientRect();
            var dist = Math.abs((r.left + r.right) / 2 - center);
            if (dist < bestDist) {
              bestDist = dist;
              best = index;
            }
          });
          return best;
        }

        function goTo(index) {
          index = Math.max(0, Math.min(items.length - 1, index));
          var target = items[index];
          var carRect = carousel.getBoundingClientRect();
          var tRect = target.getBoundingClientRect();
          var delta =
            tRect.left -
            carRect.left -
            (carousel.clientWidth - target.clientWidth) / 2;
          carousel.scrollBy({ left: delta, behavior: "smooth" });
        }

        function updateState() {
          var overflow = carousel.scrollWidth - carousel.clientWidth > 2;
          controls.hidden = !overflow;
          if (!overflow) return;
          var index = currentIndex();
          dotList.forEach(function (dot, i) {
            dot.setAttribute("aria-current", i === index ? "true" : "false");
          });
          prev.disabled = carousel.scrollLeft <= 1;
          next.disabled =
            carousel.scrollLeft >=
            carousel.scrollWidth - carousel.clientWidth - 1;
        }

        prev.addEventListener("click", function () {
          goTo(currentIndex() - 1);
        });
        next.addEventListener("click", function () {
          goTo(currentIndex() + 1);
        });

        var scheduled = false;
        carousel.addEventListener("scroll", function () {
          if (scheduled) return;
          scheduled = true;
          window.requestAnimationFrame(function () {
            scheduled = false;
            updateState();
          });
        });

        carousel.addEventListener("keydown", function (event) {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(currentIndex() - 1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(currentIndex() + 1);
          }
        });

        if (typeof ResizeObserver === "function") {
          new ResizeObserver(function () {
            updateState();
          }).observe(carousel);
        } else {
          window.addEventListener("resize", updateState);
        }

        updateState();
      }
    );
  }

  setupLightbox(root);
  setupCarouselControls(root);

  prepareModeRelationships();

  var urlMode = normalizeMode(new URLSearchParams(window.location.search).get("mode"));
  var initialMode = urlMode || getStoredMode() || "tldr";
  setMode(initialMode, { animate: false, updateUrl: false });
  observeModeSelectorImpression();

  window.addEventListener("resize", centerCarousels);
  window.addEventListener("pageshow", centerCarousels);
}());
