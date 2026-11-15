export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'estetica-madrid.es') {
      url.hostname = 'www.estetica-madrid.es';
      return Response.redirect(url.toString(), 301);
    }

    const path = url.pathname;
    const skip = path.startsWith('/.well-known/') || path.endsWith('.md');
    if (!skip && (request.method === 'GET' || request.method === 'HEAD')) {
      let target = path;
      if (/[A-Z]/.test(target) && !/\.[a-z0-9]+$/i.test(target)) target = target.toLowerCase();
      if (target.endsWith('/index.html')) target = target.slice(0, -10);
      if (target !== path) {
        url.pathname = target;
        return Response.redirect(url.toString(), 301);
      }
      if (path === '/404' || path === '/404/' || path === '/404.html') {
        const page = await env.ASSETS.fetch(new Request(new URL('/404.html', url), request));
        return withHtmlRewrites(new Response(page.body, { status: 404, headers: page.headers }));
      }
    }

    let __r = await env.ASSETS.fetch(request);
    // Static Assets normaliza con 307 y Location relativa; Google solo consolida con 301
    if (__r.status === 307 || __r.status === 308) {
      const loc = __r.headers.get('location');
      if (loc) return Response.redirect(new URL(loc, request.url).toString(), 301);
    }
    if (url.pathname.endsWith(".txt") && __r.headers.get("content-type") === "text/plain") {
      const __h = new Headers(__r.headers);
      __h.set("content-type", "text/plain; charset=utf-8");
      __r = new Response(__r.body, { status: __r.status, statusText: __r.statusText, headers: __h });
    }
    const __ct = __r.headers.get("content-type") || "";
    if (!__ct.includes("text/html")) return __r;
    return withHtmlRewrites(__r);
  }
};

function withHtmlRewrites(res) {
  return new HTMLRewriter()
    .on("head", { element(e) {
      e.append('<script>(function(){try{var c=null;try{c=JSON.parse(localStorage.getItem("nb_consent")||"null");}catch(e){}var g=c&&c.analytics?"granted":"denied";window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag("consent","default",{analytics_storage:g,ad_storage:g,ad_user_data:g,ad_personalization:g,wait_for_update:500});}catch(e){}})();</script>', { html: true });
      e.append('<script async src="https://panel.neutralb.es/track.js"></script>', { html: true });
      e.append('<script defer src="https://panel.neutralb.es/consent.js"></script>', { html: true });
    } })
    .transform(res);
}
