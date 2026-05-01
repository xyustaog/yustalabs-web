// ═══════════════════════════════════════════════════════════════════
//  Conversor USD → ARS en vivo (dolarapi.com, gratis, sin auth)
//  Incluir en cualquier landing con: <script src="/partials/fx-converter.js" defer></script>
//
//  Qué hace:
//   1. Detecta todos los precios USD del DOM (por .price-amount, .lite-price,
//      .apc-cash, .apc-full-price, .price-cuotas-note, .lite-cuotas)
//   2. Agrega debajo/al lado la conversión aproximada a ARS
//   3. Si existe <span id="fx-rate"></span> o similar, actualiza con el rate
//   4. Cachea en localStorage 15 min
// ═══════════════════════════════════════════════════════════════════

(function() {
  const CACHE_KEY = 'yustalabs-fx-rate';
  const CACHE_TTL = 15 * 60 * 1000;

  function formatARS(n) {
    return '$ ' + Math.round(n).toLocaleString('es-AR');
  }

  function appendARS(el, rate, cssClass) {
    if (el.dataset.arsInjected === '1') return;
    const match = el.textContent.match(/USD\s*([\d.,]+)/i) || el.textContent.match(/\$?\s*([\d.,]+)/);
    if (!match) return;
    const usd = parseInt(match[1].replace(/\D/g, ''), 10);
    if (!usd || usd < 10) return;
    const ars = document.createElement('span');
    ars.className = cssClass || 'fx-ars';
    ars.style.cssText = 'display:block;font-size:11px;color:rgba(255,255,255,0.55);font-weight:500;margin-top:2px;letter-spacing:0.02em;';
    ars.textContent = '≈ ' + formatARS(usd * rate) + ' ARS';
    el.appendChild(ars);
    el.dataset.arsInjected = '1';
  }

  function decorateAll(rate) {
    const selectors = [
      '.price-amount',
      '.lite-price',
      '.apc-cash',
      '.apc-full-price',
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => appendARS(el, rate));
    });

    // Update rate widget if present
    const widget = document.getElementById('fx-rate-widget');
    if (widget && !widget.dataset.updated) {
      widget.innerHTML = `<strong style="color:#F0B429;">USD 1 ≈ ${formatARS(rate)}</strong>`;
      widget.dataset.updated = '1';
    }
  }

  function fetchRate() {
    // Caché primero
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rate, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) return Promise.resolve(rate);
      }
    } catch(e) {}

    return fetch('https://dolarapi.com/v1/dolares/mep')
      .then(r => r.json())
      .then(d => d.venta || d.compra)
      .catch(() => fetch('https://dolarapi.com/v1/dolares/blue').then(r => r.json()).then(d => d.venta))
      .then(rate => {
        if (rate) {
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() })); } catch(e) {}
        }
        return rate;
      });
  }

  function init() {
    fetchRate().then(rate => {
      if (!rate) return;
      decorateAll(rate);
      // Por si la página carga cards asincrónicamente, reintenta a los 500ms
      setTimeout(() => decorateAll(rate), 500);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
