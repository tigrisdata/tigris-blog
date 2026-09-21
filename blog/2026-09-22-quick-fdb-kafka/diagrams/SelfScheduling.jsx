// FIG 09 — recurring jobs that book their own next slot
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; the axis and every rail are computed from the
// tick columns they join.
//
// A cron job here is a chain, so the figure draws it as one: each run sits on
// its own row and hands a rail up-right into the next tick on the axis. The
// animation is the chain building itself, one hop at a time, which is the only
// honest way to draw a schedule that has no scheduler.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const AXIS = [2, 74]; // the time axis runs between these columns
const T = [4, 20, 36, 52, 68]; // t0, t60, t120, t180, t240
const LABEL = ["t0", "t60", "t120", "t180", "t240"];
const HOPS = T.length - 1;

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
      throw new Error(`SelfScheduling: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

// A time axis with a tee on every tick column.
function axis() {
  const ticks = new Set(T);
  let s = "";
  for (let c = AXIS[0]; c <= AXIS[1]; c++) s += ticks.has(c) ? "┬" : "─";
  return s + "▶";
}

// The booking: "run" at tick `k`, then a labelled rail that lands on tick
// `k + 1`. The whole thing is exactly as wide as the gap between the two.
function hop(k) {
  const span = T[k + 1] - T[k] + 1;
  const text = " books ";
  const dashes = span - "run ".length - text.length - 1;
  if (dashes < 2) throw new Error(`SelfScheduling: hop ${k} has no room`);
  const left = Math.floor(dashes / 2);
  return "─".repeat(left) + text + "─".repeat(dashes - left) + "┘";
}

// --------------------------------------------------------------------- lines

const LINES = [
  L([
    AXIS[0],
    [["gray", "the bucket sweep, enqueued by hand exactly once, at t0"]],
  ]),
  [],
  L(...T.map((c, i) => [c - 1, [[`#t${i}`, LABEL[i], "green"]]])),
  L([AXIS[0], [["gray", axis()]]]),
  // Under the axis: t0 hangs down to its own run, and every later tick has an
  // arrowhead because something below it put it there.
  L(
    [T[0], [["#t0", "│", "green"]]],
    ...T.slice(1).map((c, i) => [c, [[`#t${i + 1}`, "▲", "cyan"]]])
  ),
  // One row per hop: the run that fires, the rail it writes, and the verticals
  // belonging to ticks further right that are still waiting to be reached.
  ...Array.from({ length: HOPS }, (_, k) =>
    L(
      [
        T[k],
        [
          [`#t${k}`, "run ", "green"],
          [`#hop${k}`, hop(k), "cyan"],
        ],
      ],
      ...T.slice(k + 2).map((c, i) => [c, [[`#t${k + 2 + i}`, "│", "cyan"]]])
    )
  ),
  L([
    T[HOPS],
    [
      [`#t${HOPS}`, "run ", "green"],
      [`#hop${HOPS}`, "───▶", "cyan"],
    ],
  ]),
  [],
  L([
    0,
    [
      [
        "gray",
        "// the last thing every run does is schedule the next one. no cron",
      ],
    ],
  ]),
  L([
    0,
    [
      [
        "gray",
        "// service, no leader election, nothing extra to page you about.",
      ],
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

// A hop and the tick it lands on arrive together: the booking is what makes
// the next slot exist.
const link = (k) => [`hop${k}`, `t${k + 1}`];

const STEPS = [
  {
    show: ["t0"],
    focus: ["t0"],
    caption: "somebody enqueues the sweep once, to run at t0",
    ms: 2600,
  },
  {
    show: link(0),
    focus: [...link(0), "t0"],
    caption:
      "the run's last act is to write the same job again, vesting at t60",
    ms: 3000,
  },
  {
    show: [...link(1), ...link(2)],
    focus: [...link(1), ...link(2)],
    caption:
      "t60 books t120, t120 books t180, and nothing is coordinating this",
    ms: 3000,
  },
  {
    show: [...link(3), `hop${HOPS}`],
    focus: [...link(3), `hop${HOPS}`],
    caption: "the chain is the schedule, and it goes on as long as runs finish",
    ms: 3000,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    caption: "cron, minus the cron service, the leader election and the pager",
    ms: 4000,
  },
];

export default function SelfScheduling({
  label = "FIG 09",
  title = "recurring jobs that book their own next slot",
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
