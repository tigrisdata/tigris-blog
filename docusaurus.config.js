// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint @typescript-eslint/no-var-requires: "off" */

// Needed for testing with environment variables locally
// On Vercel the environment variables are automatically injected
require("dotenv").config({ path: ".env.local" });

const tigrisConfig = require("./tigris.config");

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;
const simplePlantUML = require("@akebifiky/remark-simple-plantuml");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Tigris Object Storage",
  tagline: "Globally Distributed S3-Compatible Object Storage",
  url: tigrisConfig.websiteUrl,
  baseUrl: "/blog/",
  favicon: "img/favicon.ico",
  organizationName: "tigrisdata",
  projectName: "blog",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  trailingSlash: true,

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

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
          postsPerPage: 9,
          blogTitle: "Tigris Blog",
          blogDescription: "A blog dedicated to all things storage!",
          blogSidebarTitle: "All our posts",
          blogSidebarCount: 0,
          showReadingTime: true,
          feedOptions: {
            type: "all",
            copyright: `Copyright © ${new Date().getFullYear()} Tigris Data, Inc.`,
          },
          remarkPlugins: [simplePlantUML],
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
            href: `${tigrisConfig.docsUrl}/`,
            label: "Docs",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            href: `${tigrisConfig.docsUrl}/overview/`,
            label: "Overview",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            href: `${tigrisConfig.docsUrl}/get-started/`,
            label: "Get Started",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            href: `${tigrisConfig.docsUrl}/sdks/s3/`,
            label: "AWS S3 SDKs",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            href: `${tigrisConfig.docsUrl}/migration/`,
            label: "Migration",
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
            href: `${tigrisConfig.docsUrl}/pricing/`,
            label: "Pricing",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          // {
          //   href: tigrisConfig.discordUrl,
          //   className: "pseudo-icon discord-icon",
          //   position: "right",
          // },
          {
            href: "https://twitter.com/TigrisData",
            className: "pseudo-icon twitter-icon",
            position: "right",
          },
          {
            label: "Login",
            href: tigrisConfig.loginUrl,
            position: "right",
            className: "wc-portal-login wc-portal-link",
          },
          {
            label: "Get Started",
            href: tigrisConfig.signUpUrl,
            position: "right",
            className: "wc-portal-signup wc-portal-link",
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
            title: "Company",
            items: [
              {
                label: "About",
                href: `${tigrisConfig.docsUrl}/about/`,
                target: "_self",
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Blog",
                href: "/",
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                href: `${tigrisConfig.docsUrl}/pricing/`,
                label: "Pricing",
                target: "_self",
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Terms of Service",
                href: `${tigrisConfig.docsUrl}/legal/service-terms/`,
                target: "_self",
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Privacy Policy",
                href: `${tigrisConfig.docsUrl}/legal/privacy-policy/`,
                target: "_self",
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Report Abuse",
                href: tigrisConfig.reportAbuseUrl,
              },
              // {
              //   label: "Videos",
              //   href: tigrisConfig.youTubeUrl,
              // },
              // {
              //   label: "Community",
              //   href: tigrisConfig.discordUrl,
              // },
            ],
          },
          {
            title: "Developers",
            items: [
              {
                href: `${tigrisConfig.docsUrl}/`,
                label: "Docs",
                target: "_self",
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
              {
                label: "Status",
                href: tigrisConfig.statusPageUrl,
              },
              {
                label: "Support",
                href: "mailto:help@tigrisdata.com",
              },
              // {
              //   label: "Videos",
              //   href: "https://www.youtube.com/channel/UCsCQ5Nl3JOh71UNCCNZ3q2g",
              // },
              // {
              //   label: "Community",
              //   href: tigrisConfig.discordUrl,
              // },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tigris Data, Inc. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          "java",
          "scala",
          "php",
          "csharp",
          "ruby",
          "elixir",
        ],
      },
    }),
};

module.exports = config;
