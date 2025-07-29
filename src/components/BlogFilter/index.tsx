import React, { useEffect, useState } from "react";
import { BlogPostProvider } from "@docusaurus/theme-common/internal";
import BlogPostItem from "@theme/BlogPostItem";
import type { Props } from "@theme/BlogPostItems";
import clsx from "clsx";

export default function BlogFilter({ items }: Props): JSX.Element {
  const [filteredItems, setFilteredItems] = useState(items);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      const filter = event.detail.filter;
      setActiveFilter(filter);

      if (filter === "all") {
        setFilteredItems(items);
      } else {
        const filtered = items.filter(({ content }) => {
          const tags = content.metadata.tags.map((tag: any) => tag.label);
          return tags.includes(filter);
        });
        setFilteredItems(filtered);
      }
    };

    window.addEventListener("blogFilter", handleFilterChange as EventListener);

    return () => {
      window.removeEventListener(
        "blogFilter",
        handleFilterChange as EventListener
      );
    };
  }, [items]);

  if (filteredItems.length === 0) {
    return (
      <div className="col col--12 text--center padding-vert--lg">
        <h3>No posts found for this category</h3>
        <p>
          Try selecting a different category or check back later for new posts.
        </p>
      </div>
    );
  }

  return (
    <>
      {filteredItems.map(({ content: BlogPostContent }, i) => (
        <BlogPostProvider
          key={BlogPostContent.metadata.permalink}
          content={BlogPostContent}
        >
          <div
            className={clsx("col col--4", {
              "col--6": i < 3,
              "col--12": i === 0,
            })}
          >
            <BlogPostItem>
              <BlogPostContent />
            </BlogPostItem>
          </div>
        </BlogPostProvider>
      ))}
    </>
  );
}
