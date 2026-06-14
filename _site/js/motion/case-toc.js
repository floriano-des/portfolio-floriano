(function () {
  "use strict";

  var toc = document.querySelector("[data-cs-toc]");
  var main = toc ? toc.closest("main") : null;
  var sections = main
    ? Array.from(main.querySelectorAll("[data-cs-section]"))
    : [];
  var layout = toc ? toc.closest(".cs-layout") : null;

  if (!toc || !layout || !sections.length || toc.hasAttribute("data-cs-toc-initialized")) return;

  var list = toc.querySelector(".cs-toc__list");
  var links = new Map();
  var visibleSections = new Set();

  toc.setAttribute("data-cs-toc-initialized", "");
  list.replaceChildren();

  sections.forEach(function (section) {
    var label = section.getAttribute("data-cs-label");
    if (!section.id || !label) return;

    var item = document.createElement("li");
    var link = document.createElement("a");

    link.href = "#" + section.id;
    link.textContent = label;
    item.appendChild(link);
    list.appendChild(item);
    links.set(section, link);
  });

  if (!links.size) return;

  function setActive(section) {
    links.forEach(function (link, currentSection) {
      var isActive = currentSection === section;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActive() {
    var targetLine = window.innerHeight * 0.3;
    var candidates = visibleSections.size
      ? Array.from(visibleSections)
      : Array.from(links.keys());

    var active = candidates.reduce(function (closest, section) {
      var distance = Math.abs(section.getBoundingClientRect().top - targetLine);

      if (!closest || distance < closest.distance) {
        return { section: section, distance: distance };
      }

      return closest;
    }, null);

    if (active) setActive(active.section);
  }

  var visibilityTicking = false;

  function updateVisibility() {
    var rect = layout.getBoundingClientRect();
    var isVisible = rect.top <= 120 && rect.bottom > 280;

    toc.classList.toggle("is-visible", isVisible);
    visibilityTicking = false;
  }

  function requestVisibilityUpdate() {
    if (visibilityTicking) return;
    visibilityTicking = true;
    window.requestAnimationFrame(updateVisibility);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        visibleSections.add(entry.target);
      } else {
        visibleSections.delete(entry.target);
      }
    });

    updateActive();
  }, {
    rootMargin: "-18% 0px -62% 0px",
    threshold: [0, 0.01],
  });

  links.forEach(function (_, section) {
    observer.observe(section);
  });

  toc.classList.add("is-ready");
  updateActive();
  updateVisibility();
  window.addEventListener("scroll", requestVisibilityUpdate, { passive: true });
  window.addEventListener("resize", requestVisibilityUpdate);
}());
