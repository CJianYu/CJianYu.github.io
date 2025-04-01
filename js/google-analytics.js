// Google Analytics 4 (GA4) Integration
(function() {
  // Load the GA4 script
  var script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-C84T5K6MFP";
  document.head.appendChild(script);
  
  // Initialize GA4
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-C84T5K6MFP');
})(); 