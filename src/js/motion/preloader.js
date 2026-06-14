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

  window.setTimeout(releasePreloader, 3400);

  words.forEach(function (word, index) {
    window.setTimeout(function () {
      words.forEach(function (item) {
        item.classList.remove('is-active');
      });
      word.classList.add('is-active');
    }, index * 650);
  });

  window.setTimeout(function () {
    preloader.classList.add('is-leaving');
  }, 1950);

  window.setTimeout(releasePreloader, 2560);
}());
