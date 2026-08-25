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

// Referenzen-Slider
(function () {
  'use strict';

  var slider = document.querySelector('[data-slider]');
  if (!slider) return;

  var track = slider.querySelector('[data-slider-track]');
  var slides = Array.prototype.slice.call(track.children);
  var prevBtn = slider.querySelector('[data-slider-prev]');
  var nextBtn = slider.querySelector('[data-slider-next]');
  var dotsWrap = slider.querySelector('[data-slider-dots]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dots = slides.map(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Bild ' + (i + 1) + ' von ' + slides.length);
    dot.addEventListener('click', function () {
      goTo(i);
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function currentIndex() {
    var slideWidth = track.clientWidth;
    return Math.round(track.scrollLeft / slideWidth);
  }

  function updateDots() {
    var index = currentIndex();
    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  function goTo(index) {
    var clamped = Math.max(0, Math.min(slides.length - 1, index));
    var slideWidth = track.clientWidth;
    track.scrollTo({
      left: clamped * slideWidth,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  prevBtn.addEventListener('click', function () {
    goTo(currentIndex() - 1);
  });
  nextBtn.addEventListener('click', function () {
    goTo(currentIndex() + 1);
  });

  var scrollTimeout;
  track.addEventListener('scroll', function () {
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(updateDots, 80);
  });

  window.addEventListener('resize', updateDots);

  updateDots();
})();
