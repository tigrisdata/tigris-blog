import React, { type ReactNode } from "react";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderMeta from "@theme/BlogPostItem/Header/Meta";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Lede from "@site/src/components/Lede";

export default function BlogPostItemHeader(): ReactNode {
  const { isBlogPostPage, metadata } = useBlogPost();

  // On the single post page the byline becomes a spec-sheet meta strip
  // (author / published / reading time / tags), with a lede between the title
  // and the strip. The lede is the post description, unless the author filled
  // in a `lede` frontmatter field in the .mdx. The list view keeps the flat
  // info line + author row.
  if (isBlogPostPage) {
    const ledeText =
      (metadata.frontMatter.lede as string | undefined) ?? metadata.description;
    return (
      <header className="blog-post-header">
        <BlogPostItemHeaderTitle />
        <Lede text={ledeText} />
        <BlogPostItemHeaderMeta />
      </header>
    );
  }

  return (
    <header>
      <BlogPostItemHeaderTitle />
    </header>
  );
}
