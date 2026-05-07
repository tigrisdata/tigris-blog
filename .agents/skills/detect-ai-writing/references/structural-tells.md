# Structural tells

Sentence-level and paragraph-level formulaic patterns that LLMs default to
even when content doesn't demand them. Detection-focused — for rewriting
recipes, see `stop-slop/references/structures.md`.

## High severity

### The three-item list reflex

LLMs reach for three even when content has 2 items or 4. Watch for:

- "X, Y, and Z" where the third item is filler ("comprehensive,
  scalable, and robust")
- "There are three reasons:" when the post lists 2 substantive ones and
  pads to 3
- Bulleted sets of 3 throughout, with no 2s or 4s anywhere

Detection rule: count bulleted-list lengths in a post. If 80%+ of lists
are exactly 3 items, that's a tell.

### "X is not just Y, it's Z" / "Not just X, but Y"

Almost a unique LLM fingerprint. Examples:

- "This is not just an upgrade, it's a complete reinvention."
- "Storage is not just where data lives, it's where security begins."
- "AI agents are not just tools, but collaborators."

### Restating the question before answering

A specifically AI-shaped pattern. Examples:

- Reader: "How does X work?" → AI: "How does X work? Great question. X
  works by..."
- Headline: "Why caching matters" → first paragraph: "Caching matters
  because..."

In blog posts, look for the first sentence after a section heading
restating the heading as a statement.

### Em-dash before a reveal or pivot

Distinctive LLM tic, especially after a setup clause:

- "...the answer — was simpler than expected."
- "...we tried everything — and nothing worked."
- "It seems counterintuitive — but the data is clear."

Detection rule: count em-dashes preceded by 3-8 words and followed by a
reveal or pivot. More than 2 per post is a tell.

### Smooth-but-empty paragraph transitions

LLMs glue paragraphs with transitional phrases that add no content:

- "With that said,"
- "Building on this,"
- "That being said,"
- "On a related note,"
- "It's also worth noting that"
- "Bringing this all together,"

Detection rule: count paragraphs that start with a transition word/phrase.
More than 30% of paragraphs is a tell.

## Medium severity

### Topic-support-summary paragraphs

Formulaic 5-sentence paragraph: 1 topic sentence, 3 supporting sentences,
1 summary sentence that restates the topic. Common in LLM output, rare in
fluent human prose.

Detection rule: read the first and last sentence of each paragraph. If
they're saying the same thing in different words, the paragraph is
formulaic.

### Symmetric sentence pairs

"Some X. Others Y." / "On one hand A. On the other hand B."

Used legitimately in human writing for genuine contrasts; LLM-flavored
when the contrast is fabricated for symmetry.

### "X is more than just Y"

Variants:

- "More than just a tool, it's a..."
- "Beyond just being X, this is..."
- "It's not merely X — it's Y"

Often paired with the "not just" pattern above.

### Bulleted summary before transition

LLMs frequently bullet-summarize a section before transitioning to the
next. Look for:

- 3-5 bullets at the end of a section, each restating something already
  said in prose above
- "To recap:" or "In summary:" preambles before the bullets

### Question as paragraph opener

LLMs use questions to fake engagement: "But what does this really mean?"
"So why does this matter?" "How does this apply to you?"

When the question is genuinely opening an argument it's fine. When it's a
rhetorical setup the answer is in the next sentence, it's a tell.

## Low severity

### Parallel structure overuse

Lists of two-word or three-word noun phrases:
"X, Y, and Z. A, B, and C. P, Q, and R."

Some parallelism is good prose. When every paragraph contains a parallel
list, it's mechanical.

### Adverbial intensifiers as sentence starters

- "Importantly,..."
- "Notably,..."
- "Crucially,..."
- "Significantly,..."

One per post is fine. More than 2 is mechanical emphasis.

### Hedge clusters

Multiple hedges in a single sentence:

- "This may potentially be useful for some users in certain situations."
- "Often, many companies tend to face challenges that could possibly..."

Detection rule: count sentences with 3+ hedge words. More than 5% of
sentences is a tell.

## Paragraph-level density rules

A paragraph that hits **all** of these is almost certainly LLM-flavored
even if no individual sentence is:

- Three or more medium-severity lexical tells (see `lexical-tells.md`)
- Topic-support-summary structure
- A smooth-but-empty opener
- Ends with "ultimately" / "in essence" / "at its core"

A paragraph that hits **none** of these and uses idiosyncratic phrasing,
varied sentence rhythm, and at least one position-taking claim is
distinctly human.
