// FIG 06 — claiming a job by pushing it out of reach of the scan
//
// Hand-written animated figure. var/quick-fdb-kafka-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js.
//
// Per .agents/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; every rule and every rail is computed from the
// columns it joins.
//
// The queue is drawn as one ordered keyspace with a divider at `now`. Left of
// the divider is what a scan of the front of the queue can see; right of it is
// the future. a91f is drawn twice, once at t2 and once at t8, because a claim
// does not mark the job — it moves the key. The step that claims it blanks the
// t2 copy and reveals the t8 copy, so the job visibly leaves the scan window
// without any other column shifting.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const BOX = 2; // left border of the keyspace
const W = 74; // inner width
const RIGHT = BOX + W + 1; // right border
const DIV = 48; // the `now` divider
const IN = [5, 18, 31]; // job slots left of the divider (vested)
const OUT = [52, 65]; // job slots right of it (not vested yet)
const OLD = IN[1]; // where a91f starts
const NEW = OUT[1]; // where the lease puts it
const MID = 4; // half of a 9-wide slot, for centring a rail under one

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
      throw new Error(`LeaseClaim: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

// A border of the keyspace box, with its tee on the divider column.
const edge = (l, t, r) =>
  l + rule(DIV - BOX - 1) + t + rule(RIGHT - DIV - 1) + r;

// A labelled rail from column `from` to column `to`, head included.
function rail(from, to, label) {
  const inner = to - from - 1;
  const text = ` ${label} `;
  if (text.length > inner) {
    throw new Error(`LeaseClaim: rail label too long: ${label}`);
  }
  const left = Math.floor((inner - text.length) / 2);
  return "└" + rule(left) + text + rule(inner - text.length - left) + "▶";
}

// A double-headed span `width` columns wide with its label centred in it.
function span(width, label) {
  const inner = width - 2;
  const text = ` ${label} `;
  if (text.length > inner) {
    throw new Error(`LeaseClaim: span label too long: ${label}`);
  }
  const left = Math.floor((inner - text.length) / 2);
  return "◀" + rule(left) + text + rule(inner - text.length - left) + "▶";
}

const job = (id, vest) => `[${id} ${vest}]`;

// --------------------------------------------------------------------- lines

const LINES = [
  L([
    BOX,
    [["gray", "w-7 wakes up and asks the queue for every job that has"]],
  ]),
  L([BOX, [["gray", "already vested: getRange( (gc, 0) .. (gc, now) )"]]]),
  [],
  L(
    [
      BOX + 1,
      [["#scan", span(DIV - BOX - 1, "the scan reaches this far"), "cyan"]],
    ],
    [OUT[0], [["gray", "the future"]]]
  ),
  L([BOX, [["gray", edge("┌", "┬", "┐")]]]),
  L(
    [BOX, [["gray", "│"]]],
    [IN[0], [["gray", job("b17c", "t1")]]],
    [OLD, [["#old", job("a91f", "t2"), "amber"]]],
    [IN[2], [["gray", job("c04e", "t5")]]],
    [DIV, [["gray", "│"]]],
    [OUT[0], [["gray", job("d22a", "t9")]]],
    [NEW, [["#new", job("a91f", "t8"), "green"]]],
    [RIGHT, [["gray", "│"]]]
  ),
  L([BOX, [["gray", edge("└", "┴", "┘")]]]),
  L(
    [BOX + 1, [["gray", "0"]]],
    [OLD + MID, [["#move", "│", "green"]]],
    [DIV - MID, [["gray", "now = t6"]]]
  ),
  L([
    OLD + MID,
    [
      [
        "#move",
        rail(OLD + MID, NEW + MID, "clear at t2, set at t8, workerId = w-7"),
        "green",
      ],
    ],
  ]),
  [],
  L([
    BOX,
    [
      [
        "#expire",
        "when now catches up to t8, a91f drops back into the window for anyone to take",
        "red",
      ],
    ],
  ]),
  [],
  L([
    0,
    [["gray", "// there is no claim flag and no lock table. moving the key"]],
  ]),
  L([0, [["gray", "// out past now is the claim, and t8 is the deadline."]]]),
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
    show: ["scan", "old"],
    focus: ["scan"],
    caption: "the scan only reaches the front of the queue: keys from 0 to now",
    ms: 2600,
  },
  {
    focus: ["old"],
    caption: "a91f vested at t2, so it is inside the window. w-7 wants it",
    ms: 2400,
  },
  {
    show: ["move", "new"],
    focus: ["move", "new"],
    text: { old: " " },
    caption: "one transaction: clear the key at t2, write the same job at t8",
    ms: 3000,
  },
  {
    focus: ["scan", "new"],
    text: { old: " " },
    caption: "a91f now sits past now, where no scan of the front can reach it",
    ms: 2800,
  },
  {
    show: ["expire"],
    focus: ["expire", "new"],
    text: { old: " " },
    caption: "that is the whole lease: a deadline spelled out in the key",
    ms: 3200,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: { old: " " },
    caption: "one key, doing the work of a claim, a lock and a deadline",
    ms: 4000,
  },
];

export default function LeaseClaim({
  label = "FIG 06",
  title = "claiming a job by pushing it out of reach of the scan",
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
