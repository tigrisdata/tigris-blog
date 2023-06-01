// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint @typescript-eslint/no-var-requires: "off" */

// Needed for testing with environment variables locally
// On Vercel the environment variables are automatically injected
require("dotenv").config({ path: ".env.local" });

const tigrisConfig = require("./tigris.config");

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Tigris",
  tagline:
    "Tigris is a Serverless NoSQL Database and Search Platform that offers a modern alternative to DynamoDB and MongoDB.",
  url: tigrisConfig.websiteUrl,
  baseUrl: "/blog/",
  favicon: "img/favicon.ico",
  organizationName: "tigrisdata",
  projectName: "blog",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",
  trailingSlash: true,

  clientModules: [
    require.resolve("./src/util/augmentConsoleLinks.js"),
    require.resolve("./src/util/hideNavbarInBlogPost.js"),
  ],

  customFields: {
    newsletterApiBaseUrl: process.env.NEXT_NEWSLETTER_API_BASE_URL || "",
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: "/",
          postsPerPage: 10,
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
      "posthog-docusaurus",
      {
        apiKey: process.env.NEXT_PUBLIC_POSTHOG_APIKEY,
        appUrl: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        opt_in_site_apps: true,
        enableInDevelopment: process.env.USE_POSTHOG_IN_DEVELOPMENT === "true",
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
      // announcementBar: {
      //   id: "announcementBar-2", // increment on change
      //   content: `🚀 <a target="_blank" href="${tigrisConfig.signupUrl}">Signup</a> for our new public beta &nbsp; &nbsp; ⭐️ Star Tigris on <a target="_blank" rel="noopener noreferrer" href="https://github.com/tigrisdata/tigris">GitHub</a>`,
      //   backgroundColor: "#5ecbad",
      //   textColor: "#262b31",
      // },
      navbar: {
        hideOnScroll: false,
        logo: {
          href: tigrisConfig.websiteUrl,
          src: "/logo/light.png",
          srcDark: "/logo/dark.png",
          alt: "Tigris Blog",
          height: "26px",
          target: "_self",
        },
        items: [
          {
            href: tigrisConfig.docsUrl,
            label: "Docs",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Quickstarts",
            to: `${tigrisConfig.docsUrl}/quickstarts/`,
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Concepts",
            to: `${tigrisConfig.docsUrl}/concepts/`,
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "SDKs & Tools",
            to: `${tigrisConfig.docsUrl}/sdkstools/`,
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Guides",
            to: `${tigrisConfig.docsUrl}/guides/`,
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "References",
            to: `${tigrisConfig.docsUrl}/references/`,
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Blog",
            to: "/",
            position: "left",
          },
          {
            href: tigrisConfig.discordUrl,
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
            label: "Sign Up",
            href: tigrisConfig.signupUrl,
            position: "right",
            className: "wc-portal-signup wc-portal-link",
          },
          {
            label: "Login",
            href: tigrisConfig.loginUrl,
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
                href: tigrisConfig.consoleUrl,
              },
            ],
          },
          {
            title: "Company",
            items: [
              {
                label: "About Us",
                href: tigrisConfig.websiteUrl,
                target: "_self",
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Terms of Service",
                href: `${tigrisConfig.websiteUrl}/service-terms`,
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Privacy Policy",
                href: `${tigrisConfig.websiteUrl}/privacy-policy`,
                rel: "",
                className: "footer__link-item disable-external-icon",
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
                href: tigrisConfig.docsUrl,
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Blog",
                href: "/",
              },
              {
                label: "Videos",
                href: tigrisConfig.youTubeUrl,
              },
              {
                label: "Community",
                href: tigrisConfig.discordUrl,
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
