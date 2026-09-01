import React, { useMemo, useState } from "react";
import {
  BlogPostProvider,
  useBlogPost,
} from "@docusaurus/plugin-content-blog/client";
import BlogPostItem from "@theme/BlogPostItem";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/BlogPostItems";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import tigrisConfig from "@site/tigris.config";
import styles from "./styles.module.css";

type BlogListItem = Props["items"][number];

const CATEGORIES: { label: string; tag: string | null }[] = [
  { label: "All", tag: null },
  { label: "Engineering", tag: "engineering" },
  { label: "Build with Tigris", tag: "build-with-tigris" },
  { label: "Customers", tag: "customers" },
  { label: "Updates", tag: "updates" },
];

const SORTS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "longest", label: "Longest read" },
];

function findItemBySlug(
  items: BlogListItem[],
  slug: string
): BlogListItem | undefined {
  return items.find(({ content }) => content.metadata.permalink.endsWith(slug));
}

function matchesCategory(item: BlogListItem, tag: string | null): boolean {
  if (!tag) return true;
  return (item.content.metadata.tags ?? []).some((t) =>
    t.permalink.replace(/\/+$/, "").endsWith(`/${tag}`)
  );
}

function matchesQuery(item: BlogListItem, q: string): boolean {
  if (!q) return true;
  const { title, description } = item.content.metadata;
  return `${title} ${description ?? ""}`.toLowerCase().includes(q);
}

function sortItems(items: BlogListItem[], sort: string): BlogListItem[] {
  const arr = [...items];
  const time = (i: BlogListItem) => new Date(i.content.metadata.date).getTime();
  const read = (i: BlogListItem) => i.content.metadata.readingTime ?? 0;
  if (sort === "oldest") arr.sort((a, b) => time(a) - time(b));
  else if (sort === "longest") arr.sort((a, b) => read(b) - read(a));
  else arr.sort((a, b) => time(b) - time(a));
  return arr;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function FeaturedHeroInner() {
  const { metadata, assets, frontMatter } = useBlogPost();
  const image =
    assets.image ?? (frontMatter.image as string | undefined) ?? undefined;
  const category = metadata.tags?.[0];
  const authors = (metadata.authors ?? [])
    .map((a) => a.name?.trim())
    .filter((n): n is string => Boolean(n));
  const meta = [
    authors.join(", "),
    formatDate(metadata.date),
    typeof metadata.readingTime !== "undefined"
      ? `${Math.ceil(metadata.readingTime)} min read`
      : "",
  ].filter(Boolean);

  return (
    <Link to={metadata.permalink} className={styles.featuredCard}>
      {image && (
        <div className={styles.featuredImageWrap}>
          <img
            src={image}
            alt=""
            className={styles.featuredImage}
            loading="lazy"
            style={
              frontMatter.image_position
                ? { objectPosition: frontMatter.image_position as string }
                : undefined
            }
          />
        </div>
      )}
      <div className={styles.featuredBody}>
        {category && <span className={styles.eyebrow}>{category.label}</span>}
        <h2 className={styles.featuredTitle}>{metadata.title}</h2>
        {metadata.description && (
          <p className={styles.featuredDesc}>{metadata.description}</p>
        )}
        <div className={styles.featuredMeta}>{meta.join(" · ")}</div>
      </div>
    </Link>
  );
}

function FeaturedHero({ item }: { item: BlogListItem }) {
  return (
    <section className={styles.featuredSection}>
      <span className={styles.sectionLabel}>Featured</span>
      <BlogPostProvider content={item.content}>
        <FeaturedHeroInner />
      </BlogPostProvider>
    </section>
  );
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

  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const featuredSlugs: string[] = tigrisConfig.featuredPosts ?? [];
  const featuredItem = isHomePage
    ? featuredSlugs
        .map((slug) => findItemBySlug(items, slug))
        .find((item): item is BlogListItem => item != null) ?? null
    : null;

  const renderRow = ({ content: BlogPostContent }: BlogListItem) => (
    <BlogPostProvider
      key={BlogPostContent.metadata.permalink}
      content={BlogPostContent}
    >
      <BlogPostItemComponent className="blog-list-card">
        <BlogPostContent />
      </BlogPostItemComponent>
    </BlogPostProvider>
  );

  const q = query.trim().toLowerCase();
  const isDefaultView = category === null && q === "";

  const listItems = useMemo(() => {
    if (!isHomePage) return items;
    let arr = items.filter(
      (it) => matchesCategory(it, category) && matchesQuery(it, q)
    );
    if (isDefaultView && featuredItem) {
      const featuredPermalink = featuredItem.content.metadata.permalink;
      arr = arr.filter(
        (it) => it.content.metadata.permalink !== featuredPermalink
      );
    }
    return sortItems(arr, sort);
  }, [items, isHomePage, category, q, sort, isDefaultView, featuredItem]);

  if (!isHomePage) {
    return (
      <div className={clsx("col col--12", styles.homeCol)}>
        <div className={styles.postList}>
          {items.map((item) => renderRow(item))}
        </div>
      </div>
    );
  }

  return (
    <>
      {isDefaultView && featuredItem && (
        <div className={clsx("col col--12", styles.homeCol)}>
          <FeaturedHero item={featuredItem} />
        </div>
      )}
      <div className={clsx("col col--12", styles.homeCol)}>
        <div className={styles.controls}>
          <div
            className={styles.categories}
            role="group"
            aria-label="Filter posts by category"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                type="button"
                aria-pressed={category === c.tag}
                className={clsx(
                  styles.chip,
                  category === c.tag && styles.chipActive
                )}
                onClick={() => setCategory(c.tag)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <select
            className={styles.categorySelect}
            value={category ?? ""}
            onChange={(e) => setCategory(e.target.value || null)}
            aria-label="Category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.label} value={c.tag ?? ""}>
                {c.label}
              </option>
            ))}
          </select>
          <div className={styles.controlsRight}>
            <input
              className={styles.search}
              type="search"
              placeholder="Search posts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search posts"
            />
            <select
              className={styles.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort posts"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.postList}>
          {listItems.length > 0 ? (
            listItems.map((item) => renderRow(item))
          ) : (
            <p className={styles.empty}>No posts match your filters.</p>
          )}
        </div>
      </div>
    </>
  );
}
