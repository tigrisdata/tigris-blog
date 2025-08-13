// Breadcrumbs.jsx
import React from "react";
import styles from "./styles.module.css";

export default function Breadcrumbs({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`${styles.wrap} ${className}`}>
      <ol className={styles.list}>
        {items.map((it, i) => {
          const label = typeof it === "string" ? it : it?.label ?? "";
          const isLast = i === items.length - 1;

          return (
            <li key={i} className={styles.item}>
              <span
                className={`${styles.label} ${isLast ? styles.current : ""}`}
                aria-current={isLast ? "page" : undefined}
                title={typeof label === "string" ? label : undefined}
              >
                {label}
              </span>

              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  {/* keep aspect ratio; height:100% set in CSS */}
                  <svg className={styles.separatorSvg} viewBox="0 0 24 100">
                    <path
                      className={styles.separatorPath}
                      d="M6,12 L18,50 L6,88"
                    />
                  </svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
