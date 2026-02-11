# Anatomy of a "Build With Me" Post

This document breaks down the structural DNA of Tigris "build with me" posts --
posts where the author walks the reader through implementing, designing, or
creating something real. These are not tutorials. They are dramatic retellings
of engineering decisions.

## The Seven Beats

Every "build with me" post follows roughly seven beats. Not all beats appear in
every post, and order can shift, but the rhythm is consistent.

### Beat 1: The Hook

Ground the reader with a relatable analogy, a bold claim, or the announcement of
something new. The hook establishes emotional stakes before any technical
content.

Examples from real posts:

- **Taco Bell analogy** (Nomadic Compute): "Taco Bell is a miracle of food
  preparation... The best designed production systems I've ever used take the
  same basic idea."
- **Direct promise** (LanceDB): "every one of those examples leaves the details
  as an exercise for the reader. Not today!"
- **Announcement + promise** (Discord Backfill): "We've got a Discord... today
  I'm going to discuss how we got there and solved one of the biggest problems."
- **Feature launch + SRE koan** (Lifecycle Rules): "The simpler something looks,
  the harder it is to make it happen."
- **Meta-commentary** (Bucket Forking Deep Dive): "One of the coolest things
  about my job is picking apart how features were implemented so I can write
  these deep dives."

The hook is NEVER "In this post, I will..." or a dry thesis statement.

### Beat 2: Why Should You Care

Before any code, establish why this problem matters to the reader. Show the
real-world scenario that motivates the work. Use concrete examples with specific
numbers when possible.

Patterns:

- **Cost scenario** (Lifecycle Rules): "After three months of this daily 0.5%
  database growth, your bucket will be storing about 120 terabytes of data,
  costing you about $2,450 per month."
- **Architecture diagram** (LanceDB): The RAG pipeline mermaid diagram showing
  where the vector DB fits.
- **Use case vignette** (Object Notifications): "Imagine you're building a
  photo-sharing app. Every time a user uploads a new picture..."
- **Scientific framing** (Dataset Experimentation): Mapping the problem to the
  scientific method -- hypothesis, experiment, parallel timelines.
- **Nobody tells you this** (Nomadic Compute): "A bunch of companies want to
  sell you inference time... but nobody really tells you how to make this
  yourself."

### Beat 3: The Thinking Process

Show HOW you thought about the problem, not just what you built. This is the
beat that separates "build with me" from a tutorial. The reader should see the
mental model forming.

Patterns:

- **Reframing** (Discord Backfill): "let's think about this from an AI dataset
  perspective. Our pipeline has three distinct steps: Extract, Transform, Load."
- **Decomposition** (Nomadic Compute): "any workload is a combination of three
  basic factors: Compute, Network, Storage."
- **Three questions** (How We Make Ty): "What is there? What is it like? Where
  is it taking place?"
- **Design constraints** (Object Notifications): "Tigris isn't just any object
  store -- it's a global object store. This means objects can be changed in
  multiple regions."
- **Koan-like primitives** (Bucket Forking Deep Dive): "Tigris implements
  snapshotting through representing time as a single 64 bit integer."

### Beat 4: The Build

Walk through the implementation step by step. Show real code, real commands,
real output. Build up progressively -- start simple, add complexity.

Key characteristics:

- **Code is real and substantial.** Not toy examples. Show actual Go structs,
  Python scripts, shell commands, API calls. Include file paths and package
  names.
- **Progressive complexity.** Each code block builds on the last. The reader
  should feel the system assembling.
- **Named concepts.** Give things memorable names: "the Big Queue", "parallel
  universes", "the big import", "pass-by-reference semantics for the cloud."
- **Intermediate results.** Show what the output looks like at each stage. If
  building a Discord migration, show the test Discord screenshot. If training a
  model, show example captions.
- **Use `<details>` for long code blocks.** Keeps the narrative flowing without
  drowning in code.

### Beat 5: The Warts

Show what went wrong, what was harder than expected, or what tradeoffs were
accepted. This is critical for authenticity and distinguishes the post from
marketing content.

Examples:

- "This test failed because I have somehow managed to write code that works
  great with llama.cpp on the Spark but results in errors using OpenAI's
  production models." (Discord Backfill)
- "With all that laid out, it sounds super easy, but it took me like four months
  to do all of that." (Lifecycle Rules, quote from Garren)
- "This forces us to make the trade off of sending events out of order." (Object
  Notifications)
- "This is good, but it's not good enough. We can do better." (How We Make Ty)
- Not all posts have a dramatic failure -- sometimes the warts are smaller
  admissions like "I didn't totally understand what went wrong" or "I didn't
  think about that at the time."

### Beat 6: The Payoff

The satisfying moment where things work. Often marked by a screenshot, a demo,
or a celebratory aside. May include a wakefulness-test joke or "et voila!"

Examples:

- "I had to double check a few times including the bog-standard wakefulness
  tests... My fingers did not go through my palm." (Discord Backfill)
- "Et voila! Run maybeSlayLoop in the background... then you have yourself
  nomadic compute." (Nomadic Compute)
- "This would be much better to train a LoRA on!" (Dataset Experimentation)
- The improved tiger image after prompt iteration (How We Make Ty)

### Beat 7: The Broader Lesson

Tie back to the hook or zoom out to a bigger principle. The conclusion should
feel earned by the journey, not tacked on.

Patterns:

- **Forward-looking**: "We're surely going to make this more elaborate in the
  future, so keep your eyes peeled!" (Lifecycle Rules)
- **Principle extraction**: "Design your production clusters to take advantage
  of very well-understood fundamentals like HTTP, queues, and object storage."
  (Nomadic Compute)
- **Call to experiment**: "See how this maps to the normal experimental
  workflow?" (Dataset Experimentation)
- **Open the code**: "Please dig into the code! It's a really simple app and
  should be more than enough to get you started." (How We Make Ty)
- **Philosophical callback**: "If at first you don't succeed by changing a
  variable... travel back in time, destroy the universe you were just in, and
  try again." (Dataset Experimentation)

## Post Subtypes

### Feature Deep Dive ("How we built X")

Focus: Internal engineering decisions, architecture diagrams, tradeoffs.
Examples: Lifecycle Rules, Object Notifications, Bucket Forking Deep Dive.
Emphasis on: Beat 3 (thinking process) and Beat 5 (warts).

### Project Walkthrough ("I built X, here's how")

Focus: End-to-end journey from problem to working solution. Examples: Discord
Backfill, How We Make Ty, LanceDB. Emphasis on: Beat 4 (the build) and Beat 6
(the payoff).

### Architecture Pattern ("Here's a pattern for X")

Focus: Generalizable design principle with enough code to be concrete. Examples:
Nomadic Compute. Emphasis on: Beat 2 (why care) and Beat 3 (thinking process).

### Workflow Demonstration ("Here's how to use X for Y")

Focus: Using Tigris features to accomplish a real task, step by step. Examples:
Dataset Experimentation. Emphasis on: Beat 4 (the build) with multiple
iterations/forks.

## Tigris Integration

Tigris should appear naturally in the story, not as a forced plug. Patterns:

- Tigris solves a specific problem in the workflow (zero egress makes X
  possible)
- Tigris features enable the core concept (bucket forking = parallel universes)
- The code uses Tigris and it just works ("plugged Tigris into it and it worked
  on the first try")
- A Tigris feature is the SUBJECT of the deep dive (lifecycle rules, object
  notifications)
