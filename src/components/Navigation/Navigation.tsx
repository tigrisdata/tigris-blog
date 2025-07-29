import Link from "@docusaurus/Link";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

function isCategoryActive(category: string) {
  return location.pathname.includes(category);
}

function isBlogHomePage() {
  return location.pathname.endsWith("/blog/");
}

export default function Navigation() {
  return (
    <>
      <div className={clsx(styles.container, "container")}>
        <div className="row col">
          <div className="col col--8 col--offset-2 text-center">
            <h1 className={styles.title}>Tigris Blog</h1>
            <p>
              A multi-cloud, S3-compatible object storage service for low
              latency data access anywhere!
            </p>
          </div>
        </div>
      </div>
      <div className="row col">
        <ul className={clsx("button-group col col--12", styles.navigation)}>
          <li>
            <Link
              to="/blog"
              className={clsx(styles.link, isBlogHomePage() && styles.active)}
            >
              All Posts
            </Link>
          </li>
          <li>
            <Link
              to="/blog/tags/engineering"
              className={clsx(
                styles.link,
                isCategoryActive("engineering") && styles.active
              )}
            >
              Engineering
            </Link>
          </li>
          <li>
            <Link
              to="/blog/tags/build-with-tigris"
              className={clsx(
                styles.link,
                isCategoryActive("build-with-tigris") && styles.active
              )}
            >
              Build with Tigris
            </Link>
          </li>
          <li>
            <Link
              to="/blog/tags/customers"
              className={clsx(
                styles.link,
                isCategoryActive("customers") && styles.active
              )}
            >
              Customers
            </Link>
          </li>
          <li>
            <Link
              to="/blog/tags/updates"
              className={clsx(
                styles.link,
                isCategoryActive("updates") && styles.active
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
