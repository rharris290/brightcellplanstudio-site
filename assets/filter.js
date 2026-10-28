(()=>{const cards=[...document.querySelectorAll('#grid .card')],chips=[...document.querySelectorAll('.chip')],q=document.getElementById('q'),c=document.getElementById('count');let g=new URLSearchParams(location.search).get('c')||'';
function run(){const t=q.value.trim().toLowerCase();let n=0;cards.forEach(e=>{const ok=(!g||e.dataset.group===g)&&(!t||e.dataset.q.includes(t));e.hidden=!ok;n+=ok});chips.forEach(b=>b.classList.toggle('on',b.dataset.g===g));c.textContent=n+' items'}
chips.forEach(b=>b.onclick=()=>{g=b.dataset.g;run()});q.oninput=run;run()})();
