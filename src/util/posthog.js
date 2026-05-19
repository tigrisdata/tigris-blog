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
  bridgeStarted = true;

  const country = getCookie("tigris_geo");
  if (country !== "US" && country !== "CA") return;

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
      posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }

  startRb2bPostHogBridge();
}
