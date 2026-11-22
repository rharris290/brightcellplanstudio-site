(function(){
document.querySelectorAll('.hb-tab').forEach(function(b){b.addEventListener('click',function(){var t=b.dataset.tab;
 document.querySelectorAll('.hb-tab').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
 document.querySelectorAll('.hb-pane').forEach(function(p){p.hidden=p.dataset.pane!==t})})});
var grid=document.querySelector('.hb-all');if(!grid)return;
var D='https://brightcellplanstudio.com';
var cards=[].slice.call(grid.children),page=+grid.dataset.page||16,shown=page,f='',q='',more=document.querySelector('.hb-more'),cnt=document.querySelector('.hb-count');
var total=+grid.dataset.total||cards.length,src=grid.dataset.json,loaded=!src,loading=null;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function mk(r){var a=document.createElement('a');a.className='hb-card';a.href='/p/'+r[0]+'/';a.dataset.t=r[5];a.dataset.q=(r[1]+' '+r[6]+' '+r[3]).toLowerCase();
 var i6=r[7]||D+'/img/'+r[0]+'-640.webp',i12=r[8]||D+'/img/'+r[0]+'.webp';
 a.innerHTML='<div class="hb-ph"><img src="'+i6+'" srcset="'+i6+' 640w, '+i12+' 1200w" sizes="(max-width:700px) 50vw, 300px" alt="'+esc(r[1])+'" loading="lazy" decoding="async" width="640" height="480"></div><div class="hb-cb"><span class="hb-badge">'+esc(r[2])+'</span><h3>'+esc(r[1])+'</h3><div class="hb-meta"><span>'+esc(r[3])+'</span><b>'+esc(r[4])+'</b></div></div>';return a}
function load(){if(loaded)return Promise.resolve();if(loading)return loading;
 loading=fetch(src).then(function(r){return r.json()}).then(function(rows){var fr=document.createDocumentFragment();cards=rows.map(mk);cards.forEach(function(c){fr.appendChild(c)});grid.innerHTML='';grid.appendChild(fr);loaded=true}).catch(function(){loaded=true});return loading}
function run(){var m=cards.filter(function(c){return(!f||(' '+c.dataset.t+' ').indexOf(' '+f+' ')>-1)&&(!q||c.dataset.q.indexOf(q)>-1)});
 var all=loaded?m.length:(f||q?m.length:total);
 cards.forEach(function(c){c.classList.add('hb-hide');c.classList.remove('hb-x')});
 m.slice(0,shown).forEach(function(c){c.classList.remove('hb-hide')});
 cnt.textContent=(!loaded&&(f||q))?'Loading all products…':'Showing '+Math.min(shown,all)+' of '+all;more.style.display=all>shown?'':'none'}
function go(){run();if(!loaded)load().then(run)}
function setF(v){f=v;shown=page;document.querySelectorAll('.hb-chips .hb-chip').forEach(function(c){c.classList.toggle('on',c.dataset.f===v)});go()}
document.querySelectorAll('[data-f]').forEach(function(a){a.addEventListener('click',function(){setF(a.dataset.f)})});
document.querySelector('.hb-filters .hb-q').addEventListener('input',function(ev){q=ev.target.value.trim().toLowerCase();shown=page;go()});
more.addEventListener('click',function(){shown+=page*2;go()});
if(src&&'IntersectionObserver'in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();load().then(run)}},{rootMargin:'400px'});io.observe(grid)}
run();
})();
