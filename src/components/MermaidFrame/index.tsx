import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface MermaidFrameProps {
  title?: string;
  caption?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

export default function MermaidFrame({
  title,
  caption,
  children,
  style,
}: MermaidFrameProps): JSX.Element {
  return (
    <figure className={styles.mermaidFrame} style={style}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.body}>{children}</div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
