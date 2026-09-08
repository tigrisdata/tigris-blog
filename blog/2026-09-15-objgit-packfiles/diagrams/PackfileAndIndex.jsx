// Fig 02 — eleven million objects, one packfile, one index
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.

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
    ["#ix", " .idx", "base"],
    "                            ",
    ["#pkb", " .pack", "base"],
  ],
  [
    "  ",
    ["#ix", "┌───────────────────────┐", "base"],
    "       ",
    ["#pkb", "┌──────────────────────────────────────┐", "base"],
  ],
  [
    "  ",
    ["#ix", "│ 0002ff4c..  0x0000c   │", "base"],
    "       ",
    ["#pkb", "│███ ██ ████ █ ███████ ██ █ ████ ██████│", "base"],
  ],
  [
    "  ",
    ["#ix", "│ 0031ab90..  0x0a13f   │", "base"],
    "       ",
    ["#pkb", "└──────", "base"],
    ["#seek", "▲", "amber"],
    ["#pkb", "───────────────────────────────┘", "base"],
  ],
  [
    "  ",
    ["#ix", "│ 1c7a26a9..  0x1f3a4   │", "base"],
    ["#seek", "──────────────┘", "amber"],
  ],
  ["  ", ["#ix", "│ ...                   │", "base"]],
  ["  ", ["#ix", "└───────────────────────┘", "base"]],
  [],
  [
    "  ",
    [
      "#fast",
      "on a filesystem git mmaps the .pack and the kernel pages it in",
      "green",
    ],
    "   ",
    ["#fast", "~10 ns", "green"],
  ],
  [
    "  ",
    [
      "#slow",
      "over the network that same seek is a GetObject round trip",
      "red",
    ],
    "        ",
    ["#slow", "~10 ms", "red"],
  ],
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
    show: ["ix", "pkb"],
    caption: "and writes an index saying which object starts at which byte",
  },
  {
    show: ["seek"],
    focus: ["seek", "pkb", "ix"],
    caption: "a read becomes a seek to an offset in one big file",
  },
  {
    show: ["fast"],
    caption: "mmapped, the kernel pages it in and that seek is free",
  },
  {
    show: ["slow"],
    caption: "over the network it is a round trip. a million times slower",
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
