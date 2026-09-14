import React, { type ReactNode } from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import BlogPostItemHeaderInfo from "../Header/Info";
import ShareArticle from "@site/src/components/ShareArticle";

export default function BlogPostItemFooter(): ReactNode {
  const { isBlogPostPage } = useBlogPost();

  // BlogPost footer - details view. Tags now live in the header spec-sheet
  // meta strip, so the footer only carries the share row.
  if (isBlogPostPage) {
    return (
      <footer className="docusaurus-mt-lg">
        <ShareArticle />
      </footer>
    );
  }

  // List view
  return <BlogPostItemHeaderInfo />;
}
