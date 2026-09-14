import React, { type ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import { usePluralForm } from "@docusaurus/theme-common";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Link from "@docusaurus/Link";
import BlogAuthor from "@theme/Blog/Components/Author";

// Very simple pluralization: probably good enough for now
function useReadingTimePlural() {
  const { selectMessage } = usePluralForm();
  return (readingTimeFloat: number) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: "theme.blog.post.readingTime.plurals",
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "One min read|{readingTime} min read",
        },
        { readingTime }
      )
    );
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

/**
 * Spec-sheet meta strip: author / published / reading time / tags laid out as a
 * grid of labelled cells. The 1px grid gaps do the ruling and each cell paints
 * over them with the page-ground colour, so it reads like a hardware spec sheet.
 */
export default function BlogPostItemHeaderMeta(): ReactNode {
  const { metadata, assets } = useBlogPost();
  const { date, readingTime, authors, tags } = metadata;
  const readingTimePlural = useReadingTimePlural();

  const hasAuthors = authors.length > 0;
  const hasTags = tags.length > 0;

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
          <span className="label">Reading time</span>
          <span className="value">{readingTimePlural(readingTime)}</span>
        </div>
      )}

      {hasTags && (
        <div>
          <span className="label">Tags</span>
          <div className="blog-meta-tags">
            {tags.map((tag) => (
              <Link key={tag.permalink} to={tag.permalink}>
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
