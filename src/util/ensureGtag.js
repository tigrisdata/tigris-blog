if (typeof window !== "undefined" && typeof window.gtag !== "function") {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
}
