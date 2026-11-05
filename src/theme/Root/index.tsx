import React, { type ReactNode } from "react";
import Head from "@docusaurus/Head";

// Puts `data-surface="marketing"` on <html> so the semantic colour tokens in
// src/css/custom.css (--surface-*, --line-*, --text-*) resolve to the Teal
// surface; the blog stays on Teal by brand decision. Set through <Head> so it
// is in the server-rendered HTML, not added after hydration.
export default function Root({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <html data-surface="marketing" />
      </Head>
      {children}
    </>
  );
}
