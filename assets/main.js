// ═══════════════════════════════════════════════════════════════════
// YUSTA LABS · Shared JavaScript
// - Nav scroll detection + mobile toggle
// - Reveal animations (IntersectionObserver)
// - FX converter USD → ARS (dolarapi.com)
// - Inject year in footer copyright
// ═══════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─── 1. Nav scroll + mobile toggle ────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const toggle = nav.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }

    // Close mobile nav on link click
    nav.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // ─── 2. Reveal on scroll ─────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // ─── 3. Current year ─────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ─── 4. FX Converter USD → ARS ───────────────────────────────────
  const CACHE_KEY = 'yustalabs-fx-rate';
  const CACHE_TTL = 15 * 60 * 1000;

  function fmtARS(n) {
    return '$ ' + Math.round(n).toLocaleString('es-AR');
  }

  function injectARS(rate) {
    const selectors = ['[data-usd]', '.price-amount', '.lite-price', '.apc-cash', '.apc-full-price'];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.dataset.arsInjected === '1') return;
        let usd;
        if (el.dataset.usd) {
          usd = parseInt(el.dataset.usd, 10);
        } else {
          const match = el.textContent.match(/USD\s*([\d.,]+)/i) || el.textContent.match(/\$?\s*([\d.,]+)/);
          if (!match) return;
          usd = parseInt(match[1].replace(/\D/g, ''), 10);
        }
        if (!usd || usd < 10) return;
        const span = document.createElement('span');
        span.className = 'fx-ars';
        span.style.cssText = 'display:block;font-size:0.75em;color:var(--muted);font-weight:500;margin-top:2px;';
        span.textContent = '≈ ' + fmtARS(usd * rate) + ' ARS';
        el.appendChild(span);
        el.dataset.arsInjected = '1';
      });
    });

    // Update rate widget
    const widget = document.getElementById('fx-rate-widget');
    if (widget && !widget.dataset.updated) {
      widget.innerHTML = `<strong style="color:var(--gold);">USD 1 ≈ ${fmtARS(rate)}</strong>`;
      widget.dataset.updated = '1';
    }
  }

  function fetchRate() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rate, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) return Promise.resolve(rate);
      }
    } catch (e) {}

    return fetch('https://dolarapi.com/v1/dolares/mep')
      .then(r => r.json())
      .then(d => d.venta || d.compra)
      .catch(() => fetch('https://dolarapi.com/v1/dolares/blue').then(r => r.json()).then(d => d.venta))
      .then(rate => {
        if (rate) {
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() })); } catch (e) {}
        }
        return rate;
      });
  }

  if (document.querySelector('[data-usd], .price-amount, .lite-price, .apc-cash, #fx-rate-widget')) {
    fetchRate().then(rate => {
      if (!rate) return;
      injectARS(rate);
      setTimeout(() => injectARS(rate), 500);
    });
  }
})();
