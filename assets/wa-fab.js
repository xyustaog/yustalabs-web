// ═══════════════════════════════════════════════════════════════════
// YUSTA LABS · Floating WhatsApp button
// Self-contained: injects styles + button + handlers
// Mobile-first, safe-area aware, tap-feedback optimized
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';
  if (window.__yustaWaInjected) return;
  window.__yustaWaInjected = true;

  var WA_NUMBER = '541124693394';
  var DEFAULT_TEXT = '¡Hola! Llegué desde yustalabs.com y quiero saber más sobre Aura.';

  var CSS = ''
    + '.yl-wa-fab{position:fixed;right:18px;bottom:18px;bottom:max(18px,env(safe-area-inset-bottom));z-index:9998;display:flex;align-items:center;gap:0;background:#25D366;color:#fff;border-radius:999px;padding:0;box-shadow:0 8px 24px rgba(37,211,102,0.32),0 4px 10px rgba(0,0,0,0.25);text-decoration:none;font-family:"Plus Jakarta Sans","Inter",system-ui,sans-serif;font-weight:700;letter-spacing:-0.005em;transition:transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s,background .2s;border:none;cursor:pointer;-webkit-tap-highlight-color:transparent;outline:none;}'
    + '.yl-wa-fab:hover{background:#1ebe5d;transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,211,102,0.45),0 4px 10px rgba(0,0,0,0.3);}'
    + '.yl-wa-fab:active{transform:translateY(0) scale(0.96);background:#1aa552;}'
    + '.yl-wa-fab:focus-visible{outline:2px solid #fff;outline-offset:3px;}'
    + '.yl-wa-icon{width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:50%;flex-shrink:0;position:relative;}'
    + '.yl-wa-icon svg{width:30px;height:30px;}'
    + '.yl-wa-pulse{position:absolute;inset:0;border-radius:50%;background:#25D366;opacity:0;animation:ylWaPulse 2.4s cubic-bezier(.4,0,.6,1) infinite;pointer-events:none;}'
    + '@keyframes ylWaPulse{0%{opacity:.5;transform:scale(1);}80%,100%{opacity:0;transform:scale(1.7);}}'
    + '.yl-wa-label{padding:0 18px 0 4px;font-size:14px;line-height:1;white-space:nowrap;max-width:0;overflow:hidden;opacity:0;transition:max-width .25s ease,opacity .2s ease,padding .2s ease;}'
    + '.yl-wa-fab:hover .yl-wa-label,.yl-wa-fab.has-label .yl-wa-label{max-width:240px;padding:0 18px 0 4px;opacity:1;}'
    + '.yl-wa-badge{position:absolute;top:-3px;right:-3px;background:#fff;color:#25D366;font-size:9.5px;font-weight:800;letter-spacing:0.4px;padding:2px 6px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,0.25);text-transform:uppercase;line-height:1;}'
    + '@media (max-width:760px){'
    + '.yl-wa-fab{right:14px;bottom:14px;bottom:max(14px,env(safe-area-inset-bottom));border-radius:50%;box-shadow:0 6px 18px rgba(37,211,102,0.4),0 3px 8px rgba(0,0,0,0.3);}'
    + '.yl-wa-icon{width:54px;height:54px;}'
    + '.yl-wa-icon svg{width:28px;height:28px;}'
    + '.yl-wa-label{display:none;}'
    + '.yl-wa-fab:active{transform:scale(0.92);}'
    + '}'
    + '@media (max-width:760px) and (display-mode:standalone){'
    + '.yl-wa-fab{bottom:max(72px,env(safe-area-inset-bottom));}'
    + '}'
    + '.yl-wa-tooltip{position:fixed;right:18px;bottom:84px;bottom:calc(max(18px,env(safe-area-inset-bottom)) + 66px);z-index:9997;background:#1f2937;color:#fff;padding:9px 14px;border-radius:10px;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:12.5px;font-weight:600;letter-spacing:-0.005em;box-shadow:0 8px 24px rgba(0,0,0,0.35);max-width:240px;line-height:1.35;opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s;pointer-events:none;}'
    + '.yl-wa-tooltip.show{opacity:1;transform:translateY(0);pointer-events:auto;}'
    + '.yl-wa-tooltip::after{content:"";position:absolute;right:24px;bottom:-5px;width:10px;height:10px;background:#1f2937;transform:rotate(45deg);}'
    + '.yl-wa-tooltip-close{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#374151;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;line-height:1;}'
    + '@media (max-width:760px){.yl-wa-tooltip{right:14px;bottom:calc(max(14px,env(safe-area-inset-bottom)) + 60px);font-size:12px;padding:8px 12px;max-width:220px;}}';

  var WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  function inject() {
    if (document.getElementById('yl-wa-fab')) return;
    var style = document.createElement('style');
    style.id = 'yl-wa-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var ctx = '';
    try { ctx = (location.pathname || '').replace(/^\/+|\/+$/g, '').split('/')[0]; } catch (e) {}
    var msg = DEFAULT_TEXT;
    if (ctx) {
      var prettyMap = {
        'aura-commerce': 'Aura Commerce', 'aura-finance': 'Aura Finance', 'aura-prop': 'Aura Prop',
        'aura-logistic': 'Aura Logistic', 'aura-vet': 'Aura Vet', 'aura-auto': 'Aura Auto',
        'aura-food': 'Aura Food', 'aura-fit': 'Aura Fit', 'aura-wear': 'Aura Wear',
        'aura-tools': 'Aura Tools', 'aura-salon': 'Aura Salon',
        'precios': 'precios', 'casos': 'casos', 'showroom': 'el showroom',
        'agentes': 'agentes IA', 'proceso': 'el proceso', 'nosotros': 'Yusta Labs',
        'probar-aura-commerce': 'la demo de Aura Commerce'
      };
      var pretty = prettyMap[ctx];
      if (pretty) msg = '¡Hola! Vi ' + pretty + ' en yustalabs.com y quiero hacer una consulta.';
    }
    var href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);

    var a = document.createElement('a');
    a.id = 'yl-wa-fab';
    a.className = 'yl-wa-fab';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Hablar con el fundador por WhatsApp');
    a.innerHTML = '<span class="yl-wa-icon"><span class="yl-wa-pulse"></span>' + WA_SVG + '</span>'
                + '<span class="yl-wa-label">Hablá con el fundador</span>';

    a.addEventListener('click', function () {
      try {
        if (window.fbq) window.fbq('trackCustom', 'WhatsAppFabClick', { page: ctx || 'home' });
        if (window.gtag) window.gtag('event', 'wa_fab_click', { page: ctx || 'home' });
      } catch (e) {}
    });

    document.body.appendChild(a);

    // Tooltip on first scroll (mobile only) — invites the user to chat
    if (window.matchMedia && window.matchMedia('(max-width:760px)').matches) {
      var seen = false;
      try { seen = sessionStorage.getItem('yl-wa-seen') === '1'; } catch (e) {}
      if (!seen) {
        var tip = document.createElement('div');
        tip.className = 'yl-wa-tooltip';
        tip.innerHTML = '¿Dudas? Escribime directo <button class="yl-wa-tooltip-close" aria-label="Cerrar">×</button>';
        document.body.appendChild(tip);
        var shown = false;
        function showTip() {
          if (shown) return;
          shown = true;
          setTimeout(function () { tip.classList.add('show'); }, 100);
          setTimeout(function () { tip.classList.remove('show'); }, 7000);
          try { sessionStorage.setItem('yl-wa-seen', '1'); } catch (e) {}
        }
        window.addEventListener('scroll', showTip, { passive: true, once: true });
        setTimeout(showTip, 12000);
        tip.querySelector('.yl-wa-tooltip-close').addEventListener('click', function (e) {
          e.preventDefault(); tip.classList.remove('show');
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
