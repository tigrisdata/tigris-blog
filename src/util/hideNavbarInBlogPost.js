/*
We had three options for adjusting the UI for the full blog post view:

1. In-built configuration support. There's supposed to be sidebar hideable config but I don't think this works for the blog side bar. It's just a docs sidebar option.
2. Swizzle the sidebar (export to customize). However, this is classed as unsafe for this component (subject to change).
3. Add a clientModule that customizes the experience on the client using JavaScript.

This is an implementation for 3. However, there are restrictions with this such as not having access to the React life-cycle.
*/

const blogPostRegEx = new RegExp("/blog/.*/");
const isMobileView = () => {
  return window.innerWidth <= 996;
};

const adjustBlogPostUI = (location) => {
  try {
    // Blog takes up full view on mobile anyway
    if (isMobileView()) return;

    const sidebar = document.querySelector(
      "aside.col.col--3, .blog-left-sidebar"
    );
    if (!sidebar) return;

    const nav = sidebar.querySelector("nav");
    const main = document.querySelector(
      "main[itemtype='http://schema.org/Blog']"
    );

    if (blogPostRegEx.test(location.pathname) === true) {
      // Viewing an individual blog post
      main.className = "col col--8";
      sidebar.className = "col col--1 blog-left-sidebar";
      nav.style.display = "none";

      const rightSidebar = document.querySelector(
        "div.col.col--2, .blog-right-sidebar"
      );

      // If a blog post doesn't have any headings there will
      // be no right sidebar
      if (rightSidebar) {
        rightSidebar.className = "col col--3 blog-right-sidebar";
      }

      const backNavEl = document.getElementById("_injected_back_nav");
      if (!backNavEl) {
        const backNavEl = document.createElement("a");
        backNavEl.setAttribute("id", "_injected_back_nav");
        backNavEl.style.whiteSpace = "nowrap";
        backNavEl.style.position = "fixed";
        backNavEl.setAttribute("href", "/blog");
        const text = document.createTextNode("< Blog");
        backNavEl.append(text);
        sidebar.appendChild(backNavEl);

        backNavEl.addEventListener("click", (e) => {
          e.preventDefault();

          // hack via https://stackoverflow.com/a/62914542/39904 to trigger
          // the docusaurus navigation. Otherwise ther
          // simulate navigation to where you want to be (changes URL but doesn't navigate)
          window.history.pushState("", "", "/blog");
          // simulate navigation again so that
          window.history.pushState("", "", "/blog");
          // when you simulate back, the router tries to get BACK to "/url"
          window.history.go(-1);

          backNavEl.remove();
        });
      }
    } else {
      // Main blog listing page
      main.className = "col col--7";
      sidebar.className = "col col--3";
      nav.style.display = "";
    }
  } catch (ex) {
    console.error(ex);
  }
};

// Store the last location to be used in the
// window resize event handler
let lastLocation = null;
export function onRouteDidUpdate({ location }) {
  lastLocation = location;
  adjustBlogPostUI(lastLocation);
}

if (typeof window !== "undefined") {
  // Do not resize on every single event
  window.addEventListener("resize", () => {
    // Ensure the components have re-rendered
    window.setTimeout(() => {
      adjustBlogPostUI(lastLocation);
    }, 0);
  });
}
