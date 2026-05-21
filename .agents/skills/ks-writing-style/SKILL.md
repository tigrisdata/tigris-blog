---
name: ks-writing-style
description:
  Write or edit blog posts in Katie Schilling's voice. Use when drafting case
  studies, product feature posts, or partner-focused content for the Tigris blog.
  Katie writes technically grounded prose that centers the customer's problem and
  lets specifics do the persuading. Also use when reviewing prose that should
  match Katie's style.
---

# Katie Schilling Blog Post Writer

Write blog posts that sound like Katie Schilling. Read
`references/voice-tone.md` for detailed voice characteristics. Read 2-3 example
posts from `assets/` to calibrate tone. Then read the reference file that matches
the post type:

- `references/case-study.md` — Customer stories and partner spotlights
- `references/product-feature.md` — Feature announcements and technical
  walkthroughs
- `references/co-authored.md` — Posts written with Xe or other co-authors

Most posts are one of these types. Read whichever applies.

## Hard Rules

Non-negotiable constraints:

1. **Lead with the customer's problem, not Tigris.** The reader should
   understand why something matters before hearing about the solution.
2. **Use real numbers.** Percentages, dollar amounts, latencies, data volumes.
   Vague claims ("much faster") are never acceptable when specifics exist.
3. **Let quotes carry conviction.** Use customer quotes for the strongest claims
   about Tigris rather than making those claims editorially.
4. **No corporate fluff.** No "leverage", "empower", "cutting-edge",
   "revolutionize", "seamless". Write plainly.
5. **Show tradeoffs honestly.** Acknowledge what the customer tried before and
   why it didn't work, without caricaturing competitors.
6. **S3 is the lingua franca.** Emphasize S3 compatibility as a practical
   benefit (existing tools work) not a marketing differentiator.

## Voice in Brief

Katie writes like a technical product marketer who respects her audience's
intelligence. The prose is warm but not casual, specific but not dry, persuasive
but not pushy. She disappears behind the customer's story rather than inserting
herself as narrator.

Markers that distinguish this voice:

- **Concrete before abstract.** Opens with a scenario, a number, or a customer's
  actual situation rather than a thesis statement.
- **Conversational register.** Uses contractions, occasional sentence fragments,
  second-person address. Not stiff, not slangy.
- **Questions as hooks.** Opens sections with rhetorical questions that frame the
  problem: "What do you do when you need to serve up a 7+ billion parameter
  model with sub 10 second cold starts?"
- **Specificity as persuasion.** "Saturated 10Gb links, 1GB/s+ writes" instead
  of "extremely fast". "85% cost savings" instead of "significant reduction".
- **Understated confidence.** Lets facts speak. Doesn't oversell or use
  superlatives editorially when a quote or metric is stronger.
- **Short punchy sentences mixed with longer explanatory ones.** "Such
  conversations are rarely good for the business." followed by a multi-clause
  paragraph.
- **Simplicity as a value.** Complexity isn't sophistication. If something
  requires five steps when it should take one, that's a problem worth naming.
- **Best tool, not biggest tool.** Katie doesn't defer to incumbents. She'll
  recommend newer or less popular tools when they genuinely solve the problem
  better, and frames that choice as obvious rather than contrarian.

Read `references/voice-tone.md` for the full style guide.

## Structure

Choose the pattern that fits the material:

| Pattern                                                                         | Best for               |
| ------------------------------------------------------------------------------- | ---------------------- |
| Problem scenario → customer context → technical detail → Tigris solution → quote | Case studies           |
| Bold claim → explanation → proof → customer usage → CTA                         | Product features       |
| Shared problem → collaborative solution → technical walkthrough → editorial CTA | Co-authored posts      |
| AWS/competitor pain → Tigris alternative → partner examples → getting started   | Platform/API posts     |

## Openings

Lead with one of:

- **Rhetorical question with real constraints**: "What do you do when you need to
  serve up a completely custom, 7+ billion parameter model with sub 10 second
  cold start times?"
- **Customer's problem as narrative**: "fal.ai's team set an ambitious goal: host
  the fastest diffusion inference endpoints in the world without passing the bill
  onto their users."
- **Provocative observation**: "The problem with observability data is there's a
  lot of it. And most of it isn't useful."
- **Direct value statement**: "People put bytes into our servers with a name, and
  expect that come hell and high water, when they put in the name, they get the
  exact same bytes back."

Never open with "In this post" or a generic industry overview.

## Closings

- End with a concrete CTA: "Make a global bucket with no egress fees"
- Or end with a forward-looking statement grounded in what was just described
- Always include an `<InlineCta>` component
- Avoid tagline-style closings ("Stop X. Start Y.")

## Components

Katie uses these Tigris blog components:

- `<QuickSummary>` — 3-4 bullet key takeaways at top, with `readTime` prop
- `<BreakoutQuote>` — Customer quotes with name, title, and avatar
- `<PullQuote>` — Editorial emphasis quotes (used sparingly)
- `<InlineCta>` — Call to action at the end of every post
- `<PostEmbed>` — Embedded social media posts with attribution
- Custom diagram components for architecture illustrations

## QuickSummary Convention

Every post starts with a `<QuickSummary>` after the hero image. Items use this
pattern:

- **Title**: Short noun phrase with period. "Serverless GPUs." / "85% cost
  savings with Tigris."
- **Description**: One sentence expanding the claim with specifics.

## Quote Usage

Katie uses customer quotes strategically:

- Place quotes after the editorial paragraph that sets up the context
- Let the customer make the strongest claims about Tigris performance/value
- Use quotes for the "why" and editorial prose for the "what"
- Each case study typically has 2-4 quotes from 1-2 people
- Include real names, titles, and companies

## Body Writing Checklist

- Vary paragraph length (2-3 sentences typical, occasional single-sentence
  paragraphs for emphasis)
- Link to customer products, docs, and repos on first mention
- Use `$bigCloud` instead of naming AWS/GCP/Azure when criticizing generically
- Inline code for commands and technical terms: `beam deploy`, `fly storage create`
- Bold for key metrics or conclusions in running prose
- Numbers are specific: "10s of TBs", "100+ TBs", "sub-10s", "85%"

## Process

1. Accept the user's notes, outline, or brain dump
2. Read `references/voice-tone.md`
3. Read 2-3 example posts from `assets/` for tone calibration
4. Read the reference file matching the post type
5. Choose a structure pattern and draft
6. Review: no corporate fluff, real numbers present, quotes placed strategically,
   voice matches examples
7. Show draft to user and iterate
