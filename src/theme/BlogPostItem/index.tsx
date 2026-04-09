import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import BlogPostItemContainer from "@theme/BlogPostItem/Container";
import BlogPostItemHeader from "@theme/BlogPostItem/Header";
import BlogPostItemContent from "@theme/BlogPostItem/Content";
import BlogPostItemFooter from "@theme/BlogPostItem/Footer";
import type { Props } from "@theme/BlogPostItem";
import styles from "./styles.module.css";

export default function BlogPostItem({
  children,
  className,
}: Props): ReactNode {
  const { isBlogPostPage, assets, metadata } = useBlogPost();
  const isImportantMainCard =
    typeof className === "string" && className.includes("important-main-card");
  const isImportantSideCard =
    typeof className === "string" && className.includes("important-side-card");
  const isFeaturedListCard = isImportantMainCard || isImportantSideCard;

  return (
    <BlogPostItemContainer
      className={clsx(
        className,
        { [styles.item]: !isBlogPostPage && !isFeaturedListCard },
        {
          [styles.importantMainCardLayout]:
            isImportantMainCard && !isBlogPostPage,
        },
        {
          [styles.importantSideCardLayout]:
            isImportantSideCard && !isBlogPostPage,
        },
        isBlogPostPage ? "col--12" : !isFeaturedListCard && "margin-bottom--lg"
      )}
    >
      {isImportantSideCard && !isBlogPostPage && assets.image && (
        <Link to={metadata.permalink} className={styles.sideCardThumbnailLink}>
          <img
            src={assets.image}
            alt={metadata.title}
            className={styles.sideCardThumbnail}
            loading="lazy"
            width={180}
            height={180}
          />
        </Link>
      )}
      <div
        className={clsx({
          [styles.importantSideCardContent]:
            isImportantSideCard && !isBlogPostPage,
        })}
      >
        <BlogPostItemHeader />
        <BlogPostItemContent>{children}</BlogPostItemContent>
        <BlogPostItemFooter />
      </div>
    </BlogPostItemContainer>
  );
}
