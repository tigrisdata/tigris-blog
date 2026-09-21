// FIG 15 — what one tombstone costs in queue writes
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; the box borders are computed from the inner
// width.
//
// The numbers are the post's own napkin math: a QuiCK job costs an enqueue, a
// claim, a lease and a delete, which is four writes per tombstone before a
// single byte is freed, plus four more for the per-bucket task that found it.
// The meters share a column so the two lanes can be compared by eye, and they
// count queue writes only. The tombstone write itself happens either way.
//
// The animation is the counter. A still picture states a number; watching the
// meter fill one write at a time is the argument.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const BOX = 2; // left border of a lane
const W = 52; // inner width
const RIGHT = BOX + W + 1; // right border
const IN = BOX + 2; // content inside a lane
const NOTE = BOX + 4; // the notes hanging under the first lane
const METER = 58; // both meters, so the bars line up
const COUNT = METER + 8; // the number beside a meter
const SLOTS = 6; // how wide a meter is

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
      throw new Error(`DeleteWrites: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

const edge = (l, r) => l + "─".repeat(W) + r;

// A meter is fixed width, so a step can swap a fuller one in without moving
// the number beside it.
const meter = (n) => "█".repeat(n) + "░".repeat(SLOTS - n);

// The four writes a QuiCK job costs, in the order it costs them.
const STAGE = ["enqueue", "claim", "lease", "delete the job key"];

// --------------------------------------------------------------------- lines

const LINES = [
  L([
    BOX,
    [["gray", "cleaning up one tombstone, counted in writes to the queue"]],
  ]),
  [],
  L(
    [BOX, [["gray", "today · every stage is a QuiCK job"]]],
    [METER, [["gray", "queue writes"]]]
  ),
  L([BOX, [["gray", edge("┌", "┐")]]]),
  L(
    [BOX, [["gray", "│"]]],
    [
      IN,
      STAGE.flatMap((s, i) => [
        ...(i ? [["gray", " ▸ "]] : []),
        [`#s${i}`, s, "red"],
      ]),
    ],
    [RIGHT, [["gray", "│"]]],
    // The meter and its number are separate tags. A tag is a substitution
    // target, and these two get different text.
    [METER, [["#fdb", meter(4), "red"]]],
    [COUNT, [["#fdbCount", "4", "red"]]]
  ),
  L([BOX, [["gray", edge("└", "┘")]]]),
  L(
    [NOTE, [["#extra", "+ the per-bucket task that found it", "red"]]],
    [METER, [["#extra", meter(4), "red"]]],
    [COUNT, [["#extra", "4", "red"]]]
  ),
  L(
    [NOTE, [["#scan", "+ a range scan across the whole bucket", "amber"]]],
    [METER, [["#scan", meter(0), "amber"]]],
    [COUNT, [["#scan", "reads", "amber"]]]
  ),
  [],
  L([BOX, [["#kafka", "with kafka · the topic is the schedule", "gray"]]]),
  L([BOX, [["#kafka", edge("┌", "┐"), "gray"]]]),
  L(
    [BOX, [["#kafka", "│", "gray"]]],
    [IN, [["#produce", "produce one message to the cleanup topic", "green"]]],
    [RIGHT, [["#kafka", "│", "gray"]]],
    [METER, [["#produce", meter(0), "green"]]],
    [COUNT, [["#produce", "0", "green"]]]
  ),
  L([BOX, [["#kafka", edge("└", "┘"), "gray"]]]),
  [],
  L(
    [BOX, [["#million", "a million deletes:", "base"]]],
    [22, [["#million", "4,000,000 queue writes", "red"]]],
    [48, [["#million", "→", "gray"]]],
    [52, [["#million", "none", "green"]]]
  ),
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

const METERS = ["fdb", "fdbCount"];
const soFar = (n) => ({ fdb: meter(n), fdbCount: String(n) });

const STEPS = [
  {
    show: ["s0", ...METERS],
    focus: ["s0", ...METERS],
    text: soFar(1),
    caption: "the cleanup task has to be written into the queue before it runs",
    ms: 2800,
  },
  {
    show: ["s1", "s2"],
    focus: ["s1", "s2", ...METERS],
    text: soFar(3),
    caption: "a worker claims it, then leases it, and each of those is a write",
    ms: 3000,
  },
  {
    show: ["s3"],
    focus: ["s3", ...METERS],
    text: soFar(4),
    caption: "then it deletes itself. four writes, and no byte is freed yet",
    ms: 3200,
  },
  {
    show: ["extra", "scan"],
    focus: ["extra", "scan"],
    text: soFar(4),
    caption: "and the per-bucket task that found the tombstone cost four more",
    ms: 3000,
  },
  {
    show: ["kafka", "produce"],
    focus: ["kafka", "produce"],
    text: soFar(4),
    caption: "with a topic, the offset does the scheduling. no queue writes",
    ms: 3200,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: soFar(4),
    caption: "this is the load we took off the cluster that serves your reads",
    ms: 4000,
  },
];

export default function DeleteWrites({
  label = "FIG 15",
  title = "what one tombstone costs in queue writes",
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
