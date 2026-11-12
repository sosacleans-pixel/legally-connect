/* Best Legal Counsel case intake. Preview only: nothing is ever sent over the network. */
(function(){
var f=document.getElementById('intake');if(!f)return;
var D=f.dataset,steps=[].slice.call(f.querySelectorAll('.step')),T=steps.length,cur=0;
var back=f.querySelector('[data-back]'),next=f.querySelector('[data-next]'),sub=f.querySelector('[data-submit]');
var ptext=document.getElementById('progress-text'),bar=f.querySelector('.progress span'),err=f.querySelector('.step-error'),status=document.getElementById('form-status');
var titles=(D.titles||'').split('|');
f.classList.add('js','at-start');sub.disabled=false;

function show(n,focus){
 cur=n;steps.forEach(function(s,k){s.hidden=k!==n;});
 back.hidden=n===0;next.hidden=n===T-1;sub.hidden=n!==T-1;
 ptext.textContent=D.progress.replace('{n}',n+1).replace('{t}',T)+': '+(titles[n]||'');
 bar.style.width=((n+1)/T*100)+'%';
 err.hidden=true;err.textContent='';
 f.classList.toggle('at-start',n===0);
 var scroller=document.querySelector('.app-scroll');
 if(focus){var h=steps[n].querySelector('h2');if(h)h.focus({preventScroll:true});}
 if(scroller)scroller.scrollTop=0;else if(focus)f.scrollIntoView({block:'start'});
}

function setErr(el,msg){
 el.setAttribute('aria-invalid','true');
 var wrap=el.closest('.field')||el.closest('fieldset')||el.parentNode;
 var p=document.createElement('p');p.className='field-error';p.id=(el.id||'g'+Math.random().toString(36).slice(2))+'-err';p.textContent=msg;
 wrap.appendChild(p);
 var d=el.getAttribute('aria-describedby');el.setAttribute('aria-describedby',(d?d+' ':'')+p.id);el.setAttribute('data-err-id',p.id);
}
function clearErr(scope){
 scope.querySelectorAll('.field-error').forEach(function(p){p.remove();});
 scope.querySelectorAll('[aria-invalid]').forEach(function(el){
  el.removeAttribute('aria-invalid');var id=el.getAttribute('data-err-id');
  if(id){var d=(el.getAttribute('aria-describedby')||'').split(' ').filter(function(x){return x&&x!==id;}).join(' ');
   if(d)el.setAttribute('aria-describedby',d);else el.removeAttribute('aria-describedby');el.removeAttribute('data-err-id');}
 });
}
function validate(s){
 clearErr(s);var bad=[];
 s.querySelectorAll('[required]').forEach(function(el){
  if(el.closest('[data-show-if][hidden],[data-rep-block][hidden]'))return;
  var empty=el.type==='checkbox'?!el.checked:!el.value.trim();
  if(empty){setErr(el,D.errRequired);bad.push(el);}
  else if(el.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())){setErr(el,D.errEmail);bad.push(el);}
 });
 s.querySelectorAll('[data-phone-group]').forEach(function(g){
  var ins=[].slice.call(g.querySelectorAll('input[type=tel]')).filter(function(i){return !/fax/.test(i.name);});
  if(!ins.some(function(i){return i.value.trim();})){setErr(ins[0],D.errPhone);bad.push(ins[0]);}
 });
 if(bad.length){err.textContent=D.errStep;err.hidden=false;bad[0].focus();return false;}
 err.hidden=true;return true;
}

back.addEventListener('click',function(){show(Math.max(0,cur-1),true);});
next.addEventListener('click',function(){if(validate(steps[cur]))show(Math.min(T-1,cur+1),true);});
f.addEventListener('keydown',function(e){
 if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type!=='checkbox'&&e.target.type!=='radio'&&cur<T-1){e.preventDefault();next.click();}
});
f.addEventListener('submit',function(e){
 e.preventDefault();e.stopPropagation();
 for(var k=0;k<T;k++){if(!validate(steps[k])){if(k!==cur){show(k,false);validate(steps[k]);}return;}}
 status.textContent=D.preview; /* Preview only. No fetch, XHR, or form post happens here. */
});

/* Conditional sections: data-show-if="name=value" */
var conds=[].slice.call(f.querySelectorAll('[data-show-if]'));
function cond(){conds.forEach(function(c){var p=c.getAttribute('data-show-if').split('='),sel=f.querySelector('input[name="'+p[0]+'"]:checked');c.hidden=!(sel&&sel.value===p[1]);});}
f.addEventListener('change',cond);cond();

/* Repeatable blocks: show the first, reveal more with "Add another", up to the number in the markup (5). */
f.querySelectorAll('[data-repeat]').forEach(function(r){
 var blocks=[].slice.call(r.querySelectorAll('[data-rep-block]'));
 var add=document.createElement('button');add.type='button';add.className='btn ghost add-btn';add.textContent='+ '+D.add;
 r.appendChild(add);
 function refresh(){var shown=blocks.filter(function(b){return !b.hidden;}).length;add.hidden=shown>=blocks.length;}
 blocks.forEach(function(b,i){
  if(i>0){b.hidden=true;
   var rm=document.createElement('button');rm.type='button';rm.className='link-btn';rm.textContent=D.remove;
   rm.addEventListener('click',function(){
    b.querySelectorAll('input,textarea,select').forEach(function(el){if(el.type==='checkbox'||el.type==='radio')el.checked=false;else el.value='';});
    b.hidden=true;refresh();add.focus();
   });b.appendChild(rm);}
 });
 add.addEventListener('click',function(){var nx=blocks.filter(function(b){return b.hidden;})[0];if(nx){nx.hidden=false;var first=nx.querySelector('input');if(first)first.focus();}refresh();});
 refresh();
});

show(0,false);
})();
