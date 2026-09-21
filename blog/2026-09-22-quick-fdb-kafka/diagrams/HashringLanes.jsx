// FIG 14 — lanes on a hashring, and what a dead worker costs
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; every border and every tee is computed from the
// columns it joins.
//
// One picture of the whole arrangement: the queue on top with its own storage,
// the ring below it as three horizontal lanes, and every worker holding a few
// jobs. The lease arrow runs down out of a job and into the worker that took
// it; the checkpoint arrow runs back up into the job's own JSON body, because
// that body is where progress lives. w-9 sits in all three lanes, so killing
// it takes work out of all three, and the survivors pick that work up with the
// checkpoints already written.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const BOX = 2; // left border, shared by both boxes
const W = 74; // inner width
const RIGHT = BOX + W + 1; // right border
const JOB = [5, 23, 41, 59]; // job slots in the queue
const LANE = 4; // the "lane N" label
const WORKER = [13, 34, 55]; // worker slots inside a lane
const SLOT = 10; // worker cell, then its status
const LEASE = 18; // a square inside the first worker of lane 0
const CK = 61; // a square inside the last worker of lane 0

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
      throw new Error(`HashringLanes: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

// A full-width border with tees at the columns the arrows use.
function border(left, right, tee, cols = []) {
  const set = new Set(cols);
  let s = left;
  for (let c = BOX + 1; c < RIGHT; c++) s += set.has(c) ? tee : "─";
  return s + right;
}

// A job in the queue: the id plus the raw body, which is where the checkpoint
// lives. Every body is the same width so a step can swap one for another
// without moving a column.
const job = (id, ck) => `${id} {"ck":${ck}}`;
const NONE = "null";

// A worker: a name, then three squares, one per job it is holding.
function worker(lane, i, name, dead) {
  const cells = [
    [WORKER[i], [`${name} [`, [`#sq${lane}${i}`, "░░░", "green"], "]"]],
  ];
  if (dead) cells.push([WORKER[i] + SLOT, [[`#dead${lane}`, "    ", "red"]]]);
  return cells;
}

function laneRow(lane, names, deadAt) {
  return L(
    [BOX, [["gray", "│"]]],
    [LANE, [["gray", `lane ${lane}`]]],
    ...names.flatMap((name, i) => worker(lane, i, name, i === deadAt)),
    [RIGHT, [["gray", "│"]]]
  );
}

// w-9 is in every lane, which is the point: a worker watches a few lanes, so
// the ring holds it more than once.
const LANES = [
  { names: ["w-7", "w-9", "w-2"], dead: 1 },
  { names: ["w-9", "w-3", "w-5"], dead: 0 },
  { names: ["w-1", "w-4", "w-9"], dead: 2 },
];

// --------------------------------------------------------------------- lines

const LINES = [
  L([
    BOX,
    [
      [
        "gray",
        "queue · its own keyspace. no worker keeps anything of its own.",
      ],
    ],
  ]),
  L([BOX, [["gray", border("┌", "┐", "─")]]]),
  L(
    [BOX, [["gray", "│"]]],
    [JOB[0], [["#job1", job("a91f", '"03"'), "cyan"]]],
    [JOB[1], [["gray", job("b17c", NONE)]]],
    [JOB[2], [["gray", job("c04e", '"7f"')]]],
    [JOB[3], [["#job4", job("d22a", NONE), "green"]]],
    [RIGHT, [["gray", "│"]]]
  ),
  L([BOX, [["gray", border("└", "┘", "┬", [LEASE, CK])]]]),
  L(
    [LEASE, [["#lease", "│ lease", "cyan"]]],
    [CK - 11, [["#ck", "checkpoint ▲", "green"]]]
  ),
  L([LEASE, [["#lease", "▼", "cyan"]]], [CK, [["#ck", "│", "green"]]]),
  L([BOX, [["gray", border("┌", "┐", "┴", [LEASE, CK])]]]),
  laneRow(0, LANES[0].names, LANES[0].dead),
  L([BOX, [["gray", border("├", "┤", "─")]]]),
  laneRow(1, LANES[1].names, LANES[1].dead),
  L([BOX, [["gray", border("├", "┤", "─")]]]),
  laneRow(2, LANES[2].names, LANES[2].dead),
  L([BOX, [["gray", border("└", "┘", "─")]]]),
  [],
  L([
    0,
    [
      [
        "gray",
        "// hash(job key) picks the lane, and claiming a job changes the",
      ],
    ],
  ]),
  L([
    0,
    [["gray", "// key, so a job does not stay in one lane or on one worker."]],
  ]),
];

// --------------------------------------------------------------------- steps

// A frame is three lanes of three workers, each holding up to three jobs.
const held = (rows) => {
  const text = {};
  rows.forEach((row, lane) =>
    row.forEach((sq, i) => {
      text[`sq${lane}${i}`] = sq;
    })
  );
  return text;
};

const IDLE = held([
  ["░░░", "░░░", "░░░"],
  ["░░░", "░░░", "░░░"],
  ["░░░", "░░░", "░░░"],
]);

const CLAIMED = held([
  ["██░", "██░", "█░░"],
  ["█░░", "█░░", "░░░"],
  ["█░░", "░░░", "█░░"],
]);

// w-9's four jobs, spread over the workers that now own those lanes.
const REDEALT = held([
  ["███", "░░░", "██░"],
  ["░░░", "█░░", "█░░"],
  ["█░░", "█░░", "░░░"],
]);

const CHECKPOINTED = { job4: job("d22a", '"a4"') };
const GONE = { dead0: "dead", dead1: "dead", dead2: "dead" };

const SQUARES = Object.keys(CLAIMED);
const DEAD_SQUARES = LANES.map((l, i) => `sq${i}${l.dead}`);
const ALIVE_SQUARES = SQUARES.filter((id) => !DEAD_SQUARES.includes(id));

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
    show: ["job1", "job4", ...SQUARES],
    focus: ["job1", "job4"],
    text: IDLE,
    caption: "four jobs in the queue. ck is how far each one has got",
    ms: 2600,
  },
  {
    show: ["lease"],
    focus: ["lease", "job1", ...SQUARES],
    text: CLAIMED,
    caption:
      "hash(key) picks the lane; the workers on it lease what lands there",
    ms: 3000,
  },
  {
    show: ["ck"],
    focus: ["ck", "job4", "sq02"],
    text: { ...CLAIMED, ...CHECKPOINTED },
    caption:
      "a long job writes its checkpoint back into its own body in the queue",
    ms: 3000,
  },
  {
    show: ["dead0", "dead1", "dead2"],
    focus: ["dead0", "dead1", "dead2"],
    text: { ...CLAIMED, ...CHECKPOINTED, ...GONE },
    caption: "w-9 stops renewing. it was in all three lanes, holding four jobs",
    ms: 3000,
  },
  {
    focus: [...ALIVE_SQUARES, "job4"],
    text: { ...REDEALT, ...CHECKPOINTED, ...GONE },
    caption: "the leases lapse, the jobs re-hash, and the ring picks them up",
    ms: 3000,
  },
  {
    focus: ["job4", "sq02", "ck"],
    text: { ...REDEALT, ...CHECKPOINTED, ...GONE },
    caption: "each one resumes from the checkpoint in the queue, not from zero",
    ms: 3400,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: { ...REDEALT, ...CHECKPOINTED, ...GONE },
    caption: "leases down, checkpoints up, and nothing of value in a worker",
    ms: 4000,
  },
];

export default function HashringLanes({
  label = "FIG 14",
  title = "lanes on a hashring, and what a dead worker costs",
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
