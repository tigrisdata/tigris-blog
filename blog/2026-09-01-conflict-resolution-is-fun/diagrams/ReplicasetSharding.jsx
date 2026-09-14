// Fig 03 — sharding FoundationDB clusters into replicasets
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  S3 request"],
  ["  │"],
  ["  ▼"],
  [
    "  ┌─────────┐ ",
    ["gray", "── which replicaset holds this tenant? ──▶"],
    " ┌────────────────┐",
  ],
  [
    "  │ gateway │                                            │ shard mapping  │",
  ],
  [
    "  └─────────┘ ",
    ["gray", "◀─ ─ ─ ─ ─ ─  "],
    ["green", '"replicaset 2"'],
    ["gray", "  ─ ─ ─ ─ ─ ─  "],
    "│ cluster        │",
  ],
  [
    "       ",
    ["green", "║"],
    "                                                 └────────────────┘",
  ],
  ["       ", ["green", "╚═══════════════════╗"]],
  ["                           ", ["green", "▼"]],
  [
    "  ┌──────────────┐   ",
    ["green", "╔══════════════╗"],
    "   ┌──────────────┐",
  ],
  [
    "  │ replicaset 1 │   ",
    ["green", "║"],
    " replicaset 2 ",
    ["green", "║"],
    "   │ replicaset 3 │",
  ],
  [
    "  │ 2-3 FDB      │   ",
    ["green", "║"],
    " 2-3 FDB      ",
    ["green", "║"],
    "   │ 2-3 FDB      │",
  ],
  [
    "  │ clusters +   │   ",
    ["green", "║"],
    " clusters +   ",
    ["green", "║"],
    "   │ clusters +   │",
  ],
  [
    "  │ worker pool  │   ",
    ["green", "║"],
    " worker pool  ",
    ["green", "║"],
    "   │ worker pool  │",
  ],
  [
    "  └──────┬───────┘   ",
    ["green", "╚══════╤═══════╝"],
    "   └──────┬───────┘",
  ],
  ["         │                  │                  │"],
  ["         └──────────────────┼──────────────────┘"],
  ["                            ▼"],
  ["                 ", ["red", "┌───────────────────────┐"]],
  ["                 ", ["red", "│ global pointer table  │"]],
  ["                 ", ["red", "└───────────────────────┘"]],
];

export default function ReplicasetSharding({
  label = "FIG 03",
  title = "sharding FoundationDB clusters into replicasets",
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
