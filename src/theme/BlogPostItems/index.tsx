import React from "react";
import { BlogPostProvider } from "@docusaurus/plugin-content-blog/client";
import BlogPostItem from "@theme/BlogPostItem";
import type { Props } from "@theme/BlogPostItems";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import Navigation from "@site/src/components/Navigation/Navigation";
import tigrisConfig from "@site/tigris.config";
import styles from "./styles.module.css";

type BlogListItem = Props["items"][number];

function findItemBySlug(
  items: BlogListItem[],
  slug: string
): BlogListItem | undefined {
  return items.find(({ content }) => content.metadata.permalink.endsWith(slug));
}

export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem,
}: Props): JSX.Element {
  const location = useLocation();
  const normalizedPathname = location.pathname.replace(/\/+$/, "");
  const isHomePage =
    normalizedPathname === "/blog" ||
    normalizedPathname === "/" ||
    normalizedPathname === "";
  const isTagPage =
    normalizedPathname.startsWith("/blog/tags") ||
    normalizedPathname.startsWith("/tags");
  const isPaginatedBlogPage =
    normalizedPathname.startsWith("/blog/page") ||
    normalizedPathname.startsWith("/page/");
  const showCategoryNavigation = isHomePage || isTagPage || isPaginatedBlogPage;

  const featuredSlugs: string[] = tigrisConfig.featuredPosts ?? [];
  const featuredPosts = isHomePage
    ? featuredSlugs
        .map((slug) => findItemBySlug(items, slug))
        .filter((item): item is BlogListItem => item != null)
        .slice(0, 4)
    : [];

  const mainFeaturedPost = featuredPosts[0];
  const sideFeaturedPosts = featuredPosts.slice(1, 4);

  const featuredPermalinks = new Set(
    featuredPosts.map(({ content }) => content.metadata.permalink)
  );
  const regularGridItems =
    isHomePage && featuredPermalinks.size > 0
      ? items.filter(
          ({ content: BlogPostContent }) =>
            !featuredPermalinks.has(BlogPostContent.metadata.permalink)
        )
      : items;

  const renderPost = (
    { content: BlogPostContent }: BlogListItem,
    className?: string
  ) => (
    <BlogPostProvider
      key={BlogPostContent.metadata.permalink}
      content={BlogPostContent}
    >
      <BlogPostItemComponent className={className}>
        <BlogPostContent />
      </BlogPostItemComponent>
    </BlogPostProvider>
  );

  return (
    <>
      {isHomePage && mainFeaturedPost && (
        <section className={clsx("col col--12", styles.importantNewsSection)}>
          <h2 className={styles.importantNewsHeading}>Important News</h2>
          <div className={clsx("row", styles.importantNewsRow)}>
            <div
              className={clsx("col", styles.col, styles.importantMainColumn)}
            >
              {renderPost(
                mainFeaturedPost,
                `${styles.importantMainCard} important-main-card`
              )}
            </div>
            {sideFeaturedPosts.length > 0 && (
              <div
                className={clsx(
                  "col",
                  styles.col,
                  styles.importantNewsSideColumn
                )}
              >
                {sideFeaturedPosts.map((featuredPost) => (
                  <div
                    key={featuredPost.content.metadata.permalink}
                    className={clsx(styles.col, styles.importantSideItem)}
                  >
                    {renderPost(
                      featuredPost,
                      `${styles.importantSideCard} important-side-card`
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      {showCategoryNavigation && (
        <section className={clsx("col col--12", styles.tagsBelowTopSection)}>
          <Navigation location={location} showHeader={false} />
        </section>
      )}
      {regularGridItems.map(({ content: BlogPostContent }) => (
        <div key={BlogPostContent.metadata.permalink} className="col col--4">
          <div className={styles.col}>
            {renderPost({ content: BlogPostContent })}
          </div>
        </div>
      ))}
    </>
  );
}
