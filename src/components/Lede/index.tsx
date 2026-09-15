import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

interface LedeProps {
  /**
   * Plain-text lede (e.g. the post description). Blank lines split it into
   * paragraphs. Ignored when `children` are provided.
   */
  text?: string;
  /** Rich lede content authored inline (markdown paragraphs are supported). */
  children?: ReactNode;
}

/**
 * A lede (a.k.a. standfirst / deck): a larger, muted intro paragraph that sits
 * at the top of a post, just under the header, to set up the article before the
 * body begins. No box or border — the size and colour do the separating.
 */
export default function Lede({
  text,
  children,
}: LedeProps): JSX.Element | null {
  if (!children && !text?.trim()) {
    return null;
  }

  return (
    <div className={styles.lede}>
      {children ??
        text!
          .trim()
          .split(/\n\s*\n/)
          .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
    </div>
  );
}
