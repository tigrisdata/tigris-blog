---
name: hold-the-reader
description:
  Audit a blog post for engagement and reader pull. Use when checking whether
  a draft will actually hold attention — separate from correctness, AI tells,
  or SEO. Triggers on "is this interesting", "make this more engaging", "will
  anyone read this", "why does this feel flat", or any review where pulling
  the reader through is the question.
metadata:
  trigger: Reviewing prose for engagement, diagnosing flat drafts
---

# Hold the Reader

Whether a post is _correct_ and whether a post is _interesting_ are different
properties. A correct post can still be unread. This skill audits the second
property.

The tradition behind it: William Zinsser (_On Writing Well_) on cutting and
voice, Strunk & White on density, Steven Pinker (_Sense of Style_) on the
classic style of conversation between equals, journalism's lede-and-nut-graf
craft, NN/g's eye-tracking research on web reading patterns (readers scan in
F-shaped patterns and bail fast). All of these converge on the same set of
moves; this skill encodes them as a checklist.

## When to use

- Reviewing a blog draft for engagement (not grammar, not AI patterns)
- Asked "is this interesting?", "will anyone finish reading this?", "why does
  this feel flat?"
- Before publishing — as a complement to `stop-slop` (AI patterns) and
  `writing-clearly-and-concisely` (Strunk).
- Diagnosing why a post that's structurally correct still doesn't land.

This skill is **opinionated and prescriptive**. It will recommend specific
rewrites. The author's judgment trumps it; advisory only.

## The seven things that hold a reader

### 1. The first paragraph creates a curiosity gap

The opening's only job is to make the reader want the next paragraph. Three
formats that work:

- **Question with stakes.** _"What happens when a poisoned doc slips into
  your agent's knowledge base?"_ Opens a gap; the reader needs the answer.
- **Specific scene.** _"Last Tuesday at 2:14 AM, our pager went off."_ Drops
  the reader into something concrete and ongoing.
- **Counter-intuitive claim.** _"Most agent security tools solve the wrong
  problem."_ Plants a position that demands defense.

Things that don't work:

- Throat-clearing (_"In today's evolving AI landscape..."_)
- Definitional openers (_"An agent is a system that..."_)
- Promise-of-content (_"In this post we'll cover X, Y, and Z."_)
- Greeting (_"Hi, I'm Alex, and today I want to talk about..."_)

The cold open is the highest-leverage paragraph in the post. Treat it that
way.

### 2. Specificity beats abstraction every time

Every paragraph should answer "compared to what?" with a concrete example.
Concrete things plant memory hooks: file names, function names, exact
numbers, named systems, real error messages, named tradeoffs. Abstractions
slide off.

- **Bad:** "Our system handles failures gracefully."
- **Good:** "When the validator throws, the wrapper catches it, runs
  teardown, and rethrows — the fork bucket is gone before the user sees the
  stack trace."

If a sentence describes "a process," replace it with the named process. If a
paragraph describes "users," replace with the named role doing the named
thing. _Specifics earn trust; abstractions look like cover._

### 3. There is tension somewhere

Without tension the reader has no reason to keep reading. Tension comes
from:

- A failure mode the post is solving
- A trade-off the reader has to make
- A claim that contradicts received wisdom
- A choice between two reasonable approaches
- A constraint that forces a non-obvious solution

A post that's only "here's how X works" with no friction is a manual, not a
post. Manuals are fine — but nobody reads them for fun, and nobody shares
them.

### 4. The reader is one step ahead — but only one

Plant expectations early. Pay them off later. Don't surprise the reader with
new framing in the conclusion.

A reader scanning the third section should still feel oriented from the
first section's setup. If the cold open says "two flavors of attack we'll
demonstrate," the reader expects two demos and isn't lost when they arrive.

This is also why **headings should tell a story when read as a list**. If
you read every `##` heading top-to-bottom and it sounds like a coherent
arc, the post is well-structured. If it reads like a random table of
contents, the structure is hiding from the reader.

### 5. Voice — not voiceover

Use first person when it's earned. State opinions. Disagree with positions.
"I think" and "we should" beat "it could be argued that."

Generic corporate prose has a fingerprint: passive voice, vague qualifiers
("often," "many," "some"), hedging without commitment, no opinions, no
named risks. The reader notices, even unconsciously. They stop trusting
that anything specific is being said and they skim.

Pinker's "classic style" frames it well: write as if you've spotted
something interesting and you're showing the reader where to look. Not
lecturing. Not selling. Showing.

### 6. The reader gets smarter as they read

Each section should leave the reader knowing something they didn't, or
seeing something they did know in a new light. If you can summarize a
section in a sentence the reader could already write before reading it,
that section is dead weight.

**Test:** pick a paragraph at random. Ask "what would the reader lose if I
deleted this?" If the answer is "nothing specific," delete it.

This is harsher than it sounds. Most "context" paragraphs are dead weight.
Most "background" sections can be cut to a sentence. Most "let me set this
up" is throat-clearing.

### 7. Honest scope earns trust

Posts that acknowledge what they don't do, or where the approach breaks
down, read as more credible than posts that claim universal success. A
reader who trusts the author keeps reading. A reader who senses oversell
skims.

Concrete moves that earn trust:

- "This works except when..."
- "We tried X first and it didn't pan out — here's what we learned"
- "The tradeoff is..."
- "If your situation is Y, this isn't the right tool"
- "We don't know how this generalizes to Z yet"

A post that defends a position by acknowledging counter-positions is
stronger than a post that pretends counter-positions don't exist.

## Quick checks (binary)

Before signing off, walk through these:

- [ ] Could the first paragraph appear unchanged on any post about anything?
      (If yes, generic open — rewrite.)
- [ ] Does any paragraph state a claim without a specific example, number,
      or named system?
- [ ] Is there a paragraph the reader could skip and lose nothing?
- [ ] Does the post resolve its central tension, or peter out?
- [ ] If you read every `##` heading as a list, do they tell a story?
- [ ] Is there at least one place where the author takes a position someone
      could disagree with?
- [ ] Does the conclusion add something the body didn't already say?
- [ ] Is there a single sentence the reader will quote when sharing this?
      (Posts get shared on the strength of one or two pull-quote-worthy
      lines. If none exist, the post will get fewer eyes.)

## Scoring rubric

Rate the post on each dimension 1-10. The total / 70 calibrates the
revision depth needed.

| Dimension     | What to look for                                                    |
| ------------- | ------------------------------------------------------------------- |
| Hook          | First paragraph creates curiosity gap; no throat-clearing           |
| Specificity   | Concrete examples, file names, real numbers, named systems          |
| Tension       | A failure mode, trade-off, or contested claim drives the post       |
| Pacing        | Reader stays one step ahead but never loses orientation             |
| Voice         | First-person presence; opinions; willing to disagree                |
| Density       | Every paragraph earns its place; nothing the reader could skip      |
| Honest scope  | Acknowledges trade-offs and where the approach breaks               |

| Total | Verdict |
|---|---|
| 60-70 | Ship. Note specific dims under 7 as polish opportunities. |
| 45-59 | Revise. Identify the 2-3 lowest dimensions and target them. |
| < 45  | Rework. The structure or framing needs rethinking, not just edits. |

## Common failure modes (with fixes)

**The "comprehensive" post.** Tries to cover everything; covers nothing
deeply. _Fix:_ pick one main argument; cut everything that doesn't serve
it.

**The buried lede.** The most interesting claim is in paragraph 7. _Fix:_
move it to paragraph 1; restructure backwards from there.

**The "in this post we'll cover" opener.** Tells the reader what they'll
learn before earning their attention. _Fix:_ drop the announcement; show
something concrete first.

**The conclusion summarizes.** Restating the body insults the reader.
_Fix:_ make the conclusion add — a generalization, a next step, a new
question, a hand-off.

**The "we" with no people.** Corporate "we" without specific actors makes
nothing real. _Fix:_ name who did what. "Our team" → "the three of us
working on the launch." "Engineering decided" → "I argued for X; A. Smith
pushed back; we landed on Y."

**The unfailable claim.** "Our solution is comprehensive and robust." Means
nothing because it can't be wrong. _Fix:_ state the position with stakes —
"this is the right tool for X case; for Y case, use Z."

**The dead metaphor.** "Game-changing", "leveraging synergies", "robust
solution," "unlock value." _Fix:_ replace with the literal thing the
metaphor was supposed to evoke, or use a fresh metaphor.

**The example-free claim.** "Engineers prefer this approach." _Fix:_ name
an engineer, name a context, name a result.

**The sequenced explanations with no payoff.** "First we'll cover A, then
B, then C." If by step C the reader hasn't earned a moment of "oh," the
sequence didn't work. _Fix:_ identify the moment of insight; restructure to
build toward it.

## Output format

Produce a report with:

1. **Overall verdict** (one line): "Will hold a reader" / "Will lose
   readers by paragraph N" / "Doesn't have a position to defend yet."

2. **Score** (table): each of the seven dimensions 1-10 with a one-line
   rationale per dimension.

3. **Top three rewrites** (highest-impact changes), each with:
   - **Location:** `path:line` or section name
   - **Issue:** what's flat and why it kills engagement
   - **Suggestion:** quote the original phrase, then the suggested rewrite.
     Don't rewrite full paragraphs unless asked — phrase-level suggestions.

4. **Other findings** (severity-ordered list): less-impact issues with
   location and one-line description.

5. **What's working** (end on this): two or three things the post does
   well, so the author knows what to preserve while revising.

## Priority when this skill conflicts with others

When `hold-the-reader` and `writing-clearly-and-concisely` disagree:

- Strunk wins on grammar and clarity (active voice, omit needless words).
- This skill wins on density, voice, and the curiosity-gap structure.
- If a Strunk-correct sentence is also dead weight, this skill says cut.

When `hold-the-reader` and `stop-slop` disagree:

- `stop-slop` wins on AI-pattern detection (em-dashes before reveals,
  three-item lists, formulaic structures).
- This skill wins on engagement structure (hook, tension, pacing).
- The two are usually orthogonal — slop fixes don't make a post
  interesting; they remove a specific kind of un-interestingness.

When the author's intent disagrees with this skill, the author wins.
Advisory only.

## License

MIT
