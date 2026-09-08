// Fig 04 — how CD archival split the bytes from the map
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  [
    "  ",
    [
      "#h1",
      "one disc, one session, five tracks, and a table of contents",
      "gray",
    ],
  ],
  [],
  [
    "  ",
    [
      "#t",
      "┌──────┬──────┬──────┬────────────────┬────────────────────────┐",
      "base",
    ],
  ],
  [
    "  ",
    [
      "#t",
      "│  01  │  02  │  03  │       04       │  05                    │",
      "base",
    ],
  ],
  [
    "  ",
    [
      "#t",
      "└──────┴──────┴──────┴────────────────┴────────────────────────┘",
      "base",
    ],
  ],
  ["  ", ["#tt", "  0:00   3:12   6:40   9:05              26:31", "gray"]],
  [],
  [
    "  ",
    [
      "#toc",
      "the TOC holds every track's start, so the player drops the laser",
      "gray",
    ],
  ],
  [
    "  ",
    [
      "#toc",
      "straight onto track 04 without reading a thing before it.",
      "gray",
    ],
  ],
  [],
  ["  ", ["#h2", "unless your mastering team did this:", "gray"]],
  [],
  [
    "  ",
    [
      "#d",
      "┌──────────────────────────────────────────────────────────────┐",
      "base",
    ],
  ],
  [
    "  ",
    [
      "#d",
      "│  01   Dancing Mad, all four movements                  17:33 │",
      "base",
    ],
  ],
  [
    "  ",
    ["#d", "└───────────────────────────────────", "base"],
    ["#dm", "▲", "amber"],
    ["#d", "──────────────────────────┘", "base"],
  ],
  [
    "  ",
    [
      "#dmn",
      "                                    └── movement IV is at 9:50.",
      "gray",
    ],
  ],
  [
    "  ",
    [
      "#dmn",
      "                                        no entry for it. you",
      "gray",
    ],
  ],
  [
    "  ",
    [
      "#dmn",
      "                                        just have to know.",
      "gray",
    ],
  ],
  [],
  ["  ", ["#h3", "so an archive splits the bytes from the map:", "gray"]],
  [],
  [
    "  ",
    ["#cue", "image.cue", "cyan"],
    "                          ",
    ["#bin", "image.bin", "base"],
  ],
  [
    "  ",
    ["#cue", "TRACK 01 AUDIO INDEX 01 00:00:00", "cyan"],
    "   ",
    ["#bin", "┌────────────────────────────┐", "base"],
  ],
  [
    "  ",
    ["#cue", "TRACK 02 AUDIO INDEX 01 03:12:00", "cyan"],
    "   ",
    ["#bin", "│████████████████████████████│", "base"],
  ],
  [
    "  ",
    ["#cue", "TRACK 03 AUDIO INDEX 01 06:40:00", "cyan"],
    "   ",
    ["#bin", "└────────────────────────────┘", "base"],
  ],
  [
    "  ",
    [
      "#cuen",
      "a parser, not a player, and it seeks straight to any of them.",
      "gray",
    ],
  ],
];

const STEPS = [
  { show: ["h1", "t", "tt"], caption: "a disc: one session, five tracks" },
  {
    show: ["toc"],
    focus: ["toc", "tt"],
    caption: "the table of contents holds every track's start",
  },
  {
    show: ["h2", "d"],
    caption: "unless the whole side is one seventeen-minute track",
  },
  {
    show: ["dm", "dmn"],
    caption: "then there is no entry for the part you actually wanted",
  },
  {
    show: ["h3", "cue", "bin"],
    caption: "so an archive splits the bytes from the map: .bin and .cue",
  },
  {
    show: ["cuen"],
    focus: ["cuen", "cue"],
    caption: "and the map is small enough to read before you fetch anything",
  },
];

export default function CueSheetSeek({
  label = "FIG 04",
  title = "How CD archival split the bytes from the map",
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
