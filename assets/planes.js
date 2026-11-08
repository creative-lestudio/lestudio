/* Planes en carrusel + vista comparativa. Se construye a partir de las tarjetas ya presentes en el HTML. */
(function(){
  function tr(t){ return (window.I18N && window.I18N.tr) ? window.I18N.tr(t) : t; }
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function esc(t){ return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  document.querySelectorAll('[data-plan-carousel]').forEach(function(car){
    var cards=[].slice.call(car.children);
    var plans=cards.filter(function(c){ return c.querySelector('ul li'); });
    cards.forEach(function(c){
      var n=c.querySelectorAll('ul li').length;
      c.classList.add('pc-card', n && n<=8 ? 'pc-sq' : 'pc-tall');
    });

    var bar=el('div','pc-bar');
    var cmp=el('button','btn-ghost pc-cmp-btn font-semibold px-6 py-3 rounded-full text-sm',esc(tr('Comparar planes')));
    cmp.type='button'; cmp.setAttribute('aria-expanded','false');
    var arrows=el('div','pc-arrows');
    var prev=el('button','pc-arrow','←'), next=el('button','pc-arrow','→');
    prev.type=next.type='button'; prev.setAttribute('aria-label',tr('Anterior')); next.setAttribute('aria-label',tr('Siguiente'));
    arrows.appendChild(prev); arrows.appendChild(next);
    bar.appendChild(plans.length>1?cmp:el('span')); bar.appendChild(arrows);
    car.parentNode.insertBefore(bar,car);

    function step(d){ car.scrollBy({left:d*(cards[0].offsetWidth+16),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}); }
    prev.onclick=function(){step(-1);}; next.onclick=function(){step(1);};

    var panel=el('div','pc-compare'); panel.hidden=true;
    car.parentNode.insertBefore(panel,car.nextSibling);

    function build(){
      var data=plans.map(function(c){
        var h=c.querySelector('h3'); var name=h?h.textContent.trim():'';
        var items=[].slice.call(c.querySelectorAll('ul li')).map(function(li){
          return {t:li.textContent.trim(), on:!/text-white\/25/.test(li.className)};
        });
        return {name:name, items:items, btn:c.querySelector('button.btn-primary')};
      });
      var same=data.every(function(d){ return d.items.length===data[0].items.length && d.items.every(function(it,i){return it.t===data[0].items[i].t;}); });
      var html='';
      if(same){
        html='<table class="pc-table"><thead><tr><th scope="col"><span class="sr-only">'+esc(tr('Incluye'))+'</span></th>'+data.map(function(d){return '<th scope="col">'+esc(d.name)+'</th>';}).join('')+'</tr></thead><tbody>'+
          data[0].items.map(function(it,i){ return '<tr><th scope="row">'+esc(it.t)+'</th>'+data.map(function(d){ return '<td>'+(d.items[i].on?'<span aria-label="'+esc(tr('Incluido'))+'">✓</span>':'<span class="pc-no" aria-label="'+esc(tr('No incluido'))+'">—</span>')+'</td>'; }).join('')+'</tr>'; }).join('')+
          '</tbody></table>';
      } else {
        html='<div class="pc-cols">'+data.map(function(d,i){
          return '<div class="pc-col"><h4 class="font-display">'+esc(d.name)+'</h4><ul>'+d.items.filter(function(it){return it.on;}).map(function(it){return '<li>'+esc(it.t)+'</li>';}).join('')+'</ul></div>';
        }).join('')+'</div>';
      }
      panel.innerHTML=html;
    }
    cmp.onclick=function(){
      var open=panel.hidden;
      if(open && !panel.firstChild) build();
      panel.hidden=!open; cmp.setAttribute('aria-expanded',open?'true':'false');
      cmp.innerHTML=esc(tr(open?'Ocultar comparativa':'Comparar planes'));
      if(open) panel.scrollIntoView({behavior:'smooth',block:'nearest'});
    };
  });
})();
