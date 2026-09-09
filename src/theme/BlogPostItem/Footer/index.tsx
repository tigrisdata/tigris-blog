import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import TagsListInline from "@theme/TagsListInline";
import BlogPostItemHeaderInfo from "../Header/Info";
import ShareArticle from "@site/src/components/ShareArticle";

export default function BlogPostItemFooter(): ReactNode {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { tags } = metadata;

  const tagsExists = tags.length > 0;

  // BlogPost footer - details view
  if (isBlogPostPage) {
    return (
      <footer className="docusaurus-mt-lg">
        {tagsExists && (
          <div className={clsx("row", "margin-top--sm")}>
            <div className="col">
              <TagsListInline tags={tags} />
            </div>
          </div>
        )}
        <ShareArticle />
      </footer>
    );
  }

  // List view
  return <BlogPostItemHeaderInfo />;
}
