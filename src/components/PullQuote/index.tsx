import React, { ReactNode } from "react";
import styles from "./styles.module.css";

export interface PullQuoteProps {
  children: ReactNode;
}

export default function PullQuote({ children }: PullQuoteProps) {
  return (
    <blockquote className={styles.pullQuote}>
      <p>{children}</p>
    </blockquote>
  );
}
