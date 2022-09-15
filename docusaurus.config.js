// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint @typescript-eslint/no-var-requires: "off" */

// Needed for testing with environment variables locally
// On Vercel the environment variables are automatically injected
require("dotenv").config({ path: ".env.local" });

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const TwitterSvg =
  '<svg style="fill: #1DA1F2; vertical-align: middle;" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Tigris",
  tagline:
    "For developers who want to build scalable web and mobile apps fast!",
  url: "https://blog.tigrisdata.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "tigrisdata",
  projectName: "blog",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: "/",
          postsPerPage: 10,
          editUrl: "https://github.com/tigrisdata/tigris-docs/blob/main",
          blogTitle: "Tigris Blog",
          blogDescription: "A blog dedicated to all things database!",
          blogSidebarTitle: "All our posts",
          blogSidebarCount: "ALL",
          showReadingTime: true,
          feedOptions: {
            type: "all",
            copyright: `Copyright © ${new Date().getFullYear()} Tigris Data, Inc.`,
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-GW2DNH9EW4",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  plugins: [
    [
      "docusaurus-plugin-segment",
      {
        apiKey: process.env.NEXT_PUBLIC_ANALYTICS_ID,
        page: {
          category: "blog",
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "light",
        respectPrefersColorScheme: false,
      },
      announcementBar: {
        id: "announcementBar-1", // increment on change
        content: `🚀 <a target="_blank" href="https://www.tigrisdata.com/beta" >Signup</a> for the Tigris beta and ⭐️ give us a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/tigrisdata/tigris">GitHub</a>`,
        backgroundColor: "#5ecbad",
        textColor: "#262b31",
      },
      navbar: {
        hideOnScroll: false,
        title: "Tigris",
        logo: {
          alt: "Tigris Logo",
          src: "img/logo.svg",
          href: "https://www.tigrisdata.com/",
        },
        items: [
          {
            href: "https://docs.tigrisdata.com/",
            label: "Docs",
            position: "left",
          },
          {
            type: "dropdown",
            label: "API Reference",
            position: "left",
            items: [
              {
                label: "HTTP API",
                href: "https://docs.tigrisdata.com/apidocs/",
              },
              {
                label: "RPC",
                href: "https://docs.tigrisdata.com/protodocs/server/v1/api.proto",
              },
            ],
          },
          {
            label: "Blog",
            to: "/",
            position: "left",
          },
          {
            href: "https://jobs.lever.co/tigris",
            label: "Careers",
            position: "right",
          },
          {
            href: "https://join.slack.com/t/tigrisdatacommunity/shared_invite/zt-16fn5ogio-OjxJlgttJIV0ZDywcBItJQ",
            label: "Slack Community",
            position: "right",
          },
          {
            href: "https://github.com/tigrisdata/tigris",
            className: "navbar-item-github",
            position: "right",
          },
          {
            href: "https://twitter.com/TigrisData",
            className: "navbar-item-twitter",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Tigris Data, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java", "scala"],
      },
    }),
};

module.exports = config;
