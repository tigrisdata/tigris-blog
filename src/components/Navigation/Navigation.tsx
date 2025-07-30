import Link from "@docusaurus/Link";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";
import { useLocation } from "@docusaurus/router";

type Location = ReturnType<typeof useLocation>;

function isCategoryActive(category: string, location: Location) {
  return location.pathname.includes(category);
}

function isBlogHomePage(location: Location) {
  return location.pathname.endsWith("/blog/");
}

export default function Navigation({ location }: { location: Location }) {
  return (
    <>
      <div className={clsx(styles.container, "container")}>
        <div className="row col">
          <div className="col col--8 col--offset-2 text-center">
            <h1 className={styles.title}>Tigris Blog</h1>
            <p>
              A multi-cloud, S3-compatible object storage service for low
              latency data access anywhere.
            </p>
          </div>
        </div>
      </div>
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
              to="/blog/tags/build with tigris"
              className={clsx(
                styles.link,
                isCategoryActive("build with tigris", location) && styles.active
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
    </>
  );
}
