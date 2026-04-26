// analytics.js — loads GA4 and Facebook Pixel via /api/config.
// Set GA4_ID and FB_PIXEL_ID as Vercel env vars — no hardcoding needed.
(function(){
  function getCookie(n){var v=document.cookie.match('(^|;)\\s*'+n+'=([^;]*)');return v?v[2]:null;}
  var consent=getCookie('cookie_consent');
  if(consent==='declined')return; // user opted out

  fetch('/api/config').then(function(r){return r.json();}).then(function(cfg){
    // Google Analytics 4
    if(cfg.ga4Id){
      window.__ga4Id=cfg.ga4Id;
      var s=document.createElement('script');
      s.async=true;
      s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.ga4Id);
      document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments);}
      window.gtag=gtag;
      gtag('js',new Date());
      gtag('config',cfg.ga4Id);
    }
    // Facebook Pixel
    if(cfg.fbPixelId){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init',cfg.fbPixelId);
      window.fbq('track','PageView');
    }
  }).catch(function(){/* analytics unavailable — fail silently */});
})();
