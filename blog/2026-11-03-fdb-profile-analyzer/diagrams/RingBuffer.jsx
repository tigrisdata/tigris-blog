// FIG 01 — the profiling ring buffer, two writes after it fills
//
// Hand-written animated figure. var/fdb-profile-analyzer-diagrams.mjs does
// NOT generate this file; it only re-exports it from index.js and checks
// every frame of it.
//
// Per .claude/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every row goes through L(), which pads to absolute columns and
// throws if two cells collide; every border is computed from the slot count.
//
// Eight slots. The buffer is already full when the figure starts, so the next
// write has nowhere to go but on top of the oldest record. The head marker is
// drawn under three slots and blanked as it moves, so nothing ever shifts.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const BOX = 2; // left border of the buffer
const SLOTS = 8;
const CW = 5; // inner width of one slot
const slotAt = (i) => BOX + 1 + i * (CW + 1); // first column inside slot i
const mid = (i) => slotAt(i) + 2; // centre column of slot i
const RIGHT = BOX + SLOTS * (CW + 1); // right border

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
      throw new Error(`RingBuffer: column ${at} is already past ${col}`);
    }
    if (at > col) out.push(" ".repeat(at - col));
    out.push(...segs);
    col = at + segsWidth(segs);
  }
  return out;
}

// A border of the buffer, with a tee between every pair of slots.
const edge = (l, t, r) =>
  l + Array.from({ length: SLOTS }, () => rule(CW)).join(t) + r;

// A record name inside a slot, one space in from the left wall.
function cell(t) {
  if (t.length > CW - 2) throw new Error(`RingBuffer: "${t}" is too wide`);
  return (" " + t).padEnd(CW);
}

// --------------------------------------------------------------------- lines

// The slots that get overwritten have their own tags, because each one takes
// different replacement text. The rest share one.
const slotTag = (i) => (i < 2 ? `#s${i}` : "#kept");

const LINES = [
  L(
    [slotAt(0), [["#w0", cell("t9"), "green"]]],
    [slotAt(1), [["#w1", cell("t10"), "green"]]]
  ),
  L([mid(0), [["#v0", "▼", "green"]]], [mid(1), [["#v1", "▼", "green"]]]),
  L([BOX, [["gray", edge("┌", "┬", "┐")]]]),
  L(
    ...Array.from({ length: SLOTS }, (_, i) => [
      [slotAt(i) - 1, [["gray", "│"]]],
      [slotAt(i), [[slotTag(i), cell(`t${i + 1}`), "base"]]],
    ]).flat(),
    [RIGHT, [["gray", "│"]]]
  ),
  L([BOX, [["gray", edge("└", "┴", "┘")]]]),
  L(...[0, 1, 2].map((i) => [mid(i), [[`#h${i}`, "▲", "base"]]])),
  L(...[0, 1, 2].map((i) => [mid(i) - 1, [[`#hd${i}`, "head", "base"]]])),
  [],
  L([
    BOX,
    [
      [
        "#lost",
        "t1 and t2 are gone for good. the oldest surviving record is t3",
        "red",
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

// The head is drawn in three places. Moving it means blanking the copies
// behind it; an empty string is falsy, so the blank is one space.
const AFTER_T9 = { s0: cell("t9"), h0: " ", hd0: " " };
const AFTER_T10 = {
  ...AFTER_T9,
  s1: cell("t10"),
  h1: " ",
  hd1: " ",
};

const STEPS = [
  {
    show: ["s0", "s1", "kept", "h0", "hd0"],
    caption:
      "write #8: the buffer is full and the head wraps back to the start",
    ms: 2600,
  },
  {
    show: ["w0", "v0", "h1", "hd1"],
    focus: ["w0", "v0", "s0", "h1", "hd1"],
    text: AFTER_T9,
    caption: "write #9: t9 lands on top of t1 and the head moves on",
    ms: 2800,
  },
  {
    show: ["w1", "v1", "h2", "hd2"],
    focus: ["w1", "v1", "s1", "h2", "hd2"],
    text: AFTER_T10,
    caption: "write #10: t10 lands on top of t2",
    ms: 2800,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    text: AFTER_T10,
    caption: "anything older than one lap is not anywhere",
    ms: 4000,
  },
];

const LABEL = "FIG 01";
const TITLE = "the profiling ring buffer, two writes after it fills";

export default function RingBuffer({ label = LABEL, title = TITLE, fontSize }) {
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
