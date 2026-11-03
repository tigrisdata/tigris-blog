// FIG 03 — two transactions touch one key, and the loser does it all again
//
// Hand-written animated figure. var/fdb-profile-analyzer-diagrams.mjs does
// NOT generate this file; it only re-exports it from index.js and checks
// every frame of it.
//
// Per .claude/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; every rail is computed from the columns it
// joins.
//
// Optimistic concurrency: nobody waits. A and B both read k, A commits first,
// and B finds out at commit time that its read is stale. The retry hangs off
// B's failed commit, because that is where the extra work starts.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const LANE = 2; // where "txn A" and "txn B" sit
const READ = 10; // where every transaction starts
const WRITE = 22; // where A's write sits
const COMMIT = 36; // where both commits sit

const rule = (n) => "─".repeat(n);
const segText = (s) => (typeof s === "string" ? s : s[1]);
const segsWidth = (segs) => segs.reduce((n, s) => n + segText(s).length, 0);

// Place cells at absolute columns. Throws rather than silently overlapping,
// which is the whole reason columns are not typed by hand.
function L(...cells) {
  const out = [];
  let col = 0;
  for (const [at, segs] of cells) {
    if (!segs) continue;
    if (at < col) {
      throw new Error(`ConflictRetry: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

const READ_K = "read k";
const AFTER_READ = READ + READ_K.length + 1; // one space after "read k"

// A's path after its read: a rail to the write, a rail to the commit.
const A_PATH =
  rule(WRITE - AFTER_READ - 1) +
  " write k " +
  rule(COMMIT - WRITE - "write k".length - 2) +
  " commit ✓";

// B's path after its read: one rail straight to the commit.
const B_RAIL = rule(COMMIT - AFTER_READ - 1);

// The retry, hanging off B's failed commit. Same work as A, done again.
const RETRY = `└─ retry: ${READ_K} ${rule(2)} write k ${rule(2)} `;
const RETRY_OK = "commit ✓";

const END = COMMIT + RETRY.length + RETRY_OK.length;
const AXIS = "time " + rule(END - LANE - "time ".length - 1) + "▶";

// --------------------------------------------------------------------- lines

const LINES = [
  L([LANE, [["gray", AXIS]]]),
  [],
  L(
    [LANE, [["base", "txn A"]]],
    [READ, [["#readA", READ_K, "base"]]],
    [AFTER_READ, [["#commitA", A_PATH, "green"]]]
  ),
  L(
    [LANE, [["base", "txn B"]]],
    [READ, [["#readB", READ_K, "base"]]],
    [AFTER_READ, [["#railB", B_RAIL, "base"]]],
    [COMMIT, [["#commitB", "commit ✗ 1020 not_committed", "red"]]]
  ),
  L([
    COMMIT,
    [
      ["#retry", RETRY, "red"],
      ["#retryOk", RETRY_OK, "green"],
    ],
  ]),
];

// --------------------------------------------------------------------- steps

// Every tag the figure declares, read back off the lines so the last frame
// cannot drift out of step with them.
const ALL = [
  ...new Set(
    LINES.flat()
      .filter((s) => Array.isArray(s) && s[0].startsWith("#"))
      .map((s) => s[0].slice(1))
  ),
];

const STEPS = [
  {
    show: ["readA", "readB"],
    caption: "A and B both read k. neither one holds a lock",
    ms: 2400,
  },
  {
    show: ["commitA"],
    caption: "A writes k and commits first",
    ms: 2400,
  },
  {
    show: ["railB", "commitB"],
    caption: "B commits: k changed after B read it, so the cluster says no",
    ms: 3000,
  },
  {
    show: ["retry", "retryOk"],
    caption: "B retries from the top. the reads it already did are done again",
    ms: 3000,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    caption:
      "the retry is the cost: one lost conflict is one transaction, twice",
    ms: 4000,
  },
];

const LABEL = "FIG 03";
const TITLE = "two transactions touch one key, and the loser does it all again";

// 42rem is Tailwind's max-w-2xl; the site does not ship Tailwind, so the
// value is inlined. Auto side margins center the block in the column.
const WRAP_STYLE = { maxWidth: "42rem", margin: "0 auto" };

export default function ConflictRetry({
  label = LABEL,
  title = TITLE,
  fontSize,
}) {
  return (
    <div style={WRAP_STYLE}>
      <AnimatedAsciiFigure
        label={label}
        title={title}
        lines={LINES}
        steps={STEPS}
        fontSize={fontSize}
      />
    </div>
  );
}
