(function () {
  function closeLb() {
    var el = document.getElementById('lp-lb');
    if (!el) return;
    el.remove();
    document.body.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.lp-zoom');
    if (!a) return;
    e.preventDefault();
    var src = a.getAttribute('href');
    var img = a.querySelector('img');
    var alt = (img && img.alt) || '';
    var ov = document.createElement('div');
    ov.id = 'lp-lb';
    ov.className = 'lp-lb';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Larger photo');
    ov.innerHTML = '<button type="button" class="lp-lb-x" aria-label="Close">&times;</button><img alt="">';
    ov.querySelector('img').src = src;
    ov.querySelector('img').alt = alt;
    ov.addEventListener('click', function (ev) {
      if (ev.target === ov || ev.target.classList.contains('lp-lb-x')) closeLb();
    });
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    ov.querySelector('.lp-lb-x').focus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLb();
  });
})();
