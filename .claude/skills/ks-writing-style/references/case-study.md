# Case Study Post Reference

Katie's case studies follow a consistent pattern that centers the customer's
problem and lets their story drive the narrative.

## Structure

1. **Hero image** with caption
2. **QuickSummary** — 3-4 bullet items summarizing key takeaways
3. **Opening hook** — the customer's core challenge, stated concretely with real
   numbers or constraints
4. **Customer context** — what the company does, why their architecture is
   interesting (1-2 sections)
5. **The challenge** — what they needed from storage and why existing options
   didn't work
6. **The solution** — how Tigris fits into their architecture (often with a
   diagram)
7. **Results and specifics** — metrics, quotes, concrete outcomes
8. **Closing CTA** via `<InlineCta>`

## Opening Patterns

The opening paragraph should make the reader care about the customer's problem
before mentioning Tigris:

**Question hook:**
> What do you do when you need to serve up a completely custom, 7+ billion
> parameter model with sub 10 second cold start times? And without writing a
> Dockerfile or managing scaling policies yourself.

**Ambitious goal hook:**
> fal.ai's team set an ambitious goal: host the fastest diffusion inference
> endpoints in the world without passing the bill onto their users.

**Problem-shaped-data hook:**
> The problem with observability data is there's a lot of it. And most of it
> isn't useful, except for the precious picks that are actually used in debugging.

**Conceptual reframe hook:**
> Roads existed before cars. But once cars showed up, the roads had to change.

## Quote Placement

Quotes appear after the editorial paragraph that provides context. Never drop a
quote without the reader understanding what it's about.

**Good pattern:**
```
Editorial paragraph explaining what the company needed...

<BreakoutQuote username="Name" title="Title, Company" imageUrl="...">
  The customer's words about what they needed or what Tigris provided.
</BreakoutQuote>

Editorial paragraph continuing the story...
```

## Section Headings

Case study headings describe what happened, not generic categories:

**Good:**
- "Inference faster than you can type"
- "Five layers of Tigris"
- "Designing the Storage Layer to be Object Storage Native"
- "Do One Thing, and Do It Right"

**Bad:**
- "Background"
- "Solution Overview"
- "Benefits"
- "Conclusion"

## Handling "Why Tigris"

Never create a section called "Why Tigris" or "Benefits of Tigris". Instead,
weave the value into the customer's story:

- The customer tried other options → they didn't work because [specific reason]
- The customer switched to Tigris → [specific outcome with numbers]
- Customer quote confirms the value

The reader should infer "Tigris is good" from the evidence, not be told it
directly.

## Tone in Case Studies

- Admiration for the customer's technical ambition without fawning
- Specificity about their scale and constraints
- Honest about the tradeoffs they navigated
- The customer is the protagonist, Tigris is the tool that helped
