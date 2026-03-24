import React from "react";
import { BlogPostProvider } from "@docusaurus/plugin-content-blog/client";
import BlogPostItem from "@theme/BlogPostItem";
import type { Props } from "@theme/BlogPostItems";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import Navigation from "@site/src/components/Navigation/Navigation";
import styles from "./styles.module.css";

type BlogListItem = Props["items"][number];

function getImportantOrder(item: BlogListItem): number {
  const frontMatter = item.content.frontMatter as Record<string, unknown>;
  const order = frontMatter?.important_order;
  const normalizedOrder =
    typeof order === "number"
      ? order
      : typeof order === "string"
        ? Number.parseInt(order, 10)
        : Number.NaN;

  return Number.isNaN(normalizedOrder) ? Number.MAX_SAFE_INTEGER : normalizedOrder;
}

function isImportantNews(item: BlogListItem): boolean {
  const frontMatter = item.content.frontMatter as Record<string, unknown>;

  if (!frontMatter) {
    return false;
  }

  return (
    frontMatter.important === true ||
    frontMatter.important_news === true ||
    frontMatter.pinned === true ||
    frontMatter.pinned_news === true ||
    frontMatter.important_main === true ||
    frontMatter.pinned_main === true ||
    typeof frontMatter.important_order === "number" ||
    typeof frontMatter.important_order === "string"
  );
}

function isMainImportantNews(item: BlogListItem): boolean {
  const frontMatter = item.content.frontMatter as Record<string, unknown>;
  return frontMatter?.important_main === true || frontMatter?.pinned_main === true;
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
  const importantNewsPosts = isHomePage
    ? [...items]
        .filter(isImportantNews)
        .sort((a, b) => getImportantOrder(a) - getImportantOrder(b))
        .slice(0, 4)
    : [];

  const mainImportantNewsPost =
    importantNewsPosts.find(isMainImportantNews) ?? importantNewsPosts[0];

  const sideImportantNewsPosts = mainImportantNewsPost
    ? importantNewsPosts
        .filter(
          ({ content: BlogPostContent }) =>
            BlogPostContent.metadata.permalink !==
            mainImportantNewsPost.content.metadata.permalink
        )
        .slice(0, 3)
    : [];

  const importantNewsPermalinks = new Set(
    importantNewsPosts.map(
      ({ content: BlogPostContent }) => BlogPostContent.metadata.permalink
    )
  );
  const regularGridItems =
    isHomePage && importantNewsPermalinks.size > 0
      ? items.filter(
          ({ content: BlogPostContent }) =>
            !importantNewsPermalinks.has(BlogPostContent.metadata.permalink)
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
      {isHomePage && mainImportantNewsPost && (
        <section className={clsx("col col--12", styles.importantNewsSection)}>
          <h2 className={styles.importantNewsHeading}>Important News</h2>
          <div className={clsx("row", styles.importantNewsRow)}>
            <div className={clsx("col col--6", styles.col, styles.importantMainColumn)}>
              {renderPost(
                mainImportantNewsPost,
                `${styles.importantMainCard} important-main-card`
              )}
            </div>
            {sideImportantNewsPosts.length > 0 && (
              <div className={clsx("col col--6", styles.col, styles.importantNewsSideColumn)}>
                {sideImportantNewsPosts.map((importantNewsPost) => (
                  <div
                    key={importantNewsPost.content.metadata.permalink}
                    className={clsx(styles.col, styles.importantSideItem)}
                  >
                    {renderPost(
                      importantNewsPost,
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
          <div className={styles.col}>{renderPost({ content: BlogPostContent })}</div>
        </div>
      ))}
    </>
  );
}
