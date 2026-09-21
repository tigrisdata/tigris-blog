// FIG 11 — lanes on a hashring, and what a dead worker costs
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; every border and every tee is computed from the
// columns it joins.
//
// Each job has its own colour and keeps it from its row in the queue into
// whatever worker is holding it, so a reader can follow one job across the
// ring. A segment's colour is fixed, so a slot only ever belongs to one job for
// the whole animation: a job that moves gets its own slot at the far end rather
// than borrowing someone else's.
//
// The two arrow columns are derived from worker slots, so the lease arrow lands
// exactly on job1's slot and the checkpoint arrow leaves exactly job4's.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const BOX = 2; // left border, shared by both boxes
const W = 74; // inner width
const RIGHT = BOX + W + 1; // right border
const QUEUED = [5, 23, 41, 59]; // job slots in the queue
const LANE = 4; // the "lane N" label
const WORKER = [13, 34, 55]; // worker slots inside a lane
const NAMED = 5; // the "w-7 [" before a worker's first slot
const HELD = 10; // worker cell, then its status
const LEASE = WORKER[0] + NAMED; // lane 0's first worker, first slot
const CK = WORKER[2] + NAMED; // lane 0's last worker, first slot

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

// One job, one colour, used everywhere that job appears.
const JOBS = [
  { id: "job1", color: "cyan", ck: '"03"' },
  { id: "job2", color: "green", ck: "null" },
  { id: "job3", color: "amber", ck: "null" },
  { id: "job4", color: "violet", ck: "null" },
];

// The body is where the checkpoint lives. Every body is the same width, so a
// step can swap one for another without moving a column.
const body = (id, ck) => `${id} {"ck":${ck}}`;

// Which job owns each worker slot. A slot named here takes that job's colour;
// the rest are inert. The `b` slots are where job2 and job3 land after they
// re-hash, so they carry the same colour as the job they are.
const LANES = [
  [
    { name: "w-7", slots: ["job1"] },
    { name: "w-9", slots: ["job2"], dead: true },
    { name: "w-2", slots: ["job4"] },
  ],
  [
    { name: "w-9", slots: [], dead: true },
    { name: "w-3", slots: ["job3b"] },
    { name: "w-5", slots: ["job2b"] },
  ],
  [
    { name: "w-1", slots: [] },
    { name: "w-4", slots: [] },
    { name: "w-9", slots: ["job3"], dead: true },
  ],
];

const SLOTS = 3; // how many jobs a worker can hold at once
const COLOR = Object.fromEntries(JOBS.map((j) => [j.id, j.color]));
COLOR.job2b = COLOR.job2;
COLOR.job3b = COLOR.job3;

function worker(lane, i, w) {
  const slots = Array.from({ length: SLOTS }, (_, s) => w.slots[s] || null);
  const cells = [
    [
      WORKER[i],
      [
        `${w.name} [`,
        ...slots.map((id) => (id ? [`#${id}`, "░", COLOR[id]] : ["gray", "░"])),
        "]",
      ],
    ],
  ];
  if (w.dead) cells.push([WORKER[i] + HELD, [[`#dead${lane}`, "    ", "red"]]]);
  return cells;
}

const laneRow = (lane) =>
  L(
    [BOX, [["gray", "│"]]],
    [LANE, [["gray", `lane ${lane}`]]],
    ...LANES[lane].flatMap((w, i) => worker(lane, i, w)),
    [RIGHT, [["gray", "│"]]]
  );

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
    ...JOBS.map((j, i) => [
      QUEUED[i],
      [[`#q${j.id}`, body(j.id, j.ck), j.color]],
    ]),
    [RIGHT, [["gray", "│"]]]
  ),
  L([BOX, [["gray", border("└", "┘", "┬", [LEASE, CK])]]]),
  L(
    [LEASE, [["#lease", "│ lease", "cyan"]]],
    [CK - 11, [["#ck", "checkpoint ▲", "violet"]]]
  ),
  L([LEASE, [["#lease", "▼", "cyan"]]], [CK, [["#ck", "│", "violet"]]]),
  L([BOX, [["gray", border("┌", "┐", "┴", [LEASE, CK])]]]),
  laneRow(0),
  L([BOX, [["gray", border("├", "┤", "─")]]]),
  laneRow(1),
  L([BOX, [["gray", border("├", "┤", "─")]]]),
  laneRow(2),
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

// Every tag the figure declares, read back off the lines so the last frame
// cannot drift out of step with them.
const ALL = [
  ...new Set(
    LINES.flat()
      .filter((s) => Array.isArray(s) && s[0].startsWith("#"))
      .map((s) => s[0].slice(1))
  ),
];

const QUEUE = JOBS.map((j) => `q${j.id}`);
const HOLDING = ["job1", "job2", "job3", "job4"];
const MOVED = ["job2b", "job3b"];

// A slot is filled when it is holding its job.
const filled = (...ids) => Object.fromEntries(ids.map((id) => [id, "█"]));
const CLAIMED = filled(...HOLDING);
const AFTER = {
  ...filled("job1", "job4", ...MOVED),
  job2: "░",
  job3: "░",
};
const CHECKPOINTED = { qjob4: body("job4", '"a4"') };
const DEAD = { dead0: "dead", dead1: "dead", dead2: "dead" };

const STEPS = [
  {
    show: [...QUEUE, ...HOLDING, ...MOVED],
    focus: QUEUE,
    caption: "four jobs in the queue, each with its own colour and checkpoint",
    ms: 2800,
  },
  {
    show: ["lease"],
    focus: ["lease", ...QUEUE, ...HOLDING],
    text: CLAIMED,
    caption:
      "hash(key) picks the lane; the workers on it lease what lands there",
    ms: 3200,
  },
  {
    show: ["ck"],
    focus: ["ck", "qjob4", "job4"],
    text: { ...CLAIMED, ...CHECKPOINTED },
    caption: "job4 writes its checkpoint back into its own body in the queue",
    ms: 3000,
  },
  {
    show: ["dead0", "dead1", "dead2"],
    focus: ["dead0", "dead1", "dead2", "job2", "job3"],
    text: { ...CLAIMED, ...CHECKPOINTED, ...DEAD },
    caption:
      "w-9 stops renewing. it is in all three lanes, holding job2 and job3",
    ms: 3200,
  },
  {
    focus: [...MOVED, "qjob2", "qjob3"],
    text: { ...AFTER, ...CHECKPOINTED, ...DEAD },
    caption: "both leases lapse, both jobs re-hash, and both land in lane 1",
    ms: 3400,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: { ...AFTER, ...CHECKPOINTED, ...DEAD },
    caption: "no job belongs to a worker, and no job stays in one lane",
    ms: 4000,
  },
];

export default function HashringLanes({
  label = "FIG 11",
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
