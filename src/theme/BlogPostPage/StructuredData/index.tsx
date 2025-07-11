import React, { type ReactNode } from "react";
import Head from "@docusaurus/Head";
import { useBlogPost } from "@docusaurus/theme-common/internal";

function useBlogPostStructuredData() {
  const { metadata } = useBlogPost();

  return React.useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: metadata.title,
      datePublished: metadata.date,
      author: metadata.authors?.[0]?.name || "Tigris Data",
      description: metadata.description,
      url: metadata.permalink,
    }),
    [metadata]
  );
}

export default function BlogPostStructuredData(): ReactNode {
  const structuredData = useBlogPostStructuredData();
  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
