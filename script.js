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

// Mobile-Navigation (Hamburger-Menü)
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      closeMenu();
    }
  });

  document.addEventListener('click', function (event) {
    if (!isOpen()) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  var desktopQuery = window.matchMedia('(min-width: 700px)');
  function handleQueryChange(event) {
    if (event.matches) {
      closeMenu();
    }
  }
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', handleQueryChange);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(handleQueryChange);
  }
})();

// Visuals-Lightbox
(function () {
  'use strict';

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxBadge = document.getElementById('lightbox-badge');
  var closeBtn = document.getElementById('lightbox-close');
  var thumbs = document.querySelectorAll('.visual-thumb');
  if (!lightbox || !lightboxImg || !closeBtn || !thumbs.length) return;

  var lastFocused = null;

  function positionLightboxBadge() {
    if (!lightboxBadge || lightboxBadge.hidden) return;
    var rect = lightboxImg.getBoundingClientRect();
    lightboxBadge.style.left = (rect.left + 8) + 'px';
    lightboxBadge.style.top = (rect.bottom - 8 - lightboxBadge.offsetHeight) + 'px';
  }

  function openLightbox(src, alt, isAiGenerated) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    if (lightboxBadge) lightboxBadge.hidden = !isAiGenerated;
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    if (lightboxBadge) lightboxBadge.hidden = true;
    if (lastFocused) lastFocused.focus();
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var img = thumb.querySelector('img');
      openLightbox(thumb.getAttribute('data-lightbox-src'), img ? img.alt : '', thumb.hasAttribute('data-ai-generated'));
    });
  });

  if (lightboxImg) {
    lightboxImg.addEventListener('load', positionLightboxBadge);
  }
  window.addEventListener('resize', function () {
    if (!lightbox.hidden) positionLightboxBadge();
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();

// Kontakt: E-Mail-Adresse kopieren
(function () {
  'use strict';

  var btn = document.getElementById('copy-email-btn');
  if (!btn) return;

  var label = btn.querySelector('.copy-btn-label');
  var email = btn.getAttribute('data-email');
  var resetTimer = null;

  function showCopied() {
    btn.classList.add('is-copied');
    if (label) label.textContent = 'Kopiert!';
    btn.setAttribute('aria-label', 'E-Mail-Adresse kopiert');
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () {
      btn.classList.remove('is-copied');
      if (label) label.textContent = 'Kopieren';
      btn.setAttribute('aria-label', 'E-Mail-Adresse kopieren');
    }, 1800);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      // Kopieren nicht moeglich – der mailto-Link bleibt als Alternative bestehen.
    }
    document.body.removeChild(textarea);
  }

  btn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopied, function () {
        fallbackCopy(email);
        showCopied();
      });
    } else {
      fallbackCopy(email);
      showCopied();
    }
  });
})();
