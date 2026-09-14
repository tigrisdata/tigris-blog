import React, { type ReactNode } from "react";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderMeta from "@theme/BlogPostItem/Header/Meta";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";

export default function BlogPostItemHeader(): ReactNode {
  const { isBlogPostPage } = useBlogPost();

  // On the single post page the byline becomes a spec-sheet meta strip
  // (author / published / reading time / tags). The list view keeps the flat
  // info line + author row.
  if (isBlogPostPage) {
    return (
      <header>
        <BlogPostItemHeaderTitle />
        <BlogPostItemHeaderMeta />
      </header>
    );
  }

  return (
    <header>
      <BlogPostItemHeaderTitle />
    </header>
  );
}
