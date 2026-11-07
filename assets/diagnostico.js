/* Diagnóstico orientativo de 4 preguntas. No envía datos: al final abre el formulario de contacto con un mensaje prellenado. */
(function(){
  var root=document.getElementById('dg'); if(!root) return;
  var Q=[
    {k:'Objetivo',q:'¿Qué quieres conseguir ahora?',o:[['clientes','Más clientes o consultas'],['imagen','Una imagen más profesional'],['ventas','Vender o recibir pedidos online'],['tiempo','Ahorrar tiempo atendiendo mensajes']]},
    {k:'Negocio',q:'¿Qué tipo de negocio tienes?',o:[['hosteleria','Restauración u hostelería'],['comercio','Comercio local'],['servicios','Servicios o pyme'],['marca','Marca en crecimiento']]},
    {k:'Situación',q:'¿Cómo estás hoy?',o:[['cero','Empiezo de cero'],['desordenado','Tengo web o redes, pero desordenadas'],['noconvierte','Tengo presencia, pero no convierte']]},
    {k:'Plazo',q:'¿Cuándo querrías empezar?',o:[['ya','Cuanto antes'],['pronto','En 1–3 meses'],['explorar','Solo estoy explorando']]}
  ];
  var R={clientes:['Growth & Marketing + Web','Una web clara que convierta, apoyada con SEO local y anuncios.'],imagen:['Brand & Design','Identidad visual coherente y contenido que la refuerce.'],ventas:['Web & Digital Development','Una web o tienda pensada para pedir o comprar sin fricción.'],tiempo:['AI & Automation','Agentes y automatizaciones para responder, captar y agendar.']};
  var A=[],i=0;
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function ev(n,p){try{if(window.trackEvent)window.trackEvent(n,p||{});}catch(e){}}
  function render(){
    if(i>=Q.length){
      var r=R[A[0].v]||R.clientes;
      root.innerHTML='<p class="dg-step">Orientación inicial</p><h3 class="font-display dg-q">'+esc(r[0])+'</h3><p class="dg-res">'+esc(r[1])+'</p><p class="dg-note">Es una orientación basada en tus respuestas; no es un presupuesto.</p><div class="dg-actions"><button class="btn-primary btn-lg" id="dg-go">Reservar auditoría gratuita</button><button class="btn-ghost btn-lg" id="dg-re">Repetir</button></div>';
      ev('diagnostic_complete',{result:r[0]});
      document.getElementById('dg-go').onclick=function(){
        var msg='Diagnóstico: '+A.map(function(a){return a.k+': '+a.l;}).join(' · ')+'. Orientación: '+r[0]+'.';
        if(window.openContactForm) window.openContactForm(msg,null,'audit');
      };
      document.getElementById('dg-re').onclick=function(){A=[];i=0;render();};
      return;
    }
    var q=Q[i];
    root.innerHTML='<p class="dg-step">Pregunta '+(i+1)+' de '+Q.length+'</p><div class="dg-bar"><i style="width:'+(i/Q.length*100)+'%"></i></div><h3 class="font-display dg-q">'+esc(q.q)+'</h3><div class="dg-opts">'+q.o.map(function(o){return '<button type="button" class="dg-opt" data-v="'+o[0]+'">'+esc(o[1])+'</button>';}).join('')+'</div>'+(i?'<button type="button" class="dg-back" id="dg-back">← Atrás</button>':'');
    root.querySelectorAll('.dg-opt').forEach(function(b){b.onclick=function(){if(i===0)ev('diagnostic_start');A[i]={k:q.k,v:b.dataset.v,l:b.textContent};i++;render();};});
    var bk=document.getElementById('dg-back'); if(bk) bk.onclick=function(){i--;A.length=i;render();};
  }
  render();
})();
(function(){
  var el=document.getElementById('lg3d'); if(!el||matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  addEventListener('pointermove',function(e){el.style.setProperty('--px',(e.clientX/innerWidth-.5).toFixed(3));el.style.setProperty('--py',(e.clientY/innerHeight-.5).toFixed(3));},{passive:true});
})();
