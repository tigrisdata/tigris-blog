// Fig 02 — eleven million objects, one packfile, one index
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.
//
// Each .idx row is colour-paired with the run of bytes it points at, so the
// steps light a row and its block in the packfile together.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  [
    "  ",
    ["#cnt", "$ git count-objects -v", "base"],
    "          ",
    ["#pk", ".git/objects/pack/", "cyan"],
  ],
  [
    "  ",
    ["#cnt", "count:            0", "base"],
    "             ",
    ["#pk", "└── pack-45986f41..c5786.pack   3.7 GiB", "cyan"],
  ],
  ["  ", ["#cnt", "in-pack:   11827138", "base"]],
  [
    "  ",
    ["#cnt", "packs:            1", "base"],
    "             ",
    ["#inode", "eleven million loose files would be", "gray"],
  ],
  [
    "  ",
    ["#cnt", "size-pack:  3876775", "base"],
    "             ",
    ["#inode", "eleven million inodes. so: one file.", "gray"],
  ],
  [],
  [
    "  ",
    ["#ixl", " .idx", "base"],
    "                            ",
    ["#pkl", " .pack", "base"],
  ],
  [
    "  ",
    ["#ixb", "┌───────────────────────┐", "base"],
    "       ",
    ["#pkb", "┌──────────────────────────────────────┐", "base"],
  ],
  [
    "  ",
    ["#ixb", "│ ", "base"],
    ["#r1", "0002ff4c..  0x0000c", "violet"],
    ["#ixb", "   │", "base"],
    "       ",
    ["#pkb", "│", "base"],
    ["#b1", "███", "cyan"],
    " ",
    ["#b2", "██", "base"],
    " ",
    ["#b3", "████", "base"],
    " ",
    ["#b4", "█", "base"],
    " ",
    ["#b5", "███████", "green"],
    " ",
    ["#b6", "██", "base"],
    " ",
    ["#b7", "█", "base"],
    " ",
    ["#b8", "████", "violet"],
    " ",
    ["#b9", "██████", "base"],
    ["#pkb", "│", "base"],
  ],
  [
    "  ",
    ["#ixb", "│ ", "base"],
    ["#r2", "0031ab90..  0x0a13f", "cyan"],
    ["#ixb", "   │", "base"],
    "       ",
    ["#pkb", "└──────────────────────────────────────┘", "base"],
  ],
  [
    "  ",
    ["#ixb", "│ ", "base"],
    ["#r3", "1c7a26a9..  0x1f3a4", "green"],
    ["#ixb", "   │", "base"],
  ],
  [
    "  ",
    ["#ixb", "│ ", "base"],
    ["#rdots", "...", "base"],
    ["#ixb", "                   │", "base"],
  ],
  ["  ", ["#ixb", "└───────────────────────┘", "base"]],
];

const FRAME = [
  "ixl",
  "ixb",
  "r1",
  "r2",
  "r3",
  "rdots",
  "pkl",
  "pkb",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
];

const STEPS = [
  { show: ["cnt"], caption: "one repository, 11,827,138 objects in it" },
  {
    show: ["inode"],
    caption: "that many loose files would be that many inodes",
  },
  {
    show: ["pk"],
    focus: ["pk", "cnt"],
    caption: "so git bundles them into a single packfile instead",
  },
  {
    show: FRAME,
    caption: "and writes an index: one entry per object, and where it starts",
  },
  {
    show: [],
    focus: ["r1", "b8"],
    ms: 1700,
    caption: "0002ff4c starts at 0x0000c, and those bytes are its object",
  },
  {
    show: [],
    focus: ["r1", "b8", "r2", "b1"],
    ms: 1700,
    caption: "0031ab90 starts at 0x0a13f",
  },
  {
    show: [],
    focus: ["r1", "b8", "r2", "b1", "r3", "b5"],
    ms: 1700,
    caption:
      "1c7a26a9 at 0x1f3a4. the index is sorted by hash, the pack is not",
  },
  {
    show: [],
    focus: ["cnt", "pk", "inode", ...FRAME],
    caption: "so a read becomes a seek to an offset inside one big file",
  },
];

export default function PackfileAndIndex({
  label = "FIG 02",
  title = "Eleven million objects, one packfile, one index",
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
