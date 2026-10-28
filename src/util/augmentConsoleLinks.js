import tigrisConfig from "../../tigris.config";

// Stamp ?pid=<distinct_id>&sid=<session_id> onto every link into the Tigris
// console so PostHog can stitch the blog visit to the console session, and
// forward the session's first utm_* set so campaign attribution survives the
// hop. Mirrors PostHogLinkTagger on the website.
//
// Two things used to make this miss: it only ran on route change, and it
// bailed out when PostHog's loader stub was present but not yet __loaded.
// A reader who lands directly on a post and clicks "Get started" before the
// next navigation got an untagged link. Now it retries until PostHog loads,
// re-runs when the DOM changes (e.g. CTAs rendered after hydration), and
// re-stamps right before a console link is followed.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];
const UTM_STORAGE_KEY = "tigris.utm";
const CONSOLE_LINK_SELECTOR = `a[href*="${tigrisConfig.consoleUrl}"]`;

let retryTimer = null;
let observer = null;
let listenersAttached = false;

// Remember the first UTM set seen this session so console links carry
// campaign attribution even after the reader navigates to other posts
// (client-side navigation drops the landing query string).
function rememberUtms() {
  const params = new URLSearchParams(window.location.search);
  const found = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value;
  }
  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (Object.keys(found).length) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
    }
  } catch (e) {
    // Storage unavailable: still forward whatever is on the current URL.
  }
  return found;
}

// Returns true once pid/sid have been stamped (i.e. PostHog is ready).
// UTMs are forwarded regardless, so they survive even if PostHog is blocked.
function stampLinks() {
  const utms = rememberUtms();

  let pid = null;
  let sid = null;
  const posthog = window.posthog;
  if (posthog && posthog.__loaded) {
    pid = posthog.get_distinct_id();
    sid = posthog.get_session_id();
  }
  const haveIds = Boolean(pid && sid);

  document.querySelectorAll(CONSOLE_LINK_SELECTOR).forEach((el) => {
    const original = el.getAttribute("href");
    const href = new URL(original, window.location.href);
    // Always overwrite pid/sid so links stamped earlier pick up the current
    // identity (e.g. after the rb2b bridge calls posthog.identify).
    if (haveIds) {
      if (href.searchParams.get("pid") !== pid) {
        href.searchParams.set("pid", pid);
      }
      if (href.searchParams.get("sid") !== sid) {
        href.searchParams.set("sid", sid);
      }
    }
    // Never overwrite UTMs a link already carries.
    for (const [key, value] of Object.entries(utms)) {
      if (!href.searchParams.has(key)) href.searchParams.set(key, value);
    }
    const next = href.toString();
    if (next !== original) el.setAttribute("href", next);
  });
  return haveIds;
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

// Identity can change after the page settles (the rb2b bridge calls
// posthog.identify once its cookie appears) with no DOM mutation. Re-stamp
// right before a console link is followed so it carries the current ids.
function ensureFollowListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  const onBeforeFollow = (event) => {
    const target = event.target;
    if (target && target.closest && target.closest(CONSOLE_LINK_SELECTOR)) {
      try {
        stampLinks();
      } catch (e) {
        // Never block navigation on tagging.
      }
    }
  };
  document.addEventListener("pointerdown", onBeforeFollow, true);
  document.addEventListener("focusin", onBeforeFollow, true);
}

export function onRouteDidUpdate({ location, previousLocation }) {
  try {
    // Hash-only changes (heading navigation) don't need a re-stamp.
    if (previousLocation && location.pathname === previousLocation.pathname) {
      return;
    }
    stampWithRetry();
    ensureObserver();
    ensureFollowListeners();
  } catch (e) {
    console.warn("Error augmenting Tigris Console links with pid query param");
  }
}
