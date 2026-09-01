import React, { type ReactNode } from "react";
import clsx from "clsx";
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
  const { isBlogPostPage } = useBlogPost();

  // Blog list / home view: a flat, text-first row (no image).
  if (!isBlogPostPage) {
    return (
      <BlogPostItemContainer className={clsx(className, styles.listRow)}>
        <BlogPostItemHeader />
        <BlogPostItemContent>{children}</BlogPostItemContent>
        <BlogPostItemFooter />
      </BlogPostItemContainer>
    );
  }

  // Single post view.
  return (
    <BlogPostItemContainer className={clsx(className, "col--12")}>
      <BlogPostItemHeader />
      <BlogPostItemContent>{children}</BlogPostItemContent>
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  );
}
