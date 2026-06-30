(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  // Parse a display value like "+194%", "4.484", "2,09%", "0,71%", "42,8%"
  // Returns { prefix, number, decimals, suffix, formatted }
  function parseValue(text) {
    text = text.trim();

    // Extract prefix (non-digit chars before the first digit)
    var prefixMatch = text.match(/^([^0-9]*)/);
    var prefix = prefixMatch ? prefixMatch[1] : '';

    // Extract suffix (non-digit chars after the last digit)
    var suffixMatch = text.match(/([^0-9]*)$/);
    var suffix = suffixMatch ? suffixMatch[1] : '';

    // The numeric body
    var body = text.slice(prefix.length, text.length - suffix.length);

    // Detect decimal separator: comma (pt-BR) or dot
    var hasComma  = body.indexOf(',') !== -1;
    var hasDot    = body.indexOf('.') !== -1;

    var normalized;
    var decimals = 0;

    if (hasComma && hasDot) {
      // e.g. "4.484,5" → thousands=dot, decimal=comma
      normalized = body.replace(/\./g, '').replace(',', '.');
      decimals   = (normalized.split('.')[1] || '').length;
    } else if (hasComma) {
      // e.g. "2,09" → decimal comma
      normalized = body.replace(',', '.');
      decimals   = (normalized.split('.')[1] || '').length;
    } else if (hasDot) {
      // Could be thousands separator (4.484) or decimal (3.5)
      var parts = body.split('.');
      if (parts[1] && parts[1].length === 3) {
        // Thousands separator
        normalized = body.replace(/\./g, '');
        decimals   = 0;
      } else {
        normalized = body;
        decimals   = (body.split('.')[1] || '').length;
      }
    } else {
      normalized = body;
      decimals   = 0;
    }

    var number = parseFloat(normalized);
    if (isNaN(number)) return null;

    return { prefix: prefix, number: number, decimals: decimals, suffix: suffix, useComma: hasComma };
  }

  function formatNumber(value, parsed) {
    var fixed = value.toFixed(parsed.decimals);
    if (parsed.useComma) {
      fixed = fixed.replace('.', ',');
    }
    // Add thousands separator if needed
    var parts = fixed.split(parsed.useComma ? ',' : '.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, parsed.useComma ? '.' : ',');
    return parsed.prefix + parts.join(parsed.useComma ? ',' : '.') + parsed.suffix;
  }

  var targets = document.querySelectorAll('.cs-bignum__value, [data-count-up]');

  targets.forEach(function (el) {
    var parsed = parseValue(el.textContent);
    if (!parsed) return;

    var obj = { val: 0 };

    window.ScrollTrigger.create({
      trigger: el,
      start: 'top bottom-=80px',
      once: true,
      onEnter: function () {
        window.gsap.to(obj, {
          val: parsed.number,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = formatNumber(obj.val, parsed);
          },
          onComplete: function () {
            el.textContent = formatNumber(parsed.number, parsed);
          }
        });
      }
    });
  });
}());
