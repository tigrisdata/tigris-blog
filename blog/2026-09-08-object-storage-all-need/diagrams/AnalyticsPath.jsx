// Fig 03 — the analytics path, with no warehouse in it
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" ┌─────────────────────────────────────────────┐"],
  [
    " │ customer host                               │    ",
    ["gray", "every frame, not a 1% sample"],
  ],
  [" │                                             │"],
  [" │   agent frames  ─▶  supervisor reduces      │"],
  [" │                                             │"],
  [" └──────────────────────┬──────────────────────┘"],
  [
    "                        │                           ",
    ["gray", "sketches, masked templates, rollups"],
  ],
  [
    "                        │                           ",
    ["gray", "per agent, per 60 second window"],
  ],
  ["                        ▼"],
  [" ┌─────────────────────────────────────────────┐"],
  [
    " │ ",
    ["green", "that customer's Tigris bucket"],
    "               │    ",
    ["gray", "append-only, and not addressable"],
  ],
  [
    " │                                             │    ",
    ["gray", "by any other customer's keys"],
  ],
  [" │   analytics/{agent_id}/{window}.pb          │"],
  [" │                                             │"],
  [" └──────────────────────┬──────────────────────┘"],
  [
    "                        │                           ",
    ["gray", "read over httpfs, one bucket at a time"],
  ],
  ["                        ▼"],
  [" ┌─────────────────────────────────────────────┐"],
  [" │ DuckDB                                      │"],
  [" │                                             │"],
  [
    " │   SELECT over the files, in place           │    ",
    ["gray", "no columnar warehouse in the path"],
  ],
  [" │                                             │"],
  [" └─────────────────────────────────────────────┘"],
];

export default function AnalyticsPath({
  label = "FIG 03",
  title = "the analytics path, with no warehouse in it",
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
