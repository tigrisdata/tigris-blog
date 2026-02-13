---
name: review-writing
description:
  Preflight review of blog posts before publication. Use when reviewing or doing
  a final check on a blog post (.mdx), or when asked to "review this post" or
  "preflight check".
---

# Review a blog post before publication

## Find the target post

1. If a file path argument is provided, use that.
2. Otherwise, find uncommitted/modified `blog/**/index.mdx` files via
   `git status`.
3. If multiple candidates exist, ask the user which one to review.

## Apply skills

Apply each of the following skills to the post, noting these overrides:

- `xe-writing-style` — Do NOT use Xe's character dialogues (Mara, Cadey, etc.);
  this blog engine doesn't support them.
- `writing-clearly-and-concisely` — Focus on substantive edits, not stylistic
  nits.
- `stop-slop` — Flag but don't rewrite entire paragraphs; suggest specific
  phrase replacements.
- `using-inline-cta` — Check that an `<InlineCta>` component exists; suggest one
  if missing.
- `seo-aeo-best-practices` — Focus on frontmatter and structure, not in-body
  keyword density.

Favor specific, opinionated writing with concrete examples over generic claims.

## Run the SEO reviewer

Run `npm run seo:check` against the target post and incorporate its output into
the findings. Refer to `README-seo-reviewer.md` for interpreting the output
categories.

## Priority order for conflicting advice

1. Author intent and technical accuracy (never change meaning)
2. `xe-writing-style` (voice and tone trump SEO polish)
3. `stop-slop` (remove AI patterns)
4. `writing-clearly-and-concisely` (tighten prose)
5. `seo-aeo-best-practices` (optimize metadata and structure)
6. `using-inline-cta` (add CTA if missing)

## Deduplication

Deduplicate findings across skills. If multiple skills flag the same span of
text, combine them into a single finding and note which skills flagged it.

## Output format (required)

Start the report with:

> Advisory only — verify suggestions against author intent. Ask in #gtm if
> unsure.

If the post has no high-severity issues and fewer than 3 medium issues, lead
with: "This post is ready for publication" before listing remaining nits.

1. **Executive summary**: 3-5 highest-impact issues.
2. **Findings** (ordered by severity, then location): For each issue:
   - **Severity**: high | medium | low
   - **Location**: `path:line`
   - **Issue**: what's wrong and why it matters
   - **Fix**: suggested replacement text (quote only the relevant phrase, not
     the full sentence)
   - **Skills**: which skill(s) flagged it
3. **Repo-policy checks**:
   - Frontmatter completeness
   - Description length
   - Tag rules (first tag category requirement)
   - Heading hierarchy
4. **Image optimization plan**:
   - List any PNG images referenced in the post
   - Propose `.webp` filenames
   - Run the appropriate commands for the user to convert the images
   - Replace references to the original images
   - Ask the user to delete the PNG images
     - Mention that CI will fail if they do not do this
