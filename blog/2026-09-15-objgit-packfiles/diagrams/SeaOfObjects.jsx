// Fig 01 — a sea of objects, and a few names into it
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  ["  .git/objects/                    ", ["#ref", "refs/heads/main", "amber"]],
  ["                                     ", ["#ref", "│", "amber"]],
  [
    "  ",
    ["#d1", "├── 1c/7a26a901..ec7966", "violet"],
    "  ",
    ["#a1", "─────▶", "gray"],
    "  ",
    ["#n1", "commit 1c7a26a", "violet"],
  ],
  [
    "  ",
    ["#d1", "│", "violet"],
    "                                  ",
    ["#e1", "│", "base"],
  ],
  [
    "  ",
    ["#d2", "├── 8e/67afbb2e..857bd3", "cyan"],
    "  ",
    ["#a2", "─────▶", "gray"],
    "    ",
    ["#n2", "tree 8e67afb", "cyan"],
  ],
  [
    "  ",
    ["#d2", "│", "cyan"],
    "                                  ",
    ["#e2", "│", "base"],
    "  ",
    ["#e2", "hello.txt", "base"],
  ],
  [
    "  ",
    ["#d3", "└── 9c/c9867337..09fe26", "green"],
    "  ",
    ["#a3", "─────▶", "gray"],
    "    ",
    ["#n3", "blob 9cc9867", "green"],
  ],
  [
    "                                          ",
    ["#ct", '"Hello, blog!"', "green"],
  ],
  [],
  [
    "  ",
    [
      "#hint",
      "the filename is the sha1 of the bytes in the file, so the same",
      "gray",
    ],
  ],
  [
    "  ",
    ["#hint", "content is always, everywhere, the very same object", "gray"],
  ],
];

const STEPS = [
  {
    show: ["d1", "d2", "d3"],
    caption: "three files under .git/objects, one per object",
  },
  {
    show: ["hint"],
    caption: "the filename is the sha1 of what is inside the file",
  },
  {
    show: ["ref", "a1", "n1"],
    caption: "a named reference points at exactly one of them",
  },
  {
    show: ["e1", "a2", "n2"],
    focus: ["n1", "e1", "a2", "n2"],
    caption: "the commit names a tree",
  },
  {
    show: ["e2", "a3", "n3", "ct"],
    focus: ["n2", "e2", "a3", "n3", "ct"],
    caption: "the tree names a blob, which is the file you wrote",
  },
  {
    show: [],
    focus: [
      "ref",
      "d1",
      "d2",
      "d3",
      "a1",
      "a2",
      "a3",
      "n1",
      "n2",
      "n3",
      "e1",
      "e2",
      "ct",
      "hint",
    ],
    caption: "a repository is a sea of objects and a few names into it",
  },
];

export default function SeaOfObjects({
  label = "FIG 01",
  title = "A sea of objects, and a few names into it",
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
