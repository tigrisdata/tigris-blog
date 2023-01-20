import tigrisConfig from "../../tigris.config";

export function onRouteDidUpdate({ location, previousLocation }) {
  try {
    // Don't execute if we are still on the same page; the lifecycle may be fired
    // because the hash changes (e.g. when navigating between headings)
    if (location.pathname !== previousLocation?.pathname) {
      // PostHog should be available with the exception of in the development
      // environment
      const posthog = window.posthog;
      if (!posthog) {
        console.warn("Cannot set 'pid' for console links");
        return;
      }

      // Get all anchors that contain the console URL
      const allSignupLinks = document.querySelectorAll(
        `a[href*="${tigrisConfig.consoleUrl}`
      );

      // Add the `pid` search parameter if it is not present
      const pid = posthog.get_distinct_id();
      allSignupLinks.forEach((el) => {
        const href = new URL(el.getAttribute("href"));

        if (href.searchParams.has("pid") === false) {
          href.searchParams.set("pid", pid);
          el.setAttribute("href", href.toString());
        }
      });
    }
  } catch (e) {
    console.warn("Error augmenting Tigris Console links with pid query param");
  }
}
