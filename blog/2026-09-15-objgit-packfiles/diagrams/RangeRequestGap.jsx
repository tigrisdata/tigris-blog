// Fig 03 — the length a ranged GET needs is nowhere in a .idx
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  [
    "  ",
    ["#ixh", "what a .idx entry holds", "gray"],
    "                ",
    ["#rqh", "what a ranged GET needs", "gray"],
  ],
  [
    "  ",
    ["#ix", "┌──────────────────────────────┐", "base"],
    "      ",
    ["#rq", "┌──────────────────────────────┐", "base"],
  ],
  [
    "  ",
    ["#ix", "│ hash    1c7a26a901..ec7966   │", "base"],
    "      ",
    ["#rq", "│ first byte   ", "base"],
    ["#ok", "0x1f3a4", "green"],
    ["#rq", "         │", "base"],
  ],
  [
    "  ",
    ["#ix", "│ crc32   0x8f2a11bd           │", "base"],
    "      ",
    ["#rq", "│ last byte    ", "base"],
    ["#bad", "???????", "red"],
    ["#rq", "         │", "base"],
  ],
  [
    "  ",
    ["#ix", "│ offset  0x1f3a4              │", "base"],
    "      ",
    ["#rq", "└──────────────────────────────┘", "base"],
  ],
  [
    "  ",
    ["#ix", "└──────────────────────────────┘", "base"],
    "       ",
    ["#bad", "Range: bytes=127908-???????", "red"],
  ],
  ["  ", ["#ixn", "no length. anywhere. it is not a", "gray"]],
  ["  ", ["#ixn", "field the .idx format has at all.", "gray"]],
  [],
  ["  ", ["#ph", "and at 0x1f3a4, inside the .pack:", "gray"]],
  [
    "  ",
    [
      "#pb",
      "┌────────┬─────────────────────────────────────────────────┐",
      "base",
    ],
  ],
  [
    "  ",
    ["#pb", "│", "base"],
    " ",
    ["#hdr", "header", "amber"],
    " ",
    ["#pb", "│", "base"],
    " ",
    ["#zl", "zlib stream, ends when it ends", "base"],
    "                  ",
    ["#pb", "│", "base"],
  ],
  [
    "  ",
    [
      "#pb",
      "└────┬───┴─────────────────────────────────────────────────┘",
      "base",
    ],
  ],
  [
    "  ",
    ["#hn", "     └── type + the", "gray"],
    " ",
    ["#hn2", "decompressed", "amber"],
    " ",
    ["#hn", "size. never the stored one.", "gray"],
  ],
  [],
  [
    "  ",
    [
      "#dh",
      "and if that header says OBJ_REF_DELTA, the bytes you just paid for",
      "gray",
    ],
  ],
  ["  ", ["#dh", "are instructions, not an object:", "gray"]],
  [
    "  ",
    [
      "#dc",
      "   1c7a26a9 ──▶ 4f0be112 ──▶ 9ab3c0d7 ──▶ ...  up to 50 deep",
      "violet",
    ],
  ],
  [
    "  ",
    [
      "#dt",
      "     10 ms       10 ms        10 ms          one round trip each",
      "red",
    ],
  ],
];

const STEPS = [
  { show: ["ixh", "ix"], caption: "everything one .idx entry holds" },
  {
    show: ["rqh", "rq", "ok"],
    caption: "a ranged GET needs a first byte and a last byte",
  },
  {
    show: ["bad", "ixn"],
    focus: ["bad", "ixn", "ix"],
    caption: "the length is not there. it is not a field the format has",
  },
  {
    show: ["ph", "pb", "hdr", "zl"],
    caption:
      "seek to the offset and you land on a stream that ends when it ends",
  },
  {
    show: ["hn", "hn2"],
    focus: ["hn", "hn2", "hdr"],
    caption: "its header gives you the decompressed size, never the stored one",
  },
  {
    show: ["dh", "dc"],
    caption: "and what you paid for may be a delta against some other object",
  },
  {
    show: ["dt"],
    focus: ["dt", "dc"],
    caption: "which is another offset, another guess, another ten milliseconds",
  },
];

export default function RangeRequestGap({
  label = "FIG 03",
  title = "The one number a ranged GET needs, and where it isn't",
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
