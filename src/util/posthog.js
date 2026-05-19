function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

let pollInProgress = false;
let lastPageviewUrl = null;

function startRb2bPostHogBridge() {
  if (pollInProgress) return;

  const country = getCookie("tigris_geo");
  if (country !== "US" && country !== "CA") return;

  const posthog = window.posthog;
  if (
    posthog &&
    posthog.__loaded &&
    typeof posthog.get_distinct_id === "function" &&
    String(posthog.get_distinct_id() ?? "").startsWith("rb2b_")
  ) {
    return;
  }

  pollInProgress = true;
  let attempts = 0;
  const iv = window.setInterval(() => {
    attempts++;
    const uid = getCookie("_reb2buid");
    const ph = window.posthog;
    if (uid && ph && typeof ph.identify === "function") {
      ph.identify(`rb2b_${uid}`);
      ph.register({ rb2b_visitor_id: uid });
      pollInProgress = false;
      window.clearInterval(iv);
    } else if (attempts >= 60) {
      pollInProgress = false;
      window.clearInterval(iv);
    }
  }, 500);
}

export function onRouteDidUpdate({ location, previousLocation }) {
  if (typeof window === "undefined") return;

  if (location.pathname !== previousLocation?.pathname) {
    // posthog-docusaurus auto-captures $pageview on each route change but
    // does not emit a corresponding $pageleave for the page being left —
    // PostHog's built-in pageleave only fires on real tab close /
    // visibilitychange. Without an explicit $pageleave, dwell-time math
    // for per-page sessions is wrong. Emit it manually using the URL we
    // recorded for the previous $pageview so the two events align.
    const posthog = window.posthog;
    if (posthog && typeof posthog.capture === "function" && lastPageviewUrl) {
      posthog.capture("$pageleave", { $current_url: lastPageviewUrl });
    }
    lastPageviewUrl = window.location.href;

    // rb2b's CDN bundle auto-captures the initial pageview but not
    // subsequent SPA navigations. Without this call, every visitor looks
    // like a single-pageview visit in rb2b's pipeline, which throttles
    // their identification volume. Skip the initial render (handled by
    // rb2b's own bootstrap).
    const reb2b = window.reb2b;
    if (previousLocation && reb2b && typeof reb2b.collect === "function") {
      reb2b.collect();
    }
  }

  startRb2bPostHogBridge();
}
