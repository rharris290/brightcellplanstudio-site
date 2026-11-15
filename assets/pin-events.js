(() => {
  // Pinterest events for the shop site. No enhanced match. Never invent values.
  const TAG_EVENTS = true;

  function pin(event, params) {
    if (typeof window.pintrk !== 'function') return;
    window.pintrk('track', event, params || {});
  }

  function productId(el) {
    const marked = el && el.closest && el.closest('[data-product-id]');
    if (marked && marked.getAttribute('data-product-id')) {
      return marked.getAttribute('data-product-id');
    }
    const nodes = document.querySelectorAll('script[type="application/ld+json"]');
    for (const node of nodes) {
      let data;
      try { data = JSON.parse(node.textContent); } catch (e) { continue; }
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item && item['@type'] === 'Product' && item.sku) return String(item.sku);
      }
    }
    return '';
  }

  function priceValue(el) {
    const scope = (el && el.closest && el.closest('.pinfo, .card, .prod')) || document;
    const node = scope.querySelector('.bigprice, .price');
    if (!node) return null;
    const match = node.textContent.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
  }

  // Buy Now (Stripe) click: addtocart. Listed price is included only when it is on the page.
  document.addEventListener('click', (ev) => {
    const link = ev.target && ev.target.closest && ev.target.closest('a.buynow[href]');
    if (!link) return;
    const params = { event_source_url: location.href };
    const id = productId(link);
    if (id) params.product_id = id;
    const value = priceValue(link);
    if (value != null) {
      params.value = value;
      params.currency = 'USD';
    }
    pin('addtocart', params);
  }, true);

  // thanks.html: fire checkout only when a real value and currency are present in the URL.
  // Stripe currently redirects to thanks.html with no amount, so this will not invent a total.
  const path = location.pathname.replace(/\/+$/, '');
  if (path.endsWith('thanks.html') || path.endsWith('/thanks')) {
    const q = new URLSearchParams(location.search);
    const raw = q.get('value') || q.get('amount') || q.get('order_value');
    const currency = (q.get('currency') || '').toUpperCase();
    const value = raw != null && String(raw).trim() !== '' ? Number(String(raw).trim()) : NaN;
    if (Number.isFinite(value) && value > 0 && /^[A-Z]{3}$/.test(currency)) {
      const params = { value, currency, event_source_url: location.href };
      const pid = q.get('product_id') || q.get('listing_id');
      if (pid) params.product_id = pid;
      pin('checkout', params);
    }
  }
})();
