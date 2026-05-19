import tigrisConfig from "../../tigris.config";

export function onRouteDidUpdate({ location, previousLocation }) {
  try {
    // Don't execute if we are still on the same page; the lifecycle may be fired
    // because the hash changes (e.g. when navigating between headings)
    if (location.pathname !== previousLocation?.pathname) {
      // PostHog's loader snippet creates a truthy stub before the library
      // finishes loading. The stub exposes get_distinct_id / get_session_id
      // as queued no-ops that return undefined, so we have to also check
      // __loaded to avoid stamping ?pid=undefined&sid=undefined onto links.
      // onRouteDidUpdate fires again on the next navigation, by which point
      // the real library will be in place.
      const posthog = window.posthog;
      if (!posthog || !posthog.__loaded) {
        return;
      }

      // Get all anchors that contain the console URL
      const allSignupLinks = document.querySelectorAll(
        `a[href*="${tigrisConfig.consoleUrl}`
      );

      const existingPid = location.searchParams?.get("pid");
      const existingSid = location.searchParams?.get("sid");
      const pid = existingPid || posthog.get_distinct_id();
      const sid = existingSid || posthog.get_session_id();
      allSignupLinks.forEach((el) => {
        const href = new URL(el.getAttribute("href"));

        if (href.searchParams.has("pid") === false) {
          href.searchParams.set("pid", pid);
          el.setAttribute("href", href.toString());
        }

        if (href.searchParams.has("sid") === false) {
          href.searchParams.set("sid", sid);
          el.setAttribute("href", href.toString());
        }
      });
    }
  } catch (e) {
    console.warn("Error augmenting Tigris Console links with pid query param");
  }
}
