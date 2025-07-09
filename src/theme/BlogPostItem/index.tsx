import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useBlogPost } from "@docusaurus/theme-common/internal";
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
  const { isBlogPostPage } = useBlogPost();
  return (
    <BlogPostItemContainer
      className={clsx(
        className,
        "col",
        { [styles.item]: !isBlogPostPage },
        isBlogPostPage ? "col--12" : "col--6 margin-bottom--lg"
      )}
    >
      <div className={clsx("padding--md")}>
        <BlogPostItemHeader />
        <BlogPostItemContent>{children}</BlogPostItemContent>
        <BlogPostItemFooter />
      </div>
    </BlogPostItemContainer>
  );
}
