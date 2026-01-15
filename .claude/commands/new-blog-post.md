---
description: Create a new blog post from a template.
---

# New blog post command

Help me create a new blog post by making a new folder under `blog`:

The slug is: $1  
The publication date is: $2

If the publication date is in 2025, please throw an error and ask if the user
meant 2025 instead of the current year.

## Making a folder

```bash
mkdir blog/(publication date)-$1
```

The blogpost publication date should be formatted as YYYY-MM-DD. If you are not
sure which format the user supplied publication date is in, ask them to rewrite
it in YYYY-MM-DD format.

For example:

```text
llms-txt 2025-01-23
```

Should result in you creating the following folder:

```text
blog/2025-01-23-llms-txt
```

## Hydrating the post template

Create an `index.mdx` file based on this template:

```mdx
---
slug: $1
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

Once you are done tell the user the following:

> Please fill out the title, description, keywords, authors, and tags based on
> the article draft in Google Docs.
