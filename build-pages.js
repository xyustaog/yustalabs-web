// Generador rápido para las páginas restantes (agentes, servicios, faq, nosotros, custom).
// Cada una reutiliza el mismo nav + footer + FAB, solo cambia el contenido central.
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const NAV_ITEM_ACTIVE = { agentes: 'agentes', servicios: 'servicios', faq: 'faq', nosotros: '', custom: '' };

const HEAD = (title, desc, slug) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | Yusta Labs</title>
<meta name="description" content="${desc}">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<meta property="og:type" content="website"><meta property="og:url" content="https://yustalabs.com/${slug}"><meta property="og:title" content="${title}"><meta property="og:image" content="https://yustalabs.com/og-image.png"><meta property="og:locale" content="es_AR">
<link rel="stylesheet" href="/assets/theme.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-60G0MKXJRW"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-60G0MKXJRW');</script>`;

const NAV = (active) => `
<nav class="nav" data-nav>
  <a href="/" class="nav-brand"><img src="/assets/yusta-mark.svg?v=4" alt="" width="32" height="36"/><span class="nav-brand-text">Yusta <span style="color:var(--gold);">Labs</span></span></a>
  <div class="nav-items">
    <a href="/proceso" class="nav-item"${active==='proceso'?' aria-current="page"':''}>Proceso</a>
    <a href="/agentes" class="nav-item"${active==='agentes'?' aria-current="page"':''}>Agentes IA</a>
    <a href="/precios" class="nav-item"${active==='precios'?' aria-current="page"':''}>Precios</a>
    <a href="/servicios" class="nav-item"${active==='servicios'?' aria-current="page"':''}>Servicios</a>
    <a href="/custom" class="nav-item"${active==='custom'?' aria-current="page"':''}>Custom</a>
    <a href="/faq" class="nav-item"${active==='faq'?' aria-current="page"':''}>FAQ</a>
  </div>
  <a href="/contacto" class="nav-cta"${active==='contacto'?' aria-current="page"':''}>Hablemos <span>→</span></a>
  <button class="nav-toggle" aria-label="Abrir menú"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
</nav>`;

const FOOTER = `
<footer class="footer">
  <div class="footer-grid">
    <div><a href="/" style="display:inline-flex;align-items:center;gap:10px;color:var(--text);"><img src="/assets/yusta-mark.svg?v=4" alt="" width="32" height="36"/><span style="font-size:17px;font-weight:700;letter-spacing:-0.01em;">Yusta <span style="font-weight:400;opacity:0.95;">Labs</span></span></a><p class="footer-desc" style="margin-top:12px;">Sistemas de gestión adaptativos. Un sistema operativo para cualquier rubro.</p></div>
    <div class="footer-col"><div class="footer-col-title">Productos</div><a href="/aura-salon">Aura Salon</a><a href="/aura-fit">Aura Fit</a><a href="/aura-commerce">Aura Commerce</a><a href="/aura-food">Aura Food</a><a href="/showroom">Ver demos →</a></div>
    <div class="footer-col"><div class="footer-col-title">Empresa</div><a href="/nosotros">Sobre Yusta</a><a href="/proceso">Cómo trabajamos</a><a href="/servicios">Servicios</a><a href="/custom">Desarrollo a medida</a></div>
    <div class="footer-col"><div class="footer-col-title">Soporte</div><a href="/contacto">Contacto</a><a href="https://wa.me/541124693394" target="_blank" rel="noreferrer">WhatsApp</a><a href="/faq">FAQ</a><a href="/precios">Precios</a></div>
    <div class="footer-col"><div class="footer-col-title">Legal</div><a href="/garantia">Garantía</a><a href="/terminos">Términos y condiciones</a><a href="/privacidad">Política de privacidad</a></div>
  </div>
  <div class="footer-bottom"><span>© <span data-year>2026</span> Yusta Labs · Hecho en Argentina</span><span>no un excel.</span></div>
</footer>`;

const FAB = (msg) => `<a href="https://wa.me/541124693394?text=${encodeURIComponent(msg)}" target="_blank" rel="noreferrer" class="wa-fab" aria-label="Hablemos por WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.58-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></a>`;

const FOOT_SCRIPTS = `<script src="/assets/main.js" defer></script>`;

function buildPage({ slug, title, desc, active, extraStyle, body, fabMsg }) {
  const html = `${HEAD(title, desc, slug)}
${extraStyle ? `<style>${extraStyle}</style>` : ''}
</head>
<body>
${NAV(active)}

${body}

${FOOTER}
${FAB(fabMsg || `Hola! Vi ${title} y quiero más info.`)}
${FOOT_SCRIPTS}
</body>
</html>`;
  const dir = path.join(BASE, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('OK  ', slug);
}

// ═══ AGENTES ════════════════════════════════════════════════════════
buildPage({
  slug: 'agentes',
  title: 'Agentes IA',
  desc: 'Empleados digitales que trabajan 24/7 sobre tu sistema Aura. Atienden WhatsApp, cobran, detectan stock bajo, arman reportes. Setup desde USD 300 por agente + plan mensual desde USD 35.',
  active: 'agentes',
  extraStyle: `.agents-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:40px;}.agent-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:10px;transition:border-color var(--t);}.agent-card:hover{border-color:var(--border-hi);}.agent-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;background:var(--ac)20;color:var(--ac);}.agent-name{font-size:18px;font-weight:700;color:var(--text);}.agent-desc{font-size:13.5px;color:var(--muted);line-height:1.6;flex:1;}.agent-flow{margin-top:8px;padding-top:14px;border-top:1px solid var(--border);font-size:12px;color:var(--muted);line-height:1.7;}.agent-flow strong{color:var(--ac);}
.explainer{background:linear-gradient(135deg,rgba(240,180,41,0.04),rgba(240,180,41,0.01));border:1px solid rgba(240,180,41,0.18);border-radius:18px;padding:32px;margin-top:32px;}
.explainer-title{font-family:var(--font-display);font-size:clamp(22px,2.4vw,30px);font-weight:400;letter-spacing:0.02em;text-transform:uppercase;margin:0 0 12px;}
.explainer-lead{color:var(--muted);font-size:15px;line-height:1.7;max-width:720px;}
.explainer-lead strong{color:var(--text);}
.explainer-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:28px;}
.explainer-step{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;}
.explainer-step-num{display:inline-flex;width:28px;height:28px;border-radius:50%;background:rgba(240,180,41,0.15);color:var(--gold);align-items:center;justify-content:center;font-weight:800;font-size:13px;margin-bottom:10px;}
.explainer-step-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;}
.explainer-step-desc{font-size:13px;color:var(--muted);line-height:1.6;}
.wademo{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:32px;align-items:center;}
@media (max-width:820px){.wademo{grid-template-columns:1fr;}}
.wademo-side h3{font-family:var(--font-display);font-size:22px;font-weight:400;letter-spacing:0.02em;text-transform:uppercase;margin:0 0 8px;}
.wademo-side p{color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:14px;}
.wademo-phone{background:#0A0A0A;border:1px solid #2a2a2a;border-radius:22px;padding:16px;max-width:360px;margin:0 auto;box-shadow:0 20px 50px rgba(0,0,0,0.35);}
.wademo-head{display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid #222;margin-bottom:14px;}
.wademo-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px;}
.wademo-title{font-weight:700;color:#fff;font-size:14px;}
.wademo-status{font-size:11px;color:#8BFF9E;}
.wademo-status::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#25D366;margin-right:5px;vertical-align:middle;box-shadow:0 0 8px #25D366;}
.wademo-msg{max-width:82%;padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.45;margin-bottom:7px;}
.wademo-msg.in{background:#1f2937;color:#E6E7EA;border-top-left-radius:4px;margin-right:auto;}
.wademo-msg.out{background:#144D3A;color:#E9FDE5;border-top-right-radius:4px;margin-left:auto;}
.wademo-time{font-size:10px;color:#888;margin-top:1px;margin-bottom:10px;}
.wademo-time.out{text-align:right;}
.wademo-typing{display:inline-flex;gap:3px;align-items:center;padding:9px 14px;background:#1f2937;border-radius:14px;border-top-left-radius:4px;}
.wademo-typing span{width:6px;height:6px;border-radius:50%;background:#8a93a2;animation:waBounce 1.2s infinite;}
.wademo-typing span:nth-child(2){animation-delay:0.15s;}.wademo-typing span:nth-child(3){animation-delay:0.3s;}
@keyframes waBounce{0%,60%,100%{transform:translateY(0);opacity:0.5;}30%{transform:translateY(-4px);opacity:1;}}
.wademo-tag{display:inline-block;background:rgba(240,180,41,0.12);color:var(--gold);font-size:10.5px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 9px;border-radius:99px;margin-bottom:10px;}`,
  body: `
<section>
  <div class="wrap">
    <div class="section-eyebrow reveal">Agentes IA · la explicación simple</div>
    <h1 class="section-title reveal">Empleados digitales<br/>que trabajan 24/7.</h1>
    <p class="section-desc reveal">Los agentes IA atienden WhatsApp, cobran, recuerdan turnos, detectan stock bajo, arman reportes. Se adaptan a cada rubro con nombres y tareas específicas.</p>

    <div class="explainer reveal">
      <div class="wademo-tag">¿Qué es un agente IA?</div>
      <h2 class="explainer-title">Un empleado que no duerme, no se enferma y atiende a tus clientes por vos.</h2>
      <p class="explainer-lead">
        Un agente IA es un <strong>programa inteligente</strong> que trabaja dentro de tu sistema Aura y se comunica por WhatsApp con tus clientes.
        Sabe responder consultas, agendar turnos, recordar pagos y avisarte cuando algo importa — <strong>sin que vos tengas que hacer nada</strong>.
        No es un chatbot tonto que responde "sí/no" con botones: entiende lo que te escriben, responde en lenguaje natural y actúa sobre tu base de datos real.
      </p>
      <div class="explainer-steps">
        <div class="explainer-step"><div class="explainer-step-num">1</div><div class="explainer-step-title">Lo configuramos con tu negocio</div><div class="explainer-step-desc">Le cargamos tu agenda, tus precios, tus reglas. Aprende cómo atendés vos para hablar igual que vos.</div></div>
        <div class="explainer-step"><div class="explainer-step-num">2</div><div class="explainer-step-title">Conectamos tu WhatsApp Business</div><div class="explainer-step-desc">El agente escribe desde tu número oficial. Tus clientes lo ven como si fueras vos — sin aplicaciones raras ni cambios.</div></div>
        <div class="explainer-step"><div class="explainer-step-num">3</div><div class="explainer-step-title">Trabaja 24/7</div><div class="explainer-step-desc">Responde a las 3am, agenda turnos mientras dormís, cobra cuotas vencidas sin que te incomode. Vos ves todo desde el panel.</div></div>
      </div>
      <div class="wademo">
        <div class="wademo-side">
          <div class="wademo-tag">Ejemplo real</div>
          <h3>Así se ve una conversación</h3>
          <p>Un cliente escribe a la veterinaria a las 10:47 PM porque su gato está vomitando. <strong style="color:var(--text);">La Recepcionista</strong> atiende en segundos, revisa la agenda real del veterinario, agenda el turno del día siguiente y registra todo en Aura. Sin que el dueño del negocio se entere hasta la mañana.</p>
          <p style="font-size:12.5px;opacity:0.8;">Cuando el agente necesita algo que no puede resolver (un caso urgente, una excepción, etc.) te notifica a vos para que tomes el control. Siempre tenés el volante.</p>
        </div>
        <div>
          <div class="wademo-phone">
            <div class="wademo-head"><div class="wademo-avatar">🐾</div><div><div class="wademo-title">Vet del Bosque · La Recepcionista</div><div class="wademo-status">En línea · responde automáticamente</div></div></div>
            <div class="wademo-msg in">Hola, mi gato Milo está vomitando desde hace 2 horas. ¿Pueden atenderlo mañana?</div><div class="wademo-time">22:47</div>
            <div class="wademo-msg out">¡Hola! Lamento que Milo no esté bien 🐱 Soy la Recepcionista virtual de Vet del Bosque. Revisé la agenda del Dr. Ramírez — tenés turno disponible mañana jueves 9:30 hs o 15:00 hs. ¿Cuál te queda mejor?</div><div class="wademo-time out">22:47 ✓✓</div>
            <div class="wademo-msg in">9:30 está perfecto</div><div class="wademo-time">22:48</div>
            <div class="wademo-msg out">Listo ✅ Te agendé a Milo con el Dr. Ramírez mañana a las 9:30. ¿Querés que le avise al doctor que es urgencia digestiva así prepara todo?</div><div class="wademo-time out">22:48 ✓✓</div>
            <div class="wademo-msg in">Sí dale, gracias 🙏</div><div class="wademo-time">22:49</div>
            <div style="margin-bottom:8px;"><div class="wademo-typing"><span></span><span></span><span></span></div></div>
            <div class="wademo-msg out">Hecho. Ya le envié la nota al Dr. 👨‍⚕️ Mañana te espero con Milo. Si empeora esta noche, respondé a este chat y te derivo a guardia veterinaria.</div><div class="wademo-time out">22:49 ✓✓</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-eyebrow reveal" style="margin-top:56px;">Los 6 arquetipos</div>
    <h2 class="section-title reveal" style="font-size:clamp(28px,3vw,42px);">Elegí los agentes<br/>que necesita tu negocio.</h2>
    <p class="section-desc reveal">Sumás los que te sirvan. Empezás con 1 y podés agregar más cuando quieras. <strong style="color:var(--text);">Setup único por agente</strong> + <strong style="color:var(--text);">plan mensual</strong> que cubre mantenimiento y APIs.</p>

    <div class="agents-grid">
      <div class="agent-card reveal" style="--ac:#60A5FA;">
        <div class="agent-icon">💬</div>
        <div class="agent-name">El Recepcionista</div>
        <div class="agent-desc">Atiende mensajes 24/7, responde dudas frecuentes y agenda turnos automáticamente por WhatsApp.</div>
        <div class="agent-flow"><strong>Detecta:</strong> mensajes entrantes<br/><strong>Analiza:</strong> intención, urgencia, disponibilidad<br/><strong>Actúa:</strong> responde, agenda, deriva</div>
      </div>
      <div class="agent-card reveal" style="--ac:#22C55E;">
        <div class="agent-icon">💳</div>
        <div class="agent-name">El Cobrador</div>
        <div class="agent-desc">Detecta cobros pendientes, manda recordatorios escalonados y gestiona planes de pago sin que tengas que perseguir a nadie.</div>
        <div class="agent-flow"><strong>Detecta:</strong> cuotas vencidas, saldos<br/><strong>Analiza:</strong> historial, monto, días atraso<br/><strong>Actúa:</strong> recordatorios + link de pago</div>
      </div>
      <div class="agent-card reveal" style="--ac:#F59E0B;">
        <div class="agent-icon">📦</div>
        <div class="agent-name">El Almacenero</div>
        <div class="agent-desc">Controla stock en tiempo real, avisa cuando algo se está por terminar y sugiere reposiciones automáticas.</div>
        <div class="agent-flow"><strong>Detecta:</strong> movimientos, consumo<br/><strong>Analiza:</strong> rotación, puntos de reposición<br/><strong>Actúa:</strong> alerta + arma OC sugerida</div>
      </div>
      <div class="agent-card reveal" style="--ac:#A78BFA;">
        <div class="agent-icon">📊</div>
        <div class="agent-name">El Analista</div>
        <div class="agent-desc">Lee toda tu data y te dice qué está pasando en el negocio, sin que tengas que abrir un Excel.</div>
        <div class="agent-flow"><strong>Detecta:</strong> patrones anómalos<br/><strong>Analiza:</strong> tendencias, comparativos<br/><strong>Actúa:</strong> reportes + alertas clave</div>
      </div>
      <div class="agent-card reveal" style="--ac:#EC4899;">
        <div class="agent-icon">📣</div>
        <div class="agent-name">El Promotor / Community</div>
        <div class="agent-desc">Genera contenido, responde comentarios y mantiene activas tus redes sin que tengas que pensar qué postear.</div>
        <div class="agent-flow"><strong>Detecta:</strong> huecos de contenido, DMs<br/><strong>Analiza:</strong> tono de marca, timing<br/><strong>Actúa:</strong> postea + responde</div>
      </div>
      <div class="agent-card reveal" style="--ac:#EF4444;">
        <div class="agent-icon">❤️</div>
        <div class="agent-name">El Fidelizador</div>
        <div class="agent-desc">Reactiva clientes inactivos, arma campañas de cumpleaños y premia a los que más compran.</div>
        <div class="agent-flow"><strong>Detecta:</strong> clientes inactivos, cumpleaños<br/><strong>Analiza:</strong> segmento, valor<br/><strong>Actúa:</strong> campañas personalizadas</div>
      </div>
    </div>

    <div class="reveal" style="margin-top:48px;padding:24px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;text-align:center;">
      <div class="section-eyebrow">Pricing</div>
      <p style="margin:6px 0 14px;font-size:15px;">Setup por agente: <strong style="color:var(--text);">USD 300</strong> (pago único) · Plan mensual desde <strong style="color:var(--gold);">USD 35/mes</strong> (cubre mantenimiento + APIs + IA)</p>
      <a href="/precios" class="btn btn-gold">Ver pricing completo →</a>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Quiero agregar agentes IA a mi negocio.'
});

// ═══ SERVICIOS ═══════════════════════════════════════════════════════
buildPage({
  slug: 'servicios',
  title: 'Servicios',
  desc: 'Aura Web (páginas web), migraciones, mantenimiento evolutivo, capacitaciones extra. Servicios adicionales para complementar tu sistema Aura.',
  active: 'servicios',
  extraStyle: `.srv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:32px;}.srv-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:8px;}.srv-card-head{display:flex;align-items:center;gap:10px;}.srv-icon{font-size:26px;}.srv-label{font-size:11px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;font-weight:700;}.srv-title{font-size:18px;font-weight:700;color:var(--text);margin:2px 0;}.srv-price{font-family:var(--font-display);font-size:32px;color:var(--gold);line-height:1;}.srv-desc{font-size:13px;color:var(--muted);line-height:1.55;}.web-highlight{background:linear-gradient(135deg,rgba(96,165,250,0.06),transparent);border-color:rgba(96,165,250,0.2);}.web-highlight .srv-price{color:#60A5FA;}`,
  body: `
<section>
  <div class="wrap">
    <div class="section-eyebrow reveal">Complementá tu sistema</div>
    <h1 class="section-title reveal">Servicios<br/>adicionales.</h1>
    <p class="section-desc reveal">Además del sistema Aura y los agentes IA, te ofrecemos estos servicios para que tu negocio funcione mejor.</p>

    <!-- Aura Web -->
    <h2 style="font-family:var(--font-display);font-size:clamp(26px,3vw,36px);text-transform:uppercase;margin-top:40px;font-weight:400;color:#60A5FA;" class="reveal">🌐 Aura Web · páginas profesionales</h2>
    <p class="muted reveal" style="max-width:620px;line-height:1.6;">Te armamos tu página web. Hosting + dominio año 1 incluidos. Combo con plan Aura: <strong style="color:#22C55E;">USD 100 de descuento</strong>.</p>
    <div class="srv-grid">
      <div class="srv-card web-highlight reveal">
        <div class="srv-card-head"><div class="srv-icon">🌐</div><div><div class="srv-label">Aura Web Start</div><div class="srv-title">Landing 1 página</div></div></div>
        <div class="srv-price" data-usd="199">USD 199</div>
        <div class="srv-desc">Entrega en 7 días · mobile-first · form + WhatsApp · SEO básico · dominio incluido.</div>
      </div>
      <div class="srv-card web-highlight reveal" style="border-color:#60A5FA;">
        <div class="srv-card-head"><div class="srv-icon">💼</div><div><div class="srv-label" style="color:#60A5FA;">Aura Web Pro ⭐</div><div class="srv-title">Corporativa 5 páginas</div></div></div>
        <div class="srv-price" data-usd="499">USD 499</div>
        <div class="srv-desc">Entrega 14 días · Home + Nosotros + Servicios + Contacto + Blog · diseño 100% personalizado · SEO técnico.</div>
      </div>
      <div class="srv-card web-highlight reveal">
        <div class="srv-card-head"><div class="srv-icon">🛒</div><div><div class="srv-label">Aura Web Shop</div><div class="srv-title">Tienda online</div></div></div>
        <div class="srv-price" data-usd="849">USD 849</div>
        <div class="srv-desc">Entrega 21 días · carrito + MercadoPago · panel admin de stock · emails automáticos · envíos por zona.</div>
      </div>
    </div>

    <!-- Otros servicios -->
    <h2 style="font-family:var(--font-display);font-size:clamp(26px,3vw,36px);text-transform:uppercase;margin-top:56px;font-weight:400;" class="reveal">🛠️ Mantenimiento, mejoras, extras</h2>
    <div class="srv-grid">
      <div class="srv-card reveal">
        <div class="srv-label">☁️ Hosting · año 2+</div>
        <div class="srv-title">Mantenimiento managed</div>
        <div class="srv-price" data-usd="30">USD 30/mes</div>
        <div class="srv-desc">Servidores, backups diarios, SSL, actualizaciones de seguridad.</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">⚙️ Evolutivo</div>
        <div class="srv-title">Mantenimiento + dev</div>
        <div class="srv-price" data-usd="70">USD 70/mes</div>
        <div class="srv-desc">Hosting + 3 hs dev/mes para cambios y mejoras continuas.</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">🛠️ Sesión puntual</div>
        <div class="srv-title">Cambios 1-2 hs</div>
        <div class="srv-price" data-usd="40">USD 40</div>
        <div class="srv-desc">Para ajustes puntuales o features chicos. Pack 5 = USD 160 (ahorrás 40).</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">📥 Migración simple</div>
        <div class="srv-title">Desde Excel/CSV</div>
        <div class="srv-price" data-usd="40">USD 40</div>
        <div class="srv-desc">Menos de 500 registros desde tu Excel o planilla actual.</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">📊 Migración compleja</div>
        <div class="srv-title">500+ registros</div>
        <div class="srv-price" data-usd="120">USD 120</div>
        <div class="srv-desc">Con normalización de data, validación y backup previo.</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">🔁 Migración sistema</div>
        <div class="srv-title">Fudo, Tokko, Tango...</div>
        <div class="srv-price" data-usd="200">USD 200</div>
        <div class="srv-desc">Desde otro sistema completo. Incluye mapeo y validación final.</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">🎓 Capacitación extra</div>
        <div class="srv-title">Videollamada 30-60 min</div>
        <div class="srv-price" data-usd="25">USD 25</div>
        <div class="srv-desc">Para equipo nuevo o features avanzados. Grabamos el video para que quede.</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">👤 Usuario extra</div>
        <div class="srv-title">Usuarios 6 a 10</div>
        <div class="srv-price" data-usd="15">USD 15</div>
        <div class="srv-desc">Pago único por cada usuario adicional, hasta 10 en total. Los planes incluyen 5.</div>
      </div>
      <div class="srv-card reveal">
        <div class="srv-label">👥 Equipo grande</div>
        <div class="srv-title">Más de 10 usuarios</div>
        <div class="srv-price" data-usd="8">USD 8<span style="font-size:0.55em;color:var(--muted);font-weight:500;"> /mes por usuario</span></div>
        <div class="srv-desc">A partir del usuario 11, suscripción mensual por usuario. Incluye soporte prioritario y monitoreo de performance.</div>
      </div>
    </div>

    <div class="text-center reveal" style="margin-top:48px;">
      <a href="/contacto" class="btn btn-gold btn-lg">Pedir cotización →</a>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Me interesan los servicios adicionales de Yusta Labs.'
});

// ═══ FAQ ═════════════════════════════════════════════════════════════
const faqs = [
  ['¿Los agentes IA vienen incluidos con la aplicación?', 'No. La <strong>aplicación es un producto aparte</strong> — se paga una sola vez (USD 400-1.250 según rubro) y es tuya. Los <strong>agentes IA son módulos opcionales</strong> que sumás cuando quieras. Se cobran en 3 partes: <strong>setup</strong> (USD 250 por agente, pago único, incluye configuración y entrenamiento), <strong>plan mensual</strong> (desde USD 35/mes, cubre mantenimiento + uso de APIs de WhatsApp + inteligencia artificial), y <strong>extras opcionales</strong> (integraciones custom, templates personalizados). Podés empezar con 1 agente y sumar más cuando los necesites.'],
  ['¿Qué significa el plan mensual de los agentes? ¿Y por qué es mensual si la app es pago único?', 'La app es un programa que corre en tu computadora — por eso es pago único. Los agentes IA <strong>conversan 24/7 por WhatsApp y usan inteligencia artificial</strong> para entender a tus clientes. Cada mensaje que mandan o reciben tiene un costo real que Yusta Labs paga a Meta (WhatsApp Business API) y a Anthropic (IA). El plan mensual cubre todo eso, más el mantenimiento y monitoreo. Hay 4 planes: <strong>Starter</strong> USD 35/mes (1 agente), <strong>Esencial</strong> USD 100/mes (3 agentes), <strong>Negocio</strong> USD 200/mes (6 agentes), <strong>Empresa</strong> USD 400/mes (10 agentes + soporte prioritario).'],
  ['¿Qué pasa si en un mes uso mucho más de lo habitual?', 'Cada plan incluye un volumen de mensajes acorde al tamaño del negocio. Si excepcionalmente se pasa, podés <strong>recargar saldo</strong> (desde USD 20 por paquete) o pasarte al plan superior. Todo se ve en vivo en el panel de tu cuenta: cuántos mensajes llevás, cuántos te quedan, proyección del mes. Si estás cerca del tope, el sistema te avisa por WhatsApp antes de que te facture de más.'],
  ['¿Por qué pago único y no suscripción?', 'Creemos que el software que usás para tu negocio tiene que ser tuyo. Lo pagás una vez y lo tenés para siempre. Sin sorpresas ni aumentos mensuales. La única cuota opcional es la de mantenimiento (USD 30/mes después del año 1), y eso cubre servidores y soporte — pero podés hostearlo vos si querés.'],
  ['¿En cuánto tiempo lo tengo funcionando?', 'Dos semanas. Hacemos briefing el día 1-2, diseño 3-5, desarrollo 6-12, onboarding 13-14. Al día 15 estás usando tu sistema con tu data cargada.'],
  ['¿Cuántos usuarios puedo tener?', 'Hasta 5 usuarios incluidos en todos los planes (dueño + 4 empleados con roles diferenciados). Si necesitás más, los usuarios 6 a 10 son <strong>USD 15 pago único</strong> cada uno. A partir del usuario 11 pasamos a <strong>USD 8/mes por usuario</strong>, que incluye soporte prioritario y monitoreo — este modelo aplica a equipos grandes donde la infraestructura operativa escala.'],
  ['¿Se paga en pesos o en dólares?', 'En pesos argentinos. Los precios en USD son referenciales — se convierten al tipo de cambio del día (dólar MEP o blue, a convenir). Aceptamos tarjeta, MercadoPago, transferencia, efectivo y crypto (USDT, USDC, Bitcoin).'],
  ['¿Qué onda las 6 cuotas?', 'Se aplica un 20% de recargo financiero. Ejemplo: USD 450 al contado = USD 540 en 6 cuotas de USD 90. El precio al contado es el real.'],
  ['¿Funciona sin internet?', 'Depende del rubro. Todos los sistemas Aura son web-based, así que necesitan conexión. Pero tenemos mecanismos de caché local para que si se cae internet 10 min, la caja siga funcionando.'],
  ['¿Emite factura electrónica AFIP?', 'Sí, lo integramos en las versiones Completa. El Lite puede agregarse como feature adicional. Nosotros conectamos tu CUIT a AFIP y automatizamos la emisión.'],
  ['¿Puedo agregar features después?', 'Sí. Tenés 3 opciones: (1) sesión de cambios USD 40 por 1-2 hs, (2) pack 5 sesiones USD 160, (3) plan evolutivo USD 70/mes que incluye 3 hs dev por mes.'],
  ['¿Mi data está segura?', 'Sí. Todo encriptado, backups diarios automáticos, restricciones por dominio. Tenés la opción de self-hosting si querés que los datos vivan en tu propia cuenta Firebase (USD 200 setup + USD 20/mes mantenimiento).'],
  ['¿Pueden hacer algo custom para mi rubro específico?', 'Sí. Aura es adaptativo: arrancamos del núcleo común y le sumamos la capa de tu rubro. Si necesitás algo totalmente a medida, tenemos plan Custom. Cotización en 48 hs según complejidad. Desde USD 1500 típicamente.'],
  ['¿Dónde están ubicados?', '🇦🇷 CABA, Argentina. Hablamos tu idioma, entendemos tu mercado. No tercerizamos a la India ni a bots — lo hacemos nosotros.'],
  ['¿Cómo es el soporte después?', 'Primeros 30 días: soporte 24/7 por WhatsApp sin cargo. Después: soporte en horario hábil (Lun-Vie 9-19 hs) incluido en el mantenimiento mensual.'],
];
buildPage({
  slug: 'faq',
  title: 'FAQ',
  desc: 'Preguntas frecuentes sobre Yusta Labs: pricing, tiempos de entrega, formas de pago, garantías, multi-usuario, AFIP, soporte.',
  active: 'faq',
  body: `
<section>
  <div class="wrap-narrow">
    <div class="section-eyebrow reveal">Preguntas frecuentes</div>
    <h1 class="section-title reveal">Lo que siempre<br/>nos preguntan.</h1>
    <p class="section-desc reveal">Si tu pregunta no está acá, <a href="https://wa.me/541124693394?text=Hola!%20Tengo%20una%20consulta%20sobre%20Yusta%20Labs." target="_blank" rel="noreferrer" style="color:var(--gold);font-weight:700;text-decoration:none;border-bottom:1px dashed rgba(240,180,41,0.45);">escribinos por WhatsApp</a> y te respondemos en minutos.</p>

    <div style="margin-top:32px;">
      ${faqs.map(([q, a], i) => `<details class="faq-item${i===0?' open':''}"${i===0?' open':''}><summary class="faq-q">${q}</summary><div class="faq-a">${a}</div></details>`).join('')}
    </div>

    <div class="text-center reveal" style="margin-top:48px;padding:32px;background:var(--card);border:1px solid var(--border);border-radius:16px;">
      <h3 style="font-family:var(--font-display);font-size:28px;text-transform:uppercase;margin:0 0 10px;font-weight:400;">¿Tenés otra duda?</h3>
      <p class="muted" style="margin:0 0 20px;">Escribinos. Respondemos rápido.</p>
      <a href="/contacto" class="btn btn-gold">Pedir demo →</a>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Tengo una pregunta sobre Yusta Labs.'
});

// ═══ NOSOTROS ════════════════════════════════════════════════════════
buildPage({
  slug: 'nosotros',
  title: 'Nosotros',
  desc: 'Yusta Labs nació para ayudar a una empresa familiar a salir del caos de los Google Sheets. Hoy es un cerebro de gestión (Aura) para PyMEs, emprendimientos y personas reales que necesitan soluciones reales.',
  active: '',
  extraStyle: `
    .story{max-width:720px;margin:40px auto 0;}
    .story p{font-size:18px;line-height:1.75;color:var(--text);margin:0 0 20px;}
    .story p strong{color:var(--gold);}
    .story blockquote{font-family:var(--font-display);font-size:clamp(26px,3vw,40px);line-height:1.15;text-transform:uppercase;color:var(--text);margin:44px 0;padding:26px 30px;border-left:3px solid var(--gold);background:var(--card);border-radius:0 14px 14px 0;letter-spacing:0.01em;}
    .chapter-label{display:inline-block;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-top:36px;margin-bottom:4px;}
    .chapter-label::before{content:'';display:inline-block;width:18px;height:1px;background:var(--gold);margin-right:10px;vertical-align:middle;}
    .pillar-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:28px 0;}
    .pillar{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;}
    .pillar-num{font-family:var(--font-display);font-size:32px;color:var(--gold);line-height:1;margin-bottom:8px;}
    .pillar-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;}
    .pillar-desc{font-size:13px;color:var(--muted);line-height:1.55;}
    .promise-box{background:linear-gradient(135deg,rgba(240,180,41,0.06),rgba(240,180,41,0.01));border:1px solid rgba(240,180,41,0.22);border-radius:16px;padding:28px;margin:40px 0;}
    .promise-title{font-family:var(--font-display);font-size:24px;letter-spacing:0.02em;text-transform:uppercase;color:var(--gold);margin:0 0 14px;}
    .promise-list{list-style:none;padding:0;margin:0;}
    .promise-list li{font-size:15px;line-height:1.7;color:var(--text);padding:8px 0;border-bottom:1px dashed var(--border);display:flex;gap:12px;align-items:flex-start;}
    .promise-list li:last-child{border-bottom:none;}
    .promise-list li::before{content:'✓';color:var(--gold);font-weight:900;font-size:18px;line-height:1.4;flex-shrink:0;}
  `,
  body: `
<section>
  <div class="wrap-narrow">
    <div class="section-eyebrow reveal">Nuestra historia</div>
    <h1 class="section-title reveal">No empezamos con un plan<br/>de negocios. Empezamos<br/>con un problema real.</h1>

    <div class="story reveal">
      <div class="chapter-label">El origen</div>
      <p>Yusta Labs nació casi sin querer. <strong>Arranqué construyendo una aplicación para la empresa de mi familia</strong> para sacarlos del caos: tenían todo guardado en Google Sheets, una gestión bastante básica, información por todos lados, y perdían tiempo buscando datos que deberían estar a un click.</p>

      <p>Yo estaba viendo todo el movimiento de inteligencia artificial y pensé: <em>"bueno, vamos a meterle a esto. Seguro se puede hacer algo útil de verdad."</em></p>

      <p>Así empezó. Una familia, un Excel que no alcanzaba, y muchas ganas de que las cosas funcionen mejor.</p>

      <div class="chapter-label">El camino</div>
      <p>En el transcurso de este tiempo fui aprendiendo un montón de cosas. Programación, diseño, arquitectura de software, integraciones, IA. Cada problema nuevo me obligaba a estudiar algo distinto. Y de a poco lo que era una aplicación simple para un solo negocio se fue convirtiendo en algo mucho más grande.</p>

      <p>Terminé armando lo que hoy llamamos <strong>Aura</strong>: una arquitectura gigantesca que funciona como un <strong>cerebro</strong> capaz de adaptarse a cualquier rubro. No es un producto genérico que vende todo a todos — es <strong>un sistema operativo adaptativo</strong>, con un núcleo común y una capa de rubro que se moldea a tu negocio, todo corriendo sobre la misma inteligencia de base.</p>

      <blockquote>Aura es un cerebro que puede solucionarle la vida a muchísima gente.</blockquote>

      <div class="chapter-label">A quién va dirigido</div>
      <p>Pensamos en toda la gente que tiene <strong>pymes, emprendimientos, negocios</strong> — y también en personas reales que tal vez <strong>no están tan cerca de la tecnología</strong>, que no saben programar, o simplemente no les gusta. Gente que necesita que las cosas funcionen, sin tener que aprender un software complicado para lograrlo.</p>

      <p>Creemos que las soluciones de Aura aplican a muchos, muchos lugares. Y sabemos que esto es solo el comienzo. <strong>Hay que empezar a usar nuestra cabeza para pensar</strong>, para que se nos ocurran ideas que nos lleven a más soluciones reales.</p>

      <div class="promise-box">
        <div class="promise-title">🎯 Nuestra promesa</div>
        <p style="font-size:15px;color:var(--text);margin:0 0 14px;line-height:1.7;">Yusta Labs <strong>garantiza soluciones</strong>. Acá no buscamos venderte tecnología por tecnología — buscamos resolverte un problema. Eso es lo único que importa.</p>
        <ul class="promise-list">
          <li>Queremos que tengas tu información <strong>a mano, disponible, siempre en línea</strong>. Sin fallos. Sin caídas.</li>
          <li>Que si necesitás algo, <strong>en 2 minutos o menos lo encuentres</strong>.</li>
          <li>Que cargar información sea lo <strong>más rápido posible</strong>.</li>
          <li>Que responder una consulta de un cliente sea <strong>eficiente, directo, sin vueltas</strong>.</li>
        </ul>
      </div>

      <div class="chapter-label">Cómo pensamos</div>
      <p>Nuestro principal objetivo es <strong>crear soluciones de manera inteligente</strong>. No software por software. No features por features. <strong>Soluciones reales a problemas reales.</strong></p>

      <div class="pillar-grid">
        <div class="pillar">
          <div class="pillar-num">01</div>
          <div class="pillar-title">Información siempre a mano</div>
          <div class="pillar-desc">Si no encontrás lo que necesitás en menos de 2 minutos, algo está mal diseñado.</div>
        </div>
        <div class="pillar">
          <div class="pillar-num">02</div>
          <div class="pillar-title">Cero caídas</div>
          <div class="pillar-desc">Tu negocio no puede parar porque "se cayó el sistema". Diseñamos para que no pase.</div>
        </div>
        <div class="pillar">
          <div class="pillar-num">03</div>
          <div class="pillar-title">Pensado para humanos</div>
          <div class="pillar-desc">Si no entendés cómo usarlo en los primeros 10 minutos, lo hicimos mal.</div>
        </div>
        <div class="pillar">
          <div class="pillar-num">04</div>
          <div class="pillar-title">Atención directa</div>
          <div class="pillar-desc">Cuando nos escribís, te responde el equipo que hace el producto. Sin 5 niveles de soporte.</div>
        </div>
      </div>

      <div class="chapter-label">Dónde estamos</div>
      <p>🇦🇷 <strong>Buenos Aires, Argentina.</strong> Hablamos tu idioma, entendemos tu mercado, conocemos cómo funcionan de verdad los negocios argentinos. Cuando decís "fiado", entendemos. Cuando tu cliente te paga por transferencia al CBU del cuñado, no nos sorprende.</p>

      <p style="font-size:16px;color:var(--muted);margin-top:36px;line-height:1.7;">Si vendés a una agencia de afuera que te promete <em>"Revolutionize Your Business™"</em> con un SaaS en dólares, no somos para vos.<br/><br/>Si vendés a una PyME que se cansó de perder tiempo, información y clientes por culpa de sistemas que no entienden cómo trabaja, <strong style="color:var(--gold);">hablá con nosotros</strong>.</p>
    </div>

    <div class="text-center reveal" style="margin-top:64px;">
      <a href="/contacto" class="btn btn-gold btn-lg">Quiero una demo →</a>
      <a href="/showroom" class="btn btn-outline btn-lg" style="margin-left:8px;">Ver demos en vivo</a>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Leí la historia de Yusta Labs y me interesa.'
});

// ═══ CUSTOM ══════════════════════════════════════════════════════════
buildPage({
  slug: 'custom',
  title: 'Desarrollo a medida',
  desc: 'Tu rubro no está en los 11 Aura. Te armamos un sistema 100% a medida. Cotización en 48 hs, desde USD 1500, entrega en 4-8 semanas según complejidad.',
  active: '',
  extraStyle: `.custom-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:32px;}@media(max-width:800px){.custom-steps{grid-template-columns:1fr 1fr;}}.cstep{padding:20px;background:var(--card);border:1px solid var(--border);border-radius:14px;}.cstep-n{font-family:var(--font-display);font-size:32px;color:var(--gold);line-height:1;}.cstep-t{font-weight:700;margin:6px 0 4px;color:var(--text);}.cstep-d{font-size:12.5px;color:var(--muted);line-height:1.55;}`,
  body: `
<section>
  <div class="wrap-narrow">
    <div class="section-eyebrow reveal">Desarrollo a medida</div>
    <h1 class="section-title reveal">¿Tu rubro no está<br/>en los 11?</h1>
    <p class="section-desc reveal">Te hacemos un sistema 100% a medida. Desde USD 1500, entrega en 4-8 semanas según complejidad. Cotización gratis en 48 hs.</p>

    <div class="custom-steps">
      <div class="cstep reveal"><div class="cstep-n">01</div><div class="cstep-t">Briefing</div><div class="cstep-d">Llamada 60 min, nos contás tu rubro, flujos y problemas reales.</div></div>
      <div class="cstep reveal"><div class="cstep-n">02</div><div class="cstep-t">Cotización</div><div class="cstep-d">En 48 hs recibís propuesta detallada con alcance, precio y tiempos.</div></div>
      <div class="cstep reveal"><div class="cstep-n">03</div><div class="cstep-t">Desarrollo</div><div class="cstep-d">Iteramos con demos semanales. Tus cambios, sin cargo extra.</div></div>
      <div class="cstep reveal"><div class="cstep-n">04</div><div class="cstep-t">Entrega</div><div class="cstep-d">Onboarding + capacitación + 30 días de soporte 24/7.</div></div>
    </div>

    <div class="reveal" style="margin-top:48px;padding:32px;background:var(--card);border:1px solid var(--border-accent);border-radius:16px;">
      <div class="section-eyebrow">Casos típicos</div>
      <ul style="margin:10px 0 0;padding-left:20px;color:var(--muted);line-height:1.8;font-size:14.5px;">
        <li>Franquicias con requerimientos específicos de reporte centralizado</li>
        <li>Rubros nicho: funerarias, estudios jurídicos, consultorios médicos, escuelas</li>
        <li>Integraciones complejas con ERPs existentes (Tango, Bejerman, SAP)</li>
        <li>Portales B2B con múltiples roles y permisos granulares</li>
        <li>Apps mobile nativas iOS/Android complementarias al sistema web</li>
        <li>Sistemas con flujos únicos que no encajan con los 11 productos estándar</li>
      </ul>
    </div>

    <div class="text-center reveal" style="margin-top:40px;">
      <a href="https://wa.me/541124693394?text=Hola!%20Necesito%20un%20sistema%20custom%20para%20mi%20rubro." target="_blank" rel="noreferrer" class="btn btn-gold btn-lg">💬 Pedir cotización custom</a>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Necesito un sistema custom para mi rubro.'
});

// ═══ GARANTÍA ════════════════════════════════════════════════════════
buildPage({
  slug: 'garantia',
  title: 'Garantía',
  desc: 'Prueba gratuita + garantía de 30 días. Si en 30 días el sistema no resuelve lo que prometimos, te devolvemos el 100% del pago único. Sin preguntas.',
  active: '',
  extraStyle: `
    .guarantee-hero{background:linear-gradient(135deg,rgba(240,180,41,0.08),rgba(240,180,41,0.02));border:1px solid rgba(240,180,41,0.22);border-radius:18px;padding:40px;text-align:center;margin:30px 0;}
    .guarantee-seal{display:inline-flex;align-items:center;justify-content:center;width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#F0B429,#D49810);color:#07070A;font-family:var(--font-display);margin-bottom:20px;box-shadow:0 10px 30px rgba(240,180,41,0.3);}
    .guarantee-seal-num{font-size:44px;font-weight:900;line-height:1;}
    .guarantee-seal-txt{font-size:11px;letter-spacing:0.2em;margin-top:2px;}
    .how-list{list-style:none;padding:0;margin:20px 0;}
    .how-list li{padding:18px 22px;background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:12px;display:flex;gap:18px;align-items:flex-start;}
    .how-num{flex-shrink:0;width:34px;height:34px;border-radius:50%;background:rgba(240,180,41,0.15);color:var(--gold);font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px;}
    .how-content h4{margin:0 0 4px;font-size:15px;color:var(--text);}
    .how-content p{margin:0;font-size:14px;color:var(--muted);line-height:1.6;}
  `,
  body: `
<section>
  <div class="wrap-narrow">
    <div class="section-eyebrow reveal">Nuestro compromiso</div>
    <h1 class="section-title reveal">Garantía real. Prueba gratuita.<br/>Sin letra chica.</h1>
    <p class="section-desc reveal">Sabemos que estás por gastar plata en un sistema que todavía no usaste. Entendemos. Por eso te damos 2 redes de seguridad:</p>

    <div class="guarantee-hero reveal">
      <div class="guarantee-seal">
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div class="guarantee-seal-num">30</div>
          <div class="guarantee-seal-txt">DÍAS</div>
        </div>
      </div>
      <h2 style="font-family:var(--font-display);font-size:clamp(26px,3vw,38px);letter-spacing:0.02em;text-transform:uppercase;margin:0 0 12px;">Garantía de 30 días · 100% reembolso</h2>
      <p style="max-width:560px;margin:0 auto;font-size:15px;line-height:1.7;color:var(--muted);">Si en 30 días desde la entrega el sistema no resuelve lo que te prometimos, te devolvemos el 100% del pago único. Sin preguntas. Sin letra chica. Sin trabas.</p>
    </div>

    <div class="section-eyebrow reveal" style="margin-top:50px;">Antes de pagar</div>
    <h2 class="section-title reveal" style="font-size:clamp(24px,3vw,36px);">🎁 Prueba gratuita</h2>
    <p style="font-size:16px;color:var(--muted);line-height:1.7;margin-bottom:20px;">Antes de firmar nada, podés <strong style="color:var(--text);">probar la demo completa de tu rubro</strong> con datos ficticios. Cliqueás, navegás, entendés cómo funciona — y recién ahí decidís.</p>
    <p style="font-size:16px;color:var(--muted);line-height:1.7;margin-bottom:20px;">Además, te ofrecemos una <strong style="color:var(--text);">demo personalizada de 20–30 minutos</strong> donde te mostramos cómo el sistema se adapta a tu negocio específico. Te respondemos todas las preguntas, te explicamos el onboarding, y si querés, te armamos una cotización exacta.</p>
    <p style="font-size:16px;color:var(--muted);line-height:1.7;">Nada de esto cuesta un peso.</p>

    <div class="section-eyebrow reveal" style="margin-top:50px;">Después de pagar</div>
    <h2 class="section-title reveal" style="font-size:clamp(24px,3vw,36px);">🛡️ Cómo funciona la garantía</h2>

    <ul class="how-list reveal">
      <li>
        <div class="how-num">1</div>
        <div class="how-content">
          <h4>Período de garantía: 30 días desde la entrega</h4>
          <p>El plazo empieza a correr el día que te entregamos el sistema funcionando y capacitado. No desde que firmás.</p>
        </div>
      </li>
      <li>
        <div class="how-num">2</div>
        <div class="how-content">
          <h4>Qué cubre</h4>
          <p>Si el sistema no funciona como te prometimos, no resuelve el problema que acordamos, o no cumple con lo documentado en tu propuesta comercial — devolvemos el 100% del pago único del software.</p>
        </div>
      </li>
      <li>
        <div class="how-num">3</div>
        <div class="how-content">
          <h4>Qué NO cubre</h4>
          <p>Los servicios consumidos (setup de agentes IA, APIs usadas, migraciones realizadas, horas de capacitación dictadas). Si ya te instalamos 3 agentes y operaron 15 días, ese trabajo se factura aparte.</p>
        </div>
      </li>
      <li>
        <div class="how-num">4</div>
        <div class="how-content">
          <h4>Cómo solicitar el reembolso</h4>
          <p>Nos escribís por WhatsApp (+54 11 2469-3394) o email explicando por qué el sistema no funcionó para vos. Revisamos juntos si es algo que se puede ajustar. Si no hay forma, procesamos el reembolso en hasta 15 días hábiles por el mismo medio de pago.</p>
        </div>
      </li>
      <li>
        <div class="how-num">5</div>
        <div class="how-content">
          <h4>Pasado el día 30</h4>
          <p>Después del día 30, entrás en el período de soporte estándar incluido en tu compra (12 meses de hosting y soporte). Ya no aplica reembolso, pero seguís con todo el acompañamiento.</p>
        </div>
      </li>
    </ul>

    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;margin-top:30px;" class="reveal">
      <h3 style="margin:0 0 12px;font-size:17px;color:var(--gold);">💡 Por qué podemos hacer esto</h3>
      <p style="font-size:14.5px;color:var(--muted);line-height:1.7;margin:0;">Porque no vendemos humo. Cada producto Aura está diseñado específicamente para su rubro, probado con casos reales, y documentado antes de la entrega. Sabemos que va a funcionar. Y si por alguna razón no funciona para vos específicamente, no queremos quedarnos con tu plata.</p>
    </div>

    <div class="text-center reveal" style="margin-top:50px;">
      <a href="/contacto" class="btn btn-gold btn-lg">Agendar demo gratuita →</a>
      <a href="/precios" class="btn btn-outline btn-lg" style="margin-left:8px;">Ver precios</a>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Leí sobre la garantía y quiero saber más.'
});

// ═══ TÉRMINOS Y CONDICIONES ═════════════════════════════════════════
buildPage({
  slug: 'terminos',
  title: 'Términos y condiciones',
  desc: 'Términos y condiciones de uso del software Aura y servicios de Yusta Labs. Argentina — Ley 25.326.',
  active: '',
  extraStyle: `
    .legal{max-width:780px;margin:30px auto 0;font-size:14.5px;line-height:1.75;color:var(--text);}
    .legal h2{font-family:var(--font-display);font-size:clamp(20px,2.2vw,26px);letter-spacing:0.02em;text-transform:uppercase;color:var(--gold);margin:36px 0 12px;padding-top:24px;border-top:1px solid var(--border);}
    .legal h2:first-child{border-top:none;padding-top:0;margin-top:20px;}
    .legal h3{font-size:16px;color:var(--text);margin:24px 0 10px;font-weight:700;}
    .legal p{margin:0 0 14px;color:var(--muted);}
    .legal ul{margin:10px 0 16px;padding-left:22px;color:var(--muted);}
    .legal ul li{margin-bottom:8px;line-height:1.65;}
    .legal strong{color:var(--text);font-weight:700;}
    .legal .meta{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 18px;font-size:13px;color:var(--muted);margin-bottom:24px;}
  `,
  body: `
<section>
  <div class="wrap-narrow">
    <div class="section-eyebrow reveal">Legal</div>
    <h1 class="section-title reveal">Términos y Condiciones</h1>

    <div class="legal reveal">
      <div class="meta">
        <strong>Última actualización:</strong> 20 de abril de 2026<br/>
        <strong>Titular:</strong> Yusta Labs — Nicolás Yusta (fundador y operador)<br/>
        <strong>Contacto:</strong> WhatsApp: +54 11 2469-3394 (email empresarial próximamente) · +54 11 2469-3394<br/>
        <strong>Sitio:</strong> yustalabs.com<br/>
        <strong>Domicilio:</strong> Ciudad Autónoma de Buenos Aires, Argentina
      </div>

      <h2>1. Aceptación de los Términos</h2>
      <p>Al contratar cualquier producto o servicio de Yusta Labs (en adelante, <strong>"la Empresa"</strong>), el usuario (en adelante, <strong>"el Cliente"</strong>) acepta expresamente estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguno de los puntos, no debe contratar el servicio.</p>

      <h2>2. Objeto del servicio</h2>
      <p>Yusta Labs comercializa sistemas de gestión digitales a medida bajo la marca <strong>Aura</strong>, en 11 verticales distintas (gastronomía, gimnasios, inmobiliarias, veterinarias, peluquerías, ferreterías, talleres, financieras, logística, indumentaria y comercio general), así como servicios complementarios:</p>
      <ul>
        <li><strong>Software Aura (pago único):</strong> licencia perpetua de uso del sistema para el rubro contratado.</li>
        <li><strong>Agentes IA (suscripción mensual):</strong> módulos opcionales de inteligencia artificial que operan sobre el sistema Aura.</li>
        <li><strong>Aura Web:</strong> diseño y desarrollo de páginas web.</li>
        <li><strong>Servicios adicionales:</strong> migraciones, capacitaciones, mantenimiento, integraciones custom.</li>
      </ul>

      <h2>3. Licencia de uso del software</h2>
      <h3>3.1 Pago único del software Aura</h3>
      <p>El Cliente que adquiere un producto Aura recibe una <strong>licencia perpetua, no exclusiva, intransferible</strong> para el uso del software en su propio negocio. Esto significa:</p>
      <ul>
        <li>El Cliente puede usar el sistema de forma indefinida.</li>
        <li>El Cliente NO puede revender, sublicenciar ni redistribuir el software.</li>
        <li>El Cliente NO adquiere derechos sobre el código fuente. Yusta Labs conserva la propiedad intelectual del código base.</li>
        <li>Las adaptaciones, personalizaciones y datos cargados por el Cliente son 100% de su propiedad.</li>
      </ul>

      <h3>3.2 Agentes IA (suscripción mensual)</h3>
      <p>Los agentes IA funcionan mediante suscripción mensual. Mientras el Cliente mantenga el pago, los agentes operarán 24/7. Si el Cliente cancela la suscripción, los agentes dejan de funcionar pero el Cliente conserva el resto del sistema Aura.</p>

      <h2>4. Precios y formas de pago</h2>
      <ul>
        <li>Los precios se expresan en dólares estadounidenses (USD) como referencia internacional, y se abonan en pesos argentinos al tipo de cambio vigente (dólar MEP o blue, según se acuerde).</li>
        <li><strong>Contado:</strong> se abona el 100% al precio publicado.</li>
        <li><strong>Financiación:</strong> disponible en 6 cuotas con un 20% de recargo financiero sobre el precio de contado.</li>
        <li><strong>Pago anticipado:</strong> 5% de descuento adicional al abonar el 100% antes del inicio del proyecto.</li>
        <li>Los planes mensuales de agentes IA se debitan al inicio de cada período.</li>
        <li>Todas las facturas son emitidas por Yusta Labs conforme al régimen fiscal aplicable (monotributo o responsable inscripto según volumen).</li>
      </ul>

      <h2>5. Plazos de entrega</h2>
      <p>El software Aura se entrega funcionando en un plazo de <strong>2 semanas</strong> desde la firma de la propuesta y el pago inicial correspondiente. Este plazo puede extenderse si:</p>
      <ul>
        <li>El Cliente no proporciona los datos iniciales a tiempo.</li>
        <li>Se agregan funcionalidades personalizadas no incluidas en la propuesta original.</li>
        <li>Existen retrasos técnicos por parte de proveedores externos (Meta, Anthropic, Google, Mercado Pago).</li>
      </ul>

      <h2>6. Garantía y devoluciones</h2>
      <p>Yusta Labs ofrece una <strong>garantía de reembolso total de 30 días</strong> sobre el pago único del software, contados desde la entrega. Para conocer los alcances, exclusiones y procedimiento, ver la página <a href="/garantia" style="color:var(--gold);">Garantía</a>.</p>

      <h2>7. Soporte y mantenimiento</h2>
      <ul>
        <li>El primer año de soporte y hosting está incluido en el pago único del software.</li>
        <li>A partir del segundo año, el mantenimiento es opcional: USD 30/mes plan básico o USD 70/mes con 3 horas de desarrollo mensuales.</li>
        <li>El soporte se brinda en horario hábil (Lun–Vie 9:00 a 19:00 hs ART) por WhatsApp, email o videollamada.</li>
      </ul>

      <h2>8. Obligaciones del Cliente</h2>
      <ul>
        <li>Proporcionar información veraz al momento de la contratación.</li>
        <li>Cargar datos iniciales (productos, clientes, etc.) en los plazos acordados.</li>
        <li>Utilizar el software exclusivamente para fines lícitos.</li>
        <li>No intentar acceder, copiar o redistribuir el código fuente.</li>
        <li>Pagar puntualmente las suscripciones mensuales contratadas.</li>
        <li>Respetar las políticas de uso de las integraciones (WhatsApp Business, Mercado Pago, AFIP, etc.).</li>
      </ul>

      <h2>9. Obligaciones de Yusta Labs</h2>
      <ul>
        <li>Entregar el software funcional en los plazos acordados.</li>
        <li>Brindar soporte conforme al plan contratado.</li>
        <li>Mantener la confidencialidad absoluta sobre los datos del Cliente.</li>
        <li>Realizar backups diarios automáticos de la información del Cliente (cuando el hosting sea en Yusta Cloud).</li>
        <li>Notificar con 30 días de anticipación cualquier cambio sustancial en las condiciones del servicio.</li>
      </ul>

      <h2>10. Limitación de responsabilidad</h2>
      <p>Yusta Labs no será responsable por:</p>
      <ul>
        <li>Pérdidas económicas derivadas de interrupciones menores del servicio (por ejemplo, caídas de Firebase, WhatsApp o Mercado Pago).</li>
        <li>Daños indirectos, lucro cesante o pérdida de oportunidades comerciales.</li>
        <li>Mal uso del software por parte del Cliente o sus empleados.</li>
        <li>Decisiones comerciales tomadas en base a reportes del sistema.</li>
      </ul>
      <p>La responsabilidad máxima de Yusta Labs ante cualquier reclamo se limita al monto efectivamente pagado por el Cliente en los últimos 12 meses.</p>

      <h2>11. Propiedad intelectual</h2>
      <p>Todo el código base, diseños, marcas, logos y documentación de Aura y Yusta Labs son propiedad exclusiva de Yusta Labs. Los datos ingresados y el contenido generado por el Cliente son de su exclusiva propiedad.</p>

      <h2>12. Rescisión del contrato</h2>
      <ul>
        <li>El Cliente puede cancelar la suscripción mensual de agentes IA en cualquier momento, con efecto al final del período en curso.</li>
        <li>El pago único del software no es reembolsable pasados los 30 días de garantía.</li>
        <li>Yusta Labs puede rescindir el contrato si el Cliente incumple los Términos o realiza uso indebido del servicio, notificando con 15 días de anticipación.</li>
      </ul>

      <h2>13. Modificaciones</h2>
      <p>Yusta Labs se reserva el derecho de modificar estos Términos. Cualquier cambio será notificado por email al Cliente con al menos 30 días de anticipación. El uso continuado del servicio después de la notificación implica la aceptación de los nuevos términos.</p>

      <h2>14. Jurisdicción y ley aplicable</h2>
      <p>Estos Términos se rigen por las leyes de la República Argentina. Cualquier controversia será sometida a los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier otro fuero.</p>

      <h2>15. Datos personales</h2>
      <p>El tratamiento de datos personales se rige por nuestra <a href="/privacidad" style="color:var(--gold);">Política de Privacidad</a>, que forma parte integrante de estos Términos.</p>

      <h2>16. Contacto</h2>
      <p>Para cualquier consulta sobre estos Términos:</p>
      <ul>
        <li><strong>Email:</strong> WhatsApp: +54 11 2469-3394 (email empresarial próximamente)</li>
        <li><strong>WhatsApp:</strong> +54 11 2469-3394</li>
        <li><strong>Sitio:</strong> yustalabs.com</li>
      </ul>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Tengo una consulta sobre los términos.'
});

// ═══ POLÍTICA DE PRIVACIDAD ═════════════════════════════════════════
buildPage({
  slug: 'privacidad',
  title: 'Política de Privacidad',
  desc: 'Cómo Yusta Labs recolecta, usa y protege tus datos personales. Cumplimos con Ley 25.326 (Argentina) de Protección de Datos Personales.',
  active: '',
  extraStyle: `
    .legal{max-width:780px;margin:30px auto 0;font-size:14.5px;line-height:1.75;color:var(--text);}
    .legal h2{font-family:var(--font-display);font-size:clamp(20px,2.2vw,26px);letter-spacing:0.02em;text-transform:uppercase;color:var(--gold);margin:36px 0 12px;padding-top:24px;border-top:1px solid var(--border);}
    .legal h2:first-child{border-top:none;padding-top:0;margin-top:20px;}
    .legal h3{font-size:16px;color:var(--text);margin:24px 0 10px;font-weight:700;}
    .legal p{margin:0 0 14px;color:var(--muted);}
    .legal ul{margin:10px 0 16px;padding-left:22px;color:var(--muted);}
    .legal ul li{margin-bottom:8px;line-height:1.65;}
    .legal strong{color:var(--text);font-weight:700;}
    .legal .meta{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 18px;font-size:13px;color:var(--muted);margin-bottom:24px;}
    .legal a{color:var(--gold);}
  `,
  body: `
<section>
  <div class="wrap-narrow">
    <div class="section-eyebrow reveal">Legal</div>
    <h1 class="section-title reveal">Política de Privacidad</h1>

    <div class="legal reveal">
      <div class="meta">
        <strong>Última actualización:</strong> 20 de abril de 2026<br/>
        <strong>Responsable del tratamiento:</strong> Yusta Labs (Nicolás Yusta)<br/>
        <strong>Email:</strong> WhatsApp: +54 11 2469-3394 (email empresarial próximamente)<br/>
        <strong>WhatsApp:</strong> +54 11 2469-3394<br/>
        <strong>Marco legal:</strong> Ley 25.326 de Protección de Datos Personales (Argentina), Disp. 11/2006 de la Agencia de Acceso a la Información Pública.
      </div>

      <h2>1. Compromiso con tu privacidad</h2>
      <p>En Yusta Labs respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política explica qué datos recolectamos, cómo los usamos, con quién los compartimos (spoiler: con casi nadie) y qué derechos tenés sobre ellos.</p>

      <h2>2. Qué datos recolectamos</h2>
      <h3>2.1 Datos que nos das directamente</h3>
      <p>Cuando te comunicás con nosotros o contratás un servicio:</p>
      <ul>
        <li>Nombre, apellido, razón social</li>
        <li>Email</li>
        <li>Teléfono / WhatsApp</li>
        <li>Rubro y tamaño del negocio</li>
        <li>Dirección (solo para facturación)</li>
        <li>CUIT / DNI (solo para facturación)</li>
        <li>Datos de pago (procesados por Mercado Pago, no los almacenamos)</li>
      </ul>

      <h3>2.2 Datos que se recolectan automáticamente</h3>
      <p>Cuando visitás yustalabs.com:</p>
      <ul>
        <li>Dirección IP</li>
        <li>Tipo de navegador y dispositivo</li>
        <li>Páginas visitadas y tiempo de permanencia</li>
        <li>Fuente de tráfico (Google, Meta, referido, directo)</li>
        <li>Eventos de conversión (click en CTA, completar formulario)</li>
      </ul>
      <p>Estos datos se recolectan a través de <strong>Google Analytics 4</strong> de forma anonimizada. No identificamos usuarios individuales a menos que completen un formulario o nos contacten.</p>

      <h3>2.3 Datos del software Aura (cuando sos cliente)</h3>
      <p>Cuando usás un sistema Aura, este almacena los datos que cargás: clientes, productos, ventas, turnos, etc. <strong>Estos datos son de tu exclusiva propiedad</strong>. Yusta Labs solo los procesa para prestarte el servicio y no los comparte con nadie salvo por obligación legal.</p>

      <h2>3. Para qué usamos tus datos</h2>
      <ul>
        <li><strong>Atenderte:</strong> responder consultas, agendar demos, enviarte propuestas.</li>
        <li><strong>Prestarte el servicio:</strong> instalarte el sistema, facturarte, darte soporte.</li>
        <li><strong>Mejorar el producto:</strong> entender qué rubros tienen más demanda, qué páginas se usan más, qué se puede mejorar.</li>
        <li><strong>Cumplir obligaciones legales:</strong> facturación, declaraciones impositivas, pedidos de autoridad competente.</li>
        <li><strong>Comunicación:</strong> enviarte emails sobre novedades del sistema si sos cliente (siempre podés darte de baja).</li>
      </ul>
      <p><strong>Nunca vendemos tus datos</strong> a terceros. Nunca los usamos para marketing de productos no relacionados a Yusta Labs.</p>

      <h2>4. Con quién compartimos tus datos</h2>
      <p>Compartimos datos estrictamente necesarios con estos proveedores de servicios:</p>
      <ul>
        <li><strong>Google (Firebase, GA4, Workspace):</strong> hosting de datos del sistema, analytics del sitio, email.</li>
        <li><strong>Vercel:</strong> hosting del sitio web público.</li>
        <li><strong>Mercado Pago:</strong> procesamiento de pagos.</li>
        <li><strong>Meta (WhatsApp Business API):</strong> mensajería con tus clientes finales (solo si contratás agentes IA).</li>
        <li><strong>Anthropic (Claude AI):</strong> procesamiento de lenguaje para agentes IA (solo si contratás agentes Pro).</li>
        <li><strong>Autoridades competentes:</strong> cuando la ley lo requiera (AFIP, juzgados, etc.).</li>
      </ul>
      <p>Todos estos proveedores cumplen con estándares internacionales de protección de datos (SOC 2, ISO 27001, GDPR o equivalentes).</p>

      <h2>5. Tus derechos</h2>
      <p>Conforme a la Ley 25.326 (Argentina), tenés derecho a:</p>
      <ul>
        <li><strong>Acceso:</strong> saber qué datos tuyos tenemos.</li>
        <li><strong>Rectificación:</strong> corregir datos incorrectos.</li>
        <li><strong>Supresión:</strong> pedir que borremos tus datos (salvo los que debemos conservar por obligación legal — ej: facturas por 10 años).</li>
        <li><strong>Portabilidad:</strong> pedir una copia de tus datos en formato estándar.</li>
        <li><strong>Oposición:</strong> negarte a que usemos tus datos para marketing.</li>
      </ul>
      <p>Para ejercer cualquiera de estos derechos, escribinos a <strong>WhatsApp: +54 11 2469-3394 (email empresarial próximamente)</strong>. Respondemos en un plazo máximo de 10 días hábiles.</p>

      <p>La Agencia de Acceso a la Información Pública (Argentina) es el órgano de control en materia de protección de datos. Podés hacer reclamos directamente en <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noreferrer">argentina.gob.ar/aaip</a>.</p>

      <h2>6. Seguridad de los datos</h2>
      <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos:</p>
      <ul>
        <li>Encriptación en tránsito (HTTPS/SSL) y en reposo (Firebase encripta todos los datos).</li>
        <li>Backups automáticos diarios.</li>
        <li>Acceso restringido al código y a la infraestructura (solo Nico, fundador).</li>
        <li>Autenticación con 2FA en todos los servicios críticos.</li>
        <li>Monitoreo 24/7 de intentos de acceso indebido.</li>
      </ul>
      <p>Aunque hacemos todo lo razonable, ningún sistema es 100% inviolable. Si ocurre una brecha de seguridad que te afecte, te notificaremos dentro de las 72 horas de detectada.</p>

      <h2>7. Cookies y tecnologías similares</h2>
      <p>yustalabs.com usa cookies para:</p>
      <ul>
        <li><strong>Cookies técnicas esenciales:</strong> para que el sitio funcione (no se pueden desactivar).</li>
        <li><strong>Cookies de analítica (Google Analytics 4):</strong> para entender cómo se usa el sitio. Anonimizadas.</li>
        <li><strong>Cookies de marketing (Meta Pixel, Google Ads):</strong> solo si contratás publicidad con nosotros, para medir conversiones. Podés desactivarlas desde tu navegador.</li>
      </ul>

      <h2>8. Retención de datos</h2>
      <ul>
        <li><strong>Leads no convertidos:</strong> 24 meses desde el último contacto.</li>
        <li><strong>Clientes activos:</strong> durante toda la relación comercial.</li>
        <li><strong>Clientes inactivos:</strong> 36 meses desde la baja, salvo obligaciones legales (facturas: 10 años).</li>
        <li><strong>Logs técnicos:</strong> 12 meses.</li>
      </ul>

      <h2>9. Transferencias internacionales</h2>
      <p>Algunos de nuestros proveedores (Google, Meta, Anthropic, Vercel) están ubicados fuera de Argentina. Estas empresas cumplen con estándares internacionales de protección de datos. Al usar nuestros servicios, aceptás que tus datos puedan ser procesados en estos países.</p>

      <h2>10. Menores de edad</h2>
      <p>Yusta Labs está dirigido a personas mayores de 18 años que actúan en representación de un negocio. No recolectamos intencionalmente datos de menores. Si identificás que un menor nos proporcionó datos sin autorización, contactanos para eliminarlos.</p>

      <h2>11. Cambios en esta política</h2>
      <p>Podemos actualizar esta política para reflejar cambios en la ley o en nuestras prácticas. La fecha de última actualización figura al inicio del documento. Cambios sustanciales se notifican por email a los clientes activos con al menos 30 días de anticipación.</p>

      <h2>12. Contacto</h2>
      <p>Para consultas sobre privacidad o ejercer tus derechos:</p>
      <ul>
        <li><strong>Email:</strong> WhatsApp: +54 11 2469-3394 (email empresarial próximamente)</li>
        <li><strong>WhatsApp:</strong> +54 11 2469-3394</li>
        <li><strong>Asunto sugerido:</strong> "Consulta sobre privacidad" o "Ejercicio de derechos Ley 25.326"</li>
      </ul>
    </div>
  </div>
</section>`,
  fabMsg: 'Hola! Tengo una consulta sobre la política de privacidad.'
});

console.log('\\nAll pages built successfully.');
