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

const rb2bHeadTag =
  process.env.VERCEL_ENV === "production"
    ? [
        {
          tagName: "script",
          attributes: {},
          innerHTML:
            '(function(){var m=document.cookie.match(/(?:^|; )tigris_geo=([^;]*)/);var c=m?decodeURIComponent(m[1]):"";if(c!=="US"&&c!=="CA")return;if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/Z6PVLHQKD16R/Z6PVLHQKD16R.js.gz";var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(s,f);})();',
        },
      ]
    : [];

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

  headTags: [
    {
      tagName: "link",
      attributes: { rel: "preconnect", href: "https://fonts.googleapis.com" },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
    ...rb2bHeadTag,
  ],

  // Match the marketing homepage fonts (Geist / Geist Mono / Hanken Grotesk).
  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Geist:wght@300..900&family=Geist+Mono:wght@300..700&family=Hanken+Grotesk:wght@400..800&display=swap",
      rel: "stylesheet",
    },
  ],

  clientModules: [
    require.resolve("./src/util/ensureGtag.js"),
    require.resolve("./src/util/posthog.js"),
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
          postsPerPage: "ALL",
          blogTitle: "Engineering blog",
          blogDescription:
            "Posts from the Tigris engineering team about how we build global object storage for any cloud — low-latency access anywhere, millions of buckets, and 99.99% availability you can rely on.",
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
    require.resolve("./plugins/blog-stats.js"),
    [
      "@signalwire/docusaurus-plugin-llms-txt",
      {
        siteTitle: "Tigris Blog",
        siteDescription:
          "Technical blog from Tigris, a globally distributed, S3-compatible object storage service. Covers storage, cloud infrastructure, AI/ML, and developer tools.",
        content: {
          enableMarkdownFiles: true,
          enableLlmsFullTxt: true,
          includeDocs: false,
          includeBlog: true,
          includePages: false,
        },
      },
    ],
    ...(process.env.NEXT_PUBLIC_POSTHOG_APIKEY &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
      ? [
          [
            "posthog-docusaurus",
            {
              apiKey: process.env.NEXT_PUBLIC_POSTHOG_APIKEY,
              appUrl: process.env.NEXT_PUBLIC_POSTHOG_HOST,
              opt_in_site_apps: true,
              enableInDevelopment:
                process.env.USE_POSTHOG_IN_DEVELOPMENT === "true",
            },
          ],
        ]
      : []),
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
            href: `${tigrisConfig.websiteUrl}/about`,
            label: "About",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            href: `${tigrisConfig.docsUrl}/`,
            label: "Docs",
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
            href: "https://www.tigrisdata.com/pricing/",
            label: "Pricing",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            href: tigrisConfig.discordUrl,
            label: "Community",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            href: tigrisConfig.discordUrl,
            className: "pseudo-icon discord-icon",
            position: "right",
          },
          {
            href: "https://x.com/tigrisdata",
            className: "pseudo-icon twitter-icon",
            position: "right",
          },
          ...(process.env.NEXT_ALGOLIA_APPID && process.env.NEXT_ALGOLIA_APIKEY
            ? [{ type: "search", position: "right" }]
            : []),
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
        // No `href`: the marketing footer renders the wordmark as a plain
        // image, and Docusaurus' footer logo link is styled at opacity 0.5,
        // which is what made the wordmark look muted here.
        // Both files are the brand wordmark as shipped by the website repo:
        // `/img/tigris-logo.svg` is public/images/tigris-logo.svg (the asset
        // the marketing footer itself uses) and `/logo/light.svg` is
        // public/brand/color-light/Logo.svg for the light color mode.
        logo: {
          src: "/logo/light.svg",
          srcDark: "/img/tigris-logo.svg",
          alt: "Tigris",
          width: "59",
          height: "24",
        },
        links: [
          {
            title: "Company",
            items: [
              {
                label: "About",
                href: `https://www.tigrisdata.com/about/`,
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
                href: "https://www.tigrisdata.com/pricing/",
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
              {
                label: "Community",
                href: tigrisConfig.discordUrl,
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Tigris Data, Inc · All rights reserved`,
      },
      ...(process.env.NEXT_ALGOLIA_APPID && process.env.NEXT_ALGOLIA_APIKEY
        ? {
            algolia: {
              appId: process.env.NEXT_ALGOLIA_APPID,
              apiKey: process.env.NEXT_ALGOLIA_APIKEY,
              indexName: "tigrisdata_blog",
              contextualSearch: false,
            },
          }
        : {}),
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
