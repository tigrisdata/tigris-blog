# Lexical tells

Words and short phrases overrepresented in LLM output. Each pattern is
listed with its **severity weight** (how strongly its presence indicates
LLM authorship). Weights are heuristic, not statistical — calibrate against
the genre you're auditing.

This list overlaps with `stop-slop/references/phrases.md` deliberately. The
overlap is the highest-confidence subset; new entries here are detection-
specific (less common in human prose, even when used legitimately).

## High severity (single appearance is informative)

These are near-unique to LLM output in the wild:

- "delve into"
- "navigate the landscape" / "navigate the complexities of"
- "tapestry" (especially "rich tapestry")
- "in the realm of"
- "It's important to note that..."
- "It's worth mentioning that..."
- "Let's explore..." (as section opener)
- "Let's dive into..." / "Let's dive deep"
- "Imagine if..." / "Imagine a world where..."
- "Without further ado"
- "Hopefully, this helps!" (closer)
- "I hope this helps." (closer)
- "Whether you're a [X], [Y], or [Z]" (universal-audience hedge)

## Medium severity (suspicious in clusters of 2+)

Common enough that one appearance is benign; clusters indicate LLM origin:

- "Moreover" (especially as paragraph opener)
- "Furthermore" (same)
- "Additionally" (same)
- "In essence"
- "At its core"
- "Ultimately" (as paragraph closer)
- "leverage" (as verb)
- "harness" (as verb in non-technical context)
- "unlock" (figurative — "unlock value", "unlock potential")
- "unleash"
- "embrace" (figurative — "embrace change")
- "foster" (figurative — "foster collaboration")
- "robust" (especially "robust solution")
- "scalable" (when not technical)
- "comprehensive" (when describing prose itself)
- "well-rounded"
- "crucial" (especially "this is crucial because")
- "cutting-edge"
- "state-of-the-art"
- "game-changing"
- "revolutionary" (in non-revolutionary contexts)
- "seamless" / "seamlessly"

## Low severity (informative only in clusters of 4+ or paired with other tells)

Common in human writing too; pattern emerges only at high density:

- "various"
- "numerous"
- "multifaceted"
- "intricate"
- "vibrant"
- "dynamic"
- "innovative"
- "transformative"
- "groundbreaking"
- "essential"
- "vital"
- "pivotal"
- "key" (as adjective — "key insight," "key takeaway")
- "important" (vague intensifier — "an important consideration")

## Section/paragraph openers (high severity in launch posts and how-tos)

Almost always LLM-flavored, especially as the first words after a heading:

- "When it comes to..."
- "In the world of..."
- "In today's [adjective] landscape..."
- "In our increasingly connected world..."
- "Now, let's [verb]..."
- "First, let's establish..."
- "To begin with..."
- "Before we dive in..."
- "It's no secret that..."

## Closers (high severity)

- "Ultimately,..." (as final-sentence opener)
- "In the end,..."
- "All in all,..."
- "To wrap up,..."
- "In conclusion,..."
- "At the end of the day,..."
- "Hopefully, this gives you..."
- "I hope you found this useful!"

## Calibration

If the prose is technical documentation, marketing copy, or formal
business writing, weight medium-severity entries at 60% of their rated
strength. The high-severity entries remain informative across genres.

If the prose is academic or scientific writing, weight stylistic-genre
overlaps ("comprehensive," "crucial," "various") at 30%. Academic writing
uses these legitimately.
