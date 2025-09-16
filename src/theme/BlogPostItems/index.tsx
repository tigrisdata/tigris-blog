import React from "react";
import { BlogPostProvider } from "@docusaurus/plugin-content-blog/client";
import BlogPostItem from "@theme/BlogPostItem";
import type { Props } from "@theme/BlogPostItems";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";

export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem,
}: Props): JSX.Element {
  const location = useLocation();
  const isHomePage = location.pathname.endsWith("/blog/");
  return (
    <>
      {items.map(({ content: BlogPostContent }, i) => (
        <BlogPostProvider
          key={BlogPostContent.metadata.permalink}
          content={BlogPostContent}
        >
          <div
            className={clsx("col col--4", {
              "col--4": i < 2 && isHomePage,
            })}
          >
            <BlogPostItemComponent>
              <BlogPostContent />
            </BlogPostItemComponent>
          </div>
        </BlogPostProvider>
      ))}
    </>
  );
}
