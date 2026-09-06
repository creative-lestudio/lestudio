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
  const testimonials = {
    'social-media': {
      quote: 'Desde que LE STUDIO tomó nuestras redes, los informes mensuales nos muestran exactamente qué está funcionando y por qué. Nunca habíamos tenido tanta claridad.',
      name: 'Directora de Operaciones',
      company: 'Inversiones MDS'
    },
    'content-production': {
      quote: 'Una producción de alto nivel gestionada de forma 360 por LE STUDIO, lo cual ocasionó que desde nuestro primer episodio consiguiéramos muchas vistas de forma orgánica.',
      name: 'Marcelo Leal',
      company: 'Legacy World'
    },
    'brand-design': {
      quote: 'Nos armaron la identidad completa —naming, logo, papelería y manual de marca— en semanas. Hoy toda la empresa habla el mismo idioma visual.',
      name: 'Gerenta General',
      company: 'Decoplant'
    }
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
      solution: 'Dirigimos y producimos el podcast de punta a punta: definimos el concepto, el guion y la estructura de cada episodio, desarrollamos la dirección de arte, y nos encargamos de la producción y postproducción completa del contenido.',
      result: '35.000 reproducciones orgánicas en el primer episodio, sin pauta paga.',
      testimonial: { quote: 'Una producción de alto nivel gestionada de forma 360 por LE STUDIO, lo cual ocasionó que desde nuestro primer episodio consiguiéramos muchas vistas de forma orgánica.', name: 'Marcelo Leal', role: 'Fundador', company: 'Legacy World', rating: 5 }
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
      testimonial: { quote: 'Nos armaron la identidad completa —naming, logo, papelería y manual de marca— en semanas. Hoy toda la empresa habla el mismo idioma visual.', name: '', role: 'Gerenta General', company: 'Decoplant', rating: 5 }
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
      testimonial: { quote: 'Desde que LE STUDIO tomó nuestras redes, los informes mensuales nos muestran exactamente qué está funcionando y por qué. Nunca habíamos tenido tanta claridad.', name: '', role: 'Directora de Operaciones', company: 'Inversiones MDS', rating: 5 }
    },
    'legacy-world-ecommerce': {
      name: 'Legacy World — E-commerce',
      client: 'Legacy World',
      badge: 'legacy',
      tags: ['Web & Digital Development', 'AI & Automation'],
      service: 'web-development',
      solution: 'Desarrollamos el e-commerce de Legacy World de punta a punta: diseño a medida, integración de pasarela de pagos y un sistema de gestión de pedidos por WhatsApp que automatiza buena parte de la comunicación con cada cliente. El sitio recibe actualización y mantenimiento constante.'
    },
    'rdr-identidad': { name: 'Multiservicios RDR', client: 'Multiservicios RDR', badge: 'rdr', tags: ['Identidad visual'], service: 'brand-design' },
    'tecnoclean-identidad': { name: 'Corporación Tecnoclean', client: 'Corporación Tecnoclean', badge: 'tecnoclean', tags: ['Identidad visual'], service: 'brand-design' },
    'urbantex-identidad': { name: 'Urbantex', client: 'Urbantex', badge: 'urbantex', tags: ['Identidad visual', 'Contenido'], service: 'brand-design' },
    'hps-asesoria': { name: 'HPS', client: 'HPS', badge: 'hps', tags: ['Asesoría de marca'], service: 'brand-design' },
    'synergy-creativa': { name: 'Synergy', client: 'Synergy', badge: 'synergy', tags: ['Diseño, Contenido y Dirección creativa'], service: 'content-production' },
    'winners-producto': { name: 'Winners League Unimet', client: 'Winners League Unimet', badge: 'winners', tags: ['Desarrollo de producto', 'Diseño indumentaria'], service: 'brand-design' }
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
        <button onclick="showProject('${entry.slug}')" class="glass hover-lift rounded-2xl overflow-hidden text-left flex flex-col shrink-0 w-56">
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
    const list = [];
    Object.keys(projects).forEach(slug => {
      const p = projects[slug];
      if(p.testimonial){
        const svc = services[p.service];
        list.push(Object.assign({}, p.testimonial, { serviceLabel: svc ? svc.eyebrow : p.tags[0] }));
      }
    });

    const staticGrid = document.getElementById('testimonials-static-grid');
    const marqueeWrap = document.getElementById('testimonials-marquee-wrap');

    if(list.length <= 3){
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
      { name: 'Plan básico', items: [
        { label: 'Análisis de competencias', on: false },
        { label: 'Informes mensuales', on: false },
        { label: 'Community manager', on: false },
        { label: '(2) Pautas contenido orgánico', on: true },
        { label: 'Retoque fotográfico PRO', on: true },
        { label: '(4) Reels', on: true },
        { label: '(8) Post', on: true },
        { label: '(24) Historias', on: true },
        { label: 'Calendario de contenido', on: true },
        { label: '(1) Pauta contenido PRO', on: true },
        { label: 'Manejo de ADS (publicidad)', on: true },
      ]},
      { name: 'Plan intermedio', items: [
        { label: 'Análisis de competencias', on: true },
        { label: 'Informes mensuales', on: true },
        { label: 'Community manager', on: true },
        { label: '(4) Pautas contenido orgánico', on: true },
        { label: 'Retoque fotográfico PRO', on: true },
        { label: '(6) Reels', on: true },
        { label: '(12) Post', on: true },
        { label: '(32) Historias', on: true },
        { label: 'Calendario de contenido', on: true },
        { label: '(2) Pautas contenido PRO', on: true },
        { label: 'Manejo de ADS (publicidad)', on: true },
      ]},
      { name: 'Plan avanzado', items: [
        { label: 'Análisis de competencias', on: true },
        { label: 'Informes mensuales', on: true },
        { label: 'Community manager', on: true },
        { label: '(6) Pautas contenido orgánico', on: true },
        { label: 'Retoque fotográfico PRO', on: true },
        { label: '(8) Reels', on: true },
        { label: '(16) Post', on: true },
        { label: '(48) Historias', on: true },
        { label: 'Calendario de contenido', on: true },
        { label: '(4) Pautas contenido PRO', on: true },
        { label: 'Manejo de ADS (publicidad)', on: true },
      ]},
    ],
  };

  const pricingLabels = { identidad: 'Identidad Visual', social: 'Social Media' };

  function renderServicePricing(category){
    const container = document.getElementById('sd-pricing');
    if(!category || !pricingPlans[category]){ container.innerHTML = ''; return; }
    const plans = pricingPlans[category];
    const cards = plans.map(plan => {
      const quoteMsg = 'Hola, quiero solicitar presupuesto para el plan ' + plan.name + ' (' + pricingLabels[category] + ').';
      return `
      <div class="glass rounded-3xl p-8 flex flex-col">
        <h3 class="font-display text-2xl mb-6">${plan.name}</h3>
        <ul class="space-y-3.5 mb-8 flex-1">
          ${plan.items.map(it => `
            <li class="flex items-start gap-2.5 text-[14px] leading-snug ${it.on ? 'text-white/80' : 'text-white/25'}">
              ${it.on
                ? '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" class="mt-0.5 shrink-0"><path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                : '<span class="mt-[9px] w-2.5 h-px bg-white/20 shrink-0"></span>'}
              <span>${it.label}</span>
            </li>`).join('')}
        </ul>
        <button onclick='openContactForm(${JSON.stringify(quoteMsg)})' class="btn-primary text-center font-semibold px-6 py-3 rounded-full text-sm">Solicitar presupuesto</button>
      </div>`;
    }).join('');

    const customCard = `
      <div class="glass rounded-3xl p-8 flex flex-col border-dashed">
        <h3 class="font-display text-2xl mb-3">Plan personalizado</h3>
        <p class="text-white/55 text-[14px] leading-relaxed mb-8 flex-1">Elegí exactamente lo que tu marca necesita. Armás tu selección y completás tus datos para que te respondamos con una propuesta a medida.</p>
        <button onclick="openCustomPlan('${category}')" class="btn-ghost text-center font-semibold px-6 py-3 rounded-full text-sm">Crear plan personalizado</button>
      </div>`;

    container.innerHTML = `
      <div class="py-16 md:py-20 border-t border-white/10">
        <h2 class="font-display text-3xl mb-3">Planes de ${pricingLabels[category]}</h2>
        <p class="text-white/55 mb-8 max-w-2xl">Elegí el nivel de acompañamiento que tu marca necesita hoy, o armá tu propio plan a medida.</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">${cards}${customCard}</div>
      </div>`;
  }

  // ---------- Plan personalizado (custom plan -> contact form) ----------
  const customPlanItems = {
    identidad: ['Análisis de rubro','Análisis de competencias','Naming','Logotipo y versiones','Tipografías','Paleta de colores','Iconografía','Recursos gráficos','Papelería corporativa','Manual de marca'],
    social: ['Análisis de competencias','Informes mensuales','Community manager','Pautas de contenido orgánico','Retoque fotográfico PRO','Reels','Posts','Historias','Calendario de contenido','Pautas de contenido PRO','Manejo de ADS (publicidad)'],
  };

  function openCustomPlan(category){
    const modal = document.getElementById('custom-plan-modal');
    document.getElementById('custom-plan-title').textContent = 'Arma tu plan de ' + pricingLabels[category];
    document.getElementById('custom-plan-category').value = category;
    document.getElementById('custom-plan-checklist').innerHTML = customPlanItems[category].map((label, i) => `
      <label class="checkbox-row">
        <input type="checkbox" value="${label}" />
        <span class="text-white/80 text-sm">${label}</span>
      </label>`).join('');
    document.getElementById('custom-plan-notes').value = '';
    modal.classList.add('open');
  }

  function closeCustomPlan(){
    document.getElementById('custom-plan-modal').classList.remove('open');
  }

  function submitCustomPlan(){
    const category = document.getElementById('custom-plan-category').value;
    const checked = Array.from(document.querySelectorAll('#custom-plan-checklist input:checked')).map(i => i.value);
    const notes = document.getElementById('custom-plan-notes').value.trim();
    if(checked.length === 0){
      alert('Elegí al menos un ítem para tu plan personalizado.');
      return;
    }
    let message = 'Hola, quiero armar un plan personalizado de ' + pricingLabels[category] + ' con lo siguiente:\n\n';
    message += checked.map(c => '- ' + c).join('\n');
    if(notes) message += '\n\nNotas adicionales:\n' + notes;
    closeCustomPlan();
    openContactForm(message);
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

  function openContactForm(prefillMessage){
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
    document.getElementById('contact-company').value = '';
    document.getElementById('contact-service').value = 'No estoy seguro';
    document.getElementById('contact-message').value = prefillMessage || '';
    document.getElementById('contact-terms').checked = false;
    document.getElementById('contact-form-panel').classList.remove('hidden');
    document.getElementById('contact-success-panel').classList.add('hidden');
    document.getElementById('contact-error-panel').classList.add('hidden');
    document.getElementById('contact-modal').classList.add('open');
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
      alert('Por favor completá nombre, email y mensaje.');
      return;
    }
    if(!terms){
      alert('Necesitamos que aceptes ser contactado para poder responderte.');
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
        'Cualquiera puede programar publicaciones. Lo que separa una red social que vende de una que solo existe es la estrategia detrás: saber para quién hablás, qué querés lograr con cada pieza y cómo se conecta un mes con el siguiente.',
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
        { q: '¿También producís el contenido?', a: 'Sí. La estrategia y la producción van de la mano dentro de este servicio, y si necesitás piezas más elaboradas, se conecta directo con Content Production sin fricción entre equipos.' },
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
        { q: '¿Podemos contratar únicamente la producción?', a: 'Sí, si ya tenés un equipo de edición interno podemos encargarnos solo de la parte de grabación y dirección creativa.' },
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
      description: 'Diseñamos sistemas visuales coherentes que hacen que una marca se vea, se sienta y se recuerde como una sola. Desde una identidad completa hasta una pieza puntual, cada elemento responde al mismo lenguaje visual.',
      ctaLabel: 'Quiero una marca memorable',
      intro: [
        'Una marca no es un logo — es un sistema. Cuando ese sistema no existe, cada pieza nueva se diseña desde cero y la marca termina viéndose distinta en cada lugar donde aparece.',
        'Construimos ese sistema una sola vez, bien hecho, para que tu equipo pueda seguir usándolo solo durante años sin perder consistencia ni tener que llamarnos por cada publicación nueva.'
      ],
      whatWeDo: [
        { name: 'Brand Identity', desc: 'Construimos sistemas visuales capaces de representar una marca.' },
        { name: 'Dirección de arte', desc: 'Definimos cómo debe verse y sentirse la marca.' },
        { name: 'Diseño gráfico', desc: 'Creamos piezas para los diferentes puntos de contacto.' },
        { name: 'Digital Design', desc: 'Diseñamos experiencias visuales para entornos digitales.' },
        { name: 'UI/UX', desc: 'Diseñamos interfaces claras, funcionales y visualmente coherentes.' },
        { name: 'Sistemas de marca', desc: 'Creamos reglas y recursos para mantener consistencia.' }
      ],
      includes: [
        'Branding', 'Identidad visual', 'Logo', 'Dirección de arte', 'Naming',
        'Diseño gráfico', 'Diseño para redes', 'Diseño editorial', 'Packaging',
        'UI Design', 'UX Design', 'Sistemas visuales', 'Brand Guidelines'
      ],
      pricing: 'identidad',
      faq: [
        { q: '¿Creáis identidades de marca desde cero?', a: 'Sí, es uno de los proyectos más completos que hacemos: desde el naming y el concepto hasta el manual de marca final.' },
        { q: '¿También trabajáis sobre marcas existentes?', a: 'Sí, muchos proyectos son de evolución de marca: mantenemos lo que ya funciona y corregimos lo que genera inconsistencia.' },
        { q: '¿Qué incluye un proyecto de branding?', a: 'Depende del nivel elegido — tenés el detalle exacto en la sección de planes de esta página, desde identidad básica hasta un sistema de marca completo.' },
        { q: '¿Diseñáis únicamente el logo?', a: 'Podemos, pero recomendamos pensarlo como parte de un sistema: tipografías, paleta y aplicaciones, para que el logo funcione bien en cualquier contexto.' },
        { q: '¿Trabajáis también diseño para redes?', a: 'Sí, y lo hacemos usando el mismo sistema visual de tu marca, para que redes, web y papelería se vean como una sola cosa.' },
        { q: '¿Podéis diseñar la interfaz de una web o aplicación?', a: 'Sí, el diseño UI/UX forma parte de este servicio y se coordina directamente con el equipo de Web & Digital Development cuando hay que construirla.' },
        { q: '¿Entregáis manual de marca?', a: 'Sí, en los planes de identidad corporativa y completa incluimos manual de marca con las reglas de uso de cada elemento.' }
      ],
      related: ['content-production', 'web-development', 'social-media'],
      featuredProject: 'decoplant-branding'
    },
    'web-development': {
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
        { q: '¿Podéis crear una plataforma digital desde cero?', a: 'Sí, es uno de los proyectos más completos: relevamos el proceso real de tu negocio y construimos la herramienta alrededor de eso.' }
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

  // ---------- "¿Qué está frenando tu negocio?" — chips + chat ----------
  const problemChips = [
    { text: 'No tengo tiempo para gestionar mis redes', service: 'social-media' },
    { text: 'Mi marca no se ve profesional', service: 'brand-design' },
    { text: 'Necesito contenido y no sé por dónde empezar', service: 'content-production' },
    { text: 'Mi web no convierte visitas en clientes', service: 'web-development' },
    { text: 'No sé si mi marketing está funcionando', service: 'growth-marketing' },
    { text: 'Pierdo horas en tareas repetitivas', service: 'ai-automation' },
  ];

  function renderProblemChips(){
    const wrap = document.getElementById('problem-chips');
    if(!wrap) return;
    wrap.innerHTML = problemChips.map(c =>
      `<button class="problem-chip" onclick="askChipQuestion(${JSON.stringify(c.text)}, '${c.service}')">${c.text}</button>`
    ).join('');
  }

  const chatKeywordRules = [
    { keywords: ['red social', 'redes', 'instagram', 'tiktok', 'community', 'seguidores'], service: 'social-media' },
    { keywords: ['marca', 'logo', 'identidad', 'branding', 'naming', 'diseño'], service: 'brand-design' },
    { keywords: ['contenido', 'video', 'foto', 'reel', 'produccion', 'producción'], service: 'content-production' },
    { keywords: ['web', 'pagina', 'página', 'sitio', 'tienda', 'ecommerce', 'e-commerce'], service: 'web-development' },
    { keywords: ['marketing', 'seo', 'ads', 'publicidad', 'anuncios', 'clientes', 'ventas', 'leads'], service: 'growth-marketing' },
    { keywords: ['automatiz', 'tiempo', 'repetitiv', 'chatbot', 'whatsapp', 'ia ', ' ia', 'proceso'], service: 'ai-automation' },
  ];

  function matchServiceFromText(text){
    const lower = text.toLowerCase();
    for(const rule of chatKeywordRules){
      if(rule.keywords.some(k => lower.includes(k))) return rule.service;
    }
    return null;
  }

  function appendChatBubble(text, from){
    const msgs = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = from === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot';
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function appendChatServiceSuggestion(serviceId){
    const s = services[serviceId];
    const msgs = document.getElementById('chat-messages');
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble-bot';
    wrap.innerHTML = `Esto suena a <strong>${s.eyebrow}</strong>. ${s.title}<br/><button onclick="showService('${serviceId}')" style="margin-top:8px;" class="text-white underline underline-offset-2 text-[13px]">Ver ${s.eyebrow} →</button>`;
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function appendChatFallback(){
    const msgs = document.getElementById('chat-messages');
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble-bot';
    wrap.innerHTML = `No estoy seguro de cuál sea el mejor camino todavía — contanos un poco más, o <button onclick="openContactForm('Hola, quiero que me ayuden a detectar qué servicio necesito.')" style="margin-top:2px;" class="text-white underline underline-offset-2">dejanos tu consulta acá</button> y te respondemos directamente.`;
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function askChipQuestion(text, serviceId){
    appendChatBubble(text, 'user');
    await new Promise(r => setTimeout(r, 350));
    appendChatServiceSuggestion(serviceId);
  }

  async function sendChatMessage(){
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if(!text) return;
    appendChatBubble(text, 'user');
    input.value = '';

    if(CONFIG.CHAT_API_ENDPOINT && CONFIG.CHAT_API_ENDPOINT !== 'PLACEHOLDER'){
      try {
        const res = await fetch(CONFIG.CHAT_API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        appendChatBubble(data.reply || 'Gracias por tu mensaje.', 'bot');
        return;
      } catch(e){
        // if the real API fails, fall through to the local logic below
      }
    }

    await new Promise(r => setTimeout(r, 350));
    const match = matchServiceFromText(text);
    if(match){
      appendChatServiceSuggestion(match);
    } else {
      appendChatFallback();
    }
  }

  renderProblemChips();
  renderTestimonials();
  if(document.getElementById('chat-input')){
    appendChatBubble('Contame qué te está frenando y te digo qué servicio te puede ayudar.', 'bot');
    document.getElementById('chat-input').addEventListener('keydown', (e) => {
      if(e.key === 'Enter') sendChatMessage();
    });
  }

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
      alert('Por favor completá al menos nombre, email y contanos sobre el proyecto.');
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

    document.title = 'Dejanos tu reseña — LE STUDIO';
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
      alert('Por favor completá tu nombre, tu empresa, tu cargo y la descripción.');
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

    let shouldBeScrolled;
    if(currentY < 80){
      shouldBeScrolled = false; // always show full nav near the top
    } else if(scrollDirection === 'down'){
      shouldBeScrolled = true;
    } else {
      shouldBeScrolled = false;
    }

    const now = performance.now();
    if(shouldBeScrolled !== scrolledState && (now - lastToggleTime) > SCROLL_TOGGLE_COOLDOWN){
      scrolledState = shouldBeScrolled;
      lastToggleTime = now;
      document.documentElement.classList.toggle('scrolled', scrolledState);
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
