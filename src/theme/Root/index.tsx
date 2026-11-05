import React, { type ReactNode } from "react";
import Head from "@docusaurus/Head";

// Puts `data-surface="blog"` on <html> so the semantic colour tokens in
// src/css/custom.css (--surface-*, --line-*, --text-*) resolve to the Grey
// blog surface. Set through <Head> so it is in the server-rendered HTML, not
// added after hydration.
export default function Root({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <html data-surface="blog" />
      </Head>
      {children}
    </>
  );
}
