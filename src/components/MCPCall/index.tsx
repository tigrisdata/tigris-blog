/* eslint-disable react/prop-types */
import React from "react";
import styles from "./styles.module.css";

interface McpCallProps {
  title: string;
  parameters: object;
  result: object;
}

export default function McpCall({ title, parameters, result }: McpCallProps) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <span className={styles.toolName}>{title}</span>✅
        <span className={styles.arrow} aria-hidden="true"></span>
      </summary>
      <div className={styles.content}>
        <div className={styles.mcpContent}>
          <div className={styles.block}>
            <div className={styles.label}>Parameters:</div>
            <pre className={styles.codeBlock}>
              {JSON.stringify(parameters, null, 2)}
            </pre>
          </div>
          <div className={styles.block}>
            <div className={styles.label}>Result:</div>
            <pre className={styles.codeBlock}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </details>
  );
}
