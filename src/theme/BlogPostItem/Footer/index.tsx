import React, { type ReactNode } from "react";
import clsx from "clsx";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import TagsListInline from "@theme/TagsListInline";
import ReadMoreLink from "@theme/BlogPostItem/Footer/ReadMoreLink";

export default function BlogPostItemFooter(): ReactNode {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { tags, title, editUrl, hasTruncateMarker } = metadata;

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
  }
  // BlogPost footer - list view
  else {
    return (
      <footer className="row margin-top--sm">
        {truncatedPost && (
          <div className={clsx("col col--12")}>
            <ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
          </div>
        )}
        {tagsExists && (
          <div
            className={clsx("col margin-top--sm", { "col--12": truncatedPost })}
          >
            <TagsListInline tags={tags} />
          </div>
        )}
      </footer>
    );
  }
}
