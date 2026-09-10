// Fig 02 — eleven million objects, one packfile, one index
// Standalone React component. Inline styles only, React is the only dependency.
// Static figure: same panel and palette as the other figures in this post.
//
// Generated art. Each .idx row is colour-paired with the run of bytes it points
// at — violet row to violet run, cyan to cyan, green to green — which is the
// whole point of the figure, so the last line says so out loud.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ",
    "$ git count-objects -v",
    "          ",
    ["cyan", ".git/objects/pack/"],
  ],
  [
    "  ",
    "count:            0",
    "             ",
    ["cyan", "└── pack-45986f41..c5786.pack   3.7 GiB"],
  ],
  ["  ", "in-pack:   11827138"],
  [
    "  ",
    "packs:            1",
    "             ",
    ["gray", "eleven million loose files would be"],
  ],
  [
    "  ",
    "size-pack:  3876775",
    "             ",
    ["gray", "eleven million inodes. so: one file."],
  ],
  [],
  ["  ", " .idx", "                            ", " .pack"],
  [
    "  ",
    "┌───────────────────────┐",
    "       ",
    "┌──────────────────────────────────────┐",
  ],
  [
    "  ",
    "│ ",
    ["violet", "0002ff4c..  0x0000c"],
    "   │",
    "       ",
    "│",
    ["cyan", "███"],
    " ",
    "██",
    " ",
    "████",
    " ",
    "█",
    " ",
    ["green", "███████"],
    " ",
    "██",
    " ",
    "█",
    " ",
    ["violet", "████"],
    " ",
    "██████",
    "│",
  ],
  [
    "  ",
    "│ ",
    ["cyan", "0031ab90..  0x0a13f"],
    "   │",
    "       ",
    "└──────────────────────────────────────┘",
  ],
  ["  ", "│ ", ["green", "1c7a26a9..  0x1f3a4"], "   │"],
  ["  ", "│ ", "...", "                   │"],
  ["  ", "└───────────────────────┘"],
  [],
  [
    "  ",
    [
      "gray",
      "each row's colour is the run of bytes its offset points at, so a",
    ],
  ],
  ["  ", ["gray", "read is a seek to an offset inside one very big file"]],
];

export default function PackfileAndIndex({
  label = "FIG 02",
  title = "Eleven million objects, one packfile, one index",
  fontSize,
}) {
  return (
    <AsciiFigure
      label={label}
      title={title}
      lines={LINES}
      fontSize={fontSize}
    />
  );
}
