(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('jahr');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hero cursor-typer effect
  var el = document.getElementById('cursor-typer');
  if (!el) return;

  var phrases = ['Websites.', 'Web-Apps.', 'Saubere Übergabe.'];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    // No animation: leave the cursor static, no typed text.
    return;
  }

  var TYPE_SPEED = 65;
  var DELETE_SPEED = 35;
  var HOLD_TIME = 1400;
  var phraseIndex = 0;
  var charIndex = 0;

  function type() {
    var current = phrases[phraseIndex];

    if (charIndex <= current.length) {
      el.textContent = current.slice(0, charIndex);
      charIndex++;
      setTimeout(type, TYPE_SPEED);
    } else {
      setTimeout(erase, HOLD_TIME);
    }
  }

  function erase() {
    var current = phrases[phraseIndex];

    if (charIndex > 0) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      setTimeout(erase, DELETE_SPEED);
    } else {
      phraseIndex++;
      if (phraseIndex < phrases.length) {
        setTimeout(type, TYPE_SPEED);
      }
      // After the last phrase, stop: text stays empty, cursor keeps blinking via CSS.
    }
  }

  setTimeout(type, 500);
})();
