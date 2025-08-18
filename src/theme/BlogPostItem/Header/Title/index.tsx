import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/BlogPostItem/Header/Title";

import styles from "./styles.module.css";

export default function BlogPostItemHeaderTitle({
  className,
}: Props): ReactNode {
  const { metadata, isBlogPostPage, assets } = useBlogPost();
  const tag = metadata.tags[0];

  const { permalink, title } = metadata;
  const TitleHeading = isBlogPostPage ? "h1" : "h2";

  const breadcrumb = isBlogPostPage ? (
    <>
      <Link to="/blog" className="">
        Blog
      </Link>{" "}
      /{" "}
      <Link to={tag.permalink} className={clsx(styles.tagLink)}>
        {tag.label}
      </Link>
    </>
  ) : (
    <></>
  );

  return (
    <>
      {breadcrumb}
      <TitleHeading
        className={clsx(
          className,
          isBlogPostPage ? styles.titleBlogPostPage : styles.title
        )}
      >
        {!isBlogPostPage && assets.image && (
          <Link to={permalink} className={clsx(styles.titleImageLink)}>
            <img
              src={assets.image}
              alt={metadata.title}
              className={clsx(styles.titleImage, styles.zoomImage)}
              loading="lazy"
              width={400}
              height={225}
              sizes="(max-width: 768px) 100vw, (max-width: 996px) 50vw, 400px"
            />
          </Link>
        )}
        {isBlogPostPage ? (
          title
        ) : (
          <Link to={permalink} className={styles.titleLink}>
            {title}
          </Link>
        )}
      </TitleHeading>
    </>
  );
}
