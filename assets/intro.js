/* Intro de bienvenida: teléfono recibiendo notificaciones -> mensaje -> gráficos.
   Se muestra una vez por sesión (al abrir la página). Añade ?nointro a la URL para saltarla. */
(function(){
  var root = document.documentElement;
  if(!root.classList.contains('intro-on')) return;
  var intro = document.getElementById('intro');
  if(!intro){ root.classList.remove('intro-on'); return; }

  var lang = 'es';
  try { lang = sessionStorage.getItem('lang') === 'en' ? 'en' : 'es'; } catch(e){}
  var TXT = {
    es: { skip:'Saltar', line:'Si quieres ser tú el próximo, estás en el lugar correcto.', up:'Con LE STUDIO', down:'Sin LE STUDIO',
      n:[['ig','Instagram','Nuevo seguidor','@cliente_nuevo empezó a seguirte'],['tt','TikTok','Tu video está en tendencia','Miles de personas lo están viendo'],['shopify','Shopify','¡Nuevo pedido!','Venta confirmada · Pago recibido'],['yt','YouTube','Nuevos comentarios','Tu último video tiene 24 comentarios'],['ig','Instagram','Les gustó tu reel','128 Me gusta en pocos minutos'],['shopify','Shopify','¡Otra venta!','Pedido #1043 · Pago recibido'],['tt','TikTok','Nuevo seguidor','@marca_fan te empezó a seguir'],['yt','YouTube','Suscripción nueva','Alguien se suscribió a tu canal'],['ig','Instagram','Mensaje nuevo','Quiero comprar, ¿tienen disponibilidad?'],['shopify','Shopify','¡Venta!','Pedido #1044 · Pago recibido']] },
    en: { skip:'Skip', line:"If you want to be next, you're in the right place.", up:'With LE STUDIO', down:'Without LE STUDIO',
      n:[['ig','Instagram','New follower','@new_client started following you'],['tt','TikTok','Your video is trending','Thousands of people are watching it'],['shopify','Shopify','New order!','Sale confirmed · Payment received'],['yt','YouTube','New comments','Your latest video has 24 comments'],['ig','Instagram','They liked your reel','128 likes in just a few minutes'],['shopify','Shopify','Another sale!','Order #1043 · Payment received'],['tt','TikTok','New follower','@brand_fan started following you'],['yt','YouTube','New subscriber','Someone subscribed to your channel'],['ig','Instagram','New message','I want to buy, is it available?'],['shopify','Shopify','Sale!','Order #1044 · Payment received']] }
  };
  var T = TXT[lang];
  document.getElementById('intro-skip').textContent = T.skip;
  var dateEl = document.getElementById('lock-date');
  try { var d = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday:'long', day:'numeric', month:'long' }); dateEl.textContent = d.charAt(0).toUpperCase() + d.slice(1); } catch(e){}
  var line = document.getElementById('intro-line');
  line.innerHTML = T.line.split(' ').map(function(w){ return '<span class="w">' + w + '</span>'; }).join(' ');
  var caps = intro.querySelectorAll('.chart figcaption span');
  caps[0].textContent = T.up; caps[1].textContent = T.down;

  var phone = document.getElementById('phone'), notifs = document.getElementById('notifs'), charts = document.getElementById('intro-charts');
  var timers = [], done = false;
  function at(ms, fn){ timers.push(setTimeout(fn, ms)); }

  function addNotif(n){
    var el = document.createElement('div');
    el.className = 'notif';
    el.innerHTML = '<svg viewBox="0 0 64 64"><use href="#ap-' + n[0] + '"/></svg><div><b>' + n[1] + ' · ' + n[2] + '</b><span>' + n[3] + '</span></div>';
    notifs.insertBefore(el, notifs.firstChild);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('show'); }); });
    while(notifs.children.length > 9) notifs.removeChild(notifs.lastChild);
  }

  function finish(){
    if(done) return; done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('intro_seen', '1'); } catch(e){}
    intro.classList.add('out');
    setTimeout(function(){ root.classList.remove('intro-on'); }, 800);
  }
  document.getElementById('intro-skip').addEventListener('click', function(e){ e.stopPropagation(); finish(); });
  intro.addEventListener('click', finish);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') finish(); });

  // Línea de tiempo (~9,5 s)
  at(80,  function(){ phone.classList.add('in'); });
  var t = 750;
  T.n.forEach(function(n, i){ at(t, function(){ addNotif(n); }); t += i < 4 ? 430 : 300; });   // notificaciones
  at(3500, function(){ phone.classList.remove('in'); phone.classList.add('away'); });           // se va el teléfono
  at(3800, function(){ line.classList.add('on'); [].forEach.call(line.querySelectorAll('.w'), function(w, i){ w.style.transitionDelay = (i * 90) + 'ms'; }); });
  at(6000, function(){ line.classList.remove('on'); line.classList.add('off'); });              // sale el mensaje
  at(6550, function(){ charts.classList.add('on'); });                                          // gráficos
  at(9700, finish);
})();
