import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import TagsListInline from "@theme/TagsListInline";
import BlogPostItemHeaderInfo from "../Header/Info";

export default function BlogPostItemFooter(): ReactNode {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { tags, editUrl, hasTruncateMarker } = metadata;

  // A post is truncated if it's in the "list view" and it has a truncate marker
  const truncatedPost = !isBlogPostPage && hasTruncateMarker;

  const tagsExists = tags.length > 0;

  const renderFooter = tagsExists || truncatedPost || editUrl;

  if (!renderFooter) {
    return null;
  }

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
      </footer>
    );
  } else {
    return <BlogPostItemHeaderInfo />;
  }
}
