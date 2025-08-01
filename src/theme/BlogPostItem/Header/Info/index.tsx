import React, { type ReactNode } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { usePluralForm } from "@docusaurus/theme-common";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/BlogPostItem/Header/Info";

import styles from "./styles.module.css";

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

function ReadingTime({ readingTime }: { readingTime: number }) {
  const readingTimePlural = useReadingTimePlural();
  return <>{readingTimePlural(readingTime)}</>;
}

export default function BlogPostItemHeaderInfo({
  className,
}: Props): ReactNode {
  const { metadata } = useBlogPost();
  const { readingTime } = metadata;

  return (
    <div className={clsx(styles.container, "margin-vert--md", className)}>
      {typeof readingTime !== "undefined" && (
        <>
          <ReadingTime readingTime={readingTime} />
        </>
      )}
    </div>
  );
}
