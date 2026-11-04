// Kit signup: posts to the Kit form action with fetch (CORS allowed), shows the message on-page.
document.addEventListener('submit',function(ev){var f=ev.target;if(!f.matches||!f.matches('form[data-kit]'))return;ev.preventDefault();
var b=f.querySelector('button');b.disabled=true;f.classList.remove('err');
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(r.ok&&(!j.status||j.status==='success')){f.classList.add('done');if(window.gtag)gtag('event','sign_up',{method:'kit'})}else throw 0})})
.catch(function(){f.classList.add('err');b.disabled=false})},true);
