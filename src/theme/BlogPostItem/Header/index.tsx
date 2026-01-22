import React, { type ReactNode } from "react";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderInfo from "@theme/BlogPostItem/Header/Info";
import BlogPostItemHeaderAuthors from "@theme/BlogPostItem/Header/Authors";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";

export default function BlogPostItemHeader(): ReactNode {
  const { isBlogPostPage } = useBlogPost();

  return (
    <header>
      <BlogPostItemHeaderTitle />
      {isBlogPostPage && <BlogPostItemHeaderInfo />}
      {isBlogPostPage && <BlogPostItemHeaderAuthors />}
    </header>
  );
}
