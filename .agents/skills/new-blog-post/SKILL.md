---
name: new-blog-post
description:
  Create a new blog post from a template. Use when the user wants to start a new
  blog post, scaffold a post, or says "new post" or "create a post".
---

# Create a New Blog Post

## Inputs

This skill expects two arguments:

1. **slug** — the URL-friendly identifier for the post (e.g. `llms-txt`)
2. **publication date** — the date in `YYYY-MM-DD` format

If either is missing, ask the user to provide it.

## Date validation

- If the publication date is in 2025, stop and ask the user if they meant the
  current year instead.
- If the date format is ambiguous (e.g. `01/02/2026`), ask the user to rewrite
  it in `YYYY-MM-DD` format.

## Step 1: Create the post directory

Create the directory under `blog/` with the naming convention
`{publication-date}-{slug}`:

```bash
mkdir blog/{publication-date}-{slug}
```

Example: slug `llms-txt` with date `2025-01-23` produces `blog/2025-01-23-llms-txt/`.

## Step 2: Hydrate the post template

Create `blog/{publication-date}-{slug}/index.mdx` with this content:

```mdx
---
slug: {slug}
title: "TODO: replace me"
description: |
  TODO: replace me
image: ./hero-image.webp
keywords:
  -
authors:
  -
tags:
  -
---

import InlineCta from "@site/src/components/InlineCta";
import heroImage from "./hero-image.webp";

<img
  src={heroImage}
  className="hero-image"
  alt="TODO: describe the image here"
/>
```

Replace `{slug}` with the actual slug value.

## Step 3: Confirm and instruct

After creating the file, tell the user:

> Please fill out the title, description, keywords, authors, and tags based on
> the article draft in Google Docs.
