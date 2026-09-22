// FIG 08 — a long job keeps moving its own deadline
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; the axis and the span bar are computed from the
// tick columns they cover.
//
// A renewal is not an event you can draw once. The point is that the deadline
// keeps landing further right than it did a moment ago, and that the span
// nobody else can see across keeps growing with it. So the deadline marker
// walks the axis a tick at a time, and the bar underneath grows by exactly the
// same amount, by substituting a wider bar into a fixed-width segment.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const AXIS = [2, 74]; // the time axis runs between these columns
const T = [4, 17, 30, 43, 56]; // t2, t8, t14, t20, t26
const LABEL = ["t2", "t8", "t14", "t20", "t26"];
const EVENT = ["lease", "renew", "renew", "renew", "done"];
const LAST = T.length - 1;

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
      throw new Error(`LeaseRenewal: column ${at} is already past ${col}`);
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

// The span the job is invisible for, drawn from the first tick to tick `k`.
const span = (k) => "◀" + "═".repeat(T[k] - T[0] - 1) + "▶";

// --------------------------------------------------------------------- lines

const LINES = [
  L([
    AXIS[0],
    [
      [
        "gray",
        "worker1 is diffing a whole bucket. the work outlasts one lease.",
      ],
    ],
  ]),
  [],
  L(...T.map((c, i) => [c - 1, [["gray", LABEL[i]]]])),
  L([AXIS[0], [["gray", axis()]]]),
  L(...T.map((c, i) => [c, [[`#e${i}`, "│", i === LAST ? "green" : "cyan"]]])),
  L(
    ...T.map((c, i) => [
      c,
      [[`#e${i}`, EVENT[i], i === LAST ? "green" : "cyan"]],
    ])
  ),
  // The deadline the tick above just wrote, parked on the tick it names. The
  // lease at t2 points at t8, the renewal at t8 points at t14, and so on.
  L(...T.slice(1).map((c, i) => [c, [[`#v${i + 1}`, "▲", "amber"]]])),
  L(
    ...T.slice(1).map((c, i) => [
      c,
      [[`#v${i + 1}`, `vest = ${LABEL[i + 1]}`, "amber"]],
    ])
  ),
  [],
  L([T[0], [["#bar", span(LAST), "amber"]]]),
  // Its own tag, not the bar's: a tag is a substitution target, and this text
  // must not be replaced by a wider bar.
  L([
    T[0],
    [
      [
        "#barLabel",
        "no other worker can see job2 for this whole span",
        "amber",
      ],
    ],
  ]),
  [],
  L([
    0,
    [["gray", "// while a worker keeps checking in, nobody else can see the"]],
  ]),
  L([
    0,
    [["gray", "// job. stop checking in and it vests again, for any reason."]],
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

// A check-in and the deadline it writes arrive together, and the span reaches
// exactly as far as that new deadline.
const upto = (k) => ({ bar: span(k) });

const STEPS = [
  {
    show: ["e0", "v1", "bar", "barLabel"],
    focus: ["e0", "v1"],
    text: upto(1),
    caption:
      "t2: worker1 takes the lease, and the key it writes says vest = t8",
    ms: 2800,
  },
  {
    show: ["e1", "v2"],
    focus: ["e1", "v2", "bar", "barLabel"],
    text: upto(2),
    caption:
      "t8: the diff is not done, so worker1 checks in and moves the deadline",
    ms: 3000,
  },
  {
    show: ["e2", "e3", "v3", "v4"],
    focus: ["e2", "e3", "v3", "v4", "bar", "barLabel"],
    text: upto(4),
    caption: "every check-in buys another six seconds. the job never vests",
    ms: 3000,
  },
  {
    show: ["e4"],
    focus: ["e4"],
    text: upto(4),
    caption:
      "t26: the diff finishes, so worker1 clears the key instead of renewing",
    ms: 3000,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: upto(4),
    caption: "one key, moved four times, and no lock anywhere in the database",
    ms: 4000,
  },
];

export default function LeaseRenewal({
  label = "FIG 08",
  title = "a long job keeps moving its own deadline",
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
