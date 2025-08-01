import React, { type ReactNode } from "react";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderAuthors from "@theme/BlogPostItem/Header/Authors";
import { useBlogPost } from "@docusaurus/theme-common/internal";

export default function BlogPostItemHeader(): ReactNode {
  const { isBlogPostPage } = useBlogPost();

  return (
    <header>
      <BlogPostItemHeaderTitle />
      {isBlogPostPage && <BlogPostItemHeaderAuthors />}
    </header>
  );
}
