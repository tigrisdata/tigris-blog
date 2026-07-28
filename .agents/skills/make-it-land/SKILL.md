---
name: make-it-land
description:
  Use when drafting or revising a blog post so it lands with readers — the
  opener could front any post, claims lean on "much faster" instead of
  numbers, tradeoffs are deferred to "a future post", multiple authors
  flattened the voice into a corporate "we", or sections end on recaps.
  Also use when asked "why did that post do better" or "make this land."
metadata:
  trigger: Drafting or revising a post for impact; diagnosing why one post
    outperformed another
---

# Make It Land

This skill complements `hold-the-reader` (engagement audit) and
`xe-writing-style` (voice): it is the short list of what actually
separated the strongest post, usable at drafting time.

## The six moves

### 1. Open on the real question

First line after the hero image is the question or pain — no greeting, no
"in this post we'll cover", no product-brochure line.

- Bad: "At Tigris, we make object storage that scales to as many files you
  need…" / "Imagine a world where…"
- Good: "What happens if I just point a git server at an object storage
  bucket?"

**Test:** could the first paragraph appear unchanged on any other post
about anything? If yes, rewrite. The fix is usually free — the real hook
is already sitting in paragraph 2–4; promote it.

### 2. Put a real number at the point of failure

Numbers persuade when they quantify the disaster, not the effort spent
building. "Two rate-limit windows of work" is a diary entry; this is
evidence:

> "Cloning a simple repo with 318 objects and a 200KiB packfile made over
> 8,500 `GetObject` calls before I killed it."

**Test:** every "many", "significant", "often", "super powerful" either
becomes a real number or named system, or gets cut. The reader remembers
"8,500 GetObject calls" and forgets "many API calls."

### 3. Deliver the payoff on the page

The question in line one gets a measured answer, working artifact, or
before/after fix in the body. Never defer the interesting part ("we may
cover the tradeoffs in a future post") — the tradeoffs ARE the post. If
the payoff genuinely isn't ready, say so plainly in the body and reframe
the post around the payoff it does deliver.

### 4. One narrator owns the arc

Pick a single first-person voice for the narrative beats; "we" lives only
in genuinely collective engineering statements. Three bylines smoothed
into one narrator kills the "I had a terrible idea" beat, and a corporate
close stapled onto a personal middle reads as the seam where the person
stops and the product team starts. Keep the register from frontmatter to
CTA — no customer-logo dump, no "You could be next!". Headings should
sequence into the plot when read as a list ("Oh no, it works" → "Death by
a thousand stat() calls"), not read as a table of contents ("The problem /
What we built / Results").

Don't reskin posts into cursed-project experiments that aren't; the arc is
a template, not a mandate.

### 5. Confess something

One embarrassing, self-inflicted failure buys more credibility than any
disclaimer:

> "the listing cache already had an optimization for this… It was
> completely dead in production."

Every post has one — the thing that broke, the assumption that was wrong,
the version that got thrown away. Place it where the post's claims are
least plausible. One embarrassing sentence beats three paragraphs of
hedged caveats.

### 6. End every section one insight richer

Each section closes by converting its specific disaster into a portable
generalization the reader didn't have before:

> "Serving Git repositories is an accidental filesystem latency benchmark."

Never recap. Delete "In conclusion" and "Key takeaways" on sight; end on
the sentence that makes the specifics portable. Then ration the device:
one or two aphorisms land, three or four across a post become a tell.

## Free AEO scaffolding (costs no voice)

Nobody trades "clown jail" for a snippet — scaffold under the voice, not
instead of it:

- Title 50–60 chars with the keyword; meta description ≤160 chars with a
  CTA
- Question-shaped H3s under the voicey H2s; an FAQ block
- A comparison table wherever the post already implies one
- `dateModified` in frontmatter

## Quick checklist

- [ ] First paragraph fails the "any other post" test? Rewrite it.
- [ ] At least one real number at the moment things break
- [ ] Payoff (or its honest absence) is on the page, not deferred
- [ ] One narrator; "we" only where genuinely collective; no marketing
      close
- [ ] Headings tell the story when read as a list
- [ ] One confessed failure, placed at the least-plausible claim
- [ ] No section ends on a recap; closer adds a generalization or next
      step
- [ ] Aphorism count ≤ 2

Author intent and technical accuracy always win. Advisory only.
