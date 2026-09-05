export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'estetica-madrid.es') {
      url.hostname = 'www.estetica-madrid.es';
      return Response.redirect(url.toString(), 301);
    }

    let __r = await env.ASSETS.fetch(request);
    if (url.pathname.endsWith(".txt") && __r.headers.get("content-type") === "text/plain") {
      const __h = new Headers(__r.headers);
      __h.set("content-type", "text/plain; charset=utf-8");
      __r = new Response(__r.body, { status: __r.status, statusText: __r.statusText, headers: __h });
    }
    const __ct = __r.headers.get("content-type") || "";
    if (!__ct.includes("text/html")) return __r;
    return new HTMLRewriter()
      .on("head", { element(e) {
        e.append('<script>(function(){try{var c=null;try{c=JSON.parse(localStorage.getItem("nb_consent")||"null");}catch(e){}var g=c&&c.analytics?"granted":"denied";window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag("consent","default",{analytics_storage:g,ad_storage:g,ad_user_data:g,ad_personalization:g,wait_for_update:500});}catch(e){}})();</script>', { html: true });
        e.append('<script async src="https://panel.neutralb.es/track.js"></script>', { html: true });
        e.append('<script defer src="https://panel.neutralb.es/consent.js"></script>', { html: true });
      } })
      .transform(__r);
  }
};
