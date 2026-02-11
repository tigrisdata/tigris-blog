---
name: build-with-me-outline
description: >
  Create outlines for "build with me" blog posts -- dramatic retellings of
  engineering decisions, not tutorials. Use when outlining a "deep dive", "how
  we built", or "walkthrough" style post.
---

# Build With Me Outline Creator

Guide the user through creating an outline for a "build with me" post. These are
not tutorials. They are dramatic retellings of engineering decisions where the
author builds something with the reader looking over their shoulder.

Read `references/post-anatomy.md` for the seven-beat structure and detailed
examples. Read `references/example-outlines.md` for reverse-engineered outlines
from 8 real posts.

## Identify the Subtype

Ask the user which subtype fits their post:

| Subtype                  | Signal                                        | Emphasis                    |
| ------------------------ | --------------------------------------------- | --------------------------- |
| **Feature Deep Dive**    | "How we built X" -- internal engineering      | Thinking process + warts    |
| **Project Walkthrough**  | "I built X, here's how" -- end-to-end journey | The build + the payoff      |
| **Architecture Pattern** | "Here's a pattern for X" -- generalizable     | Why care + thinking process |
| **Workflow Demo**        | "Here's how to use X for Y" -- step by step   | The build with iterations   |

## Guided Outline Process

Walk the user through these questions. Ask them in batches of 2-3, not all at
once.

### Round 1: The Core

1. **What did you build / implement / design?** One sentence.
2. **Why does it matter to the reader?** What problem does it solve? What does
   it enable?
3. **What's the most interesting engineering decision or tradeoff?** The thing
   that makes this worth writing about instead of just shipping.

### Round 2: The Hook

4. **Is there a good analogy, metaphor, or cultural reference** that captures
   the core concept? (Taco Bell infrastructure, parallel universes, time travel,
   etc.) If not, brainstorm one together.
5. **What's the emotional entry point?** Frustration with status quo? Excitement
   about a new capability? Curiosity about how something works?

### Round 3: The Journey

6. **What was the sequence of steps?** Walk through what happened in order. Not
   polished -- just the raw sequence.
7. **Where did things go wrong or surprise you?** Failed approaches, unexpected
   complexity, things that took longer than expected.
8. **What was the "it works!" moment?** The payoff. Screenshot, demo output,
   successful migration, passing test.

### Round 4: The Depth

9. **What code / architecture / diagrams need to be shown?** Identify the 3-5
   most important code blocks or diagrams.
10. **What background does the reader need?** Any concepts to explain before the
    build section.
11. **How does Tigris fit into the story?** It should feel natural, not forced.

## Assemble the Outline

Once you have answers, build an outline using the seven-beat structure from
`references/post-anatomy.md`:

1. **Hook** -- Analogy, announcement, or bold claim from Round 2
2. **Why Should You Care** -- Real-world scenario with specifics from Round 1
3. **The Thinking Process** -- Mental model, decomposition, or reframing
4. **The Build** -- Progressive code walkthrough from Round 3, broken into named
   subsections
5. **The Warts** -- What went wrong, woven into the build or as its own section
6. **The Payoff** -- The satisfying result
7. **The Broader Lesson** -- Ties back to hook, forward-looking

Not all seven beats are required. Feature deep dives may merge beats 4-5.
Architecture patterns may spend most time on beats 2-3. Workflow demos may have
multiple iterations of beat 4.

### Outline Format

Present the outline as a numbered list with:

- Section heading (H2 or H3)
- 1-2 sentence summary of what goes in that section
- Notes on code blocks, diagrams, or screenshots needed
- Estimated word count per section (aim for 1500-3000 words total)

### Quality Checks

Before presenting the outline, verify:

- [ ] The hook is NOT "In this post, I will..."
- [ ] There's a concrete "why care" scenario before any code
- [ ] The thinking process is shown, not just the result
- [ ] At least one honest admission of difficulty or failure
- [ ] Tigris integration feels natural to the story
- [ ] The conclusion ties back to the hook or a broader principle
- [ ] Code blocks are real and substantial, not toy examples
