import React from "react";
import styles from "./styles.module.css";

export default function BlogHero(): JSX.Element {
  return (
    <div className={styles.heroBanner}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h1 className={styles.title}>Blog</h1>
            <p className={styles.subtitle}>
              Tigris is a globally distributed, multi-cloud object storage
              service with built-in support for the S3 API. It uses Dynamic Data
              Placement and Access-Based Rebalancing to deliver low-latency
              access worldwide — without the need to manage replication or
              caching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
