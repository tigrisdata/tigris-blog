# llm-digest — source notes

Reference document for [`index.mdx`](./index.mdx). Everything I learned building `llm-digest`, the architectural decisions, the dead ends, the live test, the line counts. Written so it can be loaded as context into Claude Cowork (or any future LLM session) and answer specific questions about the project without needing the repo open.

The repo lives at `C:\Users\Tigris Data\Desktop\llm-digest` locally. All file paths in this doc are relative to that root unless otherwise noted.

---

## 1. What `llm-digest` is

A nightly GitHub Actions cron that:

1. Reads RSS feeds listed in `config/feeds.txt`.
2. Dedupes URLs against `state.json` in the bucket.
3. Snapshots the Tigris bucket (`pre-ingest-<runId>`).
4. Mounts the bucket via `@tigrisdata/agent-shell`.
5. Runs an `@anthropic-ai/sdk` agent loop with `CLAUDE.md` as the system prompt and the seven tools defined in `scripts/lib/tools.ts`.
6. The agent calls `fetch_url` (which runs HTML through Mozilla Readability), `write_source`, `write_wiki_page`, and finally `save_digest` — all writes route through the agent-shell handle.
7. On clean return, agent-shell `flush()` atomically promotes the buffer to the bucket. On any throw, `discard()` drops the buffer; the live tree is byte-for-byte unchanged.
8. After flush: update `state.json` directly via the SDK, clear `queue.txt`, presign the digest URL, POST to Slack.

The wiki accumulates over time. Day 1 = a few pages. Month 3 = the binary-quantization page has provenance back to every paper, vendor, and benchmark that touched the topic.

---

## 2. Audience and framing

This is a **reference implementation aimed at developers evaluating the Tigris stack**. The user repositioned it mid-project from "a personal-use tool I'm building for my own reading list" to "a thing other people read to see what `@tigrisdata/storage` + `@tigrisdata/agent-shell` look like composed cleanly."

The project rule (in `CLAUDE.md` line 9, `README.md` line 24, `PLAN.md` line 13):

> Don't pitch tools — including Tigris or any others — unless they solve a real problem. If a feature is just convenient, document it as convenient. If it's load-bearing, document it as load-bearing.

`TIGRIS_FEATURES.md` is the audit. Every primitive used gets a section: what it is, what fails without it, verdict (load-bearing / convenient / depends-on-size / niche).

---

## 3. Final architecture: the three-layer sandwich

```
┌──────────────────────────────────────────────────────┐
│  LLM-wiki schema (CLAUDE.md)                         │  ← the product
│  page types, frontmatter, cross-link rules           │
└──────────────────────────────────────────────────────┘
                        ↑ writes through tools
┌──────────────────────────────────────────────────────┐
│  agent-shell (in-process JS-virtual FS)              │  ← the rollback
│  buffer in process memory; flush() atomic            │
└──────────────────────────────────────────────────────┘
                        ↑ flushes to
┌──────────────────────────────────────────────────────┐
│  Tigris (S3-compatible bucket + snapshot/fork/presign)│ ← durability
└──────────────────────────────────────────────────────┘
```

Three pieces, three jobs. The textbook agent loop in `scripts/lib/agent-loop.ts` doesn't know any of this — it calls `tool.impl(input, { shell })` and trusts the impl to do the right thing.

**Swappability**: replace any one layer without rewriting the others. Different write-back-buffer library? agent-shell's surface is small enough to wrap. Different S3-compatible store with CoW? Drop-in. Different LLM-wiki schema? Update tools.ts validators; agent-loop.ts and shell.ts don't care.

---

## 4. The full stack

| Layer | Package | Version | Role |
|---|---|---|---|
| Storage | `@tigrisdata/storage` | ^3.3.0 | Bucket I/O outside the agent loop (snapshot, presign, fork, state read/write). Module-level functions, no client object. |
| Storage layer | `@tigrisdata/agent-shell` | ^0.6.1 | JS-virtual filesystem mounted on the bucket. Tool implementations write through it. `flush()` is atomic; throw → discard. Built on `just-bash` for the shell engine. |
| LLM | `@anthropic-ai/sdk` | ^0.93.0 | The agent runner. In-process so tool impls can route through agent-shell. **Not** `@anthropic-ai/claude-code` — child process can't share the JS-virtual FS. |
| HTML cleaning | `@mozilla/readability` | ^0.6.0 | Strips nav/comments/ads/scripts from fetched HTML. Same algo as Firefox Reader View. |
| HTML parsing | `jsdom` | ^29.1.1 | Provides the DOM that Readability needs. |
| Feed parsing | `rss-parser` | ^3.13.0 | RSS/Atom → flat list of `{ url, title, publishedAt }`. |
| Validation | `zod` | ^4.4.3 | Schema validation for state.json, frontmatter, env vars, tool inputs. |
| Test | `vitest` | ^4.1.5 | All unit tests. 114 cases across 9 files. |
| Build | (none — `tsx`) | ^4.21.0 | TypeScript runs at runtime. No `dist/`, no `npm run build`. |
| Types | `@types/node` ^20.19.39, `@types/jsdom` ^28.0.1 | dev only |
| Type-check | `typescript` | ^6.0.3 | `tsc --noEmit` only. |
| Scheduler | GitHub Actions | — | Daily cron + workflow_dispatch. |
| Model | `claude-sonnet-4-6` | — | temperature 0, max 4096 tokens/turn, max 50 iterations. |

Node 20 LTS is pinned in `engines` and in both workflow YAMLs.

---

## 5. File-by-file walkthrough

### `scripts/lib/`

| File | Lines | Surface | Tested |
|---|--:|---|---|
| `shell.ts` | 187 | `mountWikiBucket(opts?)`, `withMountedBucket(fn, opts?)`, `WikiBucketHandle` interface | yes (17 cases) |
| `agent-loop.ts` | 178 | `runAgent({ shell, systemPrompt, userPrompt, tools, ... })`, `AgentError`, `IterationInfo`, `AgentClient` | yes (13 cases) |
| `tools.ts` | 452 | 7 tools: `readSource, writeSource, readWikiPage, writeWikiPage, listWiki, fetchUrl, saveDigest`. Plus `ToolError`, `ToolSpec`, `Tool` interfaces, `extractArticle` helper. | yes (27 cases) |
| `storage.ts` | 124 | `snapshot(bucket, name)`, `fork(src, dst, opts?)`, `presign(path, expiresSec)`, `StorageError` | yes (9 cases) |
| `state.ts` | 149 | `read()`, `write(state)`, `dedupe(state, candidates)`, `INITIAL_STATE`, `MAX_INGESTED_URLS=10000`, `STATE_PATH="state.json"`, `StateSchema` | yes (19 cases) |
| `feeds.ts` | 115 | `fetchAll(path, opts?)`, `parseFeedsFile(path)`, `FeedItem`, `FeedFetcher`, `DEFAULT_FEEDS_PATH="config/feeds.txt"` | yes (9 cases) |
| `share.ts` | 52 | `postToSlack(webhookUrl, text, opts?)` | yes (2 cases) |

### `scripts/` (entry points)

| File | Lines | What it does |
|---|--:|---|
| `cli.ts` | ~25 | Dispatcher. `npm run start ingest` → `ingest.main()`. `npm run start weekly-digest` → `digest.main()`. Unknown command → exit 2 with usage. |
| `ingest.ts` | 264 | The daily job. Orchestrates feeds + state + snapshot + agent loop + flush + state.write + presign + Slack. Pure helpers `isoDate`, `generateRunId`, `buildUserPrompt`, `formatSlackMessage` exported for testing. |
| `digest.ts` | 191 | The weekly roll-up. Reads last 7 daily digests, single-shot Claude call to synthesize, writes weekly digest, presigns + Slack. **No agent loop, no tools** — single output, single put. |

### `scripts/experiments/`

| File | Purpose | Committed? |
|---|---|---|
| `step6-fs-isolation.ts` | Historical record. Proved agent-shell's MountableFs is OS-isolated, which broke v0's first agent-shell-with-Claude-Code attempt. | yes (excluded from typecheck) |
| `shell-flush.ts` | Live verification of the atomic-flush claim. Writes a sentinel via `withMountedBucket`, throws, re-mounts, asserts sentinel absent. | yes |
| `byte-equal-after-throw.ts` | Step 12 (2)'s thorough version. Lists bucket pre, runs `withMountedBucket(throw)`, lists post, asserts identical. | yes |
| `.bucket-setup.ts`, `.bucket-list.ts`, `.bucket-reset.ts`, `.bucket-delete.ts` | One-off bucket admin scripts used during Step 12 verification. Dot-prefixed. | gitignored |
| `.fetch-size-check.ts` | Measured Readability's reduction without burning agent tokens. Dot-prefixed. | gitignored |
| `.verify-post-ingest.ts` | Post-run bucket inventory + 5-check pass/fail. Dot-prefixed. | gitignored |

### Top-level

| File | What it is |
|---|---|
| `CLAUDE.md` | The wiki schema. Loaded as the system prompt by the agent loop. Page types, frontmatter, cross-link rules, conflict-handling, "behaviors you must follow." |
| `README.md` | Audience-first overview. The "you don't need this if X" honesty paragraph. The runtime shape. Where to start. |
| `ARCHITECTURE.md` | The picture. ASCII diagram of repo → runner → bucket → laptop. Runtime sandwich. Data flows. The agent loop pseudocode. |
| `TIGRIS_FEATURES.md` | The honesty audit. 6 sections: Tigris-1 (bucket), Tigris-2 (snapshots), Tigris-3 (fork), Tigris-4 (presign), Shell-1 (agent-shell flush), Wiki-1 (CLAUDE.md schema). Each gets a problem / without-it / verdict. |
| `PLAN.md` | The 12-step build plan. **Status: complete** as of 2026-05-05. Sequenced steps with acceptance criteria. Boundaries section listing what's out of scope for v1. |

### `config/`

- `feeds.example.txt` — committed, sample RSS URLs for vector-search domain.
- `feeds.txt` — gitignored. User copies and edits.
- `notify.example.yml` — committed, multi-channel schema (Slack/Discord/SMTP/webhook).
- `notify.yml` — gitignored. v1 doesn't actually parse it; only `SLACK_WEBHOOK_URL` env is read.

### `.github/workflows/`

- `daily-ingest.yml` — cron `0 7 * * *`, timeout 30 min, concurrency `daily-ingest`. `npm ci && npm run start ingest`. Five secrets in env.
- `weekly-digest.yml` — cron `0 8 * * 1` (Monday 08:00 UTC after Sunday's daily). Timeout 15 min. Same secrets.
- `schema-experiment.yml` — **not present in v1**. Deferred to v2 because fork-from-snapshot only earns its place once the wiki is large.

### `docs/`

| File | Lines | Topic |
|---|--:|---|
| `01-quickstart.md` | 102 | Fork → bucket → secrets → push. Under 30 min for someone with a Tigris account. |
| `02-tigris-setup.md` | 50 | Bucket creation. **Snapshots must be enabled at creation time** — `updateBucket` has no toggle. Region picking. Smoke-test with `aws s3 ls` or `rclone`. |
| `03-github-secrets.md` | 58 | Five required secrets in a table. Common mistakes (trailing whitespace, bucket name vs URL, renaming-after-wiring). |
| `04-customizing-schema.md` | 102 | What to change in `CLAUDE.md`. Three worked examples (vector search news, ML papers, personal reading log). Update tools.ts validators when CLAUDE.md changes. |
| `05-adding-feeds.md` | 60 | Finding RSS URLs; arXiv / HN / Substack / GitHub / YouTube tips; no-RSS fallbacks (Kill the Newsletter, queue.txt). Feed-count tuning. |
| `06-snapshot-and-rollback.md` | 82 | Same-run rollback = structural (no user action). Daily snapshots = passive multi-day safety net. Manual recovery via `fork(srcBucket, recoveredName, { snapshotVersion })`. Pruning policy. |
| `07-sharing-digests.md` | 79 | Presigned URL mechanics. Default 30-day expiry. Security caveats. How to re-presign an old digest. |
| `08-anatomy-of-the-loop.md` | 222 | **The audience document.** Walks through shell.ts → agent-loop.ts → tools.ts → ingest.ts. Runtime sandwich. The two-class error split. Schema validator as load-bearing. Deliberate-failure walkthrough. "Swap any layer" framing. |

---

## 6. The seven tools

Each is a `{ spec, impl }` pair in `scripts/lib/tools.ts`. Spec is JSON Schema 2020-12 (Anthropic SDK shape). Impl takes parsed input + `{ shell }` and returns a string.

| Tool | Validates | Path constraint | Impl behavior |
|---|---|---|---|
| `read_source(path)` | path is string | must start with `sources/`, no `..` | `shell.readFile(path)` |
| `write_source(path, content)` | both strings | must start with `sources/articles/`, no `..` | `shell.mkdir(dir)` then `shell.writeFile(path, content)` |
| `read_wiki_page(path)` | path string | path under `wiki/`, no `..` | `shell.readFile("wiki/" + path)` |
| `write_wiki_page(path, frontmatter, body)` | **frontmatter via zod discriminated union on `type`** matching CLAUDE.md's four page types | path under `wiki/`, no `..` | mkdir parent, render frontmatter as YAML, write `wiki/<path>` |
| `list_wiki(prefix?)` | prefix optional | no `..` | `shell.listDir("wiki" + (prefix ? "/" + prefix : ""))` |
| `fetch_url(url)` | valid URL | n/a — no shell write | `fetch(url).text()`, then if HTML → Readability+jsdom extraction, else raw |
| `save_digest(date, body)` | YYYY-MM-DD, non-empty body | writes to `wiki/digest/<date>.md` | mkdir, writeFile, return `{ savedTo }` JSON |

`write_wiki_page`'s validator is the load-bearing one. The discriminated union:

```ts
const wikiFrontmatter = z.discriminatedUnion("type", [
  sourceSummaryFrontmatter,  // type: "source-summary", source, title, url, published, ingested
  entityFrontmatter,         // type: "entity", entity-type, created, last-updated
  conceptFrontmatter,        // type: "concept", created, last-updated
  digestFrontmatter,         // type: "digest", date, sources-ingested, ...
]);
```

Bad frontmatter → `ToolError` thrown → agent loop catches → `tool_result.is_error: true` → model retries with corrected input.

**Tool errors are recoverable; non-tool errors are not.** That's the load-bearing split in `agent-loop.ts`. `ToolError` becomes `is_error` so the model retries. Anything else propagates → `withMountedBucket` calls `discard()` → bucket unchanged.

---

## 7. CLAUDE.md schema

The system prompt loaded for every agent run. Defines:

**Folder map**:
- `sources/` — immutable raw fetched content
- `inbox/` — ad-hoc captures awaiting processing
- `wiki/` — LLM-maintained pages (the agent's output)
- `wiki/digest/` — daily digest pages, one per ingest run
- `queue.txt` — URLs added between scheduled runs
- `state.json` — runner state

**Four page types**:
1. **source-summary** at `wiki/<category>/<slug>.md` — frontmatter has `type`, `source`, `title`, `url`, `published`, `ingested`. Body sections: Claims, Evidence, Connections, Open questions.
2. **entity** at `wiki/<entity-type>/<slug>.md` — `entity-type` ∈ `person | organization | product | model | dataset | paper | place`. Body: Identity, Key facts, Timeline, Connections, Open questions.
3. **concept** at `wiki/concepts/<slug>.md` — Definition, Origin, Key claims and counterclaims, Connections, Open questions.
4. **digest** at `wiki/digest/YYYY-MM-DD.md` — Summary, Sources ingested, Pages updated, Contradictions surfaced, Recommended reads, Open questions.

**Naming conventions**: kebab-case slugs, strip articles, source-summary slugs include date prefix.

**Cross-reference rules**: every claim links to a source. Bidirectional linking enforced by tool validators. New pages must contain at least one `[[wiki-link]]` in the first paragraph (otherwise orphan).

**Conflict handling**: don't silently pick a winner. Both claims belong on the page. "Disputed" section.

**When to create vs extend**: create when entity is mentioned in 2+ sources OR concept appears in 2+ contexts. Otherwise extend.

**Schema enforcement**: tool implementations enforce schema. A `write_wiki_page` call with frontmatter that doesn't match the discriminated union throws. The throw bubbles out of `withMountedBucket`, the agent-shell buffer is dropped, the live tree is unchanged.

---

## 8. The runtime sandwich (visualized)

```
   tool calls                                    flush() / discard()
   from the model                                       ↓
        ↓                                         ┌──────────┐
   ┌──────────┐    shell.writeFile(path,body)    │  Tigris  │
   │  agent   │  ─────────────────────────────►  │  bucket  │
   │  loop    │                                   │          │
   │ (SDK)    │  ◄─────────────────────────────  │          │
   └──────────┘    shell.readFile(path)           └──────────┘
        │                                            ▲
        │                                            │ atomic
        │                                            │ promote
        ▼                                            │
   tool results                          ┌─────────────────────┐
   back to the model                     │  agent-shell        │
                                         │  (in-process buffer)│
                                         └─────────────────────┘
```

Every tool write goes into agent-shell's in-process buffer. Reads see the buffered version on top of the bucket. On `flush()`, the buffer is promoted to the bucket atomically. On `discard()`, the buffer is dropped and the bucket is byte-for-byte unchanged.

The whole rollback story is nine lines in `scripts/lib/shell.ts`:

```typescript
export async function withMountedBucket<T>(
  fn: (shell: WikiBucketHandle) => Promise<T>,
  opts: WithMountedBucketOpts = {},
): Promise<T> {
  const shell = opts.handle ?? mountWikiBucket(opts);
  try {
    const result = await fn(shell);
    await shell.flush();
    return result;
  } catch (e) {
    await shell.discard();
    throw e;
  }
}
```

---

## 9. Failure modes — what catches what

| Failure | Where it's caught | Outcome |
|---|---|---|
| Bad frontmatter (`writeWikiPage`) | `tools.ts` zod validator throws `ToolError` | agent loop surfaces as `tool_result.is_error`, model retries |
| Path traversal (any `..`) | per-tool input validator throws `ToolError` | same |
| Bad URL in `fetch_url` | zod URL validator throws `ToolError` | same |
| Non-2xx HTTP | `fetch_url` throws `ToolError` | same |
| Unknown tool name from model | `agent-loop.ts` returns `is_error` tool_result | model can correct |
| Network error mid-fetch | not a `ToolError`; propagates | `withMountedBucket.catch` → `discard()` → bucket unchanged → ingest exits 1 |
| Anthropic API error | propagates | same |
| Iteration cap (50) hit without `end_turn` | `runAgent` throws `AgentError` | same |
| Unexpected `stop_reason` | `runAgent` throws `AgentError` | same |
| `ingest.ts` post-flush errors (state.write, presign, Slack) | uncaught — propagate to `main().catch` | exit 1, **wiki already promoted** (this is documented; idempotency note in 08) |
| Snapshot creation fails before `withMountedBucket` | `storage.ts` throws `StorageError` | exit 1 before any wiki writes happen |
| Process killed mid-run | nothing — process exits, buffer is GC'd | bucket unchanged |
| Process killed during `flush()` | partial promote possible | documented in `TIGRIS_FEATURES.md` Shell-1 failure modes; daily snapshot covers it |

The load-bearing claim: **anything that throws inside `withMountedBucket` leaves the bucket byte-for-byte unchanged.** Verified live on 2026-05-05 (see §11).

---

## 10. Performance and cost

### Token reduction via Mozilla Readability

Measured on real URLs from `hnrss.org`:

| URL shape | Raw HTML | After Readability | Reduction |
|---|--:|--:|--:|
| HN discussion page | ~3.4k chars / 863 tok | 371 chars / 93 tok | 89.2% |
| arXiv abstract | 48.7k chars / 12.2k tok | 2.8k chars / 702 tok | 94.2% |
| (Real ingest, full HTML article) | ~110k tok per page | ~5k tok per page | ~95% |

Without Readability, two HN URLs blew the conversation to 224,939 input tokens by iter 2 (~$0.67 in one turn). With Readability, full 16-iter run = 28,798 input tokens total (~$0.23).

### Prompt caching

`agent-loop.ts` tags both the system prompt and the **last** tool spec with `cache_control: { type: "ephemeral" }`. Anthropic's cache key includes everything up to and including the cache breakpoint, so this caches the system + entire tools array. Across iterations of one `runAgent` the system + tools is identical, so iter 2+ reads from cache.

The conversation history (messages array) is **not** cached. That's a v2 optimization candidate — adding `cache_control` to the user-message after large fetch results would help on long runs.

### Per-iteration timing (live test)

| Iter | Tool calls | Wall time vs prev | Cumulative input | Cumulative output |
|--:|---|--:|--:|--:|
| 1 | fetch_url ×2 | — | 512 | 152 |
| 2 | fetch_url, list_wiki, write_source | +30s | 7,425 | 1,399 |
| 3 | fetch_url, list_wiki | +5s | 15,712 | 1,557 |
| 4 | write_source | +7s | 17,289 | 1,855 |
| 5–12 | various write_wiki_page | ~10–25s each | 17,819 → 25,562 | 2,814 → 8,049 |
| 13–14 | list_wiki ×4 | +3s | 27,142 | 8,228 |
| 15 | save_digest | +24s | 27,489 | 9,262 |
| 16 | end_turn | +9s | 28,798 | 9,771 |

Total wall time: **3 min 15 sec**. Total cost: **~$0.23** (sonnet-4-6 pricing: $3/M input + $15/M output).

---

## 11. Live verification (Step 12)

Verified on 2026-05-05 against bucket `llm-digest-test-step12` (now deleted; bucket was on the user's Tigris account).

### (1) Daily ingest E2E

`npm run start ingest` against the test bucket with `config/feeds.txt` containing one URL: `https://hnrss.org/newest?q=binary+quantization&count=2`.

Result: **exit 0**, 16 iterations, 8 wiki pages + 2 sources + 1 digest written, state.json updated, presigned URL generated, Slack skipped (no webhook env set).

Post-run bucket inventory (`scripts/experiments/.verify-post-ingest.ts` — gitignored helper):
- `state.json`: 1 file, lastRunStatus: "ok", ingestedUrls: 2, snapshots: 1
- `wiki/`: 9 files (8 entity/concept/source-summary pages + 1 digest)
- `sources/`: 2 files
- `queue.txt`: 1 file (cleared post-flush)
- **No `staging/` orphans** — confirmed agent-shell handles the buffering, not a residual staging-then-promote pattern

### (2a) `shell-flush.ts` atomicity verification

Script writes a sentinel inside `withMountedBucket`, throws, re-mounts, lists `experiments/` prefix.

```
PASS: sentinel absent after throw — atomic-flush rollback verified.
```

### (2b) `byte-equal-after-throw.ts` thorough verification

Lists bucket pre (13 objects). Runs `withMountedBucket` with synthetic fn that writes 3 files then throws. Lists post (13 objects). Compares names + sizes + lastModified.

```
PASS: bucket listings byte-for-byte identical — discard semantics held.
```

### (3) Cold-read of docs

Re-read `01-quickstart.md` and `08-anatomy-of-the-loop.md` from a fresh-checkout perspective. Found two stale claims:
1. Quickstart step 3 told user to edit `notify.yml`, but ingest.ts doesn't parse it (only `SLACK_WEBHOOK_URL` env). Fixed.
2. 08-anatomy claimed "roughly 300 lines of TypeScript." Actual ~1700. Fixed to honest count.

Committed at `06d78be`.

### Total verification cost

- First abandoned run (no Readability): ~$0.70 wasted (killed before completion)
- Successful run: ~$0.23
- **Total: ~$0.93** including all the bucket admin / size-check / verify scripts

---

## 12. Architectural journey — three iterations

Important context: the project went through three architectural iterations, each driven by a real bug. The git history is a guide.

### v0 (PLAN.md original): agent-shell + Claude Code subprocess

Original design: scheduled cron runs headless `@anthropic-ai/claude-code` (`-p` mode) inside `withShell` (agent-shell wrapper), writes the wiki, calls `flush()` on success or skips flush on critical lint failure.

Worked on paper. Broke at Step 6 (`scripts/lib/agent.ts`) when I asked the question "are Claude Code's writes actually visible to agent-shell's flush?"

Wrote `scripts/experiments/step6-fs-isolation.ts` to verify. Result: **agent-shell's MountableFs is fully isolated from the OS filesystem.** Claude Code in `-p` mode is a child process; its writes go to the OS FS; agent-shell can't see them; `flush()` doesn't include them; the entire rollback story breaks.

Commit: `cc25818 chore(step-6): pre-impl experiment — agent-shell FS is isolated from OS`

### v1: drop agent-shell, staging-then-promote on @tigrisdata/storage

Picked the cleanest fix: drop agent-shell entirely, use `@tigrisdata/storage` SDK directly, implement atomic-or-nothing as a staging-then-promote pattern in user code. Each run writes to `staging/<runId>/`; on lint pass, server-side rename to live via `updateObject(path, { key: livePath })`; on lint fail, leave staging as garbage; next run's first action is `gcStagingPrefixes()` to clean up.

About 30 lines in `scripts/lib/storage.ts` plus a `gcStagingPrefixes` helper.

Commit: `efff733 refactor(planning): replace agent-shell with Tigris SDK + staging-then-promote`

Worked. Got through Steps 3–8 (rebuilt storage.ts, state.ts, kept feeds.ts, wrote shell.ts no longer). The architecture was honest, the rollback property was preserved, the line count was reasonable.

### v2 (current): agent-shell back + `@anthropic-ai/sdk` directly

Mid-build the user reframed the audience ("this is a reference implementation for the Tigris stack") and made a different architectural call:

- Drop `@anthropic-ai/claude-code` entirely.
- Use `@anthropic-ai/sdk` directly with a custom agent loop **in-process**.
- Bring agent-shell back as the rollback layer — now that the agent runs in-process, tool implementations CAN route through agent-shell's buffer.
- Drop staging-then-promote — agent-shell's flush gives the same property structurally, no GC needed in user code.

Commit: `c6dda84 refactor(redesign): switch runner to @anthropic-ai/sdk + agent-shell`

This is the version that lives in the repo today. The journey through v1 wasn't wasted — staging-then-promote works fine if you don't have agent-shell. Specifically, if a project HAS to use a child-process LLM runner (Claude Code, a subprocess wrapper, anything that writes to OS FS), staging-then-promote is the right fallback.

The tradeoff in plain terms:
- v1 (staging): ~30 lines of user-code pattern, GC of orphaned prefixes, a `staging/` namespace in the bucket.
- v2 (agent-shell): structural rollback for free, no staging namespace, but constrained to in-process LLM runners.

For a reference implementation aimed at "what does composing Tigris + agent-shell + the wiki pattern look like," v2 is the right call. For a project where Claude Code's slash-command parity matters, v1's staging-then-promote is the right call.

---

## 13. Things found during live testing

Step 12's "run it for real against a real bucket" surfaced two real bugs in the as-built v2:

### Bug 1: silent agent loop

`runAgent` had no per-iteration observability. The first attempted ingest disappeared into the loop for 16 minutes with no signal. From outside, "stuck on a hung HTTP call," "grinding through 50 slow API calls," and "crashed silently" looked identical.

Fix: added `onIteration(info)` to `RunAgentOpts`. Called after each API response, before tool dispatch. `IterationInfo` carries iteration number, stop_reason, tool names invoked, per-iteration + cumulative token counts. `ingest.ts` wires it to one-line stderr progress per turn:

```
iter 1 stop=tool_use tools=[fetch_url, fetch_url] in=512 out=152
iter 2 stop=tool_use tools=[fetch_url, list_wiki, write_source] in=7425 out=1399
...
```

This is the kind of fix that's only obvious after a run goes dark. The tests verify the callback fires at the right point with the right info.

### Bug 2: token blowout in `fetch_url`

First version returned `await response.text()` for everything. For HN article URLs, that's 100k+ tokens of HTML mostly comprising comment threads, nav, scripts. By iter 2 the conversation was 224,939 input tokens (~$0.67 in one turn, projected $5+ for the full run).

Fix: wrap HTML in Mozilla Readability + jsdom inside `fetchUrl.impl`. Strips nav/footer/aside/scripts/styles, returns just article text. Non-HTML content-types pass through unchanged.

Real-world reduction: 89-94% on representative URLs. Same 2-URL ingest after the fix: 28,798 input tokens total over 16 iters (vs 224,939 in iter 2 alone before). Cost: $0.23 vs projected $5+.

Both fixes committed at `b35badb feat(step-12): live-validation hardening — Readability, onIteration, byte-equal verifier`.

### Gotcha: bucket snapshot toggle

`createBucketSnapshot` fails with "Unable to create bucket snapshot" if the bucket wasn't created with `enableSnapshot: true`. The `updateBucket` SDK method does NOT have a snapshot toggle, so a bucket created without it has to be deleted and recreated. Tigris also has a name-recycling delay after deletion (couple of minutes), so the recreate has to use a different name.

Documented in `docs/02-tigris-setup.md`.

---

## 14. Build commands

```bash
npm install                 # install deps
npm run start ingest        # run daily-ingest job
npm run start weekly-digest # run weekly roll-up
npm test                    # vitest run
npm run typecheck           # tsc --noEmit
```

Required env vars (set as GitHub secrets in production, or in local `.env` for testing):
- `ANTHROPIC_API_KEY`
- `TIGRIS_STORAGE_ACCESS_KEY_ID`
- `TIGRIS_STORAGE_SECRET_ACCESS_KEY`
- `TIGRIS_STORAGE_BUCKET`
- `SLACK_WEBHOOK_URL` (optional — ingest skips Slack delivery if unset)
- `TIGRIS_STORAGE_ENDPOINT` (optional override; default `https://t3.storage.dev`)

For the experiment scripts (e.g., `shell-flush.ts`, `byte-equal-after-throw.ts`):

```bash
set -a; source .env; set +a
npx tsx scripts/experiments/shell-flush.ts          # exit 0=PASS, 1=FAIL, 2=SKIP
npx tsx scripts/experiments/byte-equal-after-throw.ts
```

---

## 15. Commit history (annotated)

In reverse chronological order on `main`:

| SHA | Title | What it did |
|---|---|---|
| `f09a177` | `chore(plan): Status: complete after live verification` | PLAN.md status flipped after all 3 Step 12 checks passed |
| `b35badb` | `feat(step-12): live-validation hardening — Readability, onIteration, byte-equal verifier` | Mozilla Readability in fetch_url, onIteration hook in runAgent, byte-equal-after-throw experiment, doc updates |
| `06d78be` | `docs(step-12): cold-read corrections to 01 + 08 + README` | Fixed two stale claims found in cold read |
| `349b307` | `docs(step-11): fill in 02-08 + update 01 + docs/README index` | All seven supporting docs written, especially 08-anatomy-of-the-loop.md |
| `f7088e9` | `feat(step-10): workflows + digest.ts + cli dispatch` | Daily and weekly workflow YAMLs filled in, weekly roll-up script, cli.ts dispatcher |
| `7b6df96` | `feat(step-9): scripts/ingest.ts — daily ingest orchestration` | The main job + share.ts Slack helper |
| `1905bbe` | `feat(step-8): scripts/lib/agent-loop.ts — textbook SDK agent loop` | Custom SDK loop with prompt caching, two-class error split |
| `5ce6e42` | `feat(step-7): scripts/lib/tools.ts — Anthropic-SDK tool defs + impls` | All 7 tools with zod input validation, frontmatter discriminated union |
| `[step-6]` | `feat(step-6): scripts/lib/shell.ts — agent-shell mount + withMountedBucket` | The lifecycle wrapper. Plus shell-flush.ts experiment. |
| `(feeds)` | `feat(step-5): scripts/lib/feeds.ts — read feeds.txt, fetch RSS with retry` | RSS parser with backoff, retry, skip-on-failure |
| `5d92ce9` | `feat(step-4): scripts/lib/state.ts — state.json on @tigrisdata/storage` | head + get + put for state metadata |
| `415a481` | `feat(step-3): scripts/lib/storage.ts — snapshot + fork + presign only` | The trimmed v2 storage wrapper |
| `80da95d` | `feat(step-2): align deps with redesign — SDK + agent-shell` | Dropped @anthropic-ai/claude-code, added @anthropic-ai/sdk + @tigrisdata/agent-shell |
| `c6dda84` | `refactor(redesign): switch runner to @anthropic-ai/sdk + agent-shell` | The big architectural pivot from v1 to v2 |
| `(history)` | various step-3 / step-4 / step-5 commits from v1 | Now obsolete — code was rewritten in v2 |
| `efff733` | `refactor(planning): replace agent-shell with Tigris SDK + staging-then-promote` | v0 → v1 pivot |
| `cc25818` | `chore(step-6): pre-impl experiment — agent-shell FS is isolated from OS` | The experiment that proved v0's design broken |

Total file count at HEAD:
- `scripts/lib/`: 7 production .ts + 7 .test.ts (one per module)
- `scripts/`: 3 entry-point .ts (cli, ingest, digest) + 2 .test.ts (ingest, digest)
- `scripts/experiments/`: 3 committed (.ts) + 6 gitignored (dot-prefix .ts)
- `docs/`: 8 markdown
- `config/`: 2 example files
- Top-level: README, ARCHITECTURE, CLAUDE, PLAN, TIGRIS_FEATURES, package.json, tsconfig.json, .gitignore

114 unit tests across 9 files, all passing. `tsc --noEmit` clean.

---

## 16. Open issues / v2 work

Documented in PLAN.md "Boundaries — do not do these" section. Listed here for completeness:

- **`schema-experiment.yml` workflow** — deferred. Fork-from-snapshot is a Tigris-3 feature that earns its place once the wiki is large enough that copying hurts. The `fork()` primitive is in storage.ts for the manual-recovery path; the workflow itself isn't built.
- **`docs/09-schema-experiments.md`** — deferred along with the workflow.
- **Web UI for browsing the wiki** — `rclone mount` + Obsidian covers this.
- **Multi-user write coordination** — v1 is single-writer. Multi-writer needs per-writer mount handles + merge at flush time.
- **Vector search / embeddings** — explicitly not the design; if you need this, you've outgrown the wiki pattern.
- **Custom auth for digest URLs** — presigned URLs with expiry are sufficient.
- **Real-time ingest** — daily cron + queue.txt is the design.
- **A writer agent** that drafts new artifacts FROM the wiki — separate piece of work; out of scope.

Likely v2 candidates that would actually pay off:
- **Message-history caching** — currently only system + tools are cached. Adding `cache_control` to user messages after large fetch results would cut the per-iteration cost on long runs further.
- **Per-feed cost tracking** — emit feed-level cost in `ingest.done` so the user can see which feeds are expensive and trim.
- **Batch fetches** — the agent currently calls `fetch_url` per URL even when they could be parallel. The model already does this in iter 1 of the test run, but it's not enforced.
- **Inbound webhook for `queue.txt`** — phone-friendly capture. Simple Cloudflare Worker.

---

## 17. Notes for evaluators / Cowork

If you're using this doc to brief Claude Cowork or another agent on the project:

**The interesting parts of the codebase**, in order:
1. `scripts/lib/shell.ts` (187 lines) — the rollback wrapper. Read first. Nine-line `withMountedBucket`.
2. `scripts/lib/agent-loop.ts` (178 lines) — textbook SDK loop with the two-class error split.
3. `scripts/lib/tools.ts` (452 lines, longest) — 7 tools, the frontmatter discriminated union, the Readability extraction.
4. `scripts/ingest.ts` (264 lines) — orchestration.
5. `CLAUDE.md` — the schema the model follows.

**The interesting parts of the docs**:
1. `TIGRIS_FEATURES.md` — the honesty audit. Each Tigris feature gets a verdict.
2. `docs/08-anatomy-of-the-loop.md` — code walkthrough for evaluators.
3. `ARCHITECTURE.md` — the picture.

**If you want to verify a claim**:
- "Atomicity holds": run `scripts/experiments/shell-flush.ts` against any test bucket. PASS = sentinel absent after throw.
- "Bucket bytes are equal pre/post a thrown run": run `scripts/experiments/byte-equal-after-throw.ts`.
- "Readability cuts tokens": there's no committed script for this (it was a `.fetch-size-check.ts` gitignored helper), but the math is in §10 above.
- "16-iter ingest costs $0.23": run a real ingest against a test bucket. Numbers above are reproducible; the test feeds in `config/feeds.example.txt` work.

**If you want to break it**:
- Edit any `tools.ts` validator to throw on a synthetic input. The agent loop will surface as `is_error`; the model will retry; if the retry fails too, the iteration cap eventually fires; `withMountedBucket` discards; bucket unchanged. Verifiable end-to-end.
- Inject a network failure (kill the process during a tool call). Same outcome — buffer abandoned, bucket unchanged.
- Provide bad credentials. `ingest.ts` env validation catches this at startup with a clear ZodError.

**If you want to change the schema**:
- Edit `CLAUDE.md` (the page types, frontmatter fields, body sections).
- Edit `scripts/lib/tools.ts` to mirror the changes in the zod validators.
- Run `npm test` — schema tests in `tools.test.ts` will tell you what doesn't match.
- Worked examples in `docs/04-customizing-schema.md`.

**Things that will not work**:
- Adding `@anthropic-ai/claude-code` back as the runner. Its writes go to OS FS, not the agent-shell buffer. The whole rollback story breaks. See commit `cc25818`'s body for details.
- Adding a `staging/<runId>/` prefix in user code. agent-shell's flush already gives you the same property; reinventing the staging pattern alongside agent-shell is double work.
- Switching to a non-S3-compatible storage. The Tigris SDK calls (snapshot, fork, presign) are S3-API-style; a different store would need its own primitives.

---

## 18. Quick reference — facts to know

- **Project root**: `C:\Users\Tigris Data\Desktop\llm-digest`
- **Total TypeScript**: ~1700 lines (SDK code) + ~1900 (tests, experiments) = ~3600 lines all-in
- **Total YAML**: ~80 lines across 2 workflow files
- **Test suite**: 114 cases, 9 files, ~700ms run time
- **Default model**: `claude-sonnet-4-6`
- **Default temperature**: 0
- **Default max_tokens per turn**: 4096
- **Default iteration cap**: 50
- **Default presign expiry**: 30 days (`30 * 86400` sec)
- **Default Tigris endpoint**: `https://t3.storage.dev`
- **Mount point inside agent-shell**: `/workspace`
- **State path**: `state.json` (bucket root)
- **Queue path**: `queue.txt` (bucket root)
- **MAX_INGESTED_URLS**: 10,000 (cap on `state.ingestedUrls`)
- **Wiki frontmatter types**: `source-summary | entity | concept | digest`
- **Entity types**: `person | organization | product | model | dataset | paper | place`
- **Workflow timeout**: 30 min daily, 15 min weekly
- **Cron**: `0 7 * * *` (daily 07:00 UTC), `0 8 * * 1` (Monday 08:00 UTC weekly)
- **Required env (5)**: ANTHROPIC_API_KEY, TIGRIS_STORAGE_ACCESS_KEY_ID, TIGRIS_STORAGE_SECRET_ACCESS_KEY, TIGRIS_STORAGE_BUCKET, SLACK_WEBHOOK_URL
- **Live test cost**: $0.23 for one 16-iteration run
- **Live test wall time**: 3 min 15 sec
- **Live test result**: 8 wiki pages + 2 sources + 1 digest, atomic flush, byte-equal-after-throw verified

---

## 19. The minimum-viable alternative

For honesty about what this project deliberately is *not*:

The minimum-viable version of "Claude reads my RSS and posts a digest to Slack" is about 30 lines of code, no Tigris, no agent-shell, no wiki schema. Roughly:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import Parser from "rss-parser";

const parser = new Parser();
const client = new Anthropic();
const feed = await parser.parseURL("https://hnrss.org/best");
const summary = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  messages: [{ role: "user", content: `Summarize: ${feed.items.map(i => i.title).join("\n")}` }],
});
await fetch(process.env.SLACK_WEBHOOK_URL, {
  method: "POST",
  body: JSON.stringify({ text: summary.content[0].text }),
});
```

This is fine. You can build it in an afternoon.

llm-digest is not that. It's the version where:

- **The wiki accumulates, doesn't repeat.** Karpathy's compile-time-not-query-time pattern. Month 3 the system is more useful than month 1 because the wiki is denser, not just because more days have passed.
- **The agent's writes are atomic.** A nightly run that crashes halfway never leaves a half-edited wiki. Either yesterday's wiki or today's complete one. No mush.
- **Multi-day rollback exists.** If the wiki drifts in a way you only notice three days later, daily snapshots let you walk back.
- **The architectural commitments are written down** (`TIGRIS_FEATURES.md`) and audited honestly. No marketing-language load-bearing claims.

If you want the minimum-viable version, do that. If you want what `llm-digest` is, this doc and the repo show you the shape.

---

*Last updated: 2026-05-05. PLAN.md `Status: complete`.*
