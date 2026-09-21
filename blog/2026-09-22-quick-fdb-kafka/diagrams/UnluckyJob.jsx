// FIG 13 — what a coin flip does to the job nobody picks
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; the table borders are computed from the two
// column widths.
//
// The table fills in a scan round at a time, left to right, because the point
// is not the final state — it is watching a91f get passed over again and again
// while the counter on its row keeps climbing. A still picture of this reads
// as one bad moment. The animation reads as a wait.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const BOX = 2; // left border
const SPLIT = 11; // the column rule between job id and rounds
const RIGHT = 77; // right border
const NAME = BOX + 2; // job id
const ROUND = [13, 21, 29, 37, 45, 53]; // one column per scan round
const WAIT = 62; // the counter on a91f's row
const AT = ["t2", "t8", "t14", "t20", "t26", "t32"];

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
      throw new Error(`UnluckyJob: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

// A table rule, with its cross on the column rule.
const rule = (l, x, r) =>
  l + "─".repeat(SPLIT - BOX - 1) + x + "─".repeat(RIGHT - SPLIT - 1) + r;

// A row of the table: the id, then whatever the rounds put in it.
const row = (name, cells) =>
  L(
    [BOX, [["gray", "│"]]],
    [NAME, typeof name === "string" ? [name] : name],
    [SPLIT, [["gray", "│"]]],
    ...cells,
    [RIGHT, [["gray", "│"]]]
  );

const WAITED = "waited 30s"; // the widest the counter ever gets

// --------------------------------------------------------------------- lines

const LINES = [
  L([
    BOX,
    [["gray", "six workers, each reaching for a fifth of what it can see"]],
  ]),
  L([BOX, [["gray", rule("┌", "┬", "┐")]]]),
  row(
    [["gray", "job"]],
    [
      ...ROUND.map((c, i) => [c, [[`#r${i}`, AT[i], "base"]]]),
      [WAIT, [["gray", "waiting"]]],
    ]
  ),
  L([BOX, [["gray", rule("├", "┼", "┤")]]]),
  row("b17c", [[ROUND[0], [["#b0", "taken", "green"]]]]),
  row("c04e", [
    [ROUND[0], [["#c0", "skip", "gray"]]],
    [ROUND[1], [["#c1", "taken", "green"]]],
  ]),
  row(
    [["red", "a91f"]],
    [
      ...ROUND.map((c, i) => [c, [[`#a${i}`, "skip", "red"]]]),
      [WAIT, [["#wait", WAITED, "amber"]]],
    ]
  ),
  L([BOX, [["gray", rule("└", "┴", "┘")]]]),
  [],
  L([
    0,
    [
      [
        "gray",
        "// the coin has no memory of how long a91f has been waiting, so",
      ],
    ],
  ]),
  L([0, [["gray", "// it can sit there for minutes while nothing is wrong."]]]),
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

// A round brings its own column header and a91f's latest rejection with it.
const round = (i) => [`r${i}`, `a${i}`];
const waited = (s) => ({ wait: `waited ${s}s` });

const STEPS = [
  {
    show: [...round(0), "b0", "c0"],
    focus: [...round(0), "b0"],
    text: waited(0),
    caption: "round one: b17c is picked up. the other two are passed over",
    ms: 2800,
  },
  {
    show: [...round(1), "c1"],
    focus: [...round(1), "c1"],
    text: waited(6),
    caption: "round two: c04e goes. a91f loses the flip again",
    ms: 2800,
  },
  {
    show: [...round(2), ...round(3)],
    focus: [...round(2), ...round(3)],
    text: waited(18),
    caption: "two more rounds, twelve more coin flips, same answer",
    ms: 2800,
  },
  {
    show: [...round(4), ...round(5)],
    focus: [...round(4), ...round(5), "wait"],
    text: waited(30),
    caption:
      "thirty seconds in, and nothing has gone wrong. that is the problem",
    ms: 3200,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: waited(30),
    caption: "randomness keeps workers off each other. it owes no job a turn",
    ms: 4000,
  },
];

export default function UnluckyJob({
  label = "FIG 13",
  title = "what a coin flip does to the job nobody picks",
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
