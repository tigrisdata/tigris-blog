// FIG 16 — the versions table, and the only thing that ever read it
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; the box borders and the stem are computed from
// the inner width and the column the stem drops out of.
//
// Deliberately the same geometry as FIG 15: two lanes, meters in a shared
// column. The two sections make the same argument about different subspaces,
// so the figures should rhyme.
//
// What is different here is where the write lands. A tombstone is a write on
// the delete path. The versions row is a write on the PutObject hot path, paid
// on every overwrite, and its only reader is the scanner that exists to read
// it. So the figure counts the hot path, and the stem points at the row that
// nobody else ever looks at.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const BOX = 2; // left border of a lane
const W = 52; // inner width
const RIGHT = BOX + W + 1; // right border
const IN = BOX + 2; // content inside a lane
const NOTE = BOX + 4; // what hangs under a lane
const METER = 58; // both meters, so the bars line up
const COUNT = METER + 8; // the number beside a meter
const TAIL = COUNT + 3; // a label after the number
const SLOTS = 6;
const META = "object metadata"; // the write a user can actually observe
const STEM = IN + META.length + 3; // the versions row starts here

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
      throw new Error(`VersionWrites: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

const edge = (l, r) => l + "─".repeat(W) + r;

// A box bottom with a tee under an absolute column, for the line that drops
// out of the versions row.
function stem(l, r) {
  let s = l;
  for (let c = BOX + 1; c < RIGHT; c++) s += c === STEM ? "┬" : "─";
  return s + r;
}

// A meter is fixed width, so a step can swap a fuller one in without moving
// the number beside it.
const meter = (n) => "█".repeat(n) + "░".repeat(SLOTS - n);

// --------------------------------------------------------------------- lines

const LINES = [
  L([BOX, [["gray", "overwriting an object in a versioned bucket"]]]),
  [],
  L(
    [BOX, [["gray", "today · PutObject writes twice"]]],
    [METER, [["gray", "hot path"]]]
  ),
  L([BOX, [["gray", edge("┌", "┐")]]]),
  L(
    [BOX, [["gray", "│"]]],
    [IN, [["#meta", META, "base"]]],
    [IN + META.length, [["gray", " ▸ "]]],
    [STEM, [["#row", "a row in the versions table", "red"]]],
    [RIGHT, [["gray", "│"]]],
    // Meter and number are separate tags. A tag is a substitution target, and
    // these two get different text.
    [METER, [["#hot", meter(2), "red"]]],
    [COUNT, [["#hotCount", "2", "red"]]]
  ),
  L([BOX, [["gray", stem("└", "┘")]]]),
  L([STEM, [["#reader", "▼ nothing else ever reads this row", "red"]]]),
  L(
    [NOTE, [["#job", "enqueue ▸ claim ▸ lease ▸ delete the job key", "red"]]],
    [METER, [["#jobMeter", meter(4), "red"]]],
    [COUNT, [["#jobCount", "4", "red"]]],
    [TAIL, [["#jobCount", "per version", "red"]]]
  ),
  [],
  L([
    BOX,
    [["#kafka", "with kafka · the row was a message all along", "gray"]],
  ]),
  L([BOX, [["#kafka", edge("┌", "┐"), "gray"]]]),
  L(
    [BOX, [["#kafka", "│", "gray"]]],
    [IN, [["#keep", META, "base"]]],
    [IN + META.length, [["#kafka", " ▸ ", "gray"]]],
    [STEM, [["#produce", "produce one message to a topic", "green"]]],
    [RIGHT, [["#kafka", "│", "gray"]]],
    [METER, [["#produceMeter", meter(1), "green"]]],
    [COUNT, [["#produceCount", "1", "green"]]]
  ),
  L([BOX, [["#kafka", edge("└", "┘"), "gray"]]]),
  L([
    NOTE,
    [["#gone", "the versions subspace is deleted, not migrated", "green"]],
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

const hot = (n) => ({ hot: meter(n), hotCount: String(n) });

const STEPS = [
  {
    show: ["meta", "hot", "hotCount"],
    focus: ["meta", "hot", "hotCount"],
    text: hot(1),
    caption: "an overwrite writes the object. that write earns its place",
    ms: 2800,
  },
  {
    show: ["row"],
    focus: ["row", "hot", "hotCount"],
    text: hot(2),
    caption: "it also writes a row to a table, on every single PutObject",
    ms: 3000,
  },
  {
    show: ["reader", "job", "jobMeter", "jobCount"],
    focus: ["reader", "job", "jobMeter", "jobCount"],
    text: hot(2),
    caption:
      "a scanner reads that row back and schedules a job: four more writes",
    ms: 3200,
  },
  {
    show: ["kafka", "keep", "produce", "produceMeter", "produceCount"],
    focus: ["kafka", "keep", "produce", "produceMeter", "produceCount"],
    text: hot(2),
    caption:
      "so produce the message instead. the object write is the only one left",
    ms: 3200,
  },
  {
    show: ["gone"],
    focus: ["gone", "produce", "produceMeter"],
    text: hot(2),
    caption:
      "nothing user-facing read the table, so it does not need a new home",
    ms: 3000,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: hot(2),
    caption: "one fewer write on the hot path, one fewer subspace to scan",
    ms: 4000,
  },
];

export default function VersionWrites({
  label = "FIG 16",
  title = "the versions table, and the only thing that ever read it",
  fontSize,
}) {
  return (
    <AnimatedAsciiFigure
      label={label}
      title={title}
      lines={LINES}
      steps={STEPS}
      fontSize={fontSize}
    />
  );
}
