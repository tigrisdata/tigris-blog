import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

interface LedeProps {
  /** The intro / standfirst text (markdown paragraphs are supported). */
  children: ReactNode;
}

/**
 * A lede (a.k.a. standfirst / deck): a larger, muted intro paragraph that sits
 * at the top of a post, just under the header, to set up the article before the
 * body begins. No box or border — the size and colour do the separating.
 */
export default function Lede({ children }: LedeProps): JSX.Element {
  return <div className={styles.lede}>{children}</div>;
}
