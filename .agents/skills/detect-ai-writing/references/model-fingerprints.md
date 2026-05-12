# Model fingerprints

Per-model lexical and structural tells. **These drift.** The set below
reflects observations on widely-deployed models as of mid-2026 and will be
out of date as models update. Treat as starting heuristics, not as a
definitive identification key.

Use this reference only when **3+ category-1 (lexical) tells from the same
model** appear in a piece. With fewer, it's noise.

## Claude 3.5 / 3.7 / 4.x family (Anthropic)

**Distinctive lexical tells:**

- "It's important to note that..."
- "It's worth mentioning that..."
- "delve into" (very high frequency)
- "navigate" (figurative — "navigate the complexities of")
- "leverage" / "harness" (verbs)
- "ethical considerations" / "ethical implications"
- "important to consider"
- "ensure"
- "robust"
- "comprehensive"

**Structural patterns:**

- Bullet lists with bold label + colon + explanation:
  - **Performance:** ...
  - **Reliability:** ...
- Measured hedging — qualifies more than commits
- Three-sentence paragraphs as a default rhythm
- Prefers "for example" over "e.g." in conversational prose
- Closes responses with "Let me know if you have any other questions!" in
  chat contexts (rare in published prose)

**What's distinctive:** Claude tends to over-hedge on uncertain
questions. When a Claude-drafted post has hedge clusters in nearly every
paragraph, that's a strong fingerprint.

## GPT-4 / GPT-4o / GPT-5 family (OpenAI)

**Distinctive lexical tells:**

- "Moreover," (paragraph opener)
- "Furthermore," (same)
- "Additionally," (same)
- "In essence,"
- "At its core,"
- "Crucial" / "crucial role"
- "Ultimately,"
- "Embrace" / "Foster" / "Unlock" (figurative verbs)
- "robust framework"
- "tapestry"
- "dynamic" (overused as adjective)

**Structural patterns:**

- "Smooth" transition paragraphs that summarize the prior section before
  starting the next
- Three-item parallel constructions ("X, Y, and Z" — three near-equivalent
  items)
- Ends sections with a wrap-up sentence that previews the next section
- Reaches for em-dashes for emphasis at higher frequency than Claude
- "X is not just Y, it's Z" formulation

**What's distinctive:** GPT-4 family is "smoother" than Claude — fewer
abrupt sentences, more transitional padding. When a piece flows
unnaturally well between paragraphs without saying anything new in the
transitions, that's a GPT fingerprint.

## Gemini family (Google)

**Distinctive lexical tells:**

- "Indeed,"
- "It's worth mentioning that..." (different valence than Claude's; usually
  more verbose preamble)
- "It's important to consider..."
- "Crucial role"
- Verbose preambles before answering

**Structural patterns:**

- Longer preambles before getting to the point
- More frequent restatement of the question
- Tends toward listicle-flavored structure even in prose contexts

**What's distinctive:** Gemini drafts often take longer to get started
than Claude or GPT drafts. The first paragraph is preamble; the actual
answer starts in paragraph two.

## Older / smaller models (GPT-3.5, smaller open-source)

**Distinctive tells:**

- "As an AI language model" leakage (rare in current models, common in
  3.5-era)
- "I cannot assist with that request" boilerplate
- More obviously formulaic — three-paragraph structure, restate-define-
  conclude
- Higher hedge density per paragraph
- Less natural sentence-length variance

**What's distinctive:** these read more obviously LLM-flavored than
current frontier models. If a piece reads as "obviously AI" it's likely
from this tier.

## Hybrid / heavily-edited LLM output

Pieces drafted by an LLM and then human-edited often show a distinctive
pattern: lexical tells get edited out (humans notice "delve into" and
remove it), but **structural tells survive** (humans don't notice three-
item lists and topic-support-summary paragraphs).

**Detection rule:** if a piece has very few lexical tells but high-
density structural tells, it's likely heavily-edited LLM output. The
inverse — many lexical tells but varied structure — usually indicates
human writing that picked up some LLM-flavored phrasing through reading.

## Caveats and known false-positive sources

- **Specific human authors with formal corporate registers** sometimes
  match GPT fingerprints incidentally (especially writing for SEO or
  marketing).
- **Translated prose** can match LLM fingerprints because translators
  default to safe, hedge-flavored renderings.
- **Edited drafts of AI output** show fingerprint drift — partial
  patterns, mixed signals.

When in doubt: report the *findings* (specific quotes, specific patterns)
rather than the *fingerprint identification*. Findings are evidence;
fingerprint identification is interpretation.
