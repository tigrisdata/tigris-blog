import Link from "@docusaurus/Link";
import clsx from "clsx";
import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import tigrisConfig from "@site/tigris.config";
import styles from "./styles.module.css";
import { useLocation } from "@docusaurus/router";

type Location = ReturnType<typeof useLocation>;
type NavigationProps = {
  location: Location;
  showHeader?: boolean;
  showTags?: boolean;
};

type BlogStats = {
  postCount: number;
  authorCount: number;
  firstPostDate: string | null;
};

function isCategoryActive(category: string, location: Location) {
  return location.pathname.includes(category);
}

function isBlogHomePage(location: Location) {
  return location.pathname.replace(/\/+$/, "") === "/blog";
}

function BlogMetrics() {
  const stats = usePluginData("blog-stats") as BlogStats | undefined;
  const rssUrl = `${tigrisConfig.blogUrl.replace(/\/?$/, "/")}rss.xml`;
  if (!stats) return null;

  const established = stats.firstPostDate
    ? new Date(stats.firstPostDate).getUTCFullYear().toString()
    : null;

  const metrics = [
    { value: stats.postCount.toString(), label: "Posts" },
    { value: stats.authorCount.toString(), label: "Authors" },
    ...(established ? [{ value: established, label: "Established" }] : []),
  ];

  return (
    <div className={styles.headerMeta}>
      <dl className={styles.metrics}>
        {metrics.map((m) => (
          <div key={m.label} className={styles.metric}>
            <dd className={styles.metricValue}>{m.value}</dd>
            <dt className={styles.metricLabel}>{m.label}</dt>
          </div>
        ))}
      </dl>
      <a className={styles.rss} href={rssUrl} type="application/rss+xml">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="5" cy="19" r="2.2" />
          <path d="M3 10.2a10.8 10.8 0 0 1 10.8 10.8h3A13.8 13.8 0 0 0 3 7.2z" />
          <path d="M3 4.4a16.6 16.6 0 0 1 16.6 16.6h3A19.6 19.6 0 0 0 3 1.4z" />
        </svg>
        Get the RSS feed
      </a>
    </div>
  );
}

export default function Navigation({
  location,
  showHeader = true,
  showTags = true,
}: NavigationProps) {
  return (
    <>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <h1 className={styles.title}>
              Engineering <span className={styles.titleAccent}>blog</span>
            </h1>
            <p className={styles.description}>
              Posts from the Tigris engineering team about how we build global
              object storage for any cloud — low-latency access anywhere,
              millions of buckets, and 99.99% availability you can rely on.
            </p>
          </div>
          <BlogMetrics />
        </div>
      )}
      {showTags && (
        <div className="row col col--8 col--offset-2 text-center">
          <ul className={clsx("col col--12", styles.navigation)}>
            <li className={clsx(styles.navigationItem)}>
              <Link
                to="/blog"
                className={clsx(
                  styles.link,
                  isBlogHomePage(location) && styles.active
                )}
              >
                All Posts
              </Link>
            </li>
            <li className={clsx(styles.navigationItem)}>
              <Link
                to="/blog/tags/engineering"
                className={clsx(
                  styles.link,
                  isCategoryActive("engineering", location) && styles.active
                )}
              >
                Engineering
              </Link>
            </li>
            <li className={clsx(styles.navigationItem)}>
              <Link
                to="/blog/tags/build-with-tigris"
                className={clsx(
                  styles.link,
                  isCategoryActive("build-with-tigris", location) &&
                    styles.active
                )}
              >
                Build with Tigris
              </Link>
            </li>
            <li className={clsx(styles.navigationItem)}>
              <Link
                to="/blog/tags/customers"
                className={clsx(
                  styles.link,
                  isCategoryActive("customers", location) && styles.active
                )}
              >
                Customers
              </Link>
            </li>
            <li className={clsx(styles.navigationItem)}>
              <Link
                to="/blog/tags/updates"
                className={clsx(
                  styles.link,
                  isCategoryActive("updates", location) && styles.active
                )}
              >
                Updates
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
