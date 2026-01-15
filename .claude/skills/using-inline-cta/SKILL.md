---
name: using-inline-cta
description: Use when writing blog posts in .mdx format that need a call-to-action at the end. Use when adding InlineCTA (InlineCta) component to blog posts.
---

# Using InlineCta Component

## Overview

InlineCta is a React component for adding a call-to-action at the end of blog posts. It provides a visually distinct card with a title, subtitle, and button that links to documentation or getting-started pages.

## When to Use

- Add InlineCta at the very end of a blog post, after the conclusion
- Use it to drive readers to take action: start using Tigris, read documentation, or learn more

## Import Statement

```jsx
import InlineCta from "@site/src/components/InlineCta";
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Short, punchy headline (often a question or value proposition) |
| `subtitle` | `string \| JSX` | Yes | 1-2 sentence description connecting blog topic to Tigris value prop |
| `button` | `string` | Yes | Call-to-action button text |
| `link` | `string` | No | URL for button link (defaults to `tigrisConfig.getStartedUrl`) |

## Usage Pattern

Place InlineCta at the end of your blog post:

```jsx
<InlineCta
  title="Ready to fork your data like code?"
  subtitle="Get instant, isolated copies of your data for development, testing, or experimentation."
  button="Read the Bucket Forking Docs"
  link="https://www.tigrisdata.com/docs/buckets/snapshots-and-forks/"
/>
```

## Writing Guidelines

### Title

- Keep it short and punchy
- Questions work well: "Ready to...", "Want to...?"
- Value propositions: "Global storage for...", "Experience..."
- Avoid generic titles like "Get Started"

### Subtitle

- Connect the blog post's topic to Tigris value proposition
- 1-2 sentences maximum
- Can be a plain string or JSX (use JSX for formatting with `<p>` tags if needed)

### Button Text

Match button text to the link destination:
- Documentation links → "Read the docs", "Learn more"
- Getting started → "Get started", "Start building"
- Product pages → "Find out more", "See features"

### Link

- Omit `link` prop to use default (getStartedUrl)
- Provide specific URL for targeted destinations (docs, features, etc.)
- Use full URLs including protocol (https://)

## Common Mistakes

| Mist | Fix |
|------|-----|
| Placing CTA in middle of content | Always put at end, after conclusion |
| Generic title like "Get Started" | Use specific, compelling headline |
| Subtitle too long (3+ sentences) | Keep to 1-2 sentences |
| Missing `link` when sending to specific page | Always include `link` for non-default URLs |

## Examples

```jsx
// Question-style title
<InlineCta
  title="Ready to fork your data like code?"
  subtitle="Get instant, isolated copies of your data for development, testing, or experimentation."
  button="Read the Bucket Forking Docs"
  link="https://www.tigrisdata.com/docs/buckets/snapshots-and-forks/"
/>

// Value proposition title
<InlineCta
  title="Global storage for your files and feeds"
  subtitle="Fast, global, reliable: pick three. Tigris lets you store your datasets, models, streams, backups, and more close to where they're needed."
  button="Read the Docs"
/>

// JSX subtitle for formatting
<InlineCta
  title="Set and forget object storage"
  subtitle={
    <p>
      Configure your rules, then let Tigris handle the rest. Automatic lifecycle management keeps your storage costs predictable.
    </p>
  }
  button="Get started"
/>
```