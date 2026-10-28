import React from "react";
import MDXComponents from "@theme-original/MDXComponents";

// Markdown links in posts (`[create a bucket](https://storage.new)`) can't
// carry attributes, so tag every console-bound one here. This gives PostHog
// autocapture a stable `cta` property for in-post CTAs, alongside the
// navbar and InlineCta names. A link that already sets its own cta wins.
const CONSOLE_LINK =
  /^https?:\/\/(console\.storage\.dev|storage\.new)(?=[/?#]|$)/;
const CTA_ATTR = "data-ph-capture-attribute-cta";

const OriginalA = MDXComponents.a;

function ConsoleAwareLink(props: React.ComponentProps<"a">) {
  const { href } = props;
  if (href && CONSOLE_LINK.test(href) && !(CTA_ATTR in props)) {
    return <OriginalA {...{ [CTA_ATTR]: "blog-post-body-link" }} {...props} />;
  }
  return <OriginalA {...props} />;
}

export default {
  ...MDXComponents,
  a: ConsoleAwareLink,
};
