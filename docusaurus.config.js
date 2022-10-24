// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint @typescript-eslint/no-var-requires: "off" */

// Needed for testing with environment variables locally
// On Vercel the environment variables are automatically injected
require("dotenv").config({ path: ".env.local" });

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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
          blogDescription: "A blog dedicated to all things data!",
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
        defaultMode: "dark",
      },
      docs: {
        sidebar: {
          hideable: true,
        },
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
          href: "/",
          src: "/logo/light.png",
          srcDark: "/logo/dark.png",
          alt: "Tigris Blog",
          height: "26px",
        },
        items: [
          {
            href: "https://docs.tigrisdata.com/",
            label: "Docs",
            position: "left",
          },
          {
            label: "API Reference",
            href: "https://docs.tigrisdata.com/apidocs/",
            position: "left",
          },
          {
            label: "Guides",
            to: "https://docs.tigrisdata.com/guides/",
            position: "left",
          },
          {
            label: "Blog",
            to: "/",
            position: "left",
          },
          {
            href: "http://discord.tigrisdata.com",
            className: "pseudo-icon discord-icon",
            position: "right",
          },
          {
            href: "https://github.com/tigrisdata/tigris",
            className: "pseudo-icon github-icon",
            position: "right",
          },
          {
            href: "https://twitter.com/TigrisData",
            className: "pseudo-icon twitter-icon",
            position: "right",
          },
          {
            href: "https://join.slack.com/t/tigrisdatacommunity/shared_invite/zt-16fn5ogio-OjxJlgttJIV0ZDywcBItJQ",
            label: "Slack Community",
            position: "right",
          },
          {
            label: "Sign Up",
            href: "https://www.tigrisdata.com/beta#signup-form",
            position: "right",
            className: "wc-portal-signup wc-portal-link",
          },
          {
            label: "Login",
            href: "https://console.preview.tigrisdata.cloud/",
            position: "right",
            className: "wc-portal-login wc-portal-link",
          },
        ],
      },
      footer: {
        logo: {
          href: "/",
          src: "/logo/light.png",
          srcDark: "/logo/dark.png",
          alt: "Tigris Blog",
          height: "26px",
        },
        links: [
          {
            title: "Product",
            items: [
              {
                label: "Cloud Console",
                href: "https://console.preview.tigrisdata.cloud",
              },
            ],
          },
          {
            title: "Company",
            items: [
              {
                label: "About Us",
                href: "https://www.tigrisdata.com",
              },
              {
                label: "Terms of Service",
                href: "https://www.tigrisdata.com/service-terms",
              },
              {
                label: "Privacy Policy",
                href: "https://www.tigrisdata.com/privacy-policy",
              },
              {
                label: "Contact Us",
                href: "mailto:support@tigrisdata.com",
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                label: "Documentation",
                href: "https://docs.tigrisdata.com",
              },
              {
                label: "Blog",
                href: "https://blog.tigrisdata.com",
              },
              {
                label: "Videos",
                href: "https://www.youtube.com/channel/UCsCQ5Nl3JOh71UNCCNZ3q2g",
              },
              {
                label: "Community",
                href: "http://discord.tigrisdata.com",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tigris Data, Inc. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java", "scala"],
      },
    }),
};

module.exports = config;
