---
name: detect-ai-writing
description:
  Audit a piece of prose for AI-generated tells. Use when checking whether
  text reads as AI-written, when reviewing AI-assisted drafts before
  publication, or when triaging third-party content. Triggers on "is this
  AI?", "does this sound like AI?", "check for AI patterns", "audit for
  slop", "scan for tells". Output is a structured forensic report — quotes,
  locations, severity, confidence. This skill detects; `stop-slop` rewrites.
metadata:
  trigger: Forensic audit of prose for AI-generated patterns
---

# Detect AI Writing

Identify AI-generated patterns in prose with quotes, locations, severity,
and a confidence score. **This is a detection skill, not a rewriting skill** —
when you find tells, this skill names them; `stop-slop` is the companion
skill that rewrites them.

## When to use

- A draft was AI-assisted and you want to know what to clean up before
  publishing
- You're triaging third-party content (was this written by a human, an LLM,
  or a hybrid?)
- You want a forensic before/after score on a draft you've revised
- You're scanning a corpus for AI-flavored content at scale

This skill is **opinionated and pattern-based** — it can produce false
positives (humans use these patterns too, sometimes intentionally). Treat
output as a starting point for review, not as adjudication.

## How this differs from `stop-slop`

| Skill | Output | Use it when |
|---|---|---|
| `stop-slop` | Rewrites and replacements | You're editing prose to remove AI patterns |
| `detect-ai-writing` (this) | Structured forensic report (quotes, locations, severity, confidence) | You're auditing prose to identify AI patterns |

Run `detect-ai-writing` first to surface what's there. Then run `stop-slop`
on the findings to rewrite them. The two skills share pattern lists — see
`stop-slop/references/phrases.md`, `stop-slop/references/structures.md` —
plus the detection-specific lists in this skill's
[`references/`](references/) directory.

## Six categories of tells

Each finding the skill produces gets categorized into one of these. Each
category has its own severity weighting (see scoring rubric below).

### 1. Lexical tells — specific words and phrases LLMs overuse

These are individual words or short phrases with abnormally high frequency
in LLM output relative to human writing. Common examples:

- "delve into", "navigate the landscape", "leverage", "harness", "unlock",
  "unleash"
- "tapestry", "whilst" (in non-British text), "dive deep"
- "It's important to note that...", "It's worth mentioning..."
- "In essence", "At its core", "Ultimately"
- "Furthermore", "Moreover", "Additionally" as transitions

Full list with severity weights:
[`references/lexical-tells.md`](references/lexical-tells.md). Cross-check
against [`stop-slop/references/phrases.md`](../stop-slop/references/phrases.md)
for overlap.

### 2. Structural tells — formulaic sentence and paragraph patterns

LLMs default to certain structural patterns even when content doesn't
demand them:

- **Three-item lists** where two would do (or four would be honest)
- **Binary contrasts** ("not X, but Y" / "not just X, but Z")
- **Em-dash before a reveal** ("...the answer — was simpler than expected")
- **Topic-support-summary paragraphs** (1 topic sentence, 3 supports, 1
  summary — formulaic)
- **Symmetric sentence pairs** ("Some X. Others Y.")
- **"X is more than just Y" / "X is not just Y, it's Z"**
- **Restating the question** before answering it
- **Smooth-but-empty transitions** between paragraphs ("With that said,",
  "Building on this,")

Full list: [`references/structural-tells.md`](references/structural-tells.md).
Cross-check against
[`stop-slop/references/structures.md`](../stop-slop/references/structures.md).

### 3. Stylistic tells — hedging, throat-clearing, comprehensive-when-shallow

LLMs hedge by default. They throat-clear before claims. They add
disclaimers for situations where a human author would commit:

- **Hedge clusters** ("often," "many," "some," "may," "could," "potentially")
- **Authority hedges** ("Many experts agree", "Studies have shown",
  "Research suggests")
- **Disclaimer reflexes** ("It's worth noting", "Of course", "While X is
  important...")
- **Comprehensive coverage** ("This involves several key aspects:",
  "There are many factors at play")
- **Refusing to take sides** in debates the post is ostensibly arguing
- **Defining commonly-known terms** the audience already understands

Full list: [`references/stylistic-tells.md`](references/stylistic-tells.md).

### 4. Content tells — paragraph-level patterns that signal LLM generation

Larger-scale patterns that surface only at the paragraph or section level:

- **Restating in the conclusion** what the body just said
- **Empty meta-commentary** ("Now let's talk about", "First, let's
  establish")
- **Vague time references** ("In recent years", "Today's fast-paced world",
  "In our increasingly connected world")
- **Universal claims with no support** ("Every business needs", "All
  developers know")
- **Listicle openers in non-listicle content** ("Here are five reasons
  why...")
- **Closing with "ultimately" / "in the end"** to indicate a wrap-up that
  doesn't actually wrap up
- **"Imagine if..." / "Imagine a world where..."** as setup hooks
- **Frequent "Let's explore", "Let's dive into"** as section openers

### 5. Density tells — what AI writing has too much or too little of

These are quantitative signals more than specific patterns:

- **Sentence length variance:** human writing varies more than LLM output.
  Three consecutive sentences within ±3 words of each other → a tell.
- **Bullet density:** LLMs reach for bullets where prose would serve better.
  Posts that are 30%+ bullets often weren't drafted by humans.
- **Em-dash density:** an em-dash every paragraph is suspicious; em-dashes
  paired with reveals or pivots more so.
- **Adjective density:** LLMs over-modify. Phrases like "robust, scalable
  solution" or "comprehensive, well-rounded approach" stack adjectives.
- **Hedge density:** more than one hedge per paragraph on average suggests
  LLM-flavored writing.

### 6. Per-model fingerprints — distinctive tells of specific LLMs

Different models leave different traces. Useful when triaging "is this AI"
to identify which model:

- **Claude:** "important to note", "It's worth mentioning", "delve into",
  "navigate", "leverage", "harness", "ethical considerations", measured
  hedging, bullet lists with bold openers
- **GPT-4 / GPT-4o:** "Moreover", "Furthermore", "In essence", "At its
  core", "Crucial", "Ultimately", "Embrace", "Foster", smooth transitions,
  list-then-summarize pattern
- **Gemini:** "It's worth mentioning that", "Indeed", "It's important to
  consider", verbose preambles before answering
- **Older GPT-3.5:** more breathless, more obviously formulaic, frequent
  "As an AI language model" leakage (rare in current models)

These fingerprints drift; this skill's `references/model-fingerprints.md`
is dated and should be updated as models update.

## How to apply this skill

When invoked on a piece of prose:

### Step 1 — Locate and read the target

If a file path is provided, read that file. If multiple candidates exist
(e.g., uncommitted blog posts), ask the user which to audit. For pasted
text, treat the message as the input.

### Step 2 — Two-pass scan

**Pass 1 — pattern matching.** Walk the text looking for matches against
the six categories. For each match, record:

- The exact quoted text (5–15 words around the match)
- Location (line number if file; paragraph index otherwise)
- Category (1–6 above)
- Specific pattern matched (e.g., "Lexical: 'delve into'")
- Severity (low / medium / high)

**Pass 2 — density and structural metrics.** Compute:

- Sentence length variance (sample 20 sentences, compute std dev; <5 words
  std dev is a tell)
- Bullet ratio (lines that are bullets / total prose lines; >30% is
  suspicious in a non-listicle)
- Em-dash density (em-dashes / paragraph)
- Adjective stacking instances ("X, Y, Z noun" or "X and Y noun")
- Hedge density (hedges / paragraphs)

### Step 3 — Score

Rate the text across these five dimensions, 1-10:

| Dimension | Question | 1 (heavy AI) | 10 (clearly human) |
|---|---|---|---|
| Lexical | Are LLM-overused words/phrases present and frequent? | every paragraph | none or repurposed |
| Structural | Do sentences and paragraphs follow formulaic patterns? | metronomic, three-item, binary contrasts | varied, idiosyncratic |
| Stylistic | Does it hedge, throat-clear, refuse to commit? | constant | takes positions |
| Content | Does it restate, define obvious things, refuse to take sides? | yes | no |
| Density | Sentence variance, bullet ratio, em-dash, adjective stacking | within LLM ranges | varies, breaks patterns |

**Confidence score:**

- 0–15: clearly AI-written or AI-heavily-assisted
- 15–25: AI-assisted with light editing
- 25–35: human-edited AI draft, or AI-flavored human writing
- 35–45: human-written with minor AI tells (or AI passing as human)
- 45–50: clearly human

These are calibration bands, not predictions. Use the *findings* themselves
as the substance; the score summarizes.

### Step 4 — Output the report

See "Output format" below.

## Output format

Produce a report with these sections:

1. **Verdict** (one line). Examples:
   - "Reads as AI-assisted with light editing — 18 tells, 14 high-severity."
   - "Reads as human-written with minor LLM-flavored phrasing — 4 low-severity tells."
   - "Reads as straight LLM output — 47 tells, lexical and structural patterns dominate."

2. **Score** (table). Five dimensions × 1-10 with one-line rationale per
   dimension. Total / 50, calibration band.

3. **Findings** (numbered, severity-ordered). Each finding:
   - **Location:** `path:line` or paragraph number
   - **Category:** 1-6
   - **Pattern:** specific tell matched
   - **Severity:** low | medium | high
   - **Quote:** the exact phrase, 5–15 words of context
   - **Why:** brief note on why this is an AI tell (one sentence)

4. **Density metrics** (computed). Sentence-length std dev, bullet ratio,
   em-dash density, adjective stacking count, hedge density.

5. **Likely model fingerprint** (if confident). "Lexical pattern matches
   Claude" or "Structural pattern matches GPT-4o" — only if the evidence
   is strong (3+ category-6 matches). Otherwise omit.

6. **Top three concrete fixes** (handoff to `stop-slop` or rewrite). The
   three highest-leverage tells with suggested replacements. **Don't
   rewrite full paragraphs** — phrase-level suggestions.

7. **What's working** (end on this). One or two passages that read as
   distinctly human, so the author knows what to preserve.

## Severity weighting

Not all tells are equal. Use these weights when reporting:

- **High severity:** lexical fingerprints (single phrases that are
  near-unique to LLMs), formulaic three-item lists, smooth-but-empty
  transitions, restating the question, "X is not just Y, it's Z"
  formulations, paragraph-level meta-commentary
- **Medium severity:** hedge clusters, em-dash density, comprehensive
  coverage, defining commonly-known terms, vague time references
- **Low severity:** isolated mild hedges, occasional bullet, single
  adjective stacking instance

A report listing 30 low-severity findings is not a stronger signal than 5
high-severity ones. Weight the report's verdict accordingly.

## Calibration notes

This skill produces false positives on:

- **Technical writing** — uses transitions and structure conventions that
  overlap with LLM patterns
- **Academic prose** — hedges by professional norm, not LLM tic
- **Marketing copy** — has some pattern overlap with LLM output by design
- **Formal business writing** — uses "Furthermore" and "Moreover"
  legitimately

When auditing one of those genres, weight findings down by 30–50% in
categories 3 and 4 (stylistic, content). Specific lexical fingerprints
(category 1) and structural tells (category 2) are still informative.

This skill produces **false negatives** on:

- LLM output that's been heavily human-edited (most of the tells get
  caught and removed during editing)
- LLM output prompted with explicit "write in the style of..." constraints
- LLM output from models the fingerprint database doesn't cover (newer
  releases, fine-tuned models)

A clean score doesn't mean "definitely human." It means "either human or
well-edited."

## Priority when this skill conflicts with others

When `detect-ai-writing` and `stop-slop` produce overlapping findings:
deduplicate. Both skills draw on the same pattern lists; the divide is
detection vs. rewriting, not which patterns matter.

When `detect-ai-writing` and `hold-the-reader` disagree about a passage:
- `hold-the-reader` wins on engagement structure
- `detect-ai-writing` wins on AI fingerprint identification
- A passage can be both AI-flavored AND engaging; the skills aren't
  mutually exclusive

When the author intentionally uses an AI-flagged pattern for stylistic
effect (rare but valid — e.g., parodying corporate prose), the author wins.
Advisory only.

## License

MIT
