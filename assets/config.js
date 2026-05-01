// ═══════════════════════════════════════════════════════════════════
// YUSTA LABS · Public site config
// Single source of truth for contact info used across the site.
// Loaded via <script src="/assets/config.js"></script> en cada página.
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var config = {
    waNumber: '541124693394',
    waNumberDisplay: '+54 11 2469 3394',
    waLink: 'https://wa.me/541124693394',
    email: 'ny@yustalabs.com',
    emailLink: 'mailto:ny@yustalabs.com',
    instagram: 'https://instagram.com/yustalabs',
    twitter: 'https://x.com/yustalabs',
    handle: '@yustalabs',
    web: 'https://yustalabs.com',
  };

  // Expose to global so any script can use it
  window.YL_CONFIG = Object.freeze(config);

  // Optional: data-yl-* attribute auto-binding for future-proofing.
  // <a data-yl-wa>...</a>  →  href = config.waLink
  // <a data-yl-email>...</a>  →  href = config.emailLink
  // <span data-yl-text="email"></span>  →  innerText = config.email
  if (typeof document !== 'undefined') {
    function bind() {
      document.querySelectorAll('[data-yl-wa]').forEach(function (el) {
        if (!el.getAttribute('href')) el.setAttribute('href', config.waLink);
      });
      document.querySelectorAll('[data-yl-email]').forEach(function (el) {
        if (!el.getAttribute('href')) el.setAttribute('href', config.emailLink);
      });
      document.querySelectorAll('[data-yl-text]').forEach(function (el) {
        var key = el.getAttribute('data-yl-text');
        if (config[key] && !el.textContent.trim()) el.textContent = config[key];
      });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bind);
    } else {
      bind();
    }
  }
})();
