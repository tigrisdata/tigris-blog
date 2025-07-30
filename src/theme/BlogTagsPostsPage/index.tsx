import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import type { Props } from "@theme/BlogTagsPostsPage";
import BlogPostItems from "@theme/BlogPostItems";
import { translate } from "@docusaurus/Translate";

function useBlogTagsPostsPageTitle(tag: Props["tag"]) {
  return translate(
    {
      id: "theme.blog.tagTitle",
      description: "The title of the page for a blog tag",
      message: 'Posts tagged "{tagName}"',
    },
    { tagName: tag?.label }
  );
}

function BlogTagsPostsPageMetadata({ tag }: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);
  return (
    <>
      <PageMetadata title={title} description={title} />
      <SearchMetadata tag="blog_tags_posts" />
    </>
  );
}

function BlogTagsPostsPageContent({
  items,
  sidebar,
  listMetadata,
}: Props): ReactNode {
  return (
    <BlogLayout sidebar={sidebar}>
      <BlogPostItems items={items} />
      <BlogListPaginator metadata={listMetadata} />
    </BlogLayout>
  );
}
export default function BlogTagsPostsPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagPostListPage
      )}
    >
      <BlogTagsPostsPageMetadata {...props} />
      <BlogTagsPostsPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
