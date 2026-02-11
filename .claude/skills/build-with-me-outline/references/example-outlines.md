# Example Outlines

Reverse-engineered outlines from real "build with me" posts.

## Discord Backfill

**Subtype**: Project Walkthrough
**One-liner**: Migrating Q&A data from a forum into Discord using an ETL
pipeline, AI agents, and Tigris.

1. **Hook**: We have a Discord now + Answer Overflow. Here's how we solved
   backfilling it so it doesn't look empty.
2. **Reframe**: This is a dataset management / ETL problem (Extract, Transform,
   Load).
3. **The pipeline** (three named stages):
   - Extract: Scraping the forum engine (being a good internet citizen,
     User-Agent strings, using Rails .json trick, caching in Tigris)
   - Transform: HTML to Markdown, PII removal, summarization with local AI
     model, the OpenAI failure detour
   - Load: Discord webhooks, pseudo-users, generated avatars, the aesthetics
     problem
4. **The Big Import**: Running it for real, 99.9% success, wakefulness test joke
5. **Conclusion**: Making forums useful, AnswerOverflow + MCP integration

## Nomadic Compute

**Subtype**: Architecture Pattern
**One-liner**: Design AI workloads to hunt for cheap compute dynamically instead
of paying for idle GPUs.

1. **Hook**: Taco Bell infrastructure -- exciting things from boring components
2. **Fundamentals**: Compute, Network, Storage (the three pillars)
   - Egress costs as the hidden trap
   - Tigris zero-egress changes the calculus
3. **Idle storage costs more than compute**: Math showing when dynamic
   provisioning wins
4. **Dependencies and lock-in**: Strategic dependency choice, Taco Bell rules,
   how AI models become insidious dependencies
5. **Making it production-ready**: Compute/network/storage planes, pass-by-
   reference semantics, the Big Queue
6. **Code walkthrough**: ScaleToZeroProxy in Go, step by step (search →
   create → wait → proxy → slay)
7. **Conclusion**: Make your app an orchestrator of cheap compute

## Lifecycle Rules

**Subtype**: Feature Deep Dive
**One-liner**: How we implemented automatic storage tier transitions in a
globally distributed object store.

1. **Hook**: SRE koan -- "The simpler something looks, the harder it is to make
   it happen."
2. **Why care** (two scenarios with specific numbers):
   - Database backups: 120TB, $2450 → $833/mo with tiers
   - Fediverse media caches: infinitely growing folder problem
3. **How it works**: Background job, secondary index by creation time, queue-
   based transitions
4. **The hard part**: Last-Modified header semantics, global replication race
   conditions, the metadata check ordering
5. **Garren quote**: "it took me like four months"
6. **How to enable**: JSON policy document, one CLI command
7. **Conclusion**: Brief, forward-looking

## Dataset Experimentation

**Subtype**: Workflow Demonstration
**One-liner**: Using bucket forking to manage parallel experiments on an AI
training dataset.

1. **Hook**: Bucket forking = instant isolated copies, no collisions
2. **Scientific method framing**: Hypothesis → experiment → parallel timelines
3. **The dataset**: Nintendo Switch screenshots, three possible uses
4. **Fork 1** -- Data cleaning: Import, rename, snapshot, fork
5. **Fork 2** -- Caption synthesis: Few-shot prompting with local model
6. **Fork 3** -- Better captioning: Gemini-style prompts, compare with Fork 2
7. **Fork 4** -- Resize for training: Destructive operation in isolated fork
8. **Thinking with portals**: Recap of all forks and their purpose
9. **Conclusion**: Maps to experimental workflow, fork when afraid of
   destroying data

## How We Make Ty

**Subtype**: Project Walkthrough
**One-liner**: The creative process behind AI-generated blog illustrations and
the app built to streamline it.

1. **Hook**: Cover images matter for SEO, but I want them to convey meaning
2. **On Ty**: Who is Ty, animated examples
3. **The creative process**: Reduce to one sentence → three questions (What is
   there? What is it like? Where is it taking place?)
4. **Worked example**: TigrisFS → "fast" → mood board → first prompt → improved
   prompt → shippable image
5. **Introducing Tygen**: The app that automates this (Go, HTMX, OpenAI,
   Postgres, Tigris)
6. **Conclusion**: Dig into the code, it's open source

## Object Notifications

**Subtype**: Feature Deep Dive
**One-liner**: How we built event notifications for a globally distributed
object store.

1. **Hook**: Bucket notifications = inotify for object storage
2. **Use case**: Photo-sharing app with automatic processing
3. **Behind the scenes**: Global object store means multi-region changes
4. **Replication**: Last Modified timestamps, conflict resolution
5. **The Notification Hub**: Single region assignment, FoundationDB
   versionstamps, secondary index
6. **The Background Task**: Tireless worker, retry logic, cleanup
7. **Ordered events tradeoff**: Why we can't guarantee order (checking every
   region too expensive)
8. **Conclusion**: Brief wrap-up

## Bucket Forking Deep Dive

**Subtype**: Feature Deep Dive
**One-liner**: How immutable write-ahead logs and reversed timestamps enable
instant terabyte-scale bucket forking.

1. **Hook**: Koan-like primitives that lead to core lessons (three bullet
   points)
2. **Snapshots are time travel**: TODO list analogy, write-ahead logging,
   connection to ZFS and git
3. **How Tigris implements snapshots**: Single 64-bit nanosecond timestamp,
   FoundationDB keyspace layout, reversed timestamp encoding (EncodeVersion
   function)
4. **How reading works**: Newest-first ordering means you ask for "first key
   after bucket/object"
5. **Bucket forking**: Timeline metaphors, Go if-err-nil as timeline forks,
   recursive indirection for lookups
6. **Snapshots are free**: Copy-on-write, tombstones, code example showing
   fork → delete → source still intact
7. **Conclusion**: Caveats list, forward-looking

## LanceDB 101

**Subtype**: Project Walkthrough
**One-liner**: Set up a vector search database backed by Tigris for RAG
pipelines.

1. **Hook**: AI is the rage, but examples leave the details as exercises. Not
   today.
2. **Vector databases and you**: What LanceDB is, embedding models, cosine
   similarity, RAG pipeline diagram
3. **Getting Started**: Install, connect to Tigris, register embedding model,
   create schema
4. **Ingesting files**: Chunking strategy using Markdown headings, the 8191
   token limit, code walkthrough
5. **Example app**: docs-search-example repo, step-by-step setup
6. **Next steps**: Exercises left to the reader (front matter parsing, model
   integration)
