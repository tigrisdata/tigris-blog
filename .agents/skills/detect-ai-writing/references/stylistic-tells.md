# Stylistic tells

Hedging, throat-clearing, comprehensive-when-shallow, and disclaimer
reflexes. These are larger-scale patterns than lexical or sentence-level
tells — they show up across paragraphs and reveal an underlying stance the
LLM was trained to adopt: cover-everything, hedge-everything, commit-to-
nothing.

## High severity

### Refusing to take sides

The post sets up a tension or contested question, then refuses to
adjudicate. Variants:

- "There are valid arguments on both sides."
- "Whether X or Y depends on your context."
- "Different teams have different preferences here."

Sometimes this is honest — genuinely contested questions exist. The LLM
tell is when the post argues a position implicitly throughout, then dodges
the explicit commitment.

Detection rule: read the post's introduction. If the post promises an
argument, check the conclusion. If the conclusion is "it depends," that's
either a deliberate authorial choice or an LLM tic. Examine the
intervening prose for evidence either way.

### Comprehensive-when-shallow

Long enumeration of "considerations" or "aspects" or "factors" without
ranking or analysis. Examples:

- "When choosing X, consider these factors: A, B, C, D, E, F, G, H..."
- "There are several key aspects to keep in mind: ..."
- "The benefits of Y include: ..." followed by 7+ items

Human writers rank, weight, and prune. LLMs enumerate. A post that lists
8 considerations without saying which 2 matter most is comprehensive but
not useful.

### Defining commonly-known terms

The audience presumably knows what an API is; the post explains anyway.
The audience presumably knows what "scalable" means; the post defines it.

Detection rule: identify the post's intended audience from context (URL,
sibling posts, frontmatter). If terms a member of that audience would know
get defined inline, that's a tell — LLMs default to over-explaining for
unknown audiences.

### Authority hedges with no source

- "Many experts agree that..."
- "Studies have shown that..."
- "Research suggests..."
- "Industry leaders recommend..."

When followed by a citation, these are normal academic hedges. When
free-floating with no source, they're LLM-flavored authority manufacturing.

## Medium severity

### Disclaimer reflexes

Every claim followed by a softening or qualifying clause:

- "..., but of course, results may vary."
- "..., though it's worth noting that..."
- "..., while X is important, it's also true that Y."
- "..., that said,..."

One disclaimer per post is fine. One per paragraph is mechanical.

### Empty meta-commentary

The post tells the reader what it's doing instead of doing it:

- "Now let's talk about..."
- "First, let's establish..."
- "Before we move on,..."
- "Now that we've covered X, let's explore Y."

Detection rule: count sentences that describe the post's structure rather
than saying something. More than 5% of sentences is a tell.

### Vague time references

LLMs default to fuzzy temporal framings:

- "In recent years..."
- "Today's fast-paced world..."
- "In our increasingly connected society..."
- "The modern landscape..."

One use is benign. Three or more is a fingerprint.

### Universal claims with no support

- "Every business needs..."
- "All developers know..."
- "Every modern application..."
- "It's universally acknowledged that..."

Compare to human writing, which would either qualify ("most teams I've
seen") or commit with an example ("when we shipped X, we found Y").

## Low severity

### Meta-acknowledgments

- "It's important to remember that..."
- "Keep in mind that..."
- "Don't forget that..."
- "Worth noting:..."

These often function as soft hedges rather than emphasis. One or two are
fine; clusters indicate LLM-flavored hedging.

### Audience-uncertain framings

The post addresses multiple possible reader profiles in case any of them
is the actual reader:

- "Whether you're a developer, a designer, or a product manager..."
- "If you're new to X, start with Y. If you're experienced, jump to Z."
- "For [audience A], this means... For [audience B], this means..."

Used legitimately in tutorials. LLM-flavored when the post is clearly
aimed at one audience but hedges for others.

## Genre calibration

These categories produce more false positives than lexical or structural
tells. Calibrate down for:

- **Tutorials and how-tos** — defining terms is normal; hedging on
  applicability is normal.
- **Survey or overview posts** — comprehensive enumeration is the genre.
- **Academic prose** — hedging is professional norm.
- **Marketing copy** — universal claims and audience-uncertain framings
  are conventional.

For these genres, treat stylistic findings as signal only when they
co-occur with high-density lexical or structural tells.
