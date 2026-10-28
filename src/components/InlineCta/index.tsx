import tigrisConfig from "@site/tigris.config.js";
import React from "react";
import styles from "./styles.module.css";

interface Props {
  title: string;
  /** Optional second line under the tagline. */
  subtitle?: string;
  button: string;
  link?: string;
  /** PostHog autocapture name for the button; defaults to blog-inline-cta. */
  cta?: string;
}

const InlineCta = ({
  title,
  subtitle,
  button,
  link,
  cta = "blog-inline-cta",
}: Props) => {
  const linkUrl = link !== undefined ? link! : tigrisConfig.getStartedUrl;
  return (
    <div className={styles.cta}>
      <div className={styles.copy}>
        <span className={styles.title}>{title}</span>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <a
        href={linkUrl}
        data-ph-capture-attribute-cta={cta}
        className={styles.button}
      >
        {button}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </a>
    </div>
  );
};

export default InlineCta;
