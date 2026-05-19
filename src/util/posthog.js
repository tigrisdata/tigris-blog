function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

let bridgeStarted = false;

function startRb2bPostHogBridge() {
  if (bridgeStarted) return;

  // tigris_geo may be absent on the very first render (e.g., the edge
  // middleware didn't reach this specific request). Only commit to the
  // bridgeStarted lock once the cookie has actually been seen as US/CA —
  // otherwise leave the door open for retries on subsequent route changes.
  const country = getCookie("tigris_geo");
  if (country !== "US" && country !== "CA") return;

  bridgeStarted = true;

  let attempts = 0;
  const iv = window.setInterval(() => {
    attempts++;
    const uid = getCookie("_reb2buid");
    const posthog = window.posthog;
    if (uid && posthog && typeof posthog.identify === "function") {
      posthog.identify(`rb2b_${uid}`);
      posthog.register({ rb2b_visitor_id: uid });
      window.clearInterval(iv);
    } else if (attempts >= 60) {
      window.clearInterval(iv);
    }
  }, 500);
}

export function onRouteDidUpdate({ location, previousLocation }) {
  if (typeof window === "undefined") return;

  if (location.pathname !== previousLocation?.pathname) {
    const posthog = window.posthog;
    if (posthog && typeof posthog.capture === "function") {
      // PostHog's capture_pageleave only fires on real tab close /
      // visibilitychange. For Docusaurus SPA navigations we have to emit
      // $pageleave manually with the URL of the page being left so
      // dwell-time math on the previous page is correct.
      if (previousLocation) {
        const prevUrl =
          window.location.origin +
          previousLocation.pathname +
          (previousLocation.search || "");
        posthog.capture("$pageleave", { $current_url: prevUrl });
      }
      posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }

  startRb2bPostHogBridge();
}
