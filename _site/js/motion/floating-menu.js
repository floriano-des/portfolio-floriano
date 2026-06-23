(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var trigger = document.querySelector('[data-floating-menu-trigger]');
  var panel = document.querySelector('[data-floating-menu-panel]');
  var closeButton = document.querySelector('[data-floating-menu-close]');
  var backdrop = document.querySelector('[data-floating-menu-backdrop]');
  var links = document.querySelectorAll('[data-floating-menu-link]');

  if (!header || !trigger || !panel || !closeButton || !backdrop) return;

  var lastFocused = null;
  var closeTimer = 0;

  function updateCondensedState() {
    var threshold = Math.max(520, window.innerHeight * 0.82);
    header.classList.toggle('is-condensed', window.scrollY > threshold);
  }

  function getFocusableElements() {
    return Array.prototype.slice.call(
      panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function openMenu() {
    window.clearTimeout(closeTimer);
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    panel.classList.add('is-open');
    backdrop.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Fechar menu');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('floating-menu-open');
    closeButton.focus();
  }

  function closeMenu(restoreFocus) {
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Abrir menu');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('floating-menu-open');

    closeTimer = window.setTimeout(function () {
      backdrop.hidden = true;
    }, 460);

    if (restoreFocus !== false && lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  trigger.addEventListener('click', function () {
    if (panel.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeButton.addEventListener('click', function () {
    closeMenu();
  });

  backdrop.addEventListener('click', function () {
    closeMenu();
  });

  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener('click', function () {
      closeMenu(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (!panel.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    var focusable = getFocusableElements();
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('scroll', updateCondensedState, { passive: true });
  window.addEventListener('resize', updateCondensedState, { passive: true });
  updateCondensedState();
}());
