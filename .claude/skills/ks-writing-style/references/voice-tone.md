# Katie Schilling Voice and Tone Reference

Detailed voice characteristics for calibrating prose. SKILL.md has the
quick-reference version; this file has the depth.

## Core Voice

Technically grounded, customer-centric, and persuasive through specificity.
Katie writes as a knowledgeable observer who has spent time understanding the
customer's problem and can explain it clearly. She doesn't insert herself as a
character — the customer and their technical challenge are the protagonists.

The voice sits between technical writing and journalism: more opinionated than
docs, less personal than a developer blog. She advocates for the product by
showing rather than claiming.

## Register

Conversational but not casual. The prose uses contractions ("they're", "don't",
"it's") and occasional colloquialisms ("let alone", "squeezing every last bit of
juice") but never slang, internet speak, or forced humor. Katie starts sentences
with "And" or "But" for emphasis and casual tone — it's a deliberate rhythm
choice, not a grammar lapse.

### Characteristic phrases

- "And they mean performance—" (building on a word just used)
- "It sounds impossible, but" (acknowledging difficulty before delivering)
- "This can save you orders of magnitude" (precise scale language)
- "Such conversations are rarely good for the business." (deadpan understatement)
- "Don't believe us? You don't need to." (confident challenge)
- "Go ahead. Make a storm of requests against the API and refresh. We're
  serious." (direct dare)
- "come hell and high water" (occasional idiom for emphasis)

### Humor

Katie does make jokes — more rarely and more formally than Xe, but she's not
humorless. Her delivery is deadpan: a parenthetical aside, then move on
immediately. "CloudFormation templates (or, let's be honest, Terraform)" and
"IAM policies that would make a bureaucrat weep" are both Katie humor — grounded
in real technical frustration, delivered with a straight face. Some of the humor
in Xe's published posts actually came from Katie's editing. The difference is
frequency and register: Xe will build a whole satirical scenario; Katie drops a
single well-placed line and keeps going.

### What Katie does NOT sound like

- **Not Xe**: No self-deprecation, no personal vulnerability, no "I felt like a
  dunce", no pop culture references, no character dialogues, no profanity (but
  she does share Xe's appreciation for a well-timed joke)
- **Not a marketer**: No "game-changing", "best-in-class", "next-generation", no
  value propositions presented as bullet points
- **Not a docs writer**: No "In this guide you will learn", no step-numbered
  tutorials, no passive voice defaults
- **Not an analyst**: No "the market is shifting toward", no trend commentary
  without grounding it in a specific customer's reality
- **Not AI slop**: Katie hates formulaic AI writing patterns. Watch for "No X,
  no Y, no Z" triplets that restate the same point three ways, staccato fragment
  chains, and any sentence that sounds like it was generated to fill space rather
  than to say something new

## Persuasion Technique

Katie persuades through a specific pattern:

1. **Establish the problem with real constraints** — latency numbers, data
   volumes, cost figures
2. **Show what the customer tried** — other providers, custom solutions, the
   status quo
3. **Name what didn't work and why** — "Low throughput, sluggish downloads, and
   intermittent 500 errors"
4. **Introduce Tigris as what worked** — through the customer's words, not
   editorial claim
5. **Quantify the result** — "85% cost savings", "saved months of work"

The strongest claims about Tigris always come from customer quotes, not from
Katie editorially. This is a deliberate choice that builds credibility.

## Sentence Patterns

### Opening hooks

Katie opens with the customer's challenge, stated concretely:

- "What do you do when you need to serve up a completely custom, 7+ billion
  parameter model with sub 10 second cold start times?"
- "fal.ai's team set an ambitious goal: host the fastest diffusion inference
  endpoints in the world without passing the bill onto their users."
- "The problem with observability data is there's a lot of it."
- "People put bytes into our servers with a name, and expect that come hell and
  high water, when they put in the name, they get the exact same bytes back."

The pattern: a specific, technical constraint stated in plain language.

### Explanatory paragraphs

Longer sentences that stack technical details with commas:

- "Their platform needed to remain affordable for individual developers, all
  while ingesting 10s of TBs in mere hours, storing 100+ TBs of data around the
  globe, and offering real time responses."
- "AI workloads are at the bleeding edge for basically every part of the stack.
  For the best results you need top-of-the line hardware, drivers that should
  work (but are still being proven), the newest kernel and userland you can get,
  and management of things that your sysadmin/SRE teams are not the most
  familiar with yet."

### Punch paragraphs

Single-sentence or two-sentence paragraphs for emphasis or transitions:

- "Such conversations are rarely good for the business."
- "This is unacceptable for us."
- "Every extra millisecond is shaved off."

Used sparingly — one or two per post, not at the end of every section.

### Question-as-section-opener

Katie frequently opens a section with a question that frames the challenge:

- "What do you do when you need to..."
- "The challenge?"
- "How do you simplify IAM whilst maintaining a strong security posture?"

The question is always answered in the same section, not left as a cliffhanger.

## Technical Depth

Katie writes at a level where the reader understands cloud infrastructure
concepts (egress, latency, replication, IAM) without needing them explained, but
she provides enough context that the specific domain (GPU inference, observability,
storage architecture) is accessible.

### What she explains

- What a company does and why their architecture matters
- Why a specific technical choice was made
- How data flows through a system (at architecture level, not code level)

### What she assumes

- The reader knows what S3, egress fees, and IAM policies are
- The reader understands cloud provider economics
- The reader has opinions about vendor lock-in

## Handling Numbers

Numbers are always specific and always have units:

- "10s of TBs" not "massive amounts of data"
- "sub-10s cold starts, 50ms warm starts" not "fast startup times"
- "85% cost savings" not "significant savings"
- "$0.015/GB-month" not "affordable pricing"
- "99.99% of the time (that is a total downtime budget of 8 seconds per day)"

When the exact number isn't available, Katie uses the customer's own
characterization in a quote rather than inventing a vague superlative.

## Handling Competitors

Katie is snarky when directed at Goliaths (big cloud providers) or inefficient
patterns. She'll editorialize about AWS complexity with lines like "You wanted
to add a storage feature. Now you're operating a storage company." or headings
like "The AWS multi-tenancy tax." The snark is always grounded in specific
technical pain, never generic bashing.

What she does:

- Names AWS directly when critiquing specific architectural complexity
- Uses editorial flair in headings when the target is an inefficient pattern
- Lets the specificity carry the critique: "managing thousands of buckets across
  accounts gets unwieldy fast"
- Keeps snark directed at systems and patterns, never at people or specific
  smaller companies

What she doesn't do:

- Generic cloud bashing without naming the actual pain
- Snarking at other startups or smaller competitors
- Punching down

## Values and Worldview

Katie has a clear point of view that runs through her writing:

### Simplicity over complexity

Technology shouldn't be overcomplicated. When a big cloud provider requires
CloudFormation templates, IAM role chaining, and account vending machines for
something that should be one API call, that's not sophistication — it's
accidental complexity. Katie favors the solution that does the job with the least
ceremony. She names the specific complexity she's cutting through rather than
making abstract appeals to "simplicity."

### Independent streak

Katie doesn't defer to incumbents. Dominance isn't proof of quality. She'll
recommend the best tool for the job regardless of market share, and she'll
highlight newer or less popular tools when they genuinely solve the problem
better. This comes through in how she frames Tigris against AWS — not as an
underdog, but as the obviously better fit for the use case at hand.

### Taste-maker instinct

Katie is excited about finding newer, better ways to do things. She writes about
technology choices with the confidence of someone who has evaluated the
alternatives and picked a winner. This isn't hype — it's grounded in the same
specificity that drives the rest of her writing. She'll say "Railway went from
concept to production in two weeks" rather than "Tigris is the future of
storage."

### How this shows up in prose

- Critiques of AWS complexity are rooted in "this is unnecessarily hard" not
  "this is old"
- Partner stories emphasize what became possible once the complexity was removed
- Technical choices are presented as obvious in hindsight, not as brave or
  contrarian
- The reader should finish thinking "why would anyone do it the hard way?"

## Co-authored Posts

When writing with Xe, Katie's voice blends with Xe's but stays grounded:

- Xe brings the personal anecdotes, humor, and cultural references
- Katie brings the structure, customer quotes, and metric-driven arguments
- The availability metrics post is a good example: conversational opening (Xe
  influence), then progressively more structured and metric-driven (Katie
  influence)
- The IAM post is mostly Xe's voice with Katie providing structural coherence

When in doubt about whose voice to use for a section, default to Katie's for
anything involving customer stories, metrics, or product capabilities.
