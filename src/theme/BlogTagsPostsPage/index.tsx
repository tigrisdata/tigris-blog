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
import Link from "@docusaurus/Link";
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
  tag,
  items,
  sidebar,
  listMetadata,
}: Props): ReactNode {
  return (
    <BlogLayout sidebar={sidebar}>
      <div className="row col col--12">
        <header className="margin-bottom--sm">
          <Link to="/blog" className="">
            Blog
          </Link>
          {" / "}
          <h1>{tag.label}</h1>
        </header>
      </div>
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
