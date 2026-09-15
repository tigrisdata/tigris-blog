import React, { type ReactNode } from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import TOCItems from "@theme/TOCItems";
import styles from "./styles.module.css";

/**
 * An inline table of contents that sits in the content flow, just under the
 * post header. It only renders on narrow viewports (≤996px) where Docusaurus
 * hides the desktop TOC sidebar, so readers on phones/tablets still get a jump
 * list. It is purely CSS-gated (see styles.module.css) so it never duplicates
 * the sidebar on wide screens.
 */
export default function InlineTOC(): ReactNode {
  const { metadata, toc } = useBlogPost();
  const { frontMatter } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;

  if (hideTableOfContents || toc.length === 0) {
    return null;
  }

  return (
    <details className={styles.inlineToc}>
      <summary className={styles.summary}>
        <span className={styles.tag}>Contents</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      <nav className={styles.nav} aria-label="Table of contents">
        <TOCItems
          toc={toc}
          minHeadingLevel={tocMinHeadingLevel}
          maxHeadingLevel={tocMaxHeadingLevel}
          className={styles.tocItems}
          linkClassName={styles.tocLink}
          linkActiveClassName={styles.tocLinkActive}
        />
      </nav>
    </details>
  );
}
