import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import type { Props } from "@theme/BlogPostItem/Header/Title";

import styles from "./styles.module.css";

export default function BlogPostItemHeaderTitle({
  className,
}: Props): ReactNode {
  const { metadata, isBlogPostPage } = useBlogPost();
  const tag = metadata.tags[0];
  const { permalink, title } = metadata;

  if (isBlogPostPage) {
    return (
      <>
        {tag && (
          <>
            <Link to="/blog">Blog</Link> /{" "}
            <Link to={tag.permalink} className={clsx(styles.tagLink)}>
              {tag.label}
            </Link>
          </>
        )}
        <h1 className={clsx(className, styles.titleBlogPostPage)}>{title}</h1>
      </>
    );
  }

  return (
    <>
      {tag && (
        <Link to={tag.permalink} className={styles.eyebrow}>
          {tag.label}
        </Link>
      )}
      <h2 className={clsx(className, styles.title)}>
        <Link
          to={permalink}
          className={clsx(styles.titleLink, "blog-card-title-link")}
        >
          {title}
        </Link>
      </h2>
    </>
  );
}
