import React, { useLayoutEffect, useRef, useState } from "react";
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
  const isHomePage = normalizedPathname === "/blog";
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
  const sideTopImportantNewsPosts = sideImportantNewsPosts.slice(0, 2);
  const sideBottomImportantNewsPost = sideImportantNewsPosts[2];
  const mainImportantNewsRef = useRef<HTMLDivElement>(null);
  const [importantAlignment, setImportantAlignment] = useState({
    imageTop: 0,
    titleTop: 0,
  });
  const hasImportantAlignment =
    importantAlignment.titleTop > importantAlignment.imageTop;

  useLayoutEffect(() => {
    if (!isHomePage || !mainImportantNewsPost || sideImportantNewsPosts.length === 0) {
      return;
    }

    const updateAlignment = () => {
      const mainCardElement = mainImportantNewsRef.current;

      if (!mainCardElement) {
        return;
      }

      const imageElement = mainCardElement.querySelector(
        ".blog-card-image-link"
      ) as HTMLElement | null;
      const titleElement = mainCardElement.querySelector(
        ".blog-card-title-link"
      ) as HTMLElement | null;

      if (!imageElement || !titleElement) {
        return;
      }

      const mainCardRect = mainCardElement.getBoundingClientRect();
      const imageTop = imageElement.getBoundingClientRect().top - mainCardRect.top;
      const titleTop = titleElement.getBoundingClientRect().top - mainCardRect.top;

      if (titleTop > imageTop) {
        setImportantAlignment((previousAlignment) => {
          if (
            Math.abs(previousAlignment.imageTop - imageTop) < 1 &&
            Math.abs(previousAlignment.titleTop - titleTop) < 1
          ) {
            return previousAlignment;
          }

          return { imageTop, titleTop };
        });
      }
    };

    updateAlignment();
    window.addEventListener("resize", updateAlignment);

    return () => {
      window.removeEventListener("resize", updateAlignment);
    };
  }, [isHomePage, mainImportantNewsPost, sideImportantNewsPosts.length]);

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
            <div className={clsx("col col--6", styles.col)} ref={mainImportantNewsRef}>
              {renderPost(mainImportantNewsPost, styles.importantMainCard)}
            </div>
            {sideImportantNewsPosts.length > 0 && (
              <div
                className={clsx("col col--6", styles.importantNewsSideColumn, {
                  [styles.importantNewsSideColumnAligned]: hasImportantAlignment,
                })}
                style={
                  hasImportantAlignment
                    ? ({
                        "--important-image-top": `${importantAlignment.imageTop}px`,
                        "--important-title-top": `${importantAlignment.titleTop}px`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <div
                  className={clsx(styles.importantSideTopGroup, {
                    [styles.importantSideTopGroupAligned]: hasImportantAlignment,
                  })}
                >
                  {sideTopImportantNewsPosts.map((importantNewsPost) => (
                    <div
                      key={importantNewsPost.content.metadata.permalink}
                      className={clsx(styles.col, styles.importantSideTopItem)}
                    >
                      {renderPost(
                        importantNewsPost,
                        `${styles.importantSideCard} important-side-card`
                      )}
                    </div>
                  ))}
                </div>
                {sideBottomImportantNewsPost && (
                  <div className={clsx(styles.col, styles.importantSideBottomItem)}>
                    {renderPost(
                      sideBottomImportantNewsPost,
                      `${styles.importantSideCard} important-side-card`
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      {isHomePage && (
        <section className={clsx("col col--12", styles.tagsBelowTopSection)}>
          <Navigation location={location} showHeader={false} />
        </section>
      )}
      {items.map(({ content: BlogPostContent }) => (
        <div key={BlogPostContent.metadata.permalink} className="col col--4">
          <div className={styles.col}>{renderPost({ content: BlogPostContent })}</div>
        </div>
      ))}
    </>
  );
}
