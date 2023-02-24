export function onRouteDidUpdate({ location }) {
  try {
    const blogPostRegEx = new RegExp("/blog/.*/");
    const main = document.querySelector(
      "main[itemtype='http://schema.org/Blog']"
    );
    const sidebar = document.querySelector("aside.col.col--3");
    const backNavEl = document.createElement("a");
    backNavEl.setAttribute("href", "/blog");
    const text = document.createTextNode("< Blog");
    backNavEl.append(text);
    sidebar.appendChild(backNavEl);
    if (blogPostRegEx.test(location.pathname) === true) {
      // Viewing an individual blog post
      console.log("in blog/*");
      main.className = "col col--8";
      sidebar.className = "col col--1";
      sidebar.firstChild.style.display = "none";

      const rightSidebar = document.querySelector("div.col.col--2");
      rightSidebar.className = "col col--3";
    } else {
      // Main blog listing page
      main.className = "col col--7";
      sidebar.className = "col col--3";
      sidebar.firstChild.style.display = "";
    }
  } catch (e) {
    console.error(e);
  }
}
