(function(){
var DELAY=15000,NUM='13854906607';
var es=document.documentElement.lang==='es';
var T=es?{name:'Legally Connect',status:'en línea',m1:'Hola, ¿hay algo en lo que le pueda ayudar?',m2:'¿Se lesionó en un accidente?',btn:'Responder por WhatsApp',close:'Cerrar chat',label:'Chat de WhatsApp con Legally Connect',p1:'Hola, tengo una pregunta.',p2:'Hola, me lesioné en un accidente en Utah y me gustaría que me ayuden a encontrar un abogado.'}
:{name:'Legally Connect',status:'online',m1:'Hi, is there anything I can answer for you?',m2:'Were you hurt in an accident?',btn:'Reply on WhatsApp',close:'Close chat',label:'WhatsApp chat with Legally Connect',p1:'Hi, I have a question.',p2:'Hi, I was hurt in an accident in Utah and I would like help finding an attorney.'};
var stage=0,timer=null,w;
function link(m){return 'https://wa.me/'+NUM+'?text='+encodeURIComponent(m);}
function open(){window.open(link(stage>=2?T.p2:T.p1),'_blank','noopener');}
function bubble(text,pre){var a=document.createElement('a');a.className='wa-msg';a.href=link(pre);a.target='_blank';a.rel='noopener';a.textContent=text;return a;}
function build(){
 w=document.createElement('div');w.className='wa-pop';w.setAttribute('role','dialog');w.setAttribute('aria-label',T.label);w.hidden=true;
 w.innerHTML='<div class="wa-head"><span class="wa-av" aria-hidden="true">LC</span><div><strong></strong><small></small></div><button type="button" class="wa-x">&times;</button></div><div class="wa-body" aria-live="polite"></div><a class="wa-cta" target="_blank" rel="noopener"></a>';
 w.querySelector('strong').textContent=T.name;w.querySelector('small').textContent=T.status;
 var x=w.querySelector('.wa-x');x.setAttribute('aria-label',T.close);x.onclick=close;
 var c=w.querySelector('.wa-cta');c.textContent=T.btn;
 document.body.appendChild(w);
}
function show(){
 if(!w)build();stage++;
 var body=w.querySelector('.wa-body');
 if(stage===1)body.appendChild(bubble(T.m1,T.p1));
 if(stage===2)body.appendChild(bubble(T.m2,T.p2));
 w.querySelector('.wa-cta').href=link(stage>=2?T.p2:T.p1);
 w.hidden=false;
}
function close(){
 if(!w||w.hidden)return;w.hidden=true;
 if(stage===1)timer=setTimeout(show,DELAY);
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
timer=setTimeout(show,DELAY);
window.__waPopupShow=show;
})();
