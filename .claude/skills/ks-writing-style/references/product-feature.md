# Product Feature Post Reference

Posts announcing or explaining Tigris features, APIs, or capabilities. These are
more editorial than case studies — Katie (sometimes with Xe) is making an
argument for why a feature matters.

## Structure

1. **Hero image** with caption (if applicable)
2. **Opening hook** — the problem this feature solves, stated from the user's
   perspective
3. **The pain** — what the status quo looks like (often using AWS as a foil)
4. **The feature** — what Tigris built and how it works
5. **Technical detail** — API endpoints, code examples, architecture
6. **Real usage** — how partners or users are using it (with specifics)
7. **Getting started** — short onboarding steps
8. **InlineCta**

## Opening Patterns

Feature posts open with the user's frustration or need, not with "We're excited
to announce":

**Provocative observation:**
> It should be a code smell that there are several tools for constructing least
> privilege policies, all of which require you to have overprivileged entities
> and then cut back privileges, rather than making a least privilege policy from
> the start.

**Direct value claim:**
> We're making our internal reliability and performance metrics public.

**Problem framing:**
> If you run a platform, your users probably need storage. And the moment they
> do, you're faced with a choice: build storage into your product, or tell your
> users to go set it up somewhere else.

## AWS as Foil

Katie uses AWS complexity as contrast, but does it with specific details rather
than generic bashing:

**Good:** "I can personally list eight different ways to give access to an S3
bucket; there may be more."

**Good:** "Managing thousands of buckets across accounts gets unwieldy fast."

**Bad:** "AWS is overly complex and enterprise-focused."

The specificity is the critique. Name the actual pain (IAM role chaining,
per-account bucket limits, cross-region replication) rather than labeling it.

## Code Examples

Feature posts include real API calls or code blocks:

- Keep examples copy-pasteable
- Use realistic-looking resource names (not `foo`/`bar`)
- Show the minimal example, not the comprehensive one
- Annotate with brief comments only when the code isn't self-explanatory

## Tone in Feature Posts

- More direct and opinionated than case studies
- Second-person address ("you", "your users") is the default
- Confident but not boastful — let the feature speak through its simplicity
- Acknowledge what's hard about the problem before showing the solution
