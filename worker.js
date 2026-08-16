export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'estetica-madrid.es') {
      url.hostname = 'www.estetica-madrid.es';
      return Response.redirect(url.toString(), 301);
    }

    // El indice real de esta web es /sitemap_index.xml. /sitemap.xml no existe, y
    // devolver 404 rompe herramientas y enlaces que asumen la ruta clasica.
    if (url.pathname === "/sitemap.xml") {
      const destino = new URL(url);
      destino.pathname = "/sitemap_index.xml";
      return Response.redirect(destino.toString(), 301);
    }
    const __r = await env.ASSETS.fetch(request);
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
