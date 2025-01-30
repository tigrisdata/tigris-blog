/* eslint-disable react/prop-types */
import React from "react";

import styles from "./styles.module.css";

interface ReasoningCollapsibleProps {
  timeTaken: number; // in seconds
  children: JSX.Element[] | JSX.Element;
}

export default function ReasoningCollapsible({
  timeTaken,
  children,
}: ReasoningCollapsibleProps) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        Thought for {(timeTaken || 0).toFixed(0)} seconds
        <span className={styles.arrow} aria-hidden="true"></span>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
