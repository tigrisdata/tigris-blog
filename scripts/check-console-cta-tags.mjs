#!/usr/bin/env node
// Fails if any JSX link into the Tigris console lacks a PostHog CTA name.
//
// Walks src/**/*.{js,jsx,ts,tsx,mdx}, finds <a>, <Link> and <NavLink>
// opening tags whose href/to references the console (tigrisConfig
// consoleUrl/signUpUrl/loginUrl/dashboardUrl, console.storage.dev or
// storage.new) and requires data-ph-capture-attribute-cta on each, so
// autocapture funnel breakdowns can rely on properties.cta.
//
// Usage: node scripts/check-console-cta-tags.mjs [--list]
//   --list  print every console link found with its cta name

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const EXTENSIONS = /\.(js|jsx|ts|tsx|mdx)$/;
const LIST = process.argv.includes("--list");

// One JSX expression, allowing one level of nested braces ({{ a: 1 }}).
const EXPR = String.raw`\{(?:[^{}]|\{[^{}]*\})*\}`;
const STR = String.raw`"[^"]*"|'[^']*'`;
// An opening tag, possibly spanning lines. Attribute values are consumed
// whole so a ">" inside a string or expression doesn't end the tag.
const OPEN_TAG = new RegExp(
  String.raw`<(a|Link|NavLink)(?=[\s/>])((?:${STR}|${EXPR}|[^>"'{}])*)>`,
  "g"
);
const ATTR = (name) =>
  new RegExp(String.raw`(?:^|\s)${name}\s*=\s*(${STR}|${EXPR})`);
const HREF = ATTR("(?:href|to)");
const CTA = ATTR("data-ph-capture-attribute-cta");
const CONSOLE_REF =
  /tigrisConfig\.(?:consoleUrl|signUpUrl|loginUrl|dashboardUrl)\b|console\.storage\.dev|storage\.new/;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules") yield* walk(path);
    } else if (EXTENSIONS.test(entry.name)) {
      yield path;
    }
  }
}

const unwrap = (value) => value.replace(/^["'{]\s*|\s*["'}]$/g, "");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

const found = [];
for (const file of walk(SRC)) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(OPEN_TAG)) {
    const [, tag, attrs] = match;
    const href = attrs.match(HREF);
    if (!href || !CONSOLE_REF.test(href[1])) continue;
    const cta = attrs.match(CTA);
    found.push({
      where: `${relative(ROOT, file)}:${lineOf(text, match.index)}`,
      tag,
      href: unwrap(href[1]),
      cta: cta ? unwrap(cta[1]) : null,
    });
  }
}

if (LIST) {
  for (const link of found) {
    console.log(
      `${link.where}  <${link.tag}> ${link.href}  cta=${
        link.cta ?? "(missing)"
      }`
    );
  }
  console.log(`${found.length} console link(s) found`);
}

const missing = found.filter((link) => !link.cta);
if (missing.length) {
  console.error(
    `\n${missing.length} console link(s) missing data-ph-capture-attribute-cta:`
  );
  for (const link of missing) {
    console.error(`  ${link.where}  <${link.tag}> ${link.href}`);
  }
  console.error(
    '\nAdd data-ph-capture-attribute-cta="<kebab-name>" (e.g. blog-navbar-signup) to each.'
  );
  process.exit(1);
}

if (!LIST) {
  console.log(`check:cta ok (${found.length} console link(s) tagged)`);
}
