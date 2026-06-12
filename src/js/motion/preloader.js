(function () {
  'use strict';

  var root = document.documentElement;
  var preloader = document.querySelector('[data-site-preloader]');

  if (!preloader || !root.hasAttribute('data-preloader-pending')) {
    return;
  }

  var finished = false;
  var words = Array.prototype.slice.call(preloader.querySelectorAll('[data-preloader-word]'));

  function releasePreloader() {
    if (finished) return;
    finished = true;
    root.removeAttribute('data-preloader-pending');
    preloader.style.visibility = 'hidden';
    preloader.style.pointerEvents = 'none';
  }

  try {
    sessionStorage.setItem('floriano:preloader-v2', 'seen');
  } catch (_) {
    // A animacao continua mesmo sem sessionStorage.
  }

  window.setTimeout(releasePreloader, 2500);

  if (!window.gsap) {
    releasePreloader();
    return;
  }

  var timeline = window.gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: releasePreloader
  });

  words.forEach(function (word, index) {
    if (index === 0) {
      timeline.fromTo(word,
        { autoAlpha: 0, yPercent: 28 },
        { autoAlpha: 1, yPercent: 0, duration: 0.16 }
      );
    }

    timeline.to(word, {
      autoAlpha: 0,
      yPercent: -28,
      duration: 0.14
    }, index === 0 ? '+=0.12' : '+=0.1');

    if (words[index + 1]) {
      timeline.fromTo(words[index + 1],
        { autoAlpha: 0, yPercent: 28 },
        { autoAlpha: 1, yPercent: 0, duration: 0.16 },
        '<0.05'
      );
    }
  });

  timeline.to(preloader, {
    yPercent: -112,
    duration: 0.5,
    ease: 'power4.inOut'
  }, '+=0.08');
}());
