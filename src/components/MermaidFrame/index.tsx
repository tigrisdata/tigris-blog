import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface MermaidFrameProps {
  title?: string;
  caption?: string;
  children: ReactNode;
}

export default function MermaidFrame({
  title,
  caption,
  children,
}: MermaidFrameProps): JSX.Element {
  return (
    <figure className={styles.mermaidFrame}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.body}>{children}</div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

