// ==========================================================================
  // CONFIG — cambiá estos valores en UN solo lugar. Todo el sitio los usa
  // desde acá (WhatsApp, correo, formulario y analítica).
  // ==========================================================================
  const CONFIG = {
    WHATSAPP_NUMBER: '584241859724',          // sin "+", sin espacios
    EMAIL: 'creative.lestudio@gmail.com',

    // Poné acá tu endpoint real de Formspree o Web3Forms cuando lo tengas
    // (ej: 'https://formspree.io/f/xxxxxxx'). Mientras esto sea 'PLACEHOLDER',
    // el formulario sigue funcionando por correo (mailto) automáticamente.
    FORM_ENDPOINT: 'https://formspree.io/f/xkjnvaae',

    // Cuando conectes un asistente real por API (item pendiente), pegá acá su
    // endpoint. Mientras sea 'PLACEHOLDER', el chat de "¿Qué está frenando tu
    // negocio?" responde con una lógica simple local, por palabras clave.
    CHAT_API_ENDPOINT: 'PLACEHOLDER',

    // Pegá acá tu ID de Google Analytics 4 (ej: 'G-XXXXXXXXXX') y tu ID de
    // Meta Pixel cuando los tengas. Mientras estén vacíos, no se carga nada.
    GA_MEASUREMENT_ID: '',
    META_PIXEL_ID: ''
  };

  function waLink(number, text){
    return 'https://wa.me/' + number + (text ? ('?text=' + encodeURIComponent(text)) : '');
  }

  // Aplica el número/correo centralizados a todos los enlaces estáticos del HTML
  function applyConfig(){
    document.querySelectorAll('.js-whatsapp-link').forEach(el => {
      const msg = el.getAttribute('data-msg') || '';
      el.href = waLink(CONFIG.WHATSAPP_NUMBER, msg);
    });
    document.querySelectorAll('.js-email-text').forEach(el => {
      el.textContent = CONFIG.EMAIL;
    });
  }
  applyConfig();
  document.addEventListener('click', (e) => {
    if(e.target.closest('.js-whatsapp-link')){
      trackEvent('whatsapp_click', { page: document.title });
    }
  });

  // ---------- Analytics (se activa solo si cargaste IDs reales arriba) ----------
  function trackEvent(name, params){
    if(window.gtag) window.gtag('event', name, params || {});
    if(window.fbq) window.fbq('trackCustom', name, params || {});
  }
  (function initAnalytics(){
    if(CONFIG.GA_MEASUREMENT_ID){
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA_MEASUREMENT_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', CONFIG.GA_MEASUREMENT_ID);
    }
    if(CONFIG.META_PIXEL_ID){
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CONFIG.META_PIXEL_ID);
      window.fbq('track', 'PageView');
      /* eslint-enable */
    }
  })();

  // ---------- Marquee content (logos only, equal size & spacing) ----------
  const clients = [
    { name: "Inversiones MDS", logo: "mds" },
    { name: "Multiservicios RDR", logo: "rdr" },
    { name: "Corporación Tecnoclean", logo: "tecnoclean" },
    { name: "Decoplant", logo: "decoplant" },
    { name: "Legacy World", logo: "legacy" },
    { name: "Urbantex", logo: "urbantex" },
    { name: "HPS", logo: "hps" },
    { name: "Synergy", logo: "synergy" },
    { name: "Winners League Unimet", logo: "winners" },
  ];

  const marqueeLogos = {
        mds: "assets/marquee-mds.png",
    rdr: "assets/marquee-rdr.png",
    tecnoclean: "assets/marquee-tecnoclean.png",
    decoplant: "assets/marquee-decoplant.png",
    legacy: "assets/marquee-legacy.png",
    urbantex: "assets/marquee-urbantex.png",
    hps: "assets/marquee-hps.png",
    synergy: "assets/marquee-synergy.png",
    winners: "assets/marquee-winners.png"
  };

  function renderMarqueeSet(containerId){
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = clients.map(c => `
      <div class="flex items-center justify-center shrink-0 w-40 h-10">
        <img src="${marqueeLogos[c.logo]}" alt="${c.name}" class="max-h-8 max-w-[130px] w-auto object-contain opacity-80" />
      </div>
    `).join("");
  }
  renderMarqueeSet('marquee-a');
  renderMarqueeSet('marquee-b');

  // ---------- Draggable auto-scroll marquee (logos + portfolio) ----------
  // Auto-scrolls continuously, pauses on hover, and can be grabbed/dragged
  // (mouse or touch) so people can browse at their own pace and find something
  // specific instead of only watching it slide by.
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initDragMarquee(wrapId, trackId, speed){
    const wrap = document.getElementById(wrapId);
    const track = document.getElementById(trackId);
    if(!wrap || !track) return;

    let offset = 0;
    let halfWidth = track.scrollWidth / 2;
    let isDragging = false;
    let isHovering = false;
    let startX = 0;
    let startOffset = 0;
    let moved = false;

    function refreshHalfWidth(){ halfWidth = track.scrollWidth / 2 || 1; }
    window.addEventListener('resize', refreshHalfWidth);
    // Content is rendered async in some cases; recheck shortly after init.
    setTimeout(refreshHalfWidth, 300);

    function normalize(){
      if(halfWidth <= 0) return;
      while(offset <= -halfWidth) offset += halfWidth;
      while(offset > 0) offset -= halfWidth;
    }

    function tick(){
      if(!isDragging && !isHovering && !prefersReducedMotion){
        offset -= speed;
        normalize();
      }
      track.style.transform = 'translateX(' + offset + 'px)';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    wrap.addEventListener('mouseenter', () => { isHovering = true; });
    wrap.addEventListener('mouseleave', () => { isHovering = false; });

    function dragStart(clientX){
      isDragging = true;
      moved = false;
      startX = clientX;
      startOffset = offset;
      wrap.classList.add('dragging');
    }
    function dragMove(clientX){
      if(!isDragging) return;
      const dx = clientX - startX;
      if(Math.abs(dx) > 4) moved = true;
      offset = startOffset + dx;
      normalize();
    }
    function dragEnd(){
      isDragging = false;
      wrap.classList.remove('dragging');
    }

    wrap.addEventListener('pointerdown', (e) => { dragStart(e.clientX); });
    window.addEventListener('pointermove', (e) => { dragMove(e.clientX); });
    window.addEventListener('pointerup', dragEnd);
    wrap.addEventListener('pointerleave', () => { if(!isDragging) isHovering = false; });

    // If the user actually dragged (not just clicked), swallow the click so it
    // doesn't also trigger the card's onclick navigation underneath the pointer.
    wrap.addEventListener('click', (e) => {
      if(moved){ e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);
  }
  initDragMarquee('logos-marquee-wrap', 'logos-marquee-track', 0.5);

  // ---------- Portfolio (color logos + real descriptions) ----------
  // ---------- Reseñas reales de clientes ----------
  const reviews = [
    { quote: 'Muy eficiente, capturó a la perfección la esencia de marca que buscábamos', name: 'Diana Patiño', role: 'Fundadora', company: 'Suministros Daponte, C.A / Decoplant', rating: 5 , serviceLabel: 'Brand & Design' },
    { quote: 'Excelente trabajo, muy creativos y los recomendaria 100%', name: 'Jhonny Civitillo', role: 'Fundador, CEO', company: 'HPS', rating: 5 , serviceLabel: 'Brand & Design' },
    { quote: 'Un servicio bastante profesional y responsable', name: 'Andrés Roa', role: 'Gerente', company: 'Multiservicios RDR78', rating: 5 , serviceLabel: 'Brand & Design' },
    { quote: 'Muy buena la experiencia', name: 'Miguel Sanchis', role: 'Vice presidente', company: 'Winners League Unimet', rating: 5 , serviceLabel: 'Brand & Design' }
  ];

  const testimonials = {
    'brand-design': { quote: 'Muy eficiente, capturó a la perfección la esencia de marca que buscábamos', name: 'Diana Patiño', company: 'Suministros Daponte, C.A / Decoplant · Fundadora' }
  };

  // ---------- Projects (real case studies, interconnected with services & portfolio) ----------
  const projects = {
    'legacy-podcast': {
      name: 'Legacy Podcast',
      client: 'Legacy World',
      badge: 'legacy',
      tags: ['Content Production'],
      service: 'content-production',
      embedType: 'youtube',
      videoId: 'i-frSRSTsq8',
      embedUrl: 'https://www.youtube.com/embed/i-frSRSTsq8',
      linkUrl: 'https://youtu.be/i-frSRSTsq8',
      challenge: 'Legacy World quería lanzar un podcast propio, pero necesitaba algo más que una cámara y un micrófono: necesitaba un concepto, una estructura y una dirección de arte que representaran a la marca desde el primer episodio.',
      solution: 'Dirigimos y producimos el podcast de punta a punta: definimos el concepto, el guion y la estructura de cada episodio, desarrollamos la dirección de arte, y nos encargamos de la producción y postproducción completa del contenido. Marcelo Leal condujo el programa como entrevistador, y hoy el podcast se distribuye y comercializa en YouTube, TikTok e Instagram.',
      result: '35.000 reproducciones orgánicas en el primer episodio, sin pauta paga.',
    },
    'legacy-world-web': {
      name: 'Legacy World — Sitio Web',
      client: 'Legacy World',
      badge: 'legacy',
      tags: ['Web & Digital Development'],
      service: 'web-development',
      embedType: 'link',
      linkUrl: 'https://legacy-world.com',
      linkLabel: 'Ver legacy-world.com',
      challenge: 'Legacy World necesitaba una tienda online propia, capaz de vender a nivel nacional e internacional, con un checkout confiable y sin depender de intermediarios para procesar pagos.',
      solution: 'Diseñamos y desarrollamos el sitio completo desde cero: diseño de la tienda, arquitectura de producto y checkout con Shopify Payments integrado. Además, sumamos un botón de "completar compra por WhatsApp" directo en el carrito, porque para nuestros clientes ese canal genera más confianza que un checkout 100% automático.',
      result: 'Hoy legacy-world.com vende a nivel nacional e internacional (con descuento por pagos en divisas y envío gratis dentro de Venezuela), con un checkout totalmente autogestionado y un canal directo por WhatsApp para quienes prefieren cerrar la compra hablando con alguien.',
    },
    'decoplant-branding': {
      name: 'Decoplant — Branding',
      client: 'Decoplant',
      badge: 'decoplant',
      tags: ['Brand & Design'],
      service: 'brand-design',
      embedType: 'behance',
      embedUrl: 'https://www.behance.net/embed/project/218332771?ilo0=1',
      linkUrl: 'https://www.behance.net/gallery/218332771/DECOPLANT-Branding',
      challenge: 'Decoplant necesitaba una identidad capaz de representar dos líneas de negocio a la vez —decoración y plantas artificiales— sin que la marca se sintiera dividida ni genérica en ninguna de las dos.',
      solution: 'Desarrollamos el naming y la identidad visual completa de Decoplant, construyendo un sistema de marca coherente desde cero que funciona igual de bien para ambas líneas de negocio.',
      testimonial: { quote: 'Muy eficiente, capturó a la perfección la esencia de marca que buscábamos', name: 'Diana Patiño', role: 'Fundadora', company: 'Suministros Daponte, C.A / Decoplant', rating: 5 }
    },
    'mds-redes': {
      name: 'Inversiones MDS — Redes',
      client: 'Inversiones MDS',
      badge: 'mds',
      tags: ['Social Media'],
      service: 'social-media',
      embedType: 'instagram',
      linkUrl: 'https://www.instagram.com/inversiones.mds/',
      challenge: 'Inversiones MDS necesitaba algo más que seguidores: buscaba construir, a través de su Instagram, una audiencia real con potencial de convertirse en clientes.',
      solution: 'Gestionamos la presencia en redes sociales de Inversiones MDS: estrategia, calendario editorial y gestión diaria de su comunidad, con el objetivo puesto en la calidad de la audiencia, no solo en el volumen.',
      result: 'Hoy Inversiones MDS es una de las marcas más recordadas de su sector y con mejor presencia en redes, y su Instagram se convirtió en un generador constante de leads orgánicos.',
    },
    'mds-contenido': {
      name: 'Inversiones MDS — Contenido',
      client: 'Inversiones MDS',
      badge: 'mds',
      tags: ['Content Production'],
      service: 'content-production',
      embedType: 'reels',
      reelLinks: [
        'https://www.instagram.com/reel/DXNjjeQiOVK/',
        'https://www.instagram.com/reel/DcCOq3bMTae/',
        'https://www.instagram.com/reel/DYQbxXGIRS3/'
      ],
      solution: 'Producimos y editamos contenido en video para Inversiones MDS, pensado específicamente para reforzar su presencia como marca de referencia en el sector de diagnóstico médico.',
    },
    'rdr-identidad': {
      testimonial: { quote: 'Un servicio bastante profesional y responsable', name: 'Andrés Roa', role: 'Gerente', company: 'Multiservicios RDR78', rating: 5 },
      name: 'Multiservicios RDR — Identidad Visual',
      client: 'Multiservicios RDR',
      badge: 'rdr',
      tags: ['Brand & Design'],
      service: 'brand-design',
      embedType: 'behance',
      embedUrl: 'https://www.behance.net/embed/project/218334897?ilo0=1',
      linkUrl: 'https://www.behance.net/gallery/218334897/RDR-Identidad-Visual',
      solution: 'Desarrollamos la identidad visual completa de Multiservicios RDR, construyendo un sistema de marca claro y aplicable a todos sus puntos de contacto.',
    },
    'tecnoclean-identidad': {
      name: 'Corporación Tecnoclean — Identidad Visual',
      client: 'Corporación Tecnoclean',
      badge: 'tecnoclean',
      tags: ['Brand & Design'],
      service: 'brand-design',
      embedType: 'behance',
      embedUrl: 'https://www.behance.net/embed/project/218332217?ilo0=1',
      linkUrl: 'https://www.behance.net/gallery/218332217/Tecnoclean-Identidad-visual',
      solution: 'Desarrollamos la identidad visual completa de Corporación Tecnoclean: logotipo, paleta de colores, tipografías y sistema de marca aplicado a sus distintos materiales.',
    },
    'urbantex-identidad': {
      name: 'Urbantex — Identidad Visual',
      client: 'Urbantex',
      badge: 'urbantex',
      tags: ['Brand & Design'],
      service: 'brand-design',
      embedType: 'behance',
      embedUrl: 'https://www.behance.net/embed/project/173188679?ilo0=1',
      linkUrl: 'https://www.behance.net/gallery/173188679/URBANTEX-Identidad-Visual',
      solution: 'Desarrollamos la identidad visual completa de Urbantex, construyendo un sistema de marca sólido para todos sus materiales y puntos de contacto.',
    },
    'urbantex-contenido': {
      name: 'Urbantex — Contenido',
      client: 'Urbantex',
      badge: 'urbantex',
      tags: ['Content Production'],
      service: 'content-production',
      embedType: 'reels',
      reelLinks: [
        'https://www.instagram.com/reel/CqjfKgUDEh5/',
        'https://www.instagram.com/reel/CqovtDTLwdJ/',
        'https://www.instagram.com/reel/CqtYf3SLfgM/'
      ],
      solution: 'Producimos y editamos contenido en video para Urbantex, reforzando su identidad ya trabajada con piezas audiovisuales pensadas para redes.',
    },
    'synergy-fichas': {
      name: 'Synergy — Fichas de Producción',
      client: 'Synergy',
      badge: 'synergy',
      tags: ['Brand & Design'],
      service: 'brand-design',
      embedType: 'behance',
      embedUrl: 'https://www.behance.net/embed/project/173188451?ilo0=1',
      linkUrl: 'https://www.behance.net/gallery/173188451/Synergy-Store-Ficha-de-produccion',
      solution: 'Para Synergy trabajamos diseño gráfico, fichas técnicas de producción y dirección creativa para sus campañas, incluyendo el diseño de fichas técnicas que hoy forma parte de nuestro portafolio público en Behance.',
    },
    'hps-asesoria': {
      testimonial: { quote: 'Excelente trabajo, muy creativos y los recomendaria 100%', name: 'Jhonny Civitillo', role: 'Fundador, CEO', company: 'HPS', rating: 5 },
      name: 'HPS — Asesoría de Marca',
      client: 'HPS',
      badge: 'hps',
      tags: ['Brand & Design'],
      service: 'brand-design',
      challenge: 'HPS necesitaba una mirada externa sobre su marca: cómo se estaba comunicando, por dónde estaba captando clientes, y qué le faltaba para fortalecer su presencia a largo plazo.',
      solution: 'Hicimos una auditoría completa de sus canales de comunicación y conversión, y entregamos un plan de recomendaciones: sumar un canal de adquisición orgánico que complemente la pauta paga, crear un canal en Instagram dedicado al mantenimiento de comunidad, y desarrollar un sitio tipo e-commerce para fortalecer su canal de ventas propio. También trabajamos recomendaciones de marca más amplias: segmentación de marca, y cómo comunicarse y presentarse a través de sus empaques, etiquetas y labels.',
      result: 'Un plan de marca claro y accionable, con prioridades definidas para que HPS supiera exactamente qué resolver primero.',
    },
    'winners-producto': {
      testimonial: { quote: 'Muy buena la experiencia', name: 'Miguel Sanchis', role: 'Vice presidente', company: 'Winners League Unimet', rating: 5 },
      name: 'Winners League Unimet — Indumentaria',
      client: 'Winners League Unimet',
      badge: 'winners',
      tags: ['Brand & Design'],
      service: 'brand-design',
      challenge: 'La liga de fútbol 7 amateur de la Universidad Metropolitana necesitaba equipar a todos sus equipos con uniformes propios, con identidad de liga y buena calidad de producción, en volumen.',
      solution: 'Diseñamos y desarrollamos la indumentaria completa de la liga: más de 200 uniformes deportivos (short + franela) producidos para los equipos participantes.',
      result: 'Más de 200 uniformes entregados, vistiendo a toda la liga con una identidad visual consistente.',
    }
  };


  const portfolioBadges = {
        mds: "assets/badge-mds.png",
    rdr: "assets/badge-rdr.png",
    tecnoclean: "assets/badge-tecnoclean.png",
    decoplant: "assets/badge-decoplant.png",
    legacy: "assets/badge-legacy.png",
    urbantex: "assets/badge-urbantex.png",
    hps: "assets/badge-hps.png",
    synergy: "assets/badge-synergy.png",
    winners: "assets/badge-winners.png"
  };
  // One tile per CLIENT, not per project — clients with multiple projects (like
  // Legacy World) still get grouped into a single portfolio entry, with all their
  // project tags combined. Clicking opens the first project; a tab switcher inside
  // lets people flip to the sibling project(s).
  function getUniqueClientEntries(){
    const seen = [];
    const bySlug = {};
    Object.keys(projects).forEach(slug => {
      const p = projects[slug];
      let entry = bySlug[p.client];
      if(!entry){
        entry = { slug, client: p.client, badge: p.badge, tags: [] };
        bySlug[p.client] = entry;
        seen.push(entry);
      }
      p.tags.forEach(t => { if(!entry.tags.includes(t)) entry.tags.push(t); });
    });
    return seen;
  }

  function renderHomePortfolioMarquee(){
    if(!document.getElementById('portfolio-marquee-a')) return;
    const entries = getUniqueClientEntries();
    const cardHTML = entries.map(entry => `
        <button onclick="showProject('${entry.slug}')" class="glass hover-lift rounded-2xl overflow-hidden text-left flex flex-col shrink-0 w-64">
          <div class="aspect-video">
            <img src="${portfolioBadges[entry.badge]}" alt="${entry.client}" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="font-display text-base mb-1">${entry.client}</h3>
            <p class="text-white/50 text-[12px]">${entry.tags.join(', ')}</p>
          </div>
        </button>`).join('');
    document.getElementById('portfolio-marquee-a').innerHTML = cardHTML;
    document.getElementById('portfolio-marquee-b').innerHTML = cardHTML;
  }
  renderHomePortfolioMarquee();
  initDragMarquee('portfolio-marquee-wrap', 'portfolio-marquee-track', 0.4);

  // ---------- Testimonials, sourced directly from real project data ----------
  function starsHTML(count){
    return '<div class="flex gap-1 mb-5" aria-label="' + count + ' de 5 estrellas">' +
      '<svg class="star" width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6z"/></svg>'.repeat(count) +
      '</div>';
  }

  function testimonialCardHTML(t, extraClass){
    const nameLine = t.name ? t.name : t.role;
    const roleLine = t.name ? (t.role + ', ' + t.company) : t.company;
    return `
      <div class="glass rounded-2xl p-8 flex flex-col ${extraClass || ''}">
        ${starsHTML(t.rating || 5)}
        <p class="text-white/75 leading-relaxed mb-6">"${t.quote}"</p>
        <div class="mt-auto">
          <p class="font-medium text-white text-sm">${nameLine}</p>
          <p class="text-white/45 text-xs mt-0.5">${roleLine}</p>
          <p class="text-white/35 text-[11px] mt-2 uppercase tracking-wide">${t.serviceLabel}</p>
        </div>
      </div>`;
  }

  function renderTestimonials(){
    if(!document.getElementById('testimonials-static-grid')) return;
    const list = reviews.slice();

    const staticGrid = document.getElementById('testimonials-static-grid');
    const marqueeWrap = document.getElementById('testimonials-marquee-wrap');

    if(list.length <= 4){
      staticGrid.classList.remove('hidden');
      staticGrid.innerHTML = list.map(t => testimonialCardHTML(t)).join('');
      marqueeWrap.classList.add('hidden');
    } else {
      staticGrid.classList.add('hidden');
      marqueeWrap.classList.remove('hidden');
      const cardHTML = list.map(t => testimonialCardHTML(t, 'w-80 shrink-0')).join('');
      document.getElementById('testimonials-marquee-a').innerHTML = cardHTML;
      document.getElementById('testimonials-marquee-b').innerHTML = cardHTML;
      initDragMarquee('testimonials-marquee-wrap', 'testimonials-marquee-track', 0.35);
    }
  }

  // ---------- Pricing data ----------
  const pricingPlans = {
    identidad: [
      { name: 'Identidad visual', items: [
        { label: 'Análisis de rubro', on: false },
        { label: 'Análisis de competencias', on: false },
        { label: 'Naming', on: false },
        { label: 'Logotipo y versiones', on: true },
        { label: 'Tipografías', on: true },
        { label: 'Paleta de colores', on: true },
        { label: 'Iconografía', on: false },
        { label: 'Recursos gráficos', on: false },
        { label: 'Papelería corporativa (básico)', on: false },
        { label: 'Manual de marca (básico)', on: true },
      ]},
      { name: 'Identidad corporativa', items: [
        { label: 'Análisis de rubro', on: false },
        { label: 'Análisis de competencias', on: true },
        { label: 'Naming', on: false },
        { label: 'Logotipo y versiones', on: true },
        { label: 'Tipografías', on: true },
        { label: 'Paleta de colores', on: true },
        { label: 'Iconografía (básico)', on: true },
        { label: 'Recursos gráficos', on: false },
        { label: 'Papelería corporativa (básico)', on: false },
        { label: 'Manual de marca (básico)', on: true },
      ]},
      { name: 'Identidad completa', items: [
        { label: 'Análisis de rubro', on: true },
        { label: 'Análisis de competencias', on: true },
        { label: 'Naming', on: true },
        { label: 'Logotipo y versiones', on: true },
        { label: 'Tipografías', on: true },
        { label: 'Paleta de colores', on: true },
        { label: 'Iconografía (avanzada)', on: true },
        { label: 'Recursos gráficos', on: true },
        { label: 'Papelería corporativa (media)', on: true },
        { label: 'Manual de marca (avanzado)', on: true },
      ]},
    ],
    social: [
      { n: '01', name: 'Starter', price: { amount: '250 €', unit: '· 30 días' }, tagline: 'Plan de entrada para probar el servicio.', lead: 'Pensado como plan de entrada para probar el servicio.',
        items: ['Auditoría inicial del perfil','Optimización básica','Planificación mensual','Calendario de contenido','Dirección visual básica','Guiones/copies básicos','Diseño y adaptación de piezas','6–8 piezas de contenido','2 reels sencillos','Stories','Publicación/programación','Retoque fotográfico básico','Reporte final del mes'],
        note: 'No incluye: community management continuo, ads, influencers ni estrategia avanzada. Disponible una sola vez por cliente.' },
      { n: '02', name: 'Essential', price: { amount: '400 €', unit: '/mes' }, tagline: 'Para delegar la gestión habitual de tus redes.', lead: 'Para negocios que quieren delegar la gestión habitual de sus redes.',
        items: ['Estrategia mensual de contenido','Planificación y calendario','Dirección creativa de contenido','Definición de líneas visuales y temáticas','Guiones y copywriting','8–12 piezas principales al mes','Reels','Stories','Diseño gráfico','Retoque fotográfico','Publicación y programación','Community management básico','Optimización continua del perfil','Informe mensual','Reunión mensual'],
        note: 'Incluye dirección creativa, centrada principalmente en cómo se comunica la marca en redes.' },
      { n: '03', name: 'Growth', price: { amount: '750 €', unit: '/mes' }, tagline: 'Redes como herramienta de crecimiento y adquisición.', lead: 'Para negocios que quieren utilizar redes como herramienta de crecimiento y adquisición.', includes: 'Incluye todo Essential +',
        items: ['Dirección creativa estratégica','Conceptos de campaña','Desarrollo de narrativas y líneas de comunicación','Mayor producción de contenido','Estrategia de crecimiento','Gestión de Meta Ads o Google Ads','Creatividades publicitarias','Segmentación y optimización de campañas','Influencer / creator outreach','Análisis de competencia','Identificación de oportunidades y tendencias','Reporting avanzado','Seguimiento de leads, clics y conversiones cuando sea posible','Reunión estratégica mensual'],
        note: 'Inversión publicitaria e influencers no incluidos.' },
      { n: '04', name: 'Scale', price: { amount: '1.200 €', unit: '/mes' }, tagline: 'Para delegar gran parte de tu ecosistema digital.', lead: 'Para negocios que quieren delegar gran parte de su ecosistema digital.', includes: 'Incluye todo Growth +',
        items: ['Dirección creativa integral de marca digital','Estrategia multicanal','Meta Ads','Google Ads','Influencer Marketing','Google Business Profile','Campañas y lanzamientos','Estrategia promocional','Coordinación entre redes, web, anuncios y presencia local','Revisión de conversión web','Recomendaciones de landing pages, funnels y CTA','Reporting orientado a negocio','Consultoría estratégica','Mayor disponibilidad y seguimiento','Reuniones estratégicas periódicas'],
        note: 'Producción audiovisual profesional, inversión publicitaria, influencers y desarrollos web importantes se presupuestan aparte.' },
    ],
    web: [
      { n: '01', name: 'Starter', tagline: 'Presencia y captación.', lead: 'Para negocios que necesitan una presencia digital profesional y convertir visitas en contactos.',
        items: ['Portfolio, servicios o presentación del negocio','Formularios de contacto o solicitud de cotización','Contacto directo por WhatsApp','Diseño responsive y optimización para móvil','SEO técnico básico y configuración esencial'] },
      { n: '02', name: 'Business', tagline: 'Procesos automatizados.', lead: 'Para negocios que quieren automatizar consultas, comandas, reservas o solicitudes sin procesar pagos.',
        items: ['Todo lo esencial del plan Starter','Formularios avanzados con lógica de pedido o reserva','Comandas automáticas por WhatsApp o correo','Cálculo de productos, extras o cantidades cuando aplique','Confirmaciones y automatizaciones básicas'] },
      { n: '03', name: 'E-commerce', tagline: 'Pedidos + pagos.', lead: 'Para negocios que tramitan pedidos y pagos directamente desde su web mediante una pasarela de pago segura.',
        items: ['Catálogo, carrito y checkout','Pasarela de pago','Tarjeta, Apple Pay y Google Pay cuando la plataforma lo permita','Confirmaciones automáticas de pedido y pago','Backend, webhooks y medidas de seguridad cuando sean necesarios','Gestión básica de pedidos'] },
      { n: '04', name: 'Commerce Integration', cta: 'Solicitar presupuesto', tagline: 'Ecosistema conectado. Según presupuesto.', lead: 'Para negocios que necesitan que la web forme parte de su ecosistema de ventas y operación. Se cotiza según presupuesto.',
        items: ['Pedidos y pagos conectados con sistemas internos','Integración con TPV / POS','APIs, webhooks y automatizaciones avanzadas','Flujos multilocal cuando sea necesario','Sincronización con stock, CRM, ERP u otras herramientas','Arquitectura técnica adaptada al negocio'] },
    ],
  };

  const pricingLabels = { identidad: 'Identidad Visual', social: 'Social Media', web: 'Desarrollo Web' };
  const pricingServiceValue = { identidad: 'Brand & Design', social: 'Social Media', web: 'Web & Digital Development' };

  const pricingMeta = {
    social: {
      title: 'Un plan para cada etapa de tu marca',
      intro: 'Desde probar el servicio hasta delegar gran parte de tu ecosistema digital. Elegimos el nivel según lo que tu negocio necesita conseguir en redes.',
      notice: { tag: 'Desde', text: 'Los importes indicados son precios desde. El presupuesto final se ajusta a lo que tu negocio necesita conseguir.' },
      how: { title: 'Cómo elegimos el plan', rows: [
        ['Starter', 'Una primera toma de contacto para probar el servicio, disponible una sola vez por cliente.'],
        ['Essential', 'Gestión habitual de las redes, con dirección creativa centrada en cómo se comunica la marca.'],
        ['Growth', 'Se pasa de dirigir contenido a dirigir campañas orientadas al crecimiento.'],
        ['Scale', 'Dirección integral de la marca digital, coordinando redes, web, anuncios y presencia local.'] ] }
    },
    web: {
      title: 'Webs que hacen más por tu negocio',
      intro: 'Desde presencia digital hasta sistemas conectados con tu operativa. Elegimos el nivel según lo que realmente necesita tu negocio.',
      notice: { tag: 'Importante', text: 'El presupuesto final depende del alcance, volumen de contenido, funcionalidades, integraciones, plataforma y necesidades técnicas de cada proyecto.' },
      how: { title: 'Cómo elegimos el plan', text: 'El plan no depende de cuántas páginas tenga la web, sino de lo que debe hacer: mostrar, captar, automatizar, cobrar o integrarse con los sistemas del negocio.' },
      recurrence: { title: 'Recurrencia · Web Care', groups: [
        { items: [['Web Care Starter', 'Para webs de presencia y captación.'], ['Web Care Business', 'Para webs con procesos automatizados.']],
          note: 'Incluye soporte técnico, actualizaciones, supervisión, pequeñas modificaciones y mantenimiento operativo según el alcance contratado.' },
        { items: [['Web Care Commerce', 'Para tiendas online con pedidos y pagos.'], ['Web Care Integration', 'Para webs integradas con sistemas internos.']],
          note: 'La cuota final depende de infraestructura, integraciones, volumen de cambios y nivel de soporte requerido.' } ] },
      priority: { tag: 'Priority · Soporte 24/7', title: 'Soporte técnico y atención al cliente 24/7.', text: 'Se cotiza según el nivel de cobertura, criticidad y tiempos de respuesta requeridos.' },
      extras: { title: 'Completa la solución', intro: 'Los siguientes servicios no están incluidos de forma automática en los planes de desarrollo. Se añaden únicamente cuando el proyecto los necesita y se presupuestan por separado.',
        items: [
          ['Fotografía profesional', 'Sesión y producción fotográfica para producto, espacio, equipo o carta.'],
          ['Retoque & dirección visual', 'Optimización y homogeneización de fotografías actuales mediante retoque profesional, diseño y herramientas avanzadas.'],
          ['Google Business Profile', 'Optimización de ficha, categorías, información, imágenes y presencia local.'],
          ['SEO · GEO · AEO', 'Posicionamiento en buscadores, motores generativos y sistemas de respuesta.'],
          ['Arquitectura visual de marca', 'Sistema visual, criterios de aplicación, tipografía, color y dirección gráfica para construir una presencia coherente.'],
          ['Otras necesidades', 'Copywriting, automatizaciones, integraciones, analítica, idiomas, migraciones, funcionalidades personalizadas y más.'] ] },
      closing: { title: 'Cada proyecto se cotiza según su alcance real.', text: 'Antes de comenzar, definimos funcionalidades, contenidos, integraciones y necesidades para presentar un presupuesto cerrado del proyecto concreto.' }
    }
  };

  const CHECK_SVG = '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" class="mt-0.5 shrink-0"><path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const qAttr = (msg, svc) => `onclick='openContactForm(${JSON.stringify(msg)}, ${JSON.stringify(svc)}, "quote")'`;

  function renderServicePricing(category){
    const container = document.getElementById('sd-pricing');
    if(!container) return;
    if(!category || !pricingPlans[category]){ container.innerHTML = ''; return; }
    const plans = pricingPlans[category];
    const meta = pricingMeta[category];
    const svcValue = pricingServiceValue[category];

    const cards = plans.map(plan => {
      const quoteMsg = 'Hola, quiero solicitar presupuesto para el plan ' + plan.name + ' (' + pricingLabels[category] + ').';
      const items = plan.items.map(raw => (typeof raw === 'string') ? { label: raw, on: true } : raw);
      return `
      <div class="glass rounded-3xl p-8 flex flex-col">
        ${plan.n ? `<p class="text-[11px] tracking-[0.18em] uppercase text-white/40 mb-3">${plan.n} · ${plan.name}</p>` : ''}
        <h3 class="font-display text-2xl mb-2">${plan.name}</h3>
        ${plan.price ? `<p class="mb-3"><span class="text-xs text-white/45 mr-1.5">Desde</span><span class="font-display text-3xl">${plan.price.amount}</span> <span class="text-white/50 text-sm">${plan.price.unit}</span></p>` : ''}
        ${plan.tagline ? `<p class="text-white/60 text-[14px] leading-relaxed mb-1">${plan.tagline}</p>` : ''}
        ${plan.lead ? `<p class="text-white/45 text-[13px] leading-relaxed mb-5">${plan.lead}</p>` : '<div class="mb-4"></div>'}
        ${plan.includes ? `<p class="text-[11px] tracking-[0.16em] uppercase text-white/55 mb-3">${plan.includes}</p>` : (plan.lead ? '<p class="text-[11px] tracking-[0.16em] uppercase text-white/55 mb-3">Incluye</p>' : '')}
        <ul class="space-y-3 mb-6 flex-1">
          ${items.map(it => `
            <li class="flex items-start gap-2.5 text-[14px] leading-snug ${it.on ? 'text-white/80' : 'text-white/25'}">
              ${it.on ? CHECK_SVG : '<span class="mt-[9px] w-2.5 h-px bg-white/20 shrink-0"></span>'}
              <span>${it.label}</span>
            </li>`).join('')}
        </ul>
        ${plan.note ? `<p class="text-white/55 text-[13px] leading-relaxed border-t border-white/10 pt-4 mb-6">${plan.note}</p>` : ''}
        <button ${qAttr(quoteMsg, svcValue)} class="btn-primary text-center font-semibold px-6 py-3 rounded-full text-sm">${plan.cta || 'Hablar sobre este plan'}</button>
      </div>`;
    }).join('');

    const customCard = `
      <div class="glass rounded-3xl p-8 flex flex-col border-dashed ${meta ? 'md:col-span-2' : ''}">
        <h3 class="font-display text-2xl mb-3">Plan personalizado</h3>
        <p class="text-white/55 text-[14px] leading-relaxed mb-8 flex-1">Elige exactamente lo que tu marca necesita. Armas tu selección y completas tus datos para que te respondamos con una propuesta a medida.</p>
        <button onclick="openCustomPlan('${category}')" class="btn-ghost text-center font-semibold px-6 py-3 rounded-full text-sm">Crear plan personalizado</button>
      </div>`;

    const gridCls = meta ? 'grid md:grid-cols-2 gap-5' : 'grid md:grid-cols-2 lg:grid-cols-4 gap-5';
    let html = `
      <div class="py-16 md:py-20 border-t border-white/10">
        <h2 class="font-display text-3xl md:text-4xl mb-3">${meta ? meta.title : 'Planes de ' + pricingLabels[category]}</h2>
        <p class="text-white/55 mb-8 max-w-2xl">${meta ? meta.intro : 'Elige el nivel de acompañamiento que tu marca necesita hoy, o arma tu propio plan a medida.'}</p>
        ${meta && meta.notice ? `<div class="glass rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4"><span class="btn-primary text-sm font-semibold px-4 py-2 rounded-full self-start">${meta.notice.tag}</span><p class="text-white/65 text-[14px] leading-relaxed">${meta.notice.text}</p></div>` : ''}
        <div class="${gridCls}">${cards}${customCard}</div>
      </div>`;

    if(meta && meta.how){
      const how = meta.how;
      html += `
      <div class="pb-16 md:pb-20">
        <h3 class="font-display text-2xl mb-5">${how.title}</h3>
        <div class="glass rounded-3xl p-6 md:p-8">
          ${how.rows ? how.rows.map((r, i) => `<div class="grid md:grid-cols-[160px_1fr] gap-1 md:gap-6 py-4 ${i ? 'border-t border-white/10' : ''}"><span class="font-semibold text-sm tracking-wider uppercase">${r[0]}</span><span class="text-white/70 text-[15px] leading-relaxed">${r[1]}</span></div>`).join('') : `<p class="text-white/70 text-[15px] leading-relaxed">${how.text}</p>`}
        </div>
      </div>`;
    }

    if(meta && meta.recurrence){
      const rec = meta.recurrence;
      html += `
      <div class="pb-16 md:pb-20 border-t border-white/10 pt-16 md:pt-20">
        <h3 class="font-display text-3xl mb-8">${rec.title}</h3>
        <div class="space-y-6">
          ${rec.groups.map(g => `
            <div>
              <div class="grid md:grid-cols-2 gap-5">${g.items.map(it => `
                <div class="glass rounded-2xl p-6 flex flex-col gap-4 justify-between">
                  <div><p class="text-[11px] tracking-[0.18em] uppercase text-white/40 mb-2">Web Care</p><h4 class="font-display text-xl mb-1">${it[0]}</h4><p class="text-white/60 text-[14px]">${it[1]}</p></div>
                  <button ${qAttr('Hola, quiero información sobre el mantenimiento ' + it[0] + '.', pricingServiceValue.web)} class="btn-ghost text-center font-semibold px-5 py-2.5 rounded-full text-sm self-start">Hablar sobre este plan</button>
                </div>`).join('')}</div>
              <p class="text-white/45 text-[13px] leading-relaxed mt-3 px-1">${g.note}</p>
            </div>`).join('')}
        </div>
        ${meta.priority ? `<div class="rounded-3xl p-7 mt-8 bg-white text-[#021024]"><p class="text-[11px] tracking-[0.18em] uppercase opacity-55 mb-2">${meta.priority.tag}</p><h4 class="font-display text-xl mb-1">${meta.priority.title}</h4><p class="opacity-75 text-[15px]">${meta.priority.text}</p></div>` : ''}
      </div>`;
    }

    if(meta && meta.extras){
      const ex = meta.extras;
      html += `
      <div class="pb-16 md:pb-20 border-t border-white/10 pt-16 md:pt-20">
        <h3 class="font-display text-3xl mb-3">${ex.title}</h3>
        <p class="text-white/55 mb-8 max-w-2xl">${ex.intro}</p>
        <div class="grid sm:grid-cols-2 gap-5">
          ${ex.items.map(it => `
            <div class="glass rounded-2xl p-6 flex flex-col gap-4 justify-between">
              <div><h4 class="font-display text-xl mb-2">${it[0]}</h4><p class="text-white/60 text-[14px] leading-relaxed">${it[1]}</p></div>
              <button ${qAttr('Hola, quiero presupuestar: ' + it[0] + ' (' + pricingLabels[category] + ').', pricingServiceValue[category])} class="btn-primary text-center font-semibold px-5 py-2.5 rounded-full text-sm self-start">Consultar</button>
            </div>`).join('')}
        </div>
        ${meta.closing ? `<div class="rounded-3xl p-7 mt-8 bg-white text-[#021024]"><h4 class="font-display text-xl mb-1">${meta.closing.title}</h4><p class="opacity-75 text-[15px] leading-relaxed">${meta.closing.text}</p></div>` : ''}
      </div>`;
    }
    container.innerHTML = html;
  }

  // ---------- Plan personalizado (checklist agrupada -> formulario -> correo) ----------
  const customPlanGroups = {
    identidad: [{ title: '', items: ['Análisis de rubro','Análisis de competencias','Naming','Logotipo y versiones','Tipografías','Paleta de colores','Iconografía','Recursos gráficos','Papelería corporativa','Manual de marca','Diseño para redes sociales'] }],
    social: [
      { title: 'Estrategia y dirección', items: ['Auditoría inicial del perfil','Estrategia mensual de contenido','Planificación y calendario','Dirección creativa de contenido','Dirección creativa estratégica','Dirección creativa integral de marca digital','Conceptos de campaña','Desarrollo de narrativas y líneas de comunicación','Definición de líneas visuales y temáticas','Estrategia de crecimiento','Estrategia multicanal','Estrategia promocional'] },
      { title: 'Contenido y producción', items: ['Guiones y copywriting','Piezas principales al mes (6–12)','Reels','Stories','Diseño gráfico','Retoque fotográfico','Publicación y programación','Mayor producción de contenido','Campañas y lanzamientos'] },
      { title: 'Comunidad y perfil', items: ['Community management básico','Optimización continua del perfil','Google Business Profile'] },
      { title: 'Publicidad y crecimiento', items: ['Meta Ads','Google Ads','Creatividades publicitarias','Segmentación y optimización de campañas','Influencer / creator outreach','Influencer Marketing'] },
      { title: 'Análisis y reportes', items: ['Análisis de competencia','Identificación de oportunidades y tendencias','Informe mensual','Reporting avanzado','Reporting orientado a negocio','Seguimiento de leads, clics y conversiones','Revisión de conversión web','Recomendaciones de landing pages, funnels y CTA','Reunión mensual','Reunión estratégica mensual','Consultoría estratégica','Mayor disponibilidad y seguimiento'] }
    ],
    web: [
      { title: 'Presencia y captación', items: ['Portfolio, servicios o presentación del negocio','Formularios de contacto o solicitud de cotización','Contacto directo por WhatsApp','Diseño responsive y optimización para móvil','SEO técnico básico y configuración esencial'] },
      { title: 'Procesos automatizados', items: ['Formularios avanzados con lógica de pedido o reserva','Comandas automáticas por WhatsApp o correo','Cálculo de productos, extras o cantidades','Confirmaciones y automatizaciones básicas'] },
      { title: 'Venta online', items: ['Catálogo, carrito y checkout','Pasarela de pago','Tarjeta, Apple Pay y Google Pay','Confirmaciones automáticas de pedido y pago','Backend, webhooks y medidas de seguridad','Gestión básica de pedidos'] },
      { title: 'Integración', items: ['Pedidos y pagos conectados con sistemas internos','Integración con TPV / POS','APIs, webhooks y automatizaciones avanzadas','Flujos multilocal','Sincronización con stock, CRM, ERP u otras herramientas','Arquitectura técnica adaptada al negocio'] },
      { title: 'Mantenimiento y soporte', items: ['Web Care Starter','Web Care Business','Web Care Commerce','Web Care Integration','Soporte técnico y atención al cliente 24/7'] },
      { title: 'Extras', items: ['Fotografía profesional','Retoque & dirección visual','Google Business Profile','SEO · GEO · AEO','Arquitectura visual de marca','Otras necesidades'] }
    ]
  };

  function openCustomPlan(category){
    const modal = document.getElementById('custom-plan-modal');
    document.getElementById('custom-plan-title').textContent = (window.I18N ? I18N.tr('Arma tu plan de') : 'Arma tu plan de') + ' ' + (window.I18N ? I18N.tr(pricingLabels[category]) : pricingLabels[category]);
    document.getElementById('custom-plan-category').value = category;
    const list = document.getElementById('custom-plan-checklist');
    list.style.maxHeight = '46vh'; list.style.overflowY = 'auto';
    list.innerHTML = customPlanGroups[category].map(g => `
      ${g.title ? `<p class="text-[11px] tracking-[0.16em] uppercase text-white/45 mt-4 mb-1">${g.title}</p>` : ''}
      ${g.items.map(label => `
      <label class="checkbox-row">
        <input type="checkbox" value="${label}" data-group="${g.title}" />
        <span class="text-white/80 text-sm">${label}</span>
      </label>`).join('')}`).join('');
    document.getElementById('custom-plan-notes').value = '';
    modal.classList.add('open');
  }

  function closeCustomPlan(){
    document.getElementById('custom-plan-modal').classList.remove('open');
  }

  function submitCustomPlan(){
    const category = document.getElementById('custom-plan-category').value;
    const checked = Array.from(document.querySelectorAll('#custom-plan-checklist input:checked')).map(i => ({ v: i.value, g: i.dataset.group || '' }));
    const notes = document.getElementById('custom-plan-notes').value.trim();
    if(checked.length === 0){
      alert(window.I18N ? I18N.tr('Elegí al menos un ítem para tu plan personalizado.') : 'Elegí al menos un ítem para tu plan personalizado.');
      return;
    }
    const T = (x) => (window.I18N ? I18N.tr(x) : x);
    let message = T('Hola, quiero armar un plan personalizado de') + ' ' + T(pricingLabels[category]) + ' ' + T('con lo siguiente') + ':\n';
    const seen = [];
    checked.forEach(c => { if(seen.indexOf(c.g) === -1) seen.push(c.g); });
    seen.forEach(g => {
      message += '\n' + (g ? T(g) + ':\n' : '');
      message += checked.filter(c => c.g === g).map(c => '- ' + T(c.v)).join('\n') + '\n';
    });
    if(notes) message += '\n' + T('Notas adicionales') + ':\n' + notes;
    closeCustomPlan();
    openContactForm(message, pricingServiceValue[category], 'quote');
  }

  // ---------- Unified contact form (mail icon, "Solicitar presupuesto", plan personalizado) ----------
  // ---------- Shared lead submission: real endpoint if configured, else mailto ----------
  async function submitLead(fields, kind){
    if(CONFIG.FORM_ENDPOINT && CONFIG.FORM_ENDPOINT !== 'PLACEHOLDER'){
      try {
        const subjectLine = (kind === 'review' ? 'Nueva reseña de cliente — ' : 'Nueva solicitud — ') + (fields.company || fields.service || 'LE STUDIO');
        const payload = Object.assign(
          { _kind: kind || 'lead', _subject: subjectLine },
          fields.email ? { _replyto: fields.email } : {},
          fields
        );
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if(res.ok){
          trackEvent('form_submit', { kind: kind || 'lead', service: fields.service || '' });
          return { ok: true };
        }
        return { ok: false };
      } catch (e){
        return { ok: false };
      }
    }
    // Fallback while FORM_ENDPOINT isn't configured yet: open the mail client.
    const subject = (kind === 'review' ? 'Nueva reseña de cliente — ' : 'Nueva solicitud — ') + (fields.company || fields.service || 'LE STUDIO');
    let body = 'Nombre: ' + fields.name + '\n';
    if(fields.email) body += 'Email: ' + fields.email + '\n';
    if(fields.phone) body += 'Teléfono: ' + fields.phone + '\n';
    if(fields.company) body += 'Empresa: ' + fields.company + '\n';
    if(fields.role) body += 'Cargo: ' + fields.role + '\n';
    if(fields.service) body += 'Servicio: ' + fields.service + '\n';
    if(fields.rating) body += 'Calificación: ' + '★'.repeat(fields.rating) + '☆'.repeat(5 - fields.rating) + ' (' + fields.rating + '/5)\n';
    body += '\n' + (kind === 'review' ? 'Reseña:\n' : 'Mensaje:\n') + fields.message;
    window.location.href = 'mailto:' + CONFIG.EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    trackEvent('form_submit_mailto', { kind: kind || 'lead', service: fields.service || '' });
    return { ok: true, viaMailto: true };
  }

  function openContactForm(prefillMessage, serviceValue, mode){
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
    document.getElementById('contact-company').value = '';
    const svcSel = document.getElementById('contact-service');
    svcSel.value = 'No estoy seguro';
    if(serviceValue){
      const hasOpt = Array.from(svcSel.options).some(o => o.value === serviceValue);
      if(hasOpt) svcSel.value = serviceValue;
    }
    document.getElementById('contact-message').value = prefillMessage || '';
    document.getElementById('contact-terms').checked = false;
    const titleEl = document.getElementById('contact-title');
    const subEl = document.getElementById('contact-sub');
    if(titleEl && subEl){
      if(mode === 'quote'){
        titleEl.textContent = 'Solicita tu cotización';
        subEl.textContent = 'Cuéntanos qué necesitas y te enviamos una propuesta a medida en menos de 24 horas.';
      } else {
        titleEl.textContent = '¿Hablamos de tu proyecto?';
        subEl.textContent = 'Completa tus datos y te respondemos en menos de 24 horas.';
      }
    }
    document.getElementById('contact-form-panel').classList.remove('hidden');
    document.getElementById('contact-success-panel').classList.add('hidden');
    document.getElementById('contact-error-panel').classList.add('hidden');
    document.getElementById('contact-modal').classList.add('open');
    trackEvent('contact_form_open', { mode: mode || 'default' });
  }

  function closeContactForm(){
    document.getElementById('contact-modal').classList.remove('open');
  }

  async function submitContactForm(){
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const company = document.getElementById('contact-company').value.trim();
    const service = document.getElementById('contact-service').value;
    const message = document.getElementById('contact-message').value.trim();
    const terms = document.getElementById('contact-terms').checked;

    if(!name || !email || !message){
      alert(window.I18N ? I18N.tr('Por favor completá nombre, email y mensaje.') : 'Por favor completá nombre, email y mensaje.');
      return;
    }
    if(!terms){
      alert(window.I18N ? I18N.tr('Necesitamos que aceptes ser contactado para poder responderte.') : 'Necesitamos que aceptes ser contactado para poder responderte.');
      return;
    }

    const btn = document.getElementById('contact-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const result = await submitLead({ name, email, phone, company, service, message });

    btn.disabled = false;
    btn.textContent = 'Enviar';

    if(result.ok){
      document.getElementById('contact-form-panel').classList.add('hidden');
      document.getElementById('contact-success-panel').classList.toggle('hidden', false);
      document.getElementById('contact-error-panel').classList.add('hidden');
    } else {
      document.getElementById('contact-form-panel').classList.add('hidden');
      document.getElementById('contact-error-panel').classList.remove('hidden');
    }
  }


  // ---------- Services data ----------
  const services = {
    'social-media': {
      eyebrow: 'Social Media',
      title: 'Tu marca, activa, relevante y estratégica.',
      description: 'Gestionamos tus redes sociales como un canal de negocio, no como un simple calendario de publicaciones. Definimos la estrategia, planificamos el contenido, gestionamos la comunidad y analizamos el rendimiento para construir una presencia digital coherente y orientada al crecimiento.',
      ctaLabel: 'Quiero hacer crecer mis redes',
      intro: [
        'Cualquiera puede programar publicaciones. Lo que separa una red social que vende de una que solo existe es la estrategia detrás: saber para quién hablas, qué quieres lograr con cada pieza y cómo se conecta un mes con el siguiente.',
        'Trabajamos con marcas que ya entendieron que las redes no son gratis solo porque no se pagan en pauta — cuestan tiempo, consistencia y criterio. Nosotros ponemos las tres cosas, para que vos no tengas que estar pendiente de qué publicar hoy.'
      ],
      whatWeDo: [
        { name: 'Estrategia de redes', desc: 'Definimos qué comunicar, a quién, cómo y con qué objetivo.' },
        { name: 'Planificación de contenido', desc: 'Construimos calendarios y pilares de contenido alineados con la marca.' },
        { name: 'Gestión de redes', desc: 'Publicamos, organizamos y mantenemos activa la presencia digital.' },
        { name: 'Community Management', desc: 'Gestionamos conversaciones, comentarios y mensajes de la comunidad.' },
        { name: 'Contenido para redes', desc: 'Desarrollamos piezas adaptadas a cada plataforma.' },
        { name: 'Análisis y optimización', desc: 'Medimos el rendimiento y usamos los datos para mejorar la estrategia.' }
      ],
      includes: [
        'Estrategia de Social Media', 'Instagram', 'TikTok', 'Calendario editorial',
        'Community Management', 'Diseño de publicaciones', 'Reels', 'Stories',
        'Copywriting', 'Gestión de perfiles', 'Informes mensuales', 'Estrategias de crecimiento'
      ],
      pricing: 'social',
      faq: [
        { q: '¿Qué redes sociales gestionáis?', a: 'Principalmente Instagram y TikTok, aunque nos adaptamos a la plataforma donde esté tu audiencia. Lo definimos juntos según tu marca y tu objetivo, no aplicamos la misma fórmula a todos los clientes.' },
        { q: '¿También producís el contenido?', a: 'Sí. La estrategia y la producción van de la mano dentro de este servicio, y si necesitas piezas más elaboradas, se conecta directo con Content Production sin fricción entre equipos.' },
        { q: '¿Podemos contratar únicamente estrategia?', a: 'Sí, es posible. Muchos clientes ya tienen equipo interno de community management y solo necesitan la definición estratégica y el calendario. Lo conversamos según tu caso.' },
        { q: '¿Gestionáis comentarios y mensajes?', a: 'Sí, el community management incluye responder comentarios y mensajes directos dentro del horario y el tono que definamos juntos para tu marca.' },
        { q: '¿Cuánto contenido se publica al mes?', a: 'Depende del plan que elijas. Los tres niveles —básico, intermedio y avanzado— tienen cantidades distintas de posts, reels e historias, detalladas en la sección de planes.' },
        { q: '¿Cómo medís los resultados?', a: 'Con informes mensuales que muestran alcance, interacción y crecimiento real, explicados en lenguaje simple — no solo una captura de métricas sin contexto.' },
        { q: '¿Trabajáis con marcas que están empezando?', a: 'Sí. De hecho ahí es donde más valor aporta tener una estrategia clara desde el día uno, en vez de publicar sin un rumbo definido.' }
      ],
      related: ['content-production', 'brand-design', 'growth-marketing'],
      featuredProject: 'mds-redes'
    },
    'content-production': {
      eyebrow: 'Content Production',
      title: 'Contenido diseñado para captar atención.',
      description: 'Conceptualizamos, producimos y editamos contenido que convierte ideas en piezas que las personas quieren ver, compartir y recordar. Desde contenido para redes hasta campañas audiovisuales, construimos cada producción alrededor de una idea, una narrativa y un objetivo.',
      ctaLabel: 'Quiero contenido que convierta',
      intro: [
        'La diferencia entre un video que se scrollea y uno que se mira entero casi nunca es la cámara — es la idea. Por eso empezamos por el concepto y la narrativa, no por la fecha de grabación.',
        'Producimos con equipo propio, no subcontratamos cámaras ni editores de último minuto. Eso significa un mismo estándar de calidad en cada entrega, y un equipo que entiende tu marca en vez de tratarla como un cliente más de la semana.'
      ],
      whatWeDo: [
        { name: 'Dirección creativa', desc: 'Definimos el concepto visual y narrativo de cada producción.' },
        { name: 'Concepto y guion', desc: 'Convertimos objetivos de comunicación en ideas que pueden convertirse en contenido.' },
        { name: 'Producción audiovisual', desc: 'Fotografía, video y producción de contenido.' },
        { name: 'Contenido vertical', desc: 'Reels, TikTok, Shorts y formatos pensados para consumo móvil.' },
        { name: 'Edición', desc: 'Montaje, ritmo, sonido, color y postproducción.' },
        { name: 'Adaptación', desc: 'Convertimos una producción en diferentes piezas y formatos.' }
      ],
      includes: [
        'Dirección creativa', 'Conceptualización', 'Guion', 'Producción audiovisual',
        'Fotografía', 'Video', 'Reels', 'TikTok', 'Shorts', 'Edición',
        'Motion graphics', 'Postproducción', 'Adaptación a formatos', 'Contenido para campañas'
      ],
      faq: [
        { q: '¿Trabajáis con video y fotografía?', a: 'Sí, ambos formatos forman parte del servicio y normalmente se planifican juntos dentro de una misma producción para aprovechar cada sesión.' },
        { q: '¿Podéis producir contenido para redes?', a: 'Sí, es uno de los usos más frecuentes: contenido vertical, reels y piezas pensadas específicamente para el consumo en redes sociales.' },
        { q: '¿También os encargáis de la edición?', a: 'Sí, montaje, color, sonido y motion graphics están incluidos — no entregamos material crudo sin terminar.' },
        { q: '¿Podemos contratar únicamente la producción?', a: 'Sí, si ya tienes un equipo de edición interno podemos encargarnos solo de la parte de grabación y dirección creativa.' },
        { q: '¿Trabajáis con campañas publicitarias?', a: 'Sí, producimos piezas pensadas para campañas pagas, coordinado con el equipo de Growth & Marketing cuando el proyecto lo requiere.' },
        { q: '¿Podéis crear diferentes formatos a partir de una producción?', a: 'Sí, de una misma sesión solemos adaptar múltiples piezas: reel, historia, corte horizontal y vertical, para aprovechar mejor cada producción.' },
        { q: '¿Trabajáis con contenido generado mediante IA?', a: 'Lo evaluamos caso por caso. Priorizamos producción real, pero hay procesos puntuales (como algunas adaptaciones o pruebas de concepto) donde la IA puede sumar sin reemplazar la producción original.' }
      ],
      related: ['social-media', 'brand-design', 'growth-marketing'],
      featuredProject: 'legacy-podcast'
    },
    'brand-design': {
      eyebrow: 'Brand & Design',
      title: 'Una identidad que hace reconocible a tu marca.',
      description: 'Diseñamos sistemas visuales coherentes que hacen que una marca se vea, se sienta y se recuerde como una sola. Desde una identidad completa hasta el diseño para tus redes sociales, cada elemento responde al mismo lenguaje visual.',
      ctaLabel: 'Quiero una marca memorable',
      intro: [
        'Una marca no es un logo — es un sistema. Cuando ese sistema no existe, cada pieza nueva se diseña desde cero y la marca termina viéndose distinta en cada lugar donde aparece.',
        'Construimos ese sistema una sola vez, bien hecho, para que tu equipo pueda seguir usándolo solo durante años sin perder consistencia ni tener que llamarnos por cada publicación nueva.'
      ],
      whatWeDo: [
        { name: 'Brand Identity', desc: 'Construimos sistemas visuales capaces de representar una marca.' },
        { name: 'Dirección de arte', desc: 'Definimos cómo debe verse y sentirse la marca.' },
        { name: 'Diseño gráfico', desc: 'Creamos piezas para los diferentes puntos de contacto.' },
        { name: 'Diseño para redes sociales', desc: 'Posts, historias, carruseles, portadas y plantillas editables, alineados con tu identidad.' },
        { name: 'UI/UX', desc: 'Diseñamos interfaces claras, funcionales y visualmente coherentes.' },
        { name: 'Sistemas de marca', desc: 'Creamos reglas y recursos para mantener consistencia.' }
      ],
      includes: [
        'Branding', 'Identidad visual', 'Logo', 'Dirección de arte', 'Naming',
        'Diseño gráfico', 'Diseño para redes sociales', 'Posts y carruseles', 'Plantillas para redes', 'Diseño editorial', 'Packaging',
        'UI Design', 'UX Design', 'Sistemas visuales', 'Brand Guidelines'
      ],
      pricing: 'identidad',
      faq: [
        { q: '¿Creáis identidades de marca desde cero?', a: 'Sí, es uno de los proyectos más completos que hacemos: desde el naming y el concepto hasta el manual de marca final.' },
        { q: '¿También trabajáis sobre marcas existentes?', a: 'Sí, muchos proyectos son de evolución de marca: mantenemos lo que ya funciona y corregimos lo que genera inconsistencia.' },
        { q: '¿Qué incluye un proyecto de branding?', a: 'Depende del nivel elegido — tienes el detalle exacto en la sección de planes de esta página, desde identidad básica hasta un sistema de marca completo.' },
        { q: '¿Diseñáis únicamente el logo?', a: 'Podemos, pero recomendamos pensarlo como parte de un sistema: tipografías, paleta y aplicaciones, para que el logo funcione bien en cualquier contexto.' },
        { q: '¿Trabajáis también diseño para redes sociales?', a: 'Sí. Diseñamos posts, historias, carruseles, portadas y plantillas editables usando el mismo sistema visual de tu marca, para que redes, web y papelería se vean como una sola cosa.' },
        { q: '¿Podéis diseñar la interfaz de una web o aplicación?', a: 'Sí, el diseño UI/UX forma parte de este servicio y se coordina directamente con el equipo de Web & Digital Development cuando hay que construirla.' },
        { q: '¿Entregáis manual de marca?', a: 'Sí, en los planes de identidad corporativa y completa incluimos manual de marca con las reglas de uso de cada elemento.' }
      ],
      related: ['content-production', 'web-development', 'social-media'],
      featuredProject: 'decoplant-branding'
    },
    'web-development': {
      pricing: 'web',
      eyebrow: 'Web & Digital Development',
      title: 'Diseñamos y desarrollamos productos digitales que funcionan.',
      description: 'Creamos experiencias digitales rápidas, escalables y adaptadas a las necesidades reales de cada negocio. Desde una landing diseñada para convertir hasta plataformas y herramientas internas construidas completamente a medida.',
      ctaLabel: 'Quiero un sitio que venda',
      intro: [
        'Una web bonita que carga lento o no convierte no cumplió su trabajo. Antes de diseñar una sola pantalla, entendemos qué tiene que lograr ese sitio y para quién.',
        'Construimos productos digitales pensados para durar: rápidos, ordenados por dentro y fáciles de mantener, no solo para verse bien el día del lanzamiento.'
      ],
      whatWeDo: [
        { name: 'E-commerce', desc: 'Tiendas online diseñadas para vender y crecer.' },
        { name: 'Landing Pages', desc: 'Experiencias enfocadas en conversión.' },
        { name: 'Sitios corporativos', desc: 'Webs que comunican claramente el valor de una empresa.' },
        { name: 'Dashboards', desc: 'Paneles para visualizar información y gestionar operaciones.' },
        { name: 'Aplicaciones web', desc: 'Productos digitales desarrollados alrededor de necesidades específicas.' },
        { name: 'Integraciones', desc: 'Conectamos herramientas, APIs y sistemas.' }
      ],
      includes: [
        'Diseño web', 'Desarrollo web', 'E-commerce', 'Shopify', 'Landing pages',
        'Sitios corporativos', 'Dashboards', 'Aplicaciones web', 'Plataformas digitales',
        'Sistemas internos', 'Integraciones API', 'Automatizaciones', 'Mantenimiento', 'Soporte'
      ],
      faq: [
        { q: '¿Trabajáis con Shopify?', a: 'Sí, tanto tiendas nuevas como mejoras y personalización de tiendas Shopify existentes.' },
        { q: '¿Podéis desarrollar una web completamente a medida?', a: 'Sí, cuando el proyecto lo requiere construimos desde cero en vez de partir de una plantilla, especialmente en dashboards o plataformas con lógica propia.' },
        { q: '¿También diseñáis la interfaz?', a: 'Sí, el diseño UI/UX se trabaja en conjunto con Brand & Design para que la web sea consistente con el resto de tu identidad.' },
        { q: '¿Podéis conectar diferentes herramientas?', a: 'Sí, las integraciones vía API con CRM, email o pasarelas de pago son parte habitual de estos proyectos.' },
        { q: '¿Desarrolláis dashboards?', a: 'Sí, paneles internos para visualizar datos o gestionar operaciones son uno de los productos que más construimos a medida.' },
        { q: '¿Podéis mantener una web después del lanzamiento?', a: 'Sí, ofrecemos mantenimiento y soporte continuo para que el sitio siga funcionando bien mucho después de publicado.' },
        { q: '¿Podéis crear una plataforma digital desde cero?', a: 'Sí, es uno de los proyectos más completos: analizamos el proceso real de tu negocio y construimos la herramienta alrededor de eso.' }
      ],
      related: ['brand-design', 'growth-marketing', 'ai-automation'],
      featuredProject: 'legacy-world-ecommerce'
    },
    'growth-marketing': {
      eyebrow: 'Growth & Marketing',
      title: 'Convertimos visibilidad en oportunidades de negocio.',
      description: 'Construimos estrategias para que tu marca sea encontrada, considerada y elegida. Combinamos posicionamiento orgánico, publicidad digital, presencia en buscadores de IA y estrategias de captación para construir un sistema de adquisición conectado.',
      ctaLabel: 'Quiero encontrar oportunidades de crecimiento',
      intro: [
        'Que te encuentren es el primer paso, no el objetivo. El objetivo es que te elijan a vos y no a la competencia que apareció al lado en la misma búsqueda.',
        'Por eso no separamos SEO, publicidad y contenido en compartimentos aislados: los conectamos en un mismo sistema, donde cada canal refuerza a los demás en vez de competir por el mismo presupuesto.'
      ],
      whatWeDo: [
        { name: 'SEO', desc: 'Trabajamos el posicionamiento orgánico para atraer tráfico cualificado.' },
        { name: 'GEO / AI Search', desc: 'Optimizamos la presencia de una marca en motores de búsqueda generativos y sistemas de IA.' },
        { name: 'Google Ads', desc: 'Diseñamos, lanzamos y optimizamos campañas de publicidad en Google.' },
        { name: 'Meta Ads', desc: 'Desarrollamos estrategias de adquisición mediante Instagram y Facebook.' },
        { name: 'Estrategia de contenido', desc: 'Creamos contenido orientado a descubrimiento, consideración y conversión.' },
        { name: 'Captación y conversión', desc: 'Diseñamos sistemas para convertir tráfico en oportunidades comerciales.' }
      ],
      includes: [
        'Estrategia de marketing', 'SEO', 'SEO técnico', 'SEO de contenidos', 'GEO',
        'AI Search', 'Google Ads', 'Meta Ads', 'Lead Generation', 'CRO',
        'Analytics', 'Reporting', 'Estrategia de contenidos'
      ],
      faq: [
        { q: '¿Qué diferencia hay entre SEO y GEO?', a: 'El SEO trabaja tu posición en buscadores tradicionales como Google. El GEO busca que tu marca esté bien representada dentro de las respuestas de sistemas de IA generativa. Son complementarios, no excluyentes.' },
        { q: '¿Trabajáis con Google Ads?', a: 'Sí, diseñamos, lanzamos y optimizamos campañas de búsqueda y shopping según el objetivo de cada negocio.' },
        { q: '¿También gestionáis Meta Ads?', a: 'Sí, campañas en Instagram y Facebook, coordinadas con el resto de la estrategia de contenido y marca.' },
        { q: '¿Podéis combinar SEO y publicidad?', a: 'Sí, de hecho lo recomendamos: el orgánico construye una base sostenible mientras la pauta genera resultados más inmediatos.' },
        { q: '¿Qué significa aparecer en buscadores de IA?', a: 'Significa que cuando alguien le pregunta algo relacionado con tu rubro a ChatGPT, Gemini u otro sistema similar, tu marca tiene más probabilidad de ser mencionada o considerada dentro de esa respuesta. No es algo que se pueda garantizar puntualmente, pero sí se puede trabajar de forma consistente.' },
        { q: '¿Cómo medís los resultados?', a: 'Con analítica y reporting periódico sobre tráfico, posiciones, conversión y rendimiento de cada campaña.' },
        { q: '¿Trabajáis con empresas que ya tienen equipo de marketing?', a: 'Sí, en varios proyectos trabajamos como un equipo especializado que complementa al equipo interno, no como reemplazo.' }
      ],
      related: ['social-media', 'content-production', 'web-development']
    },
    'ai-automation': {
      eyebrow: 'AI & Automation',
      title: 'IA que trabaja para tu negocio.',
      description: 'Diseñamos sistemas de inteligencia artificial y automatización que reducen tareas repetitivas, aceleran procesos y permiten que los equipos dediquen más tiempo a lo que realmente importa. No se trata de añadir IA porque está de moda: analizamos cómo funciona tu empresa y aplicamos tecnología donde realmente puede generar impacto.',
      ctaLabel: 'Quiero automatizar mi negocio',
      automationAreas: [
        'Captación de leads', 'Atención al cliente', 'WhatsApp', 'Seguimiento comercial',
        'Gestión de citas', 'Procesos internos', 'Generación de contenido', 'Reporting'
      ],
      intro: [
        'La mayoría de los procesos que le quitan tiempo a un equipo no requieren una persona pensando — requieren que alguien mueva información de un lado a otro. Ahí es exactamente donde entra la automatización.',
        'No empezamos por la tecnología. Empezamos por entender cómo funciona tu operación hoy, y después decidimos si hace falta un agente de IA, un flujo automatizado, o simplemente conectar dos herramientas que ya usás.'
      ],
      whatWeDo: [
        { name: 'AI Agents', desc: 'Agentes capaces de ejecutar tareas y trabajar con información de la empresa.' },
        { name: 'Chatbots', desc: 'Atención automatizada para web y canales de comunicación.' },
        { name: 'Automatización de procesos', desc: 'Conectamos herramientas y eliminamos tareas manuales repetitivas.' },
        { name: 'Automatización comercial', desc: 'Captación, cualificación y seguimiento automático de leads.' },
        { name: 'Integraciones', desc: 'Conectamos CRM, formularios, plataformas, APIs y herramientas.' },
        { name: 'IA interna', desc: 'Sistemas que ayudan a los equipos a buscar información, procesar datos y ejecutar tareas.' }
      ],
      includes: [
        'AI Agents', 'Chatbots', 'Asistentes virtuales', 'Automatización de procesos',
        'Automatización de ventas', 'Automatización de marketing', 'Lead qualification',
        'Seguimiento automático', 'Integraciones con CRM', 'Integraciones API',
        'IA para equipos internos', 'Atención 24/7'
      ],
      faq: [
        { q: '¿Qué procesos se pueden automatizar?', a: 'Cualquier tarea repetitiva basada en reglas claras: seguimiento de leads, respuestas frecuentes, envío de documentos, actualización de datos entre sistemas, entre muchas otras.' },
        { q: '¿Podéis crear un agente de IA personalizado?', a: 'Sí, entrenado con información real de tu negocio para que responda y actúe de forma coherente con cómo trabajás.' },
        { q: '¿Los chatbots pueden utilizar información de nuestra empresa?', a: 'Sí, ese es justamente el punto: que respondan con tus datos reales, no con respuestas genéricas desconectadas de tu negocio.' },
        { q: '¿Podéis conectar la IA con nuestro CRM?', a: 'Sí, las integraciones con CRM son una de las bases más comunes de estos proyectos, para que la información fluya sin cargarla dos veces.' },
        { q: '¿La IA puede atender clientes automáticamente?', a: 'Sí, con escalamiento a un humano cuando la consulta lo amerita — nunca dejamos a tu cliente sin respuesta ni atrapado en un bucle.' },
        { q: '¿Podéis automatizar procesos internos?', a: 'Sí, no solo de cara al cliente: también procesos administrativos, operativos o de reporting interno.' },
        { q: '¿Cómo sabemos qué procesos merece la pena automatizar?', a: 'Empezamos con una auditoría de tu operación actual para identificar dónde hay más fricción y dónde la automatización realmente ahorra tiempo, en vez de sumar complejidad innecesaria.' }
      ],
      related: ['web-development', 'growth-marketing', 'social-media'],
      featuredProject: 'legacy-world-ecommerce'
    }
  };

  // ---------- "¿Qué está frenando tu negocio?" — asistente de texto libre ----------
  // Sin mensajes ni botones predeterminados: la persona escribe, el asistente
  // interpreta su situación, justifica y recomienda el servicio. Si pregunta por
  // precios, muestra el botón que abre el formulario de cotización.
  // Si algún día conectas un modelo real, pon su URL en CONFIG.CHAT_API_ENDPOINT
  // (recibe { message, history } y devuelve { reply }). Mientras tanto responde
  // con el motor local de abajo.

  const assistantServices = {
    'social-media': {
      name: 'Social Media', href: 'social-media/',
      keys: [['redes',2],['red social',2],['instagram',2],['tiktok',2],['facebook',1],['linkedin',1],['seguidores',2],['followers',2],['comunidad',1],['community',2],['publicaciones',1],['publicar',1],['posts',1],['engagement',2],['interaccion',1],['alcance',1],['perfil',1],['no tengo tiempo',1],['que publicar',1]],
      intro: 'Es muy común: gestionar redes consume tiempo y, sin una estrategia clara, rara vez se traduce en clientes.',
      why: 'Las redes funcionan cuando hay estrategia, constancia y criterio detrás: saber para quién hablas, qué quieres lograr con cada pieza y cómo se conecta un mes con el siguiente. Nosotros ponemos esas tres cosas para que tu perfil deje de ser una tarea pendiente y empiece a atraer a las personas correctas.',
      deliver: 'definiríamos la estrategia, planificaríamos el contenido, gestionaríamos tu comunidad y te entregaríamos informes para ver qué funciona y por qué.',
      proof: 'Con Inversiones MDS construimos una audiencia real y su Instagram se convirtió en un generador constante de leads orgánicos.',
      short: 'se encargaría de que tus redes estén activas, con estrategia y medición.'
    },
    'content-production': {
      name: 'Content Production', href: 'content-production/',
      keys: [['contenido',2],['video',2],['videos',2],['foto',2],['fotos',2],['fotografia',2],['reel',2],['reels',2],['podcast',2],['produccion',2],['audiovisual',2],['grabar',2],['edicion',1],['editar',1],['camara',1],['guion',1],['creativ',1],['que publicar',1],['no se que',1]],
      intro: 'Tiene sentido: sin una buena idea y una producción cuidada, el contenido pasa desapercibido.',
      why: 'La diferencia entre un video que se salta y uno que se ve completo casi nunca es la cámara: es la idea. Por eso partimos del concepto y la narrativa, y después producimos y editamos con un mismo estándar de calidad.',
      deliver: 'nos encargaríamos de la dirección creativa, el guion, la grabación (video y fotografía) y la edición, con formatos pensados para redes y campañas.',
      proof: 'El primer episodio del podcast de Legacy World, que produjimos de punta a punta, alcanzó 35.000 reproducciones orgánicas sin pauta paga.',
      short: 'te daría piezas de video y foto con una idea detrás, listas para redes y campañas.'
    },
    'brand-design': {
      name: 'Brand & Design', href: 'brand-design/',
      keys: [['marca',2],['logo',2],['logotipo',2],['identidad',2],['branding',2],['naming',2],['nombre de',1],['diseno',2],['disenar',2],['imagen',1],['profesional',1],['amateur',2],['paleta',1],['tipografia',1],['manual de marca',2],['packaging',2],['flyer',1],['plantillas',1],['artes',1],['presentacion',1],['uniforme',1],['merch',1],['no se ve',1],['se ve mal',2]],
      intro: 'Es más común de lo que parece: cuando una marca no se ve profesional, la gente duda antes de comprar.',
      why: 'Una marca no es solo un logo: es un sistema visual que debe verse igual en tu web, tus redes y tus materiales. Cuando ese sistema no existe, cada pieza se ve distinta y transmite menos confianza; cuando existe, te reconocen y te recuerdan.',
      deliver: 'crearíamos tu identidad visual (logo, tipografías, paleta y manual de marca) y el diseño para tus redes sociales —posts, historias, carruseles y plantillas— con el mismo lenguaje visual.',
      proof: 'Para Decoplant desarrollamos el naming y la identidad visual completa desde cero, con un sistema que funciona para sus dos líneas de negocio.',
      short: 'daría a tu marca una identidad coherente, incluido el diseño para redes sociales.'
    },
    'web-development': {
      name: 'Web & Digital Development', href: 'web-development/',
      keys: [['web',2],['pagina',2],['sitio',2],['tienda',2],['ecommerce',2],['e-commerce',2],['shopify',2],['landing',2],['plataforma',1],['dashboard',2],['aplicacion',1],['app',1],['carrito',1],['checkout',1],['vender online',2],['vender por internet',2],['dominio',1],['no convierte',2],['visitas',1]],
      intro: 'Una web que no convierte es una oportunidad perdida todos los días.',
      why: 'Una web bonita que carga lento o no guía al visitante hacia una acción no cumple su trabajo. Antes de diseñar una pantalla definimos qué debe lograr el sitio y para quién, y construimos algo rápido, ordenado y pensado para convertir visitas en clientes.',
      deliver: 'diseñaríamos y desarrollaríamos tu sitio, tienda online o landing con foco en conversión, incluyendo los canales de contacto o compra que más usan tus clientes.',
      proof: 'Para Legacy World construimos su tienda online desde cero: hoy vende a nivel nacional e internacional, con checkout propio y un botón para cerrar la compra por WhatsApp.',
      short: 'te daría un sitio rápido y pensado para convertir visitas en clientes.'
    },
    'growth-marketing': {
      name: 'Growth & Marketing', href: 'growth-marketing/',
      keys: [['marketing',2],['seo',2],['google',2],['ads',2],['anuncios',2],['publicidad',2],['pauta',2],['leads',2],['ventas',2],['vender',1],['vendo',2],['clientes',1],['no me encuentran',2],['posicionamiento',2],['conversion',1],['campana',2],['trafico',2],['embudo',2],['no tengo clientes',3],['captar',2],['resultados',1],['no funciona',1]],
      intro: 'Cuando no entra un flujo constante de clientes, casi siempre falta visibilidad o un sistema que convierta.',
      why: 'Para vender no basta con existir: hay que ser encontrado y convertir. Combinamos SEO (incluida la visibilidad en las respuestas de IA), campañas en Google y Meta y seguimiento de resultados, para que cada acción esté ligada a clientes potenciales y no solo a visitas.',
      deliver: 'revisaríamos cómo te encuentran hoy, definiríamos dónde conviene invertir y mediríamos leads y conversiones para optimizar con datos reales.',
      proof: '',
      short: 'te ayudaría a que te encuentren y a convertir esa atención en clientes, midiendo resultados.'
    },
    'ai-automation': {
      name: 'AI & Automation', href: 'ai-automation/',
      keys: [['automat',3],['=ia',3],['inteligencia artificial',3],['chatbot',3],['bot',1],['whatsapp',1],['repetitiv',3],['procesos',2],['pierdo tiempo',2],['pierdo horas',3],['agente',2],['asistente',1],['atencion al cliente',2],['responder mensajes',2],['crm',2],['flujo',1],['manual',1],['tareas',1],['no tengo tiempo',1]],
      intro: 'Las tareas repetitivas se comen horas que podrías dedicar a vender y a atender mejor.',
      why: 'Responder los mismos mensajes, calificar contactos o mover datos entre herramientas se puede automatizar con agentes de IA y flujos conectados. Así tu equipo dedica su tiempo a lo que realmente aporta valor.',
      deliver: 'empezaríamos detectando qué procesos te quitan más horas y construiríamos chatbots, agentes o automatizaciones a la medida de tu negocio.',
      proof: '',
      short: 'automatizaría las tareas repetitivas para que recuperes tiempo.'
    }
  };

  const aEnKeys = {
    'social-media': [['social media',2],['followers',2],['engagement',2],['community',1],['posts',1],['instagram',2]],
    'content-production': [['content',2],['videos',2],['photo',2],['photography',2],['production',2],['filming',2],['editing',1],['reels',2]],
    'brand-design': [['brand',2],['identity',2],['design',2],['unprofessional',2],['professional',1],['logo',2],['packaging',2]],
    'web-development': [['website',2],['site',1],['online store',2],['store',1],['shop',1],['landing',2],['web',2]],
    'growth-marketing': [['advertising',2],['sales',2],['customers',1],['no customers',3],['traffic',2],['campaign',2],['found on google',2],['marketing',2],['seo',2],['ads',2],['leads',2]],
    'ai-automation': [['automate',3],['automation',3],['=ai',3],['artificial intelligence',3],['repetitive',3],['processes',2],['agent',2],['customer support',2],['chatbot',3]]
  };
  Object.keys(aEnKeys).forEach(id => { assistantServices[id].keys = assistantServices[id].keys.concat(aEnKeys[id]); });

  const assistantState = { history: [], last: [], unmatched: 0, busy: false };

  function aNorm(t){
    return ' ' + String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\-\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }

  function aScoreServices(norm){
    const out = [];
    Object.keys(assistantServices).forEach(id => {
      let score = 0;
      assistantServices[id].keys.forEach(([kw, w]) => {
        if(kw.charAt(0) === '='){
          if(norm.indexOf(' ' + kw.slice(1) + ' ') !== -1) score += w;
        } else if(norm.indexOf(' ' + kw) !== -1){
          score += w;
        }
      });
      if(score > 0) out.push({ id, score });
    });
    return out.sort((a, b) => b.score - a.score);
  }

  function aIntent(norm){
    const trimmed = norm.trim();
    const price = /\b(price|prices|pricing|cost|costs|rates|fee|fees|budget|quote|cheap|affordable|precio|precios|cuesta|cuestan|costo|costos|tarifa|tarifas|presupuesto|cotiza|cotizacion|cotizar|cobran|cobras|planes|paquete|paquetes|barato|economico|inversion)\b/.test(norm)
      || (/\bcuanto\b/.test(norm) && /(cuest|cobr|vale|pag|sale|inver)/.test(norm)) || /how much/.test(norm);
    const greet = trimmed.length < 28 && /^(hello|hi|hey|hola|buenas|buenos dias|buen dia|buenas tardes|buenas noches|hey|saludos|que tal)\b/.test(trimmed);
    const thanks = trimmed.length < 40 && /\b(thanks|thank you|gracias|genial|perfecto|excelente|listo)\b/.test(trimmed);
    const timing = /(how long|timeline|deadline|turnaround|cuanto tard|plazo|tiempo de entrega|cuando entreg|demora)/.test(norm);
    const human = /(talk to|speak with|schedule|meeting|hablar con|contactar|agendar|reunion|llamada|una cita|asesor)/.test(norm);
    const overview = /(what do you do|what services|who are you|que hacen|que ofrecen|que servicios|quienes son|a que se dedican)/.test(norm);
    return { price, greet, thanks, timing, human, overview };
  }

  function aEl(tag, cls, html){
    const el = document.createElement(tag);
    if(cls) el.className = cls;
    if(html != null) el.innerHTML = html;
    return el;
  }

  function aButton(label, kind, onClick, href){
    const el = href ? aEl('a', kind) : aEl('button', kind);
    if(href){ el.href = href; } else { el.type = 'button'; }
    el.innerHTML = label;
    if(onClick) el.addEventListener('click', onClick);
    return el;
  }

  function aThread(){ return document.getElementById('chat-messages'); }
  function aScroll(){ const t = aThread(); if(t) t.scrollTop = t.scrollHeight; }

  function aAddUser(text){
    const d = aEl('div', 'msg msg-user');
    d.textContent = text;
    aThread().appendChild(d);
    aScroll();
  }

  function aTyping(){
    const d = aEl('div', 'msg msg-bot', '<span class="typing" aria-label="Escribiendo"><i></i><i></i><i></i></span>');
    aThread().appendChild(d);
    aScroll();
    return d;
  }

  function aQuoteMessage(userText, serviceId){
    const svc = serviceId ? assistantServices[serviceId].name : '';
    const T = (x) => (window.I18N ? I18N.tr(x) : x);
    let msg = T('Hola, quiero solicitar una cotización') + (svc ? ' ' + T('de') + ' ' + svc : '') + '.';
    if(userText) msg += '\n\n' + T('Mi situación') + ': ' + userText.slice(0, 400);
    return msg;
  }

  function aFill(bubble, paragraphs, actions){
    bubble.innerHTML = '';
    paragraphs.forEach(p => bubble.appendChild(aEl('p', null, p)));
    if(actions && actions.length){
      const wrap = aEl('div', 'msg-actions');
      actions.forEach(a => wrap.appendChild(a));
      bubble.appendChild(wrap);
    }
  }

  function aBuildReply(userText, goalArg){
    const norm = aNorm(userText);
    const intent = aIntent(norm);
    let scored = aScoreServices(norm);
    if(goalArg && goalArg.services){ scored = goalArg.services.map((id, i) => ({ id, score: 10 - i })); }

    // seguimiento: si no hay servicio pero ya hablamos de uno, lo reutilizamos
    let usedContext = false;
    if(!scored.length && assistantState.last.length && (intent.price || intent.timing || intent.human)){
      scored = assistantState.last.map(id => ({ id, score: 1 }));
      usedContext = true;
    }

    const primary = scored[0] ? scored[0].id : null;
    const secondary = (scored[1] && scored[1].score >= Math.max(2, scored[0].score * 0.5)) ? scored[1].id : null;
    const paragraphs = [];
    const actions = [];

    const quoteBtn = (serviceId) => aButton('Solicitar cotización', 'btn-primary', () => {
      openContactForm(aQuoteMessage(userText, serviceId), serviceId ? assistantServices[serviceId].name : '', 'quote');
    });
    const talkBtn = () => aButton('Analizar mi proyecto', 'btn-ghost', () => {
      openContactForm((window.I18N ? I18N.tr('Hola, quiero que me ayuden con lo siguiente') : 'Hola, quiero que me ayuden con lo siguiente') + ': ' + userText.slice(0, 400));
    });

    // --- Saludo / gracias
    if(intent.greet && !primary){
      paragraphs.push('¡Hola! Cuéntame qué está frenando tu negocio —más clientes, una marca que no se ve profesional, tiempo perdido en tareas repetitivas…— y te explico qué haríamos para resolverlo.');
      return { paragraphs, actions };
    }
    if(intent.thanks && !primary && !intent.price){
      paragraphs.push('¡Con gusto! Si quieres, cuéntame más sobre tu negocio o deja tus datos y el equipo te escribe en menos de 24 horas.');
      actions.push(talkBtn());
      return { paragraphs, actions };
    }

    // --- Precios: siempre ofrece el formulario de cotización
    if(intent.price){
      paragraphs.push('Cada proyecto se cotiza según lo que necesitas y el alcance que tenga, y trabajamos para que nuestras soluciones sean accesibles para negocios en cualquier etapa. Lo más rápido es que nos cuentes tu caso en el formulario y te enviamos una cotización a medida en menos de 24 horas.');
      if(primary){
        const s = assistantServices[primary];
        paragraphs.push('<span>Por lo que cuentas, lo que mejor encaja es</span> <strong>' + s.name + '</strong>: <span>' + s.deliver + '</span>');
        if(secondary) paragraphs.push('<span>También podría ayudarte</span> <strong>' + assistantServices[secondary].name + '</strong>: <span>' + assistantServices[secondary].short + '</span>');
      }
      actions.push(quoteBtn(primary));
      if(primary) actions.push(aButton('<span>Ver</span> ' + assistantServices[primary].name, 'btn-ghost', null, assistantServices[primary].href));
      return { paragraphs, actions, services: primary ? [primary].concat(secondary ? [secondary] : []) : [] };
    }

    // --- Plazos
    if(intent.timing){
      paragraphs.push('Los tiempos dependen del alcance de cada proyecto. Una vez que entendemos lo que necesitas, te entregamos una propuesta con alcance y calendario claros, para que sepas qué esperar desde el primer día.');
      if(primary) paragraphs.push('<span>Para tu caso, lo más cercano es</span> <strong>' + assistantServices[primary].name + '</strong>.');
      actions.push(talkBtn());
      return { paragraphs, actions, services: primary ? [primary] : [] };
    }

    // --- Quiere hablar con una persona
    if(intent.human){
      paragraphs.push('Claro. Déjanos tus datos y cuéntanos brevemente tu proyecto: el equipo te responde en menos de 24 horas. Si prefieres algo más directo, también puedes escribirnos por WhatsApp.');
      actions.push(talkBtn());
      actions.push(aButton('WhatsApp', 'btn-ghost', null, waLink(CONFIG.WHATSAPP_NUMBER, 'Hola, quiero hablar sobre mi proyecto.')));
      return { paragraphs, actions };
    }

    // --- Recomendación con justificación
    if(primary){
      const s = assistantServices[primary];
      const tag = aEl('span', 'msg-tag', '<span>Te recomendamos</span>: ' + s.name);
      paragraphs.push(tag.outerHTML + '<br/><span>' + ((goalArg && goalArg.intro) || s.intro) + '</span>');
      paragraphs.push('<span>' + s.why + '</span>');
      paragraphs.push('<strong>Lo que haríamos:</strong> <span>' + s.deliver + '</span>');
      if(s.proof) paragraphs.push('<span>' + s.proof + '</span>');
      if(secondary){
        paragraphs.push('<span>Además,</span> <strong>' + assistantServices[secondary].name + '</strong>: <span>' + assistantServices[secondary].short + '</span>');
      }
      actions.push(aButton('<span>Ver</span> ' + s.name, 'btn-primary', null, s.href));
      actions.push(talkBtn());
      return { paragraphs, actions, services: [primary].concat(secondary ? [secondary] : []) };
    }

    // --- Panorama general
    if(intent.overview){
      paragraphs.push('Somos un equipo de crecimiento digital con seis servicios: Brand & Design (identidad y diseño para redes), Social Media, Content Production, Web & Digital Development, Growth & Marketing y AI & Automation. Cuéntame qué quieres lograr y te digo por dónde empezar.');
      actions.push(aButton('Ver servicios', 'btn-ghost', null, '#servicios'));
      return { paragraphs, actions };
    }

    // --- No hay suficiente contexto: pedimos más información
    assistantState.unmatched += 1;
    if(assistantState.unmatched >= 2){
      paragraphs.push('Para recomendarte bien prefiero que lo veas con una persona del equipo: déjanos tu consulta y te respondemos en menos de 24 horas con el mejor camino para tu negocio.');
      actions.push(talkBtn());
    } else {
      paragraphs.push('Para recomendarte bien necesito un poco más de contexto. ¿A qué se dedica tu negocio y qué te gustaría conseguir: más clientes, una mejor imagen, ahorrar tiempo…?');
    }
    return { paragraphs, actions };
  }

  async function aReplyViaApi(userText){
    const res = await fetch(CONFIG.CHAT_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, history: assistantState.history.slice(-8) })
    });
    const data = await res.json();
    return data && data.reply ? String(data.reply) : '';
  }

  async function sendChatMessage(preset, goal){
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    if(!input || assistantState.busy) return;
    const text = (typeof preset === 'string' ? preset : input.value).trim();
    if(!text) return;

    assistantState.busy = true;
    sendBtn.disabled = true;
    input.value = '';
    input.style.height = 'auto';
    aAddUser(text);
    assistantState.history.push({ role: 'user', content: text });
    trackEvent('assistant_message', { page: document.title });

    const bubble = aTyping();
    const reply = (goal && goal.id === 'unsure') ? aUnsureReply(text) : aBuildReply(text, goal);
    const apiEnabled = CONFIG.CHAT_API_ENDPOINT && CONFIG.CHAT_API_ENDPOINT !== 'PLACEHOLDER';
    let apiText = '';
    if(apiEnabled){
      try { apiText = await aReplyViaApi(text); } catch(e){ apiText = ''; }
    }
    const words = reply.paragraphs.join(' ').split(/\s+/).length;
    const wait = prefersReducedMotion ? 0 : Math.min(1500, 650 + words * 7);
    await new Promise(r => setTimeout(r, wait));

    if(apiText){
      const safe = apiText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      aFill(bubble, safe.split(/\n+/).filter(Boolean), reply.actions);
    } else {
      aFill(bubble, reply.paragraphs, reply.actions);
    }
    if(reply.services && reply.services.length){ assistantState.last = reply.services; assistantState.unmatched = 0; }
    assistantState.history.push({ role: 'assistant', content: reply.paragraphs.join(' ').replace(/<[^>]+>/g, '') });
    aScroll();
    assistantState.busy = false;
    sendBtn.disabled = false;
    input.focus({ preventScroll: true });
  }

  const GOALS = [
    { id: 'clients', label: 'Conseguir más clientes', text: 'Quiero conseguir más clientes', services: ['growth-marketing', 'social-media'],
      intro: 'Conseguir más clientes casi nunca depende de una sola acción: hay que ser encontrado, generar confianza y convertir esa atención en contactos.' },
    { id: 'image', label: 'Mejorar mi imagen', text: 'Quiero mejorar la imagen de mi marca', services: ['brand-design', 'content-production'],
      intro: 'Cuando la imagen de una marca no está a la altura de su negocio, la gente duda antes de comprar.' },
    { id: 'sell', label: 'Vender online', text: 'Quiero vender online', services: ['web-development', 'growth-marketing'],
      intro: 'Vender online necesita dos cosas a la vez: una tienda que convierta y un flujo de personas que llegue a ella.' },
    { id: 'social', label: 'Mejorar mis redes sociales', text: 'Quiero mejorar mis redes sociales', services: ['social-media', 'content-production'],
      intro: 'Las redes funcionan cuando hay estrategia, constancia y medición detrás, no solo publicaciones sueltas.' },
    { id: 'automate', label: 'Automatizar procesos', text: 'Quiero automatizar procesos de mi negocio', services: ['ai-automation'],
      intro: 'Las tareas repetitivas se pueden automatizar para que tu equipo dedique su tiempo a lo que de verdad aporta valor.' },
    { id: 'web', label: 'Crear una web', text: 'Quiero crear una web', services: ['web-development', 'brand-design'],
      intro: 'Una web no es solo una página bonita: tiene que captar clientes, vender o gestionar pedidos y reservas.' },
    { id: 'unsure', label: 'No estoy seguro', text: 'No estoy seguro de por dónde empezar', services: [] }
  ];

  function aUnsureReply(userText){
    const T = (x) => (window.I18N ? I18N.tr(x) : x);
    return {
      paragraphs: ['No pasa nada, es lo más habitual. Cuéntame en una frase a qué se dedica tu negocio y qué te gustaría mejorar, o pídenos que analicemos tu proyecto y te proponemos por dónde empezar.'],
      actions: [aButton('Analizar mi proyecto', 'btn-primary', () => openContactForm(T('Hola, quiero que me ayuden a definir por dónde empezar') + '.'))]
    };
  }

  (function initGoalChips(){
    const box = document.getElementById('goal-chips');
    if(!box) return;
    box.innerHTML = GOALS.map(g => `<button type="button" class="chip" data-goal="${g.id}">${g.label}</button>`).join('');
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-goal]'); if(!b) return;
      const goal = GOALS.find(g => g.id === b.dataset.goal);
      if(goal) sendChatMessage(goal.text, goal);
    });
  })();

  renderTestimonials();
  (function initAssistantInput(){
    const input = document.getElementById('chat-input');
    if(!input) return;
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendChatMessage(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 160) + 'px';
    });
  })();

  // ---------- Home: constelación de servicios + animaciones de entrada ----------
  const constellationNodes = [
    { label: 'Brand',   href: 'brand-design/',       desc: 'Identidad visual, diseño para redes y manual de marca.',
      ico: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>' },
    { label: 'Content', href: 'content-production/', desc: 'Producción audiovisual, fotografía, video y edición.',
      ico: '<rect x="3" y="5" width="14" height="14" rx="2"/><path d="M17 9.5L21 7v10l-4-2.5"/>' },
    { label: 'Social',  href: 'social-media/',       desc: 'Estrategia y comunidad en Instagram, TikTok y más.',
      ico: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { label: 'Web',     href: 'web-development/',    desc: 'E-commerce, landing pages y plataformas a medida.',
      ico: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M8 21h8M12 18v3"/>' },
    { label: 'Growth',  href: 'growth-marketing/',   desc: 'SEO, GEO/AEO, Google Ads y Meta Ads.',
      ico: '<path d="M4 17l5-6 4 3 7-8"/><path d="M14 6h6v6"/>' },
    { label: 'IA',      href: 'ai-automation/',      desc: 'Agentes, chatbots y automatización de procesos.',
      ico: '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V4"/><circle cx="9" cy="12.5" r="1.2"/><circle cx="15" cy="12.5" r="1.2"/>' }
  ];

  (function initConstellation(){
    const host = document.getElementById('sys');
    if(!host) return;
    const C = 280, R = 190, NR = 38;
    const pos = constellationNodes.map((_, i) => {
      const a = (-90 + i * 60) * Math.PI / 180;
      return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
    });
    let rays = '', nodes = '', pulses = '';
    pos.forEach((p, i) => {
      const n = constellationNodes[i];
      rays += `<line class="ray" style="--i:${i}" pathLength="1" x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${C}" y2="${C}"/>`;
      if(!prefersReducedMotion){
        const b = (1.8 + i * 0.55).toFixed(2);
        pulses += `<circle class="pulse" r="4" visibility="hidden"><set attributeName="visibility" to="visible" begin="${b}s"/><animateMotion dur="3.4s" begin="${b}s" repeatCount="indefinite" path="M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${C} ${C}" calcMode="linear"/></circle>`;
      }
      nodes += `
        <a class="node" style="--i:${i}" href="${n.href}" data-i="${i}" aria-label="${n.label}: ${n.desc}">
          <g class="node-in">
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${NR}"/>
            <g class="ico" transform="translate(${(p.x - 14).toFixed(1)} ${(p.y - 14).toFixed(1)}) scale(1.17)">${n.ico}</g>
            <text x="${p.x.toFixed(1)}" y="${(p.y + NR + 26).toFixed(1)}">${n.label}</text>
          </g>
        </a>`;
    });
    host.innerHTML = `
      <svg viewBox="0 0 560 560" role="img">
        <circle class="ring" cx="${C}" cy="${C}" r="${R}"/>
        ${rays}
        ${pulses}
        <g class="core">
          <circle class="halo" cx="${C}" cy="${C}" r="76"/>
          <circle class="fill" cx="${C}" cy="${C}" r="58"/>
          <text x="${C}" y="${C - 2}">Tu</text>
          <text x="${C}" y="${C + 20}">objetivo</text>
        </g>
        ${nodes}
      </svg>`;

    const cap = document.getElementById('sys-cap');
    const def = 'Seis disciplinas, una sola dirección. <b>Pasa el cursor por cada una.</b>';
    cap.innerHTML = def;
    host.querySelectorAll('.node').forEach(el => {
      const n = constellationNodes[el.dataset.i];
      const show = () => { cap.innerHTML = '<b>' + n.label + '.</b> ' + n.desc; };
      const hide = () => { cap.innerHTML = def; };
      el.addEventListener('mouseenter', show); el.addEventListener('focus', show);
      el.addEventListener('mouseleave', hide); el.addEventListener('blur', hide);
    });

    if('IntersectionObserver' in window && !prefersReducedMotion){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => { if(en.isIntersecting){ host.classList.add('go'); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(host);
    } else {
      host.classList.add('go');
    }
  })();

  (function initReveal(){
    const els = document.querySelectorAll('.rv');
    if(!els.length) return;
    document.querySelectorAll('.h-bento, .h-stats').forEach(group => {
      group.querySelectorAll(':scope > .rv').forEach((el, i) => el.style.setProperty('--rd', ((i % 3) * 0.08) + 's'));
    });
    if(!('IntersectionObserver' in window) || prefersReducedMotion){
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
  })();
  // ---------- Trabajo real por servicio (se muestra en cada página de servicio) ----------
  // Para añadir un cliente: agrega una línea en el servicio que corresponda.
  //   { name, what, label, url }  -> url externa (Instagram, Behance, web...)
  //   { name, what, label, case: 'slug-del-proyecto' } -> abre el caso dentro del portafolio
  const serviceWork = {
    'social-media': [
      { name: 'Inversiones MDS', what: 'Estrategia y gestión de su Instagram', label: 'Ver Instagram', url: 'https://www.instagram.com/inversiones.mds/' }
      // { name: 'Legacy World', what: 'Redes sociales', label: 'Ver Instagram', url: 'https://www.instagram.com/…' }
    ],
    'content-production': [
      { name: 'Legacy Podcast', what: 'Podcast producido de punta a punta', label: 'Ver episodio en YouTube', url: 'https://youtu.be/i-frSRSTsq8' },
      { name: 'Inversiones MDS', what: 'Contenido en video para su marca', label: 'Ver caso', case: 'mds-contenido' },
      { name: 'Urbantex', what: 'Contenido en video para redes', label: 'Ver caso', case: 'urbantex-contenido' }
    ],
    'brand-design': [
      { name: 'Decoplant', what: 'Naming e identidad visual', label: 'Ver en Behance', url: 'https://www.behance.net/gallery/218332771/DECOPLANT-Branding' },
      { name: 'Multiservicios RDR', what: 'Identidad visual', label: 'Ver en Behance', url: 'https://www.behance.net/gallery/218334897/RDR-Identidad-Visual' },
      { name: 'Corporación Tecnoclean', what: 'Identidad visual', label: 'Ver en Behance', url: 'https://www.behance.net/gallery/218332217/Tecnoclean-Identidad-visual' },
      { name: 'Urbantex', what: 'Identidad visual', label: 'Ver en Behance', url: 'https://www.behance.net/gallery/173188679/URBANTEX-Identidad-Visual' },
      { name: 'Synergy', what: 'Fichas de producción', label: 'Ver en Behance', url: 'https://www.behance.net/gallery/173188451/Synergy-Store-Ficha-de-produccion' },
      { name: 'HPS', what: 'Asesoría de marca', label: 'Ver caso', case: 'hps-asesoria' },
      { name: 'Winners League Unimet', what: 'Indumentaria deportiva', label: 'Ver caso', case: 'winners-producto' }
    ],
    'web-development': [
      { name: 'Legacy World', what: 'Tienda online propia, nacional e internacional', label: 'Ver legacy-world.com', url: 'https://legacy-world.com' }
    ],
    'growth-marketing': [],
    'ai-automation': []
  };

  function renderServiceWork(){
    const box = document.getElementById('service-work');
    if(!box) return;
    const list = serviceWork[box.dataset.service] || [];
    if(!list.length){ box.remove(); return; }
    const base = document.getElementById('home-view') ? '' : '../';
    const arrow = '<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 14L14 6M7 6h7v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    box.innerHTML = `
      <div class="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20 border-t border-white/10">
        <h2 class="font-display text-3xl md:text-4xl mb-3">Trabajo real en este servicio</h2>
        <p class="text-white/55 mb-9 max-w-xl">Mira lo que hemos hecho para otros clientes.</p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${list.map(c => {
            const href = c.url ? c.url : base + 'proyectos/' + c.case + '/';
            const ext = c.url ? ' target="_blank" rel="noopener"' : '';
            return `<a href="${href}"${ext} class="glass hover-lift rounded-2xl p-6 flex flex-col justify-between gap-6">
              <div><h3 class="font-display text-xl mb-1">${c.name}</h3><p class="text-white/60 text-[14px] leading-relaxed">${c.what}</p></div>
              <span class="inline-flex items-center gap-2 text-sm font-semibold">${c.label} ${arrow}</span>
            </a>`;
          }).join('')}
        </div>
      </div>`;
  }
  renderServiceWork();

  window.__appReady = true;

  // ---------- Abstract hero visuals per service (no stock photography) ----------
  const serviceVisuals = {
    'social-media': `<svg viewBox="0 0 200 200" fill="none" class="w-full h-full"><circle cx="100" cy="100" r="14" stroke="white" stroke-opacity=".8" stroke-width="1.4"/><circle cx="40" cy="55" r="9" stroke="white" stroke-opacity=".55" stroke-width="1.4"/><circle cx="160" cy="55" r="9" stroke="white" stroke-opacity=".55" stroke-width="1.4"/><circle cx="40" cy="150" r="9" stroke="white" stroke-opacity=".55" stroke-width="1.4"/><circle cx="160" cy="150" r="9" stroke="white" stroke-opacity=".55" stroke-width="1.4"/><path d="M88 90L48 62M112 90L152 62M88 110L48 143M112 110L152 143" stroke="white" stroke-opacity=".35" stroke-width="1.2"/></svg>`,
    'content-production': `<svg viewBox="0 0 200 200" fill="none" class="w-full h-full"><rect x="35" y="55" width="130" height="90" rx="8" stroke="white" stroke-opacity=".7" stroke-width="1.4"/><path d="M85 82L120 100L85 118V82Z" stroke="white" stroke-opacity=".8" stroke-width="1.4" stroke-linejoin="round"/><path d="M35 75H165M35 125H165" stroke="white" stroke-opacity=".25" stroke-width="1.2"/></svg>`,
    'brand-design': `<svg viewBox="0 0 200 200" fill="none" class="w-full h-full"><circle cx="85" cy="100" r="45" stroke="white" stroke-opacity=".55" stroke-width="1.4"/><path d="M118 60L150 100L118 140L100 100L118 60Z" stroke="white" stroke-opacity=".8" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    'web-development': `<svg viewBox="0 0 200 200" fill="none" class="w-full h-full"><rect x="30" y="45" width="140" height="110" rx="8" stroke="white" stroke-opacity=".7" stroke-width="1.4"/><path d="M30 70H170" stroke="white" stroke-opacity=".7" stroke-width="1.4"/><circle cx="45" cy="57.5" r="3" fill="white" fill-opacity=".6"/><circle cx="57" cy="57.5" r="3" fill="white" fill-opacity=".6"/><path d="M55 100L75 120L55 140M100 140H145" stroke="white" stroke-opacity=".6" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'growth-marketing': `<svg viewBox="0 0 200 200" fill="none" class="w-full h-full"><path d="M35 145L75 100L105 125L165 55" stroke="white" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M130 55H165V90" stroke="white" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 165H165" stroke="white" stroke-opacity=".25" stroke-width="1.2"/></svg>`,
    'ai-automation': `<svg viewBox="0 0 200 200" fill="none" class="w-full h-full"><rect x="70" y="80" width="60" height="45" rx="10" stroke="white" stroke-opacity=".8" stroke-width="1.4"/><path d="M100 80V60" stroke="white" stroke-opacity=".8" stroke-width="1.4" stroke-linecap="round"/><circle cx="100" cy="54" r="6" stroke="white" stroke-opacity=".8" stroke-width="1.4"/><circle cx="85" cy="102" r="5" fill="white" fill-opacity=".7"/><circle cx="115" cy="102" r="5" fill="white" fill-opacity=".7"/><circle cx="40" cy="102" r="7" stroke="white" stroke-opacity=".4" stroke-width="1.2"/><circle cx="160" cy="102" r="7" stroke="white" stroke-opacity=".4" stroke-width="1.2"/><path d="M70 102H47M130 102H153" stroke="white" stroke-opacity=".3" stroke-width="1.2"/></svg>`
  };

  // ---------- Featured project card (used inside each service page) ----------
  function renderFeaturedProject(containerId, slug){
    const container = document.getElementById(containerId);
    const p = slug ? projects[slug] : null;

    if(!p || (!p.challenge && !p.solution && !p.result)){
      container.innerHTML = `
        <div class="glass rounded-3xl p-8 md:p-12">
          <div class="grid md:grid-cols-2 gap-10 items-center">
            <div class="aspect-video rounded-2xl border border-dashed border-white/15 flex items-center justify-center">
              <span class="text-white/25 text-sm">Imagen del proyecto — próximamente</span>
            </div>
            <div>
              <h3 class="font-display text-2xl mb-6 text-white/40">Nombre del proyecto — próximamente</h3>
              <p class="text-white/40 text-sm leading-relaxed">Estamos documentando este caso para mostrártelo con el detalle que merece.</p>
            </div>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="glass rounded-3xl p-8 md:p-12">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div class="aspect-video rounded-2xl overflow-hidden glass flex items-center justify-center">
            <div class="folder-badge" style="width:96px;height:96px;">
              <img src="${portfolioBadges[p.badge]}" alt="${p.client}" />
            </div>
          </div>
          <div>
            <p class="text-white/45 text-xs mb-2">${p.client}</p>
            <h3 class="font-display text-2xl mb-5">${p.name}</h3>
            ${p.result ? `<p class="text-white/70 text-sm leading-relaxed mb-6">${p.result}</p>` : (p.solution ? `<p class="text-white/60 text-sm leading-relaxed mb-6">${p.solution}</p>` : '')}
            <button onclick="showProject('${slug}')" class="btn-ghost text-center font-semibold px-6 py-3 rounded-full text-sm">Ver caso completo →</button>
          </div>
        </div>
      </div>`;
  }

  let currentServiceCtaLabel = 'Enviar proyecto';

  function showService(id){
    // Cada servicio vive en su propia página (más simple y mejor para SEO)
    if(services[id]){ window.location.href = id + '/'; return; }
    const s = services[id];
    if(!s) return;
    trackEvent('service_view', { service: id });

    document.getElementById('sd-eyebrow').textContent = s.eyebrow;
    document.getElementById('sd-title').textContent = s.title;
    document.getElementById('sd-description').textContent = s.description;
    document.getElementById('sd-visual').innerHTML = serviceVisuals[id] || '';

    currentServiceCtaLabel = s.ctaLabel || 'Enviar proyecto';
    document.getElementById('sd-cta-submit-btn').textContent = currentServiceCtaLabel + ' →';

    const automationWrap = document.getElementById('sd-automation-wrap');
    if(s.automationAreas){
      automationWrap.classList.remove('hidden');
      document.getElementById('sd-automation-areas').innerHTML = s.automationAreas.map(a => `<span class="tag-pill">${a}</span>`).join('');
    } else {
      automationWrap.classList.add('hidden');
    }

    document.getElementById('sd-intro').innerHTML = s.intro.map(p => `<p>${p}</p>`).join('');

    document.getElementById('sd-whatwedo').innerHTML = s.whatWeDo.map(item => `
      <div class="glass rounded-2xl p-6">
        <h3 class="font-display text-lg mb-2">${item.name}</h3>
        <p class="text-white/60 text-[14px] leading-relaxed">${item.desc}</p>
      </div>`).join('');

    document.getElementById('sd-includes').innerHTML = s.includes.map(item => `
      <span class="tag-pill">${item}</span>`).join('');

    renderServicePricing(s.pricing);
    renderFeaturedProject('sd-project', s.featuredProject);

    // Testimonial (only if one exists for this service, per real data — no invented quotes)
    const testimonialWrap = document.getElementById('sd-testimonial-wrap');
    const t = testimonials[id];
    if(t){
      testimonialWrap.innerHTML = `
        <div class="glass rounded-3xl p-8 md:p-10">
          <div class="flex gap-1 mb-5" aria-label="5 de 5 estrellas">
            ${'<svg class="star" width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6z"/></svg>'.repeat(5)}
          </div>
          <p class="text-white/75 leading-relaxed mb-7 text-lg">"${t.quote}"</p>
          <p class="font-medium text-white text-sm">${t.name}</p>
          <p class="text-white/45 text-xs mt-0.5">${t.company}</p>
        </div>`;
    } else {
      testimonialWrap.innerHTML = `
        <div class="glass rounded-3xl p-8 md:p-10 text-center border-dashed">
          <p class="text-white/40 text-sm italic">Todavía no sumamos un testimonio específico de este servicio — pronto vas a poder leerlo acá.</p>
        </div>`;
    }

    document.getElementById('sd-related').innerHTML = s.related.map(relId => {
      const rel = services[relId];
      return `
        <button onclick="showService('${relId}')" class="glass hover-lift rounded-2xl p-6 text-left">
          <h3 class="font-display text-lg mb-1.5">${rel.eyebrow}</h3>
          <p class="text-white/50 text-[13px]">${rel.title}</p>
        </button>`;
    }).join('');

    document.getElementById('sd-faq').innerHTML = s.faq.map((item, i) => `
      <div class="faq-item">
        <button class="faq-question" onclick="toggleFaq(this)">
          <span>${item.q}</span>
          <svg class="faq-chevron" width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M1 1L7 7L13 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="faq-answer">${item.a}</div>
      </div>`).join('');

    document.getElementById('sd-cta-service').value = s.eyebrow;
    document.getElementById('sd-cta-form-panel').classList.remove('hidden');
    document.getElementById('sd-cta-success-panel').classList.add('hidden');
    document.getElementById('sd-cta-error-panel').classList.add('hidden');
    document.getElementById('sd-whatsapp-link').href =
      waLink(CONFIG.WHATSAPP_NUMBER, 'Hola, quiero hablar sobre ' + s.eyebrow + '.');

    document.title = s.eyebrow + ' — LE STUDIO';
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute('content', s.description);

    document.getElementById('home-view').style.display = 'none';
    document.getElementById('project-detail-view').style.display = 'none';
    document.getElementById('portfolio-page-view').style.display = 'none';
    document.getElementById('review-form-view').style.display = 'none';
    document.getElementById('service-detail-view').style.display = 'block';
    closeMobile();
    closeDropdown();
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});

    if(location.hash.slice(1) !== id){
      history.pushState({service: id}, '', '#' + id);
    }
  }

  function toggleFaq(btn){
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  }

  async function submitServiceCTA(){
    const name = document.getElementById('sd-cta-name').value.trim();
    const email = document.getElementById('sd-cta-email').value.trim();
    const company = document.getElementById('sd-cta-company').value.trim();
    const service = document.getElementById('sd-cta-service').value;
    const message = document.getElementById('sd-cta-message').value.trim();

    if(!name || !email || !message){
      alert(window.I18N ? I18N.tr('Por favor completá al menos nombre, email y cuéntanos sobre el proyecto.') : 'Por favor completá al menos nombre, email y cuéntanos sobre el proyecto.');
      return;
    }

    const btn = document.getElementById('sd-cta-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const result = await submitLead({ name, email, company, service, message });

    btn.disabled = false;
    btn.textContent = currentServiceCtaLabel + ' →';

    if(result.ok){
      document.getElementById('sd-cta-form-panel').classList.add('hidden');
      document.getElementById('sd-cta-success-panel').classList.remove('hidden');
      document.getElementById('sd-cta-error-panel').classList.add('hidden');
    } else {
      document.getElementById('sd-cta-form-panel').classList.add('hidden');
      document.getElementById('sd-cta-error-panel').classList.remove('hidden');
    }
  }

  function goHome(){
    document.getElementById('service-detail-view').style.display = 'none';
    document.getElementById('project-detail-view').style.display = 'none';
    document.getElementById('portfolio-page-view').style.display = 'none';
    document.getElementById('review-form-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
    document.title = 'LE STUDIO — Creative, Digital & AI Studio';
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute('content', 'LE STUDIO es un estudio de estrategia, creatividad y tecnología. Diseñamos marcas, producimos contenido, desarrollamos productos digitales y aplicamos IA para ayudar a empresas a crecer.');
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
    if(location.hash){
      history.pushState({}, '', location.pathname + location.search);
    }
  }

  // ---------- Portfolio gallery page ----------
  function showPortfolioPage(){
    window.location.href = 'proyectos/'; return;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('service-detail-view').style.display = 'none';
    document.getElementById('project-detail-view').style.display = 'none';
    document.getElementById('review-form-view').style.display = 'none';
    document.getElementById('portfolio-page-view').style.display = 'block';
    closeMobile();
    closeDropdown();

    document.getElementById('portfolio-gallery-grid').innerHTML = getUniqueClientEntries().map(entry => `
        <button onclick="showProject('${entry.slug}')" class="glass hover-lift rounded-2xl overflow-hidden text-left flex flex-col">
          <div class="aspect-video">
            <img src="${portfolioBadges[entry.badge]}" alt="${entry.client}" class="w-full h-full object-cover" />
          </div>
          <div class="p-6">
            <h3 class="font-display text-lg mb-1.5">${entry.client}</h3>
            <p class="text-white/50 text-[13px]">${entry.tags.join(', ')}</p>
          </div>
        </button>`).join('');

    document.title = 'Trabajo seleccionado — LE STUDIO';
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
    if(location.hash.slice(1) !== 'portafolio'){
      history.pushState({portfolio: true}, '', '#portafolio');
    }
  }

  // ---------- Individual project detail page ----------
  function getSiblingProjectSlugs(slug){
    const p = projects[slug];
    if(!p) return [slug];
    return Object.keys(projects).filter(k => projects[k].client === p.client);
  }

  function showProject(slug){
    if(projects[slug]){ window.location.href = 'proyectos/' + slug + '/'; return; }
    const p = projects[slug];
    if(!p) return;
    trackEvent('portfolio_click', { project: slug });

    document.getElementById('pd-client').textContent = p.client;
    document.getElementById('pd-title').textContent = p.name;
    document.getElementById('pd-tags').innerHTML = p.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');

    // If this client has more than one project, show a switcher so people can
    // browse between them without treating each one as a separate portfolio entry.
    const tabsEl = document.getElementById('pd-project-tabs');
    const siblings = getSiblingProjectSlugs(slug);
    if(siblings.length > 1){
      tabsEl.classList.remove('hidden');
      tabsEl.classList.add('flex');
      tabsEl.innerHTML = siblings.map(sib => {
        const sp = projects[sib];
        const active = sib === slug;
        return `<button onclick="showProject('${sib}')" class="px-4 py-2 rounded-full text-sm font-medium transition-colors ${active ? 'bg-white text-[#021024]' : 'glass text-white/60 hover:text-white'}">${sp.tags[0]}</button>`;
      }).join('');
    } else {
      tabsEl.classList.add('hidden');
      tabsEl.classList.remove('flex');
      tabsEl.innerHTML = '';
    }

    // Embed (video / behance / instagram link-out / none yet)
    const embedEl = document.getElementById('pd-embed');
    if(p.embedType === 'youtube'){
      embedEl.innerHTML = `
        <a href="${p.linkUrl}" target="_blank" rel="noopener" class="group relative block aspect-video rounded-2xl overflow-hidden glass">
          <img src="https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg" alt="${p.name}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 group-hover:scale-105 transition-transform flex items-center justify-center shadow-xl">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#021024"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <span class="absolute bottom-4 right-4 text-white/90 text-xs bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">Ver en YouTube →</span>
        </a>`;
    } else if(p.embedType === 'behance'){
      embedEl.innerHTML = `
        <a href="${p.linkUrl}" target="_blank" rel="noopener" class="group relative block aspect-video rounded-2xl overflow-hidden glass">
          <img src="${portfolioBadges[p.badge]}" alt="${p.name}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex flex-col items-center justify-center gap-3 text-center px-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M7.8 6.3H2v1.4h5.8V6.3zM22 15.2c0 .4 0 .7-.1 1H15c.1 1.3 1.2 2 2.5 2 .9 0 1.6-.3 2.3-1l1.4 1.3c-1 1.1-2.3 1.7-3.8 1.7-2.8 0-4.7-1.9-4.7-4.6 0-2.6 1.9-4.6 4.5-4.6 2.7 0 4.2 2 4.2 4.2zM19.9 14.2c-.1-1.2-.9-1.9-2-1.9-1.1 0-1.9.7-2.1 1.9h4.1zM8.6 9.7c1.9 0 3 1.3 3 3 0 .4-.1.8-.2 1.1.9.5 1.4 1.4 1.4 2.5 0 1.9-1.5 3.1-3.7 3.1H2V9.7h6.6zm-.4 4.7c.9 0 1.5-.5 1.5-1.4 0-.8-.5-1.3-1.5-1.3H4.3v2.7h3.9zm.3 4.5c1 0 1.7-.5 1.7-1.5 0-.9-.6-1.4-1.7-1.4H4.3v2.9h4.2z"/></svg>
            <p class="text-white font-medium text-sm">Ver el proyecto completo en Behance</p>
          </div>
        </a>`;
    } else if(p.embedType === 'instagram'){
      embedEl.innerHTML = `
        <div class="glass rounded-2xl p-10 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="mx-auto mb-4"><rect x="3" y="3" width="18" height="18" rx="5" stroke="white" stroke-opacity=".8" stroke-width="1.6"/><circle cx="12" cy="12" r="4.2" stroke="white" stroke-opacity=".8" stroke-width="1.6"/><circle cx="17.3" cy="6.7" r="1.1" fill="white" fill-opacity=".8"/></svg>
          <p class="text-white/55 text-sm mb-6">Este proyecto vive directamente en redes sociales.</p>
          <a href="${p.linkUrl}" target="_blank" rel="noopener" class="btn-ghost inline-block font-semibold px-7 py-3 rounded-full text-sm">Ver perfil en Instagram →</a>
        </div>`;
    } else if(p.embedType === 'reels'){
      const reelsHtml = (p.reelLinks || []).map((url, i) => `
        <a href="${url}" target="_blank" rel="noopener" class="glass hover-lift rounded-2xl p-6 flex items-center justify-between gap-3">
          <span class="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="white" fill-opacity=".85"/></svg>
            <span class="text-white/80 text-sm font-medium">Reel ${i + 1}</span>
          </span>
          <span class="text-white/40 text-xs">Ver en Instagram →</span>
        </a>`).join('');
      embedEl.innerHTML = `<div class="grid sm:grid-cols-3 gap-4">${reelsHtml}</div>`;
    } else if(p.embedType === 'link'){
      embedEl.innerHTML = `
        <a href="${p.linkUrl}" target="_blank" rel="noopener" class="glass hover-lift rounded-2xl p-10 flex flex-col items-center text-center gap-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14 3h7v7" stroke="white" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 14L21 3" stroke="white" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5" stroke="white" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="text-white font-medium">${p.linkLabel || 'Ver sitio'}</span>
        </a>`;
    } else {
      embedEl.innerHTML = `
        <div class="aspect-video rounded-2xl border border-dashed border-white/15 flex items-center justify-center">
          <span class="text-white/25 text-sm">Imagen o video del proyecto — próximamente</span>
        </div>`;
    }

    // Story: reto / solución / resultado — only show blocks that actually have content
    const storyEl = document.getElementById('pd-story');
    const blocks = [];
    if(p.challenge) blocks.push({ label: 'El reto', text: p.challenge });
    if(p.solution) blocks.push({ label: 'La solución', text: p.solution });
    if(p.result) blocks.push({ label: 'El resultado', text: p.result });
    if(blocks.length){
      const colsClass = blocks.length === 1 ? 'grid-cols-1' : (blocks.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3');
      storyEl.className = 'grid ' + colsClass + ' gap-5 mb-14';
      storyEl.innerHTML = blocks.map(b => `
        <div class="glass rounded-2xl p-7">
          <p class="text-white/45 text-xs uppercase tracking-wide mb-2">${b.label}</p>
          <p class="text-white/65 text-sm leading-relaxed">${b.text}</p>
        </div>`).join('');
    } else {
      storyEl.className = 'grid grid-cols-1 gap-5 mb-14';
      storyEl.innerHTML = `
        <div class="glass rounded-2xl p-7 text-center">
          <p class="text-white/40 text-sm italic">Estamos documentando el detalle de este proyecto — pronto vas a poder leerlo acá.</p>
        </div>`;
    }

    // Testimonial
    const testEl = document.getElementById('pd-testimonial');
    if(p.testimonial){
      const t = p.testimonial;
      testEl.innerHTML = `
        <div class="glass rounded-3xl p-8 md:p-10">
          <div class="flex gap-1 mb-5" aria-label="${t.rating || 5} de 5 estrellas">
            ${'<svg class="star" width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6z"/></svg>'.repeat(t.rating || 5)}
          </div>
          <p class="text-white/75 leading-relaxed mb-7 text-lg">"${t.quote}"</p>
          <p class="font-medium text-white text-sm">${t.name}</p>
          <p class="text-white/45 text-xs mt-0.5">${t.company}</p>
        </div>`;
    } else {
      testEl.innerHTML = '';
    }

    // Bottom CTA -> link to the related service
    const serviceLinkBtn = document.getElementById('pd-service-link');
    const rel = services[p.service];
    serviceLinkBtn.textContent = rel ? 'Ver servicio: ' + rel.eyebrow : 'Ver servicios';
    serviceLinkBtn.onclick = () => showService(p.service);

    document.getElementById('home-view').style.display = 'none';
    document.getElementById('service-detail-view').style.display = 'none';
    document.getElementById('portfolio-page-view').style.display = 'none';
    document.getElementById('review-form-view').style.display = 'none';
    document.getElementById('project-detail-view').style.display = 'block';
    closeMobile();
    closeDropdown();
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});

    document.title = p.name + ' — LE STUDIO';

    if(location.hash.slice(1) !== 'proyecto-' + slug){
      history.pushState({project: slug}, '', '#proyecto-' + slug);
    }
  }

  function scrollToTop(){
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function scrollToId(id){
    // If we're in a service detail view, go home first so the home sections exist
    const detail = document.getElementById('service-detail-view');
    if(detail.style.display === 'block'){
      goHome();
    }
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  function scrollToIdInPage(id){
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }

  // ---------- Deep links: #social-media, #brand-design, etc. ----------
  function routeFromHash(){
    const hash = location.hash.slice(1);
    if(hash && services[hash]){
      showService(hash);
    } else if(hash === 'portafolio'){
      showPortfolioPage();
    } else if(hash === 'resena'){
      showReviewForm();
    } else if(hash.indexOf('proyecto-') === 0 && projects[hash.slice(9)]){
      showProject(hash.slice(9));
    } else if(!hash){
      goHome();
    }
  }
  window.addEventListener('popstate', routeFromHash);

  // ---------- Review request page (compartí #resena con tus clientes) ----------
  let selectedRating = 0;
  function renderReviewStars(){
    const wrap = document.getElementById('review-stars');
    wrap.innerHTML = '';
    for(let i = 1; i <= 5; i++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', i + ' de 5 estrellas');
      btn.style.cssText = 'background:none;border:none;cursor:pointer;padding:2px;';
      btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 20 20" fill="' + (i <= selectedRating ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.3" style="color:' + (i <= selectedRating ? '#d9c79a' : 'rgba(255,255,255,.3)') + '"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6z"/></svg>';
      // Rating scale is 0-5: clicking the star that's already the current rating resets it to 0.
      btn.onclick = () => { selectedRating = (selectedRating === i) ? 0 : i; renderReviewStars(); };
      wrap.appendChild(btn);
    }
    const label = document.getElementById('review-rating-label');
    if(label) label.textContent = selectedRating + '/5';
  }

  function showReviewForm(){
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('service-detail-view').style.display = 'none';
    document.getElementById('project-detail-view').style.display = 'none';
    document.getElementById('portfolio-page-view').style.display = 'none';
    document.getElementById('review-form-view').style.display = 'block';
    closeMobile();
    closeDropdown();

    document.getElementById('review-name').value = '';
    document.getElementById('review-company').value = '';
    document.getElementById('review-role').value = '';
    document.getElementById('review-service').value = 'Social Media';
    document.getElementById('review-text').value = '';
    selectedRating = 0;
    renderReviewStars();
    document.getElementById('review-form-panel').classList.remove('hidden');
    document.getElementById('review-success-panel').classList.add('hidden');
    document.getElementById('review-error-panel').classList.add('hidden');

    document.title = 'Déjanos tu reseña — LE STUDIO';
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
    if(location.hash.slice(1) !== 'resena'){
      history.pushState({review: true}, '', '#resena');
    }
  }

  async function submitReview(){
    const name = document.getElementById('review-name').value.trim();
    const company = document.getElementById('review-company').value.trim();
    const role = document.getElementById('review-role').value.trim();
    const service = document.getElementById('review-service').value;
    const message = document.getElementById('review-text').value.trim();

    if(!name || !company || !role || !message){
      alert(window.I18N ? I18N.tr('Por favor completá tu nombre, tu empresa, tu cargo y la descripción.') : 'Por favor completá tu nombre, tu empresa, tu cargo y la descripción.');
      return;
    }

    const btn = document.getElementById('review-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const result = await submitLead({ name, company, role, service, rating: selectedRating, message }, 'review');

    btn.disabled = false;
    btn.textContent = 'Enviar reseña';

    if(result.ok){
      document.getElementById('review-form-panel').classList.add('hidden');
      document.getElementById('review-success-panel').classList.remove('hidden');
      document.getElementById('review-error-panel').classList.add('hidden');
    } else {
      document.getElementById('review-form-panel').classList.add('hidden');
      document.getElementById('review-error-panel').classList.remove('hidden');
    }
  }

  // ---------- Direction-aware scroll dock (no flicker) ----------
  // Scrolling down past the threshold: collapse the full nav, show the compact dock.
  // Scrolling up: bring back the full nav and hide the dock.
  // A jitter threshold ignores tiny trackpad/inertia fluctuations, and a cooldown
  // stops the state from flipping again before the previous transition finished —
  // together these are what actually kill the flicker.
  let lastScrollY = window.scrollY;
  let scrollDirection = 'up';
  let scrolledState = false;
  let scrollTicking = false;
  let lastToggleTime = 0;
  const SCROLL_JITTER_THRESHOLD = 8;
  const SCROLL_TOGGLE_COOLDOWN = 380; // ms, a touch longer than the CSS transitions

  function computeScrollState(){
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    if(Math.abs(delta) > SCROLL_JITTER_THRESHOLD){
      scrollDirection = delta > 0 ? 'down' : 'up';
      lastScrollY = currentY;
    }
    const root = document.documentElement;
    // El dock está disponible en cuanto se baja un poco, suba o baje la persona.
    root.classList.toggle('scrolled', currentY > 80);
    // El menú superior solo se oculta mientras se baja.
    const shouldHide = currentY > 80 && scrollDirection === 'down';
    const now = performance.now();
    if(shouldHide !== scrolledState && (now - lastToggleTime) > SCROLL_TOGGLE_COOLDOWN){
      scrolledState = shouldHide;
      lastToggleTime = now;
      root.classList.toggle('nav-hide', shouldHide);
    }
    scrollTicking = false;
  }

  function onScroll(){
    if(!scrollTicking){
      window.requestAnimationFrame(computeScrollState);
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  computeScrollState();

  // ---------- Dock: enlaces reales (funcionan desde cualquier página) ----------
  // En la home evitamos recargar y volvemos a la vista principal si hace falta;
  // en el resto de páginas el enlace normal (href) abre la página.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.dock-btn[data-nav]');
    if(!a) return;
    const home = document.getElementById('home-view');
    if(!home) return;
    e.preventDefault();
    const nav = a.dataset.nav;
    if(nav === 'home'){ goHome(); scrollToTop(); return; }
    if(nav === 'portafolio'){ showPortfolioPage(); return; }
    if(home.style.display === 'none') goHome();
    setTimeout(() => scrollToId(nav), 40);
  });

  // ---------- Mobile menu ----------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  function closeMobile(){ mobileMenu.classList.add('hidden'); }

  // ---------- Dropdown (click support for touch/keyboard, hover handled by CSS) ----------
  const servTogg = document.getElementById('servicios-toggle');
  const servPanel = document.getElementById('servicios-panel');
  servTogg.addEventListener('click', () => {
    const open = servPanel.classList.toggle('force-open');
    servTogg.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if(!e.target.closest('.dropdown-group')){
      closeDropdown();
    }
  });
  function closeDropdown(){
    servPanel.classList.remove('force-open');
    servTogg.setAttribute('aria-expanded', 'false');
  }

  // Run once everything above is initialized, so a direct/refreshed link like
  // #social-media, #portafolio or #proyecto-legacy-podcast (or the back/forward buttons)
  // can safely call the relevant show function.
  if(location.hash){
    routeFromHash();
  }
