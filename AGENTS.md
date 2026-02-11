# AGENTS.md

This file provides guidance to AI agents when working with code in this
repository.

## Project Overview

This is the Tigris Data blog built with Docusaurus 3. It's a static site
generator that hosts blog content about Tigris's globally distributed,
multi-cloud object storage service. The blog serves as a technical resource for
developers and includes content about storage, cloud infrastructure, AI/ML, and
developer tools.

## Development Commands

### Essential Commands

- `npm install` - Install dependencies
- `npm run start` - Start local development server
- `npm run dev` - Start dev server on all interfaces (0.0.0.0)
- `npm run build` - Build the static site for production
- `npm run serve` - Serve the built site locally

### Content Creation

- `npm run blog:new --slug={your-slug}` - Create a new blog post scaffold This
  creates a directory `{date}-{slug}/` with an `index.mdx` file ready for
  content

### Code Quality

- `npm run test` - Run full test suite (format check + lint + build)
- `npm run test:format` - Check code formatting with Prettier
- `npm run format` - Auto-format code with Prettier
- `npm run lint` - Run ESLint

### SEO Tools

- `npm run seo:check` - Analyze current blog post for SEO optimization
- `npm run seo:check:all` - Analyze all blog posts
- `npm run seo:apply` - Apply SEO suggestions to current post
- `npm run seo:apply:all` - Apply SEO suggestions to all posts

## Architecture

### Directory Structure

- `blog/` - Blog posts organized by date-slug directories containing `index.mdx`
- `src/` - Custom React components and theme overrides
  - `components/` - Reusable UI components (NewsletterSubscribe, TerminalWindow,
    etc.)
  - `theme/` - Docusaurus theme customizations (BlogLayout, BlogPostItem, etc.)
  - `css/` - Custom styling
- `static/` - Static assets (images, fonts, tiles for blog posts)
- `templates/` - Blog post templates (used by `blog:new` command)

### Key Configuration Files

- `docusaurus.config.js` - Main Docusaurus configuration with navbar, footer,
  and plugin setup
- `tigris.config.js` - External configuration for Tigris-specific settings
- `.env.local` - Environment variables (copy from `.env.local.example`)

### Content Structure

Each blog post is in `blog/{date}-{slug}/index.mdx` with frontmatter containing:

- `title` - Blog post title
- `description` - Meta description (150-160 chars recommended)
- `authors` - Array of author objects with name, title, and URL
- `tags` - Array of tags for categorization
- `image` - Path to featured image
- `canonical` - Canonical URL if applicable

### Custom Components

- `<NewsletterSubscribe>` - Email newsletter signup component
- `<TerminalWindow>` - Code terminal display component
- `<PullQuote>` - Styled quote component for highlighting text
- `<Carousel>` - Image carousel for multiple visuals
- `<Timeline>` - Event timeline visualization
- `<BreakoutQuote>` - Large styled quote for emphasis

## Content Guidelines

### SEO Requirements

- All posts should have a meta description between 150-160 characters
- Images must have alt text (use captions when available)
- Posts should be 500+ words minimum
- Use proper heading hierarchy (H1-H6)
- Include 3-5 relevant tags

### Tag Categories

**IMPORTANT:** Every blog post MUST have one of the following category tags as
the FIRST tag in the tags list. This is enforced by CI:

- "Engineering" - Technical implementation posts
- "Build with Tigris" - Tutorial/how-to content
- "Customers" - Case studies and success stories
- "Updates" - Product announcements and releases

Run `npm run check:tags` to validate category tags locally before committing.

### Tigris Terminology

- Use "object storage" instead of "file storage"
- Emphasize "multi-cloud" and "globally distributed"
- Use "S3-compatible" instead of "S3-like"
- Highlight "low-latency" as a key value prop
- Refer to "Tigris" with consistent capitalization

## Development Notes

### Commit Message Convention

Follow conventional commit format:

- Use lowercase for commit body text
- Examples: `fix: correct header title`, `docs: add new guide`,
  `feat: implement feature`

### Attribution Requirements

AI agents must disclose what tool and model they are using in the "Assisted-by"
commit footer with a structure like this:

```text
Assisted-by: [Model Name] via [Tool Name]
```

Example:

```text
Assisted-by: GLM 4.6 via Claude Code
```

```text
Assisted-by: GPT-5-Codex via OpenAI Codex
```

If you don't know which model you are using, make a best guess and at least note
which agent you are using:

```text
Assisted-by: Cursor
```

### Environment Setup

1. Copy `.env.local.example` to `.env.local` and configure
2. For newsletter testing locally, you may need a CORS proxy
3. Set `NEXT_NEWSLETTER_API_BASE_URL` in `.env.local` for local newsletter
   testing

### Pre-commit Hooks

The project uses pre-commit for code quality. Set up with:

```bash
brew install pre-commit
pre-commit install
```

### Build Process

- Standard build: `npm run build`
- Vercel deployment: `npm run vercel-build` (includes special 404 handling)
- Build output goes to `build/` directory

### SEO Reviewer Tool

The `seo-reviewer.mjs` script provides comprehensive SEO analysis:

- Analyzes frontmatter, content structure, and image optimization
- Suggests improvements for LLM optimization
- Checks Tigris terminology consistency
- Can auto-apply suggested fixes with `--apply` flag

## Relevant skills

When reviewing content please use the following skills:

- `convert-images-to-webp`: convert any png files to webp, discarding the
  original png file
- `using-inline-cta`: properly using the InlineCta component to prompt users to
  take next steps
- `xe-writing-style`: use Xe's writing style guide to ensure that writing is
  real, human, and has that je ne sais quoi de vivre of something made to lift
  up human efforts
