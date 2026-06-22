(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  // Targets: headings globally + any element with [data-text-reveal]
  var targets = document.querySelectorAll('h1, h2, h3, [data-text-reveal]');
  if (!targets.length) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  // Split only text nodes, preserving HTML structure (links, em, strong, etc.)
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim()) textNodes.push(node);
    }

    textNodes.forEach(function (textNode) {
      var parts = textNode.textContent.split(/(\s+)/);
      var frag  = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          var outer = document.createElement('span');
          outer.className = 'tr-word';
          var inner = document.createElement('span');
          inner.className = 'tr-word__inner';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  function animate(inners) {
    window.gsap.fromTo(inners,
      {
        y: '105%',
        filter: 'blur(10px)',
        opacity: 0.2
      },
      {
        y: '0%',
        filter: 'blur(0px)',
        opacity: 1,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.055
      }
    );
  }

  targets.forEach(function (el) {
    if (el.querySelector('.tr-word')) return;

    splitWords(el);

    var inners = el.querySelectorAll('.tr-word__inner');
    if (!inners.length) return;

    var rect   = el.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    // Also treat elements already scrolled past (e.g. landing via /#hash)
    var scrolledPast = rect.bottom <= 0;

    if (inView || scrolledPast) {
      animate(inners);
    } else {
      // Set hidden state before ScrollTrigger fires
      window.gsap.set(inners, { y: '105%', filter: 'blur(10px)', opacity: 0.2 });
      window.ScrollTrigger.create({
        trigger: el,
        start: 'top bottom-=60px',
        once: true,
        onEnter: function () { animate(inners); }
      });
    }
  });
}());
