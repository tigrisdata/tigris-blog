# Immutable Agent — Migration Plan

Pivot from "ship a package + a demo" to "ship a single reference
implementation." Consolidate `tigrisdata/agent-forks` (the package) and
`tigrisdata/mastra-tigris-demo` (the demo) into one repo:
`tigrisdata/immutable-agent`. The "shovel" logic that was in `agent-forks`
moves inside the demo as `src/lib/`. Builders clone the repo, learn the
pattern, fork to customize. No npm package is published.

This plan is for Claude Code to execute. It's self-contained — do not
assume context from any prior conversation.

---

## Why this pivot

The pattern (per-session forks + validator + promote/quarantine) isn't
stable enough to commit to a v0.1 npm API. Shipping it as a reference
implementation lets the API harden through real use, then a package can
be extracted later if there's demand. A single repo also gives the
launch a single artifact to point at, simpler co-marketing with Mastra,
and lower maintenance overhead.

The blog post that announces this is at
`tigris-blog/blog/2026-04-30-immutable-agent/index.mdx`. It currently
references `@tigrisdata/agent-forks` as a package; that needs to change
to reference this repo as a reference implementation.

---

## Scope

**Source repos (existing on disk):**

- `C:\Users\Tigris Data\Documents\GitHub\tigrisdata-agent-forks\` — the
  package source. Has `src/`, `tests/`, `examples/`, `package.json`, etc.
  All custom code that wraps `@tigrisdata/agent-kit` lives here.
- `C:\Users\Tigris Data\Documents\GitHub\mastra-tigris-demo\` — the demo.
  Has `src/agents/`, `src/tools/`, `src/runs/`, `src/validators/`,
  `data/seed-docs/` (including `poison.md`), `scripts/`.

**Target repo (to create):**

- `C:\Users\Tigris Data\Documents\GitHub\immutable-agent\` — the
  consolidated reference implementation.

**Other artifacts to update:**

- `C:\Users\Tigris Data\Documents\GitHub\tigris-blog\blog\2026-04-30-immutable-agent\index.mdx`
  — the launch blog. Currently references `@tigrisdata/agent-forks` as a
  package. Update to reference the demo repo.
- `C:\Users\Tigris Data\Documents\GitHub\skills\skills\mastra-agents\SKILL.md`
  — the AI assistant skill. Currently references `@tigrisdata/mastra`
  (older name) and the orchestrator pattern. Update to reference
  `immutable-agent` and the in-repo pattern.

---

## Settled (do not re-decide)

| Decision | Choice |
|---|---|
| Repo name | `immutable-agent` |
| Repo location | `C:\Users\Tigris Data\Documents\GitHub\immutable-agent\` |
| Eventual GitHub URL | `github.com/tigrisdata/immutable-agent` |
| Type | Reference implementation, not an npm package. No `npm publish`. |
| Underlying SDKs | `@tigrisdata/agent-kit`, `@tigrisdata/storage`, `@mastra/core` |
| Custom code lives at | `src/lib/` (was `src/` in `agent-forks`) |
| Demo code lives at | `src/agents/`, `src/tools/`, `src/runs/`, `src/validators/`, `data/`, `scripts/` |
| LLM provider | OpenAI (the demo's existing choice) |
| Mastra adapter exposed as | `src/lib/mastra/` (importable as `./lib/mastra` from demo code) |
| Old `agent-forks` repo | Archived after migration. Optionally a `README.md` redirect points to `immutable-agent`. |
| Old `mastra-tigris-demo` repo | Archived after migration. |

---

## Open questions — ask the user before starting

1. **Has the existing `tigrisdata-agent-forks` code been verified to
   work end-to-end?** Run `npm install && npm test` in
   `tigrisdata-agent-forks/` first. If tests pass, the migration is
   straightforward source-copying. If tests fail, fix the failing tests
   first or surface the issues to the user before continuing.

2. **Has `mastra-tigris-demo` been verified to work end-to-end?** Same
   check: `npm install && npm test` (if tests exist) and
   `npm run seed && npm run dev` to confirm the demo flow runs against a
   real Tigris account.

3. **Does Agent Kit currently expose `promote` and `quarantine`?** This
   affects whether the migrated `src/lib/promote.ts` and
   `src/lib/quarantine.ts` use Agent Kit primitives directly or stay as
   inline implementations. Read `node_modules/@tigrisdata/agent-kit/dist/`
   in `tigrisdata-agent-forks` to confirm. *Default if unspecified: keep
   them inline, exactly as they currently are in `agent-forks`.*

4. **Should this plan also delete the old repos, or just stop touching
   them?** *Default if unspecified: leave the old folders on disk. The
   user can archive on GitHub manually.*

If any of these turn up surprises that change the migration shape, stop
and ask the user before continuing.

---

## Verify before writing code

Before executing the migration, confirm these things in the source repos:

1. `tigrisdata-agent-forks/package.json` — note the dependencies and dev
   dependencies. The new repo will need most of them.
2. `tigrisdata-agent-forks/src/` — confirm the file layout matches the
   expected structure: `session.ts`, `promote.ts`, `quarantine.ts`,
   `types.ts`, `index.ts`, `validators/`, `mastra/`. If anything is
   missing or differently named, adjust the migration plan inline.
3. `mastra-tigris-demo/package.json` — note the dependencies. Should be
   `@mastra/core`, `@mastra/memory`, `@ai-sdk/openai`, `zod`, `dotenv`,
   plus the import that points at `@tigrisdata/agent-forks/mastra`
   (which will change to a relative import).
4. `mastra-tigris-demo/src/` — confirm the layout: `agents/`, `tools/`,
   `runs/`, `validators/`. Same with `data/seed-docs/` (must include
   `poison.md`) and `scripts/`.

Document any deviations in a top-of-file comment in the new repo's
`README.md` so future maintainers can trace decisions.

---

## Target file layout

```
immutable-agent/
├── README.md
├── LICENSE                          # MIT
├── package.json                     # Demo deps; no npm publish config
├── tsconfig.json
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml                   # Run tests on push (skip integration without creds)
│
├── src/
│   ├── lib/                         # Migrated from tigrisdata-agent-forks/src/
│   │   ├── index.ts                 # Re-exports for the demo's internal use
│   │   ├── session.ts               # TigrisSession class
│   │   ├── promote.ts               # promote() logic
│   │   ├── quarantine.ts            # quarantine() + registry
│   │   ├── types.ts                 # shared types
│   │   ├── validators/
│   │   │   ├── canary.ts
│   │   │   ├── instruction-leak.ts
│   │   │   ├── compose.ts
│   │   │   └── corpus/
│   │   │       └── instruction-leak-patterns.json
│   │   └── mastra/                  # Mastra adapter (was @tigrisdata/agent-forks/mastra)
│   │       ├── index.ts
│   │       ├── with-session.ts
│   │       └── bridge.ts
│   │
│   ├── agents/                      # Migrated from mastra-tigris-demo/src/agents/
│   │   └── support-agent.ts
│   ├── tools/                       # Migrated from mastra-tigris-demo/src/tools/
│   │   ├── append-note.ts
│   │   └── search-docs.ts
│   ├── runs/                        # Migrated from mastra-tigris-demo/src/runs/
│   │   └── handle-customer.ts
│   ├── validators/                  # Demo-specific canaries
│   │   └── canary-set.ts
│   └── mastra/
│       └── index.ts                 # Mastra app entry (new)
│
├── data/
│   └── seed-docs/                   # Migrated from mastra-tigris-demo/data/seed-docs/
│       ├── pricing.md
│       ├── regions.md
│       ├── support-hours.md
│       └── poison.md                # The adversarial doc
│
├── scripts/
│   ├── seed.ts                      # Seed the source bucket with seed-docs/
│   ├── clean.ts                     # Tear down all forks/quarantines
│   ├── inspect-quarantine.ts        # NEW: browse a quarantined fork interactively
│   └── verify-setup.ts              # NEW: smoke test for env + Tigris reachability
│
├── examples/
│   ├── basic-session.ts             # Migrated from agent-forks/examples/
│   └── manual-session.ts            # Migrated from agent-forks/examples/
│
└── tests/
    ├── unit/                        # Migrated from agent-forks/tests/unit/
    │   ├── session.test.ts
    │   ├── promote.test.ts
    │   ├── quarantine.test.ts
    │   ├── validators.test.ts
    │   └── with-session.test.ts
    └── integration/                 # Migrated from agent-forks/tests/integration/
        ├── roundtrip.test.ts
        ├── validators.test.ts
        ├── wrapper.test.ts
        └── poison-flow.test.ts      # NEW: end-to-end demo scenario test
```

---

## Phase 0 — Bootstrap and verify (~30 min)

1. Confirm `tigrisdata-agent-forks` and `mastra-tigris-demo` exist at the
   paths above. If either is missing, stop and tell the user.
2. Run `npm install` in each. Confirm they install cleanly.
3. Run `npm test` in `tigrisdata-agent-forks/`. If unit tests pass,
   continue. If they fail, surface the failures to the user — they may
   indicate the migrated code needs fixing before consolidation.
4. Run `npm run seed && npm run dev` in `mastra-tigris-demo/` if a real
   Tigris account is configured. Confirm the demo runs end to end. If
   not configured, skip; the integration tests in Phase 5 will surface
   any breakage.
5. Read both `package.json` files and capture the union of dependencies
   needed for `immutable-agent/package.json`.

**Acceptance:** Both source repos build and (if creds are configured)
their tests pass. List of merged deps is captured.

**Gate:** If anything is broken in the source repos, stop and ask the
user how to proceed. Don't migrate broken code.

---

## Phase 1 — Create the new repo skeleton (~30 min)

1. Create the directory:
   `C:\Users\Tigris Data\Documents\GitHub\immutable-agent\`
2. Initialize as a git repo: `git init`
3. Create `package.json` with:
   - `name`: `immutable-agent`
   - `version`: `0.1.0`
   - `private`: `true` (no npm publish)
   - Merged deps from both source repos. Notable inclusions:
     - `@tigrisdata/agent-kit`, `@tigrisdata/storage`, `@tigrisdata/iam`
     - `@mastra/core`, `@mastra/memory`, `@mastra/libsql`
     - `@ai-sdk/openai`, `ai`
     - `zod`, `dotenv`
   - DevDeps:
     - `tsx`, `vitest`, `typescript`, `@types/node`
4. Create `tsconfig.json` matching the more permissive of the two source
   `tsconfig.json` files.
5. Create `.gitignore` covering: `node_modules/`, `.env`, `.env.local`,
   `dist/`, `*.log`, `.DS_Store`.
6. Create `.env.example` listing required env vars:
   - `TIGRIS_STORAGE_ACCESS_KEY_ID`
   - `TIGRIS_STORAGE_SECRET_ACCESS_KEY`
   - `OPENAI_API_KEY`
   - `TIGRIS_KNOWLEDGE_BUCKET` (or whatever the demo uses)
7. Create `LICENSE` (MIT).
8. Create skeleton `README.md` — title only. Full content comes in Phase 6.
9. Run `npm install` to confirm the merged deps resolve.

**Acceptance:** `immutable-agent/` exists with a working `package.json`
that installs cleanly. `tsc --noEmit` passes on a stub file.

---

## Phase 2 — Migrate the `agent-forks` source as `src/lib/` (~1 hour)

1. Copy the entire contents of `tigrisdata-agent-forks/src/` into
   `immutable-agent/src/lib/`. Preserve subdirectory structure.
2. Copy `tigrisdata-agent-forks/src/validators/corpus/` recursively.
3. Update `src/lib/index.ts`:
   - Re-export the public surface used by the demo: `TigrisSession`,
     `withTigrisSession`, validator helpers, types
   - This is now an internal-to-repo export, not a published package
4. Update imports inside `src/lib/`:
   - Any imports that referenced `@tigrisdata/agent-forks/...` (there
     shouldn't be any, but check) should become relative paths
   - Any imports that referenced `@tigrisdata/agent-forks/mastra` should
     become `./mastra` (relative)
5. Run `tsc --noEmit` from `immutable-agent/`. Fix any import errors.
6. Run the migrated unit tests if they were copied: `npm test`. They
   should pass.

**Acceptance:** All `agent-forks` source files exist under `src/lib/`,
type-check clean, and unit tests pass.

---

## Phase 3 — Migrate the demo content (~1 hour)

1. Copy these from `mastra-tigris-demo/` to `immutable-agent/`:
   - `src/agents/` → `src/agents/`
   - `src/tools/` → `src/tools/`
   - `src/runs/` → `src/runs/`
   - `src/validators/` → `src/validators/`
   - `data/seed-docs/` → `data/seed-docs/`
   - `scripts/seed.ts` → `scripts/seed.ts`
   - `scripts/clean.ts` → `scripts/clean.ts`
2. Update imports in the migrated demo files:
   - `import { withTigrisSession } from "@tigrisdata/agent-forks/mastra"`
     → `import { withTigrisSession } from "../lib/mastra"`
   - `import { canaryQueries } from "@tigrisdata/agent-forks/validators"`
     → `import { canaryQueries } from "../lib/validators/canary"`
   - Adjust relative paths based on where the importing file lives
3. Add `src/mastra/index.ts` — Mastra app entry point that exports the
   configured `Mastra` instance with the support agent registered. This
   may already exist in `mastra-tigris-demo`; if so, copy and adjust
   imports.
4. Run `tsc --noEmit`. Fix any remaining import errors.

**Acceptance:** All demo files exist in `src/`, all imports resolve to
`src/lib/...` or other in-repo paths, no references to
`@tigrisdata/agent-forks` remain anywhere in the codebase.

**Gate:** Run `grep -r "@tigrisdata/agent-forks" src/ scripts/ tests/`.
This should return zero matches. If anything matches, fix before
proceeding.

---

## Phase 4 — Migrate tests and add the poison-flow test (~1 hour)

1. Copy `tigrisdata-agent-forks/tests/unit/` → `immutable-agent/tests/unit/`
2. Copy `tigrisdata-agent-forks/tests/integration/` → `immutable-agent/tests/integration/`
3. Update test imports same as Phase 2/3.
4. Create `tests/integration/poison-flow.test.ts`:
   - Sets up a fresh source bucket with seed-docs/
   - Runs the demo's `handle-customer.ts` against a clean session — verifies the agent gives the correct pricing answer
   - Ingests `poison.md` into the source via the orchestrator
   - Re-runs `handle-customer.ts` — verifies the validator catches the contradiction and the fork is quarantined
   - Verifies the source bucket's `pricing.md` content is unchanged
   - Verifies the quarantine bucket exists and contains the poisoned content
   - Tears down all created buckets at the end
5. Run `npm test`. All unit tests should pass. Integration tests pass if
   Tigris credentials are configured; otherwise skip with a `console.warn`.

**Acceptance:** Unit tests deterministically pass. Integration tests
pass against a real Tigris account, including the new poison-flow test.

---

## Phase 5 — Add `verify-setup.ts` and `inspect-quarantine.ts` scripts (~30 min)

1. `scripts/verify-setup.ts`:
   - Reads required env vars (fails clear if missing)
   - Provisions a temp workspace via Agent Kit
   - Writes a tiny test object, reads it back
   - Tears down the workspace
   - Prints a green-light summary
   - This is the "first 30 seconds after clone" smoke test

2. `scripts/inspect-quarantine.ts`:
   - CLI that lists current quarantines (from the registry)
   - Lets the user select one
   - Prints metadata: trigger doc, validation reason, parent checkpoint
   - Optionally launches a query loop against the quarantined index for
     manual exploration

3. Add npm scripts to `package.json`:
   - `"verify-setup": "tsx scripts/verify-setup.ts"`
   - `"seed": "tsx scripts/seed.ts"`
   - `"clean": "tsx scripts/clean.ts"`
   - `"inspect-quarantine": "tsx scripts/inspect-quarantine.ts"`
   - `"dev": "tsx src/runs/handle-customer.ts"` (or whatever the
     entry-point script is)

**Acceptance:** All four scripts run cleanly against a configured Tigris
account.

---

## Phase 6 — Write the README (~1 hour)

The README is the load-bearing artifact. It frames the repo as a
reference implementation, not a package. Required sections:

1. **Title and one-paragraph pitch.** "A reference implementation of
   storage-protected AI agents on Tigris and Mastra. Clone, run, learn
   the pattern, fork to customize. Not a package — the patterns here
   are stable; the code shape is one way to express them."

2. **Setup in 60 seconds.** Install, paste keys, run `verify-setup`.

3. **Running the demo.**
   - Happy path: seed → handle-customer → see correct answer
   - Poison flow: seed-with-poison → handle-customer → see validator
     catch it → see quarantine → confirm production unchanged

4. **Where the pattern lives.** Pointer at `src/lib/`. One-line
   description of each file:
   - `session.ts` — the lifecycle: fork → run → validate → promote/quarantine → teardown
   - `promote.ts` — pointer-swap and copy-forward strategies
   - `quarantine.ts` — registry of failed forks for forensics
   - `validators/` — pluggable validator interface, starter
     implementations
   - `mastra/` — Mastra-specific bridging (RequestContext, withTigrisSession)

5. **How to adapt.** Three concrete pointers:
   - Replace `src/agents/support-agent.ts` with your agent
   - Customize `src/validators/canary-set.ts` for your domain
   - Replace `src/runs/handle-customer.ts` with your orchestrator

6. **What this is and isn't.** Explicit scope:
   - Is: reference for the storage-protected agent pattern
   - Isn't: a one-line library, a published npm package, a complete
     production solution
   - The patterns are stable; the API shape may evolve as we learn from
     real adoption

7. **Cross-links.**
   - Link to the launch blog (`tigrisdata.com/blog/immutable-agent`)
   - Link to the Mastra integration doc
   - Link to Agent Kit docs

**Acceptance:** A new reader can understand what the repo is, run it,
and adapt it from the README alone.

---

## Phase 7 — Update the launch blog (~30 min)

File: `tigris-blog/blog/2026-04-30-immutable-agent/index.mdx`

The blog currently announces `@tigrisdata/agent-forks` as a package
("Today we're shipping..."). Update to announce the reference
implementation. Specific changes:

1. **Replace the announcement paragraph:**

   Before:
   ```
   Today we're shipping
   [`@tigrisdata/agent-forks`](https://www.npmjs.com/package/@tigrisdata/agent-forks).
   Its Mastra adapter wraps any Mastra agent with storage-protected
   sessions in one line. The
   [demo repo](https://github.com/tigrisdata/mastra-tigris-demo) walks
   through wrapping an agent end to end.
   ```

   After:
   ```
   Today we're publishing
   [`immutable-agent`](https://github.com/tigrisdata/immutable-agent), a
   reference implementation of the storage-protected agent pattern on
   Tigris and Mastra. Clone it, run it, fork it to customize. The
   patterns are stable; the API shape will harden through real use
   before we package it.
   ```

2. **Replace the TypeScript code block.** Remove the import from
   `@tigrisdata/agent-forks/mastra`. Replace with a snippet showing the
   pattern as code-in-context:

   ```typescript
   // From src/runs/handle-customer.ts in the immutable-agent repo
   import { withTigrisSession } from "../lib/mastra";

   const safeAgent = withTigrisSession(supportAgent, {
     source: "support-knowledge-base",
     validate: canaryQueries(supportCanarySet),
   });

   const result = await safeAgent.generate(userQuery);
   ```

3. **Replace the install command.** Drop `npm install
   @tigrisdata/agent-forks`. Replace with:

   ```bash
   git clone https://github.com/tigrisdata/immutable-agent
   cd immutable-agent
   npm install && npm run verify-setup
   ```

4. **Update the architectural breakdown table.** Change "Primitive"
   column to reference both the underlying SDK call and the file in the
   repo where it lives:

   | Phase | What happens | Where it lives |
   |---|---|---|
   | Fork | ... | `createForks` (Agent Kit) → wrapped in `src/lib/session.ts` |
   | ... | ... | ... |

5. **Update the closing positioning paragraph:**

   Before:
   ```
   The
   [`@tigrisdata/agent-kit`](https://www.tigrisdata.com/docs/ai/agent-kit/)
   SDK ships the underlying primitives... `@tigrisdata/agent-forks`
   composes them into a session-shaped abstraction; the Mastra adapter
   at `@tigrisdata/agent-forks/mastra` is the framework-specific glue.
   ```

   After:
   ```
   The
   [`@tigrisdata/agent-kit`](https://www.tigrisdata.com/docs/ai/agent-kit/)
   SDK ships the underlying primitives. `immutable-agent`'s `src/lib/`
   composes them into a session-shaped abstraction with a Mastra
   adapter. If you're on a different framework, the pattern in
   `src/lib/session.ts` ports straight across — the framework-specific
   glue is one file in `src/lib/mastra/`.
   ```

6. **Update the InlineCta at the bottom:**
   - `title`: "Ready to wrap your first agent?" → "Ready to fork the reference?"
   - `link`: keep pointing at the integration doc (or update to point at
     the repo's GitHub URL — user's call)

**Acceptance:** The blog references the demo repo, not a package. All
old `@tigrisdata/agent-forks` references are gone. Reading the blog
fresh, a builder knows to clone the repo rather than expect an
installable package.

---

## Phase 8 — Update the skill (~30 min)

File: `tigrisdata/skills/skills/mastra-agents/SKILL.md`

The skill currently teaches AI assistants to wire up Mastra + Tigris
using the orchestrator pattern. It references `@tigrisdata/mastra` (an
older name from before the rename to `agent-forks`).

Updates:

1. Description: keep the trigger keywords, but point at the
   `immutable-agent` reference repo as the canonical source for the
   pattern.
2. Remove all `npm install @tigrisdata/agent-forks` (or `@tigrisdata/mastra`)
   instructions.
3. Replace with: "the canonical implementation lives at
   `github.com/tigrisdata/immutable-agent`. The pattern is in
   `src/lib/session.ts` and `src/lib/mastra/with-session.ts`. Adapt the
   pattern; don't expect to install a package."
4. Update the code examples in the skill to use the relative imports
   from `src/lib/mastra` instead of `@tigrisdata/agent-forks/mastra`.
5. Keep all the anti-patterns intact (don't put `createWorkspace` in
   tools, don't pass master credentials, etc.).
6. Update the metadata.json `references` array to include the new repo
   URL and remove any defunct package URLs.

**Acceptance:** The skill no longer references the package. AI
assistants triggered by Mastra+Tigris keywords get directed to the
reference repo, with the orchestrator pattern unchanged.

---

## Phase 9 — Verify end-to-end (~30 min)

1. From a clean state in `immutable-agent/`:
   - `npm install`
   - `npm run verify-setup` — green
   - `npm run seed` — populates source bucket
   - `npm run dev` — runs the happy-path demo
2. Run the poison flow:
   - Re-seed with poison.md included
   - Re-run the demo
   - Confirm validator catches it, fork is quarantined, source unchanged
3. `npm run inspect-quarantine` — confirm the quarantine record is
   browsable
4. `npm test` — all unit and integration tests pass
5. `npm run clean` — tears down all forks and quarantines, leaves
   source bucket alone

**Acceptance:** A fresh clone runs the full demo flow end-to-end without
manual intervention beyond pasting credentials. All tests pass. Cleanup
works.

---

## Phase 10 — Archive the old repos (optional, user's call)

If the user gave permission to archive in Phase 0's open questions:

1. Add a `README.md` redirect in `tigrisdata-agent-forks/`:
   ```
   # @tigrisdata/agent-forks (archived)
   The patterns here moved to
   [`immutable-agent`](https://github.com/tigrisdata/immutable-agent).
   See that repo for the canonical reference implementation.
   ```
2. Same for `mastra-tigris-demo/`:
   ```
   # mastra-tigris-demo (archived)
   This demo merged with the agent-forks code into
   [`immutable-agent`](https://github.com/tigrisdata/immutable-agent).
   ```
3. Push the redirects, then archive on GitHub manually (Claude Code
   can't archive a GitHub repo — that's a UI action by the user).

**Acceptance:** Anyone landing on the old repos sees a clear redirect
to the new one.

---

## What this plan deliberately does NOT include

- **No npm publish step.** This is a reference implementation. No
  package gets pushed to npm.
- **No restructuring of `agent-kit`.** The Agent Kit SDK stays as is.
  The pattern of pushing `promote`/`quarantine` upstream into Agent Kit
  is a separate roadmap item, not part of this migration.
- **No co-marketing changes with Mastra.** Coordinate that separately.
- **No automatic GitHub repo creation.** Claude Code can't create a
  GitHub repo via API without auth. The user creates the repo on GitHub
  manually and pushes when ready.
- **No automatic blog deploy.** The blog edits land on the file system;
  publishing is a separate manual step.

---

## Sequencing notes for Claude Code

Work phase-by-phase. **Stop and report after each phase.** Specifically:

- After Phase 0: report whether both source repos build and test cleanly. If
  they don't, ask the user how to proceed.
- After Phase 2: confirm `tsc --noEmit` passes after migrating
  `agent-forks` source. This is the type-system gate.
- After Phase 3: run `grep -r "@tigrisdata/agent-forks"` to confirm zero
  matches. This is the import-cleanup gate.
- After Phase 4: integration tests pass against a real Tigris account.
  This is the runtime gate.
- After Phase 6: README is reviewable.
- After Phase 7: blog edits are reviewable.

If a "verify before writing code" check turns up a surprise (e.g.,
`agent-forks` source isn't where this plan expects, or tests are
failing), stop and update the plan inline before writing migration code.
Don't paper over discrepancies with type assertions or skipped tests.

---

## Acceptance criteria — "the migration is done"

- [ ] `immutable-agent/` exists at the expected path with the file
      layout above
- [ ] `npm install && npm run verify-setup && npm test` works end-to-end
- [ ] All `@tigrisdata/agent-forks` references are gone from the new
      repo, the blog post, and the skill
- [ ] The README sells the repo as a reference implementation, not a
      package
- [ ] The poison-flow integration test passes
- [ ] The blog post points at the new repo
- [ ] The skill points at the new repo
- [ ] (If user opted in) the old repos have redirect READMEs
- [ ] User has been kept in the loop after each phase
