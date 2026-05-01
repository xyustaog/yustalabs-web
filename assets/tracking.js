/**
 * tracking.js — Meta Pixel + Firebase Leads
 *
 * Carga global del pixel + helpers (`yl.lead`, `yl.contact`, `yl.viewContent`)
 * para que cualquier formulario o CTA pueda emitir el evento sin replicar la
 * snippet en cada página. También provee `yl.saveLead({...})` que escribe el
 * lead a Firestore — colección `leads/` — antes de abrir WhatsApp, para que
 * NUNCA perdamos un prospecto que abandone el flow del WA.
 *
 * Reemplazá `META_PIXEL_ID` con el pixel real cuando crees la cuenta de Meta.
 * Si queda como placeholder, las llamadas a fbq no rompen — fbq() es no-op.
 */
(function(){
  'use strict'

  // ───────────────────────────────────────────────────────────
  // 1. Meta Pixel
  // ───────────────────────────────────────────────────────────
  // Reemplazar por el Pixel ID real de Meta Business Suite.
  // Mientras esté en placeholder, fbq() opera como no-op silencioso.
  var META_PIXEL_ID = window.YL_META_PIXEL_ID || 'XXXXXXXXXXXXXXXX'
  var pixelEnabled = META_PIXEL_ID && META_PIXEL_ID !== 'XXXXXXXXXXXXXXXX'

  if (pixelEnabled) {
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return; n=f.fbq=function(){
        n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
      }
      if(!f._fbq)f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0'
      n.queue=[]; t=b.createElement(e); t.async=!0
      t.src=v; s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js')
    fbq('init', META_PIXEL_ID)
    fbq('track', 'PageView')
  } else {
    // No-op fallback so calling code never throws.
    window.fbq = window.fbq || function(){}
  }

  // ───────────────────────────────────────────────────────────
  // 2. Firebase config (para leads/) — solo público, NO secrets.
  //    Las write rules en Firestore son las que protegen `leads/`
  //    contra spam (ver firestore.rules · /leads/{leadId}).
  // ───────────────────────────────────────────────────────────
  var FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCtpv45L73IX7wlNORIFT3f1juaYPqrJK0',
    authDomain: 'aura-commerce-93e34.firebaseapp.com',
    projectId: 'aura-commerce-93e34',
    storageBucket: 'aura-commerce-93e34.firebasestorage.app',
    messagingSenderId: '573180517854',
    appId: '1:573180517854:web:44e7cc97232282da5fd14f',
  }

  // Lazy-load Firebase Web SDK only when first lead is submitted, so we don't
  // block the initial page render with ~80kB of JS for visitors that bounce.
  var _dbPromise = null
  function getDb() {
    if (_dbPromise) return _dbPromise
    _dbPromise = (async function(){
      var fbApp = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js')
      var fbStore = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js')
      var app = fbApp.initializeApp(FIREBASE_CONFIG)
      return { db: fbStore.getFirestore(app), addDoc: fbStore.addDoc, collection: fbStore.collection, serverTimestamp: fbStore.serverTimestamp }
    })()
    return _dbPromise
  }

  // ───────────────────────────────────────────────────────────
  // 3. Public API: window.yl.{lead, contact, saveLead}
  // ───────────────────────────────────────────────────────────
  function pixelEvent(name, params) {
    try { window.fbq && window.fbq('track', name, params || {}) } catch(_) {}
    try {
      // Mirror to GA4 if gtag is on the page.
      window.gtag && window.gtag('event', name === 'Lead' ? 'generate_lead' : name.toLowerCase(), params || {})
    } catch(_) {}
  }

  /**
   * Persist a lead to Firestore + fire all tracking events.
   * @param {Object} data - { nombre, negocio, telefono, rubro, email, mensaje, source, ...extras }
   *   Extras supported: services (string[]), totalEstimateUsd (number),
   *   needsCustomQuote (bool). Otros campos arbitrarios también se persisten.
   * @returns {Promise<{ok:boolean, id?:string, reason?:string}>}
   */
  async function saveLead(data) {
    // Build payload: spread all custom fields first, then enforce schema for
    // the well-known string fields (trimmed) + audit fields. Esta forma deja
    // pasar `services`, `totalEstimateUsd`, etc. tal cual los manda el caller.
    var payload = Object.assign({}, data, {
      nombre: (data.nombre || '').trim(),
      negocio: (data.negocio || '').trim(),
      telefono: (data.telefono || '').trim(),
      rubro: (data.rubro || '').trim(),
      email: (data.email || '').trim(),
      mensaje: (data.mensaje || '').trim(),
      source: data.source || 'web',
      page: location.pathname,
      userAgent: navigator.userAgent,
      estado: 'nuevo',  // panel kanban initial state
      createdAt: new Date().toISOString(),
    })
    try {
      var fb = await getDb()
      var ref = await fb.addDoc(fb.collection(fb.db, 'leads'), {
        ...payload,
        serverCreatedAt: fb.serverTimestamp(),
      })
      pixelEvent('Lead', { content_category: payload.rubro, content_name: payload.negocio })
      return { ok: true, id: ref.id }
    } catch (err) {
      console.warn('[tracking] saveLead error:', err)
      // Even if Firestore fails, fire the pixel so we don't lose attribution.
      pixelEvent('Lead', { content_category: payload.rubro })
      return { ok: false, reason: String(err && err.message || err) }
    }
  }

  /** Track a Contact button click (e.g. WhatsApp link) without writing a lead. */
  function trackContact(opts) {
    pixelEvent('Contact', { content_name: (opts && opts.label) || 'cta' })
  }

  /** Track view of a specific product/landing for retargeting. */
  function trackViewContent(contentName) {
    pixelEvent('ViewContent', { content_name: contentName || location.pathname })
  }

  // Auto-track ViewContent on landings (`/aura-*`) so retargeting audiences
  // build naturally without per-page snippets.
  if (/^\/aura-/.test(location.pathname)) {
    trackViewContent(location.pathname.replace(/^\/+|\/+$/g, '') || 'landing')
  }

  window.yl = window.yl || {}
  window.yl.saveLead = saveLead
  window.yl.contact = trackContact
  window.yl.viewContent = trackViewContent
  window.yl.lead = function(extra) { pixelEvent('Lead', extra || {}) }
})()
