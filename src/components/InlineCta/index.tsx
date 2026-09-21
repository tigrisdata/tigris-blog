import tigrisConfig from "@site/tigris.config.js";
import React from "react";
import styles from "./styles.module.css";

interface Props {
  title: string;
  /** Optional second line under the tagline. */
  subtitle?: string;
  button: string;
  link?: string;
}

const InlineCta = ({ title, subtitle, button, link }: Props) => {
  const linkUrl = link !== undefined ? link! : tigrisConfig.getStartedUrl;
  return (
    <div className={styles.cta}>
      <div className={styles.copy}>
        <span className={styles.title}>{title}</span>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <a href={linkUrl} className={styles.button}>
        {button}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </a>
    </div>
  );
};

export default InlineCta;
