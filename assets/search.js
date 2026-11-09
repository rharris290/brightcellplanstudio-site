(()=>{let idx=null;const f=document.querySelector('.hdr .srch'),root=f?f.dataset.root:'';
const load=()=>idx?Promise.resolve(idx):fetch(root+'search-index.json').then(r=>r.json()).then(d=>idx=d);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function find(q){const t=q.toLowerCase().split(/\s+/).filter(Boolean);if(!t.length)return[];return idx.map(p=>{const tl=p.t.toLowerCase(),h=(tl+' '+p.c+' '+p.s+' '+p.k).toLowerCase();let s=0;for(const w of t){if(!h.includes(w))return null;s+=tl.includes(w)?3:1}return[s,p]}).filter(Boolean).sort((a,b)=>b[0]-a[0]).map(x=>x[1])}
const row=p=>`<a class="sr" href="${root}${p.u}"><img src="${root}${p.i}" alt="${esc(p.t)}" loading="lazy" width="64" height="48"><span><b>${esc(p.t)}</b><small>${esc(p.c)} · ${esc(p.s)}</small></span><em>${esc(p.p)}</em></a>`;
if(f){const i=f.querySelector('input'),box=f.querySelector('.sres');
i.addEventListener('focus',load);i.addEventListener('input',()=>load().then(()=>{const r=find(i.value);if(!i.value.trim()){box.hidden=true;return}
box.innerHTML=r.length?r.slice(0,8).map(row).join('')+`<a class="sall" href="${root}search.html?q=${encodeURIComponent(i.value)}">See all ${r.length} results →</a>`:'<p class="snone">No products found.</p>';box.hidden=false}));
document.addEventListener('click',e=>{if(!f.contains(e.target))box.hidden=true});i.addEventListener('keydown',e=>{if(e.key==='Escape')box.hidden=true})}
const g=document.getElementById('sgrid');if(g){const pi=document.querySelector('.srch.big input'),c=document.getElementById('scount');
const run=()=>load().then(()=>{const r=find(pi.value);c.textContent=pi.value.trim()?r.length+' results':'';g.innerHTML=r.map(p=>`<a class="card" href="${p.u}"><div class="ph"><img src="${p.i}" alt="${esc(p.t)} – ${esc(p.c)}" loading="lazy" width="640" height="480"></div><div class="cb"><div><span class="badge">${esc(p.c)}</span><h3>${esc(p.t)}</h3></div><span class="price">${esc(p.p)}</span></div></a>`).join('')});
pi.value=new URLSearchParams(location.search).get('q')||'';pi.addEventListener('input',run);run()}})();
