import React, { useState, type ReactNode } from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Link from "@docusaurus/Link";
import BlogAuthor from "@theme/Blog/Components/Author";

// Desktop shows at most this many tags; the rest hide behind an expander.
const MAX_VISIBLE_TAGS = 3;

function formatDate(date: string): string {
  // ISO date keeps the spec-sheet look (mono, terse).
  return new Date(date).toISOString().slice(0, 10);
}

function BlogPostItemHeaderTags(): ReactNode {
  const { metadata } = useBlogPost();
  const { tags } = metadata;
  const [expanded, setExpanded] = useState(false);

  if (tags.length === 0) {
    return null;
  }

  const hasOverflow = tags.length > MAX_VISIBLE_TAGS;
  const visibleTags =
    expanded || !hasOverflow ? tags : tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = tags.length - MAX_VISIBLE_TAGS;

  return (
    <div>
      <span className="label">Tags</span>
      <div className="blog-meta-tags">
        {visibleTags.map((tag) => (
          <Link key={tag.permalink} to={tag.permalink}>
            {tag.label}
          </Link>
        ))}
        {hasOverflow && (
          <button
            type="button"
            className="blog-meta-tags-toggle"
            aria-expanded={expanded}
            aria-label={
              expanded
                ? "Show fewer tags"
                : `Show ${hiddenCount} more ${
                    hiddenCount === 1 ? "tag" : "tags"
                  }`
            }
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Less" : `+${hiddenCount}`}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Spec-sheet meta strip: author / published / reading / tags laid out as a row
 * of labelled cells between two hairlines. Collapses to a single stacked column
 * on mobile.
 */
export default function BlogPostItemHeaderMeta(): ReactNode {
  const { metadata, assets } = useBlogPost();
  const { date, readingTime, authors } = metadata;

  const hasAuthors = authors.length > 0;

  return (
    <div className="blog-meta-strip">
      {hasAuthors && (
        <div>
          <span className="label">
            {authors.length > 1 ? "Authors" : "Author"}
          </span>
          <div className="blog-meta-authors">
            {authors.map((author, idx) => (
              <BlogAuthor
                key={idx}
                author={{
                  ...author,
                  // Handle author images using relative paths
                  imageURL: assets.authorsImageUrls[idx] ?? author.imageURL,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="label">Published</span>
        <time dateTime={date}>{formatDate(date)}</time>
      </div>

      {typeof readingTime !== "undefined" && (
        <div>
          <span className="label">Reading</span>
          <span className="value">{Math.ceil(readingTime)} min</span>
        </div>
      )}

      <BlogPostItemHeaderTags />
    </div>
  );
}
