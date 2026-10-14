import tigrisConfig from "../../tigris.config";

// Stamp ?pid=<distinct_id>&sid=<session_id> onto every link into the Tigris
// console so PostHog can stitch the blog visit to the console session.
//
// Two things used to make this miss: it only ran on route change, and it
// bailed out when PostHog's loader stub was present but not yet __loaded.
// A reader who lands directly on a post and clicks "Get started" before the
// next navigation got an untagged link. Now it retries until PostHog loads
// and re-runs when the DOM changes (e.g. CTAs rendered after hydration).

let retryTimer = null;
let observer = null;

function stampLinks() {
  const posthog = window.posthog;
  if (!posthog || !posthog.__loaded) return false;

  const pid = posthog.get_distinct_id();
  const sid = posthog.get_session_id();
  if (!pid || !sid) return false;

  const links = document.querySelectorAll(
    `a[href*="${tigrisConfig.consoleUrl}"]`
  );

  // Always overwrite pid/sid so links stamped earlier pick up the current
  // identity (e.g. after the rb2b bridge calls posthog.identify).
  links.forEach((el) => {
    const href = new URL(el.getAttribute("href"), window.location.href);
    if (href.searchParams.get("pid") !== pid) {
      href.searchParams.set("pid", pid);
    }
    if (href.searchParams.get("sid") !== sid) {
      href.searchParams.set("sid", sid);
    }
    el.setAttribute("href", href.toString());
  });
  return true;
}

function stampWithRetry(attempt = 0) {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
  if (stampLinks()) return;
  // PostHog loads async; poll briefly (up to ~10s) until it is ready.
  if (attempt < 20) {
    retryTimer = setTimeout(() => stampWithRetry(attempt + 1), 500);
  }
}

function ensureObserver() {
  if (observer || typeof MutationObserver === "undefined") return;
  let scheduled = false;
  observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      stampLinks();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function onRouteDidUpdate({ location, previousLocation }) {
  try {
    // Hash-only changes (heading navigation) don't need a re-stamp.
    if (previousLocation && location.pathname === previousLocation.pathname) {
      return;
    }
    stampWithRetry();
    ensureObserver();
  } catch (e) {
    console.warn("Error augmenting Tigris Console links with pid query param");
  }
}
