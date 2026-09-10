// Fig 06 — racing the beam: four ranged GETs while the container is 2 MiB in
// Standalone React component. Inline styles only, React is the only dependency.
// Static figure: same panel and palette as the other figures in this post.
//
// Generated art. The bar is 48 cells over a 128 MiB container, so one cell is
// 2.67 MiB and a 2 MiB download rounds up to a single filled cell. The four
// wanted objects sit at cells 6, 15, 29 and 40 — all of them past the beam, so
// every one of them is still a ranged GET. Each object's byte offset and its
// tick column are derived from the same cell number, so they cannot disagree.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  ", ["gray", "git wants four objects out of packs/019a7f3c..bin"]],
  [],
  [
    "         ",
    ["cyan", "A"],
    "        ",
    ["cyan", "B"],
    "             ",
    ["cyan", "C"],
    "          ",
    ["cyan", "D"],
  ],
  [
    "         ",
    ["cyan", "▼"],
    "        ",
    ["cyan", "▼"],
    "             ",
    ["cyan", "▼"],
    "          ",
    ["cyan", "▼"],
  ],
  ["  ", "┌────────────────────────────────────────────────┐"],
  [
    "  ",
    "│",
    ["green", "█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"],
    "│",
    "  ",
    ["green", "2 of 128 MiB in the temp file"],
  ],
  ["  ", "└─┬──────────────────────────────────────────────┘"],
  [
    "    ",
    ["amber", "└── the beam, 2 MiB in."],
    " ",
    ["gray", "everything right of it is still only in the bucket"],
  ],
  [],
  [
    "  ",
    ["gray", "obj  "],
    ["gray", "   sits at  "],
    ["gray", "what the read actually does           "],
    ["gray", "cost  "],
  ],
  [
    "  ",
    ["cyan", "A    "],
    ["cyan", " 16 MiB in  "],
    ["cyan", "GET Range: bytes=16777216-16779263    "],
    ["cyan", "1 RTT "],
    ["gray", "┐"],
  ],
  [
    "  ",
    ["cyan", "B    "],
    ["cyan", " 40 MiB in  "],
    ["cyan", "GET Range: bytes=41943040-41943551    "],
    ["cyan", "1 RTT "],
    ["gray", "│"],
    "  ",
    ["gray", "all four ranged GETs"],
  ],
  [
    "  ",
    ["cyan", "C    "],
    ["cyan", " 77 MiB in  "],
    ["cyan", "GET Range: bytes=81089877-81093972    "],
    ["cyan", "1 RTT "],
    ["gray", "│"],
    "  ",
    ["gray", "are in flight at once"],
  ],
  [
    "  ",
    ["cyan", "D    "],
    ["cyan", "107 MiB in  "],
    ["cyan", "GET Range: bytes=111848107-111856298  "],
    ["cyan", "1 RTT "],
    ["gray", "┘"],
  ],
  [],
  [
    "  ",
    [
      "gray",
      "the beam only moves right, so every object it passes stops needing a GET.",
    ],
  ],
];

export default function RacingTheBeam({
  label = "FIG 06",
  title = "Racing the beam: four ranged GETs while the container is 2 MiB in",
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
