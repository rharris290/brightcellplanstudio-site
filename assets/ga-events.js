(() => {
  const SHOPS = {
    brightcellplanstudio: 'BrightCellPlanStudio',
    spoonfulofcalmstudio: 'SpoonfulOfCalmStudio'
  };

  function hostOf(url) {
    return url.hostname.replace(/^www\./i, '').toLowerCase();
  }

  function isEtsy(url) {
    const host = hostOf(url);
    return host === 'etsy.com' || host.endsWith('.etsy.com') || host === 'etsy.me' || host.endsWith('.etsy.me');
  }

  function isStripe(url) {
    return hostOf(url) === 'buy.stripe.com';
  }

  function shopFromLink(url) {
    const match = url.pathname.match(/\/shop\/([^/?#]+)/i);
    if (!match) return '';
    const key = decodeURIComponent(match[1]).toLowerCase();
    return SHOPS[key] || '';
  }

  function shopFromPage() {
    const nodes = document.querySelectorAll('script[type="application/ld+json"]');
    for (const node of nodes) {
      let data;
      try { data = JSON.parse(node.textContent); } catch (e) { continue; }
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const name = item && item.brand && item.brand.name;
        if (name === 'BrightCellPlanStudio' || name === 'SpoonfulOfCalmStudio') return name;
      }
    }
    return '';
  }

  function slugFrom(el) {
    const marked = el.closest('[data-product-slug]');
    if (marked) return marked.getAttribute('data-product-slug') || '';
    const sources = [location.pathname];
    const card = el.closest('a.card[href], a[href*="/p/"]');
    if (card) sources.unshift(card.getAttribute('href') || '');
    for (const source of sources) {
      const match = String(source).match(/\/p\/([^/?#]+)\/?/);
      if (match) return decodeURIComponent(match[1]);
    }
    return '';
  }

  function priceValue(el) {
    const scope = el.closest('.pinfo, .card') || document;
    const node = scope.querySelector('.bigprice, .price');
    if (!node) return null;
    const match = node.textContent.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
  }

  function cookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  // GA browser id for the server-side purchase event: "ga-<rand>-<ts>[-s<sessionId>]" (Stripe allows letters,
  // digits, dashes, underscores). The delivery Worker turns it back into the GA client_id after payment.
  function gaRef() {
    const m = cookie('_ga').match(/^GA\d\.\d+\.(\d+)\.(\d+)$/);
    if (!m) return '';
    let ref = 'ga-' + m[1] + '-' + m[2];
    const g = cookie('_ga_0G337QF6YX');
    const sm = g.match(/^GS1\.\d+\.(\d+)\./) || g.match(/^GS2\.\d+\.s(\d+)/);
    if (sm) ref += '-s' + sm[1];
    return ref;
  }

  function tagStripeLink(link, url) {
    try {
      if (url.searchParams.has('client_reference_id')) return;
      const ref = gaRef();
      if (!ref) return;
      url.searchParams.set('client_reference_id', ref);
      link.href = url.href;
    } catch (e) {}
  }

  function send(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params);
  }

  document.addEventListener('click', (ev) => {
    const link = ev.target && ev.target.closest && ev.target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch (e) { return; }
    const etsy = isEtsy(url);
    const stripe = isStripe(url);
    if (!etsy && !stripe) return;
    const params = {
      product_slug: slugFrom(link),
      shop: shopFromLink(url) || shopFromPage(),
      page_path: location.pathname,
      link_url: url.href,
      transport_type: 'beacon'
    };
    if (stripe) {
      const value = priceValue(link);
      if (value != null) {
        params.value = value;
        params.currency = 'USD';
      }
      send('buy_click', params);
      tagStripeLink(link, url);
    } else {
      send('etsy_click', params);
    }
  }, true);

  const reported = new WeakSet();
  function reportLead(form) {
    if (!form || reported.has(form) || !form.classList.contains('done')) return;
    reported.add(form);
    send('generate_lead', {
      form_location: form.closest('footer') ? 'footer' : (form.closest('#join') ? 'signup' : 'page'),
      page_path: location.pathname,
      transport_type: 'beacon'
    });
  }

  document.addEventListener('submit', (ev) => {
    const form = ev.target;
    if (!form || !form.classList || !form.classList.contains('su2-form')) return;
    const watch = new MutationObserver(() => {
      if (!form.classList.contains('done')) return;
      watch.disconnect();
      reportLead(form);
    });
    watch.observe(form, { attributes: true, attributeFilter: ['class'] });
  }, true);
})();
