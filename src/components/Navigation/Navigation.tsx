import Link from "@docusaurus/Link";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

export default function Navigation() {
  return (
    <div className="row col">
      <ul className={clsx("button-group col col--12", styles.navigation)}>
        <li>
          <Link to="/blog" className={styles.link}>
            All
          </Link>
        </li>
        <li>
          <Link to="/blog/tags/engineering" className={styles.link}>
            Engineering
          </Link>
        </li>
        <li>
          <Link to="/blog/tags/building-with-tigris" className={styles.link}>
            Building with Tigris
          </Link>
        </li>
        <li>
          <Link to="/blog/tags/customers" className={styles.link}>
            Customers
          </Link>
        </li>
        <li>
          <Link to="/blog/tags/updates" className={styles.link}>
            Updates
          </Link>
        </li>
      </ul>
    </div>
  );
}
