// Fig 01 — Prism write and read paths on Tigris
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["                                    ┌────────────────────────────────┐"],
  [
    "                                ┌──▶│ batch of blocks, 1 Vortex file │───┐   ",
    ["green", "┌──────────────────────────┐"],
  ],
  [
    "┌───────────┐     ┌────────┐    │   └────────────────────────────────┘   │   ",
    ["green", "│ Tigris bucket            │"],
  ],
  [
    "│ chain RPC │────▶│ writer │────┤                                        ├──▶",
    ["green", "│ "],
    "global, no egress fees   ",
    ["green", "│"],
  ],
  [
    "└───────────┘     └────────┘    │   ┌────────────────────────────────┐   │   ",
    ["green", "│ "],
    ["gray", "each chain stored once   "],
    ["green", "│"],
  ],
  [
    "                                ├──▶│ SlateDB index                  │───┘   ",
    ["green", "└──────────────────────────┘"],
  ],
  [
    "                                │   └────────────────────────────────┘                    ▲",
  ],
  [
    "                                │ ",
    ["gray", "notify tip window                                       "],
    "│",
  ],
  [
    "                                │                                                         │ ",
    ["gray", "<1% of reads"],
  ],
  [
    "                                ▼                                                         │ ",
    ["green", "10 to 800 ms"],
  ],
  [
    "                  ┌────────────────────────────┐          ",
    ["green", "┌────────────────────────┐      "],
    "│",
  ],
  [
    "                  │ reader                     │   ",
    ["gray", "miss   "],
    ["green", "│ TAG cache              │ "],
    ["gray", "miss "],
    "│",
  ],
  [
    ["gray", "request "],
    "─────────▶│ ",
    ["gray", "tip window in memory       "],
    "│─────────▶",
    ["green", "│ "],
    "gp3 in region          ",
    ["green", "│"],
    "──────┘",
  ],
  [
    "                  │ ",
    ["gray", "~90% of reads       "],
    ["green", "< 1 ms "],
    "│          ",
    ["green", "│ "],
    ["gray", "~9% of reads     "],
    ["green", "~9 ms │"],
  ],
  [
    "                  └────────────────────────────┘          ",
    ["green", "└────────────────────────┘"],
  ],
];

export default function PrismArchitecture({
  label = "FIG 01",
  title = "Prism writes each chain once to Tigris and reads through memory, then TAG, then the bucket",
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
