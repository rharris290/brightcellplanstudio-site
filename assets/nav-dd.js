(()=>{document.querySelectorAll('[data-dd]').forEach(dd=>{const b=dd.querySelector('.dd-btn'),m=dd.querySelector('.dd-menu');if(!b||!m)return;const hov=matchMedia('(hover:hover) and (min-width:901px)');let t;
const set=o=>{dd.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false')};
let h0=0;b.addEventListener('click',ev=>{ev.preventDefault();if(hov.matches&&Date.now()-h0<500){set(true);return}set(!dd.classList.contains('open'))});
b.addEventListener('keydown',ev=>{if(ev.key==='ArrowDown'){ev.preventDefault();set(true);const a=m.querySelector('a');a&&a.focus()}});
dd.addEventListener('keydown',ev=>{if(ev.target===b&&ev.key!=='Escape')return;const ls=[...m.querySelectorAll('a')],i=ls.indexOf(document.activeElement);if(ev.key==='Escape'&&dd.classList.contains('open')){set(false);b.focus()}else if(i>-1&&(ev.key==='ArrowDown'||ev.key==='ArrowUp')){ev.preventDefault();ls[(i+(ev.key==='ArrowDown'?1:ls.length-1))%ls.length].focus()}});
dd.addEventListener('focusout',ev=>{if(!dd.contains(ev.relatedTarget))set(false)});
dd.addEventListener('mouseenter',()=>{if(hov.matches){clearTimeout(t);if(!dd.classList.contains('open'))h0=Date.now();set(true)}});
dd.addEventListener('mouseleave',()=>{if(hov.matches){t=setTimeout(()=>set(false),180)}});
document.addEventListener('click',ev=>{if(!dd.contains(ev.target))set(false)});});})();
