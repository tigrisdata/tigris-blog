// Fig 01 — the single-region write path
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "./AsciiFigure";

const LINES = [
  [
    "  ┌────────────┐      ┌────────────────────┐      ┌───────────────────────────────┐",
  ],
  [
    "  │ client     │ ───▶ │ nearest Tigris     │ ───▶ │ owning region                 │",
  ],
  [
    "  │ PutObject  │      │ gateway            │      │                               │",
  ],
  [
    "  └────────────┘      │                    │      │ 1. bytes ──▶ block store      │",
  ],
  [
    "                      │ which region owns  │      │ 2. metadata ──▶ FoundationDB  │",
  ],
  [
    "                      │ this bucket?       │      │    ",
    ["gray", "(one gRPC commit)"],
    "          │",
  ],
  [
    "                      └────────────────────┘      │ 3. ",
    ["green", "return success"],
    "             │",
  ],
  [
    "                                                  └───────────────┬───────────────┘",
  ],
  ["                                                                  │"],
  [
    "                                                      ",
    ["gray", "reads queue"],
    " │ ",
    ["gray", "(async)"],
  ],
  ["                                                                  ▼"],
  [
    "                                                  ┌───────────────────────────────┐",
  ],
  [
    "                                                  │ replication worker            │",
  ],
  [
    "                                                  │ every other region gets       │",
  ],
  [
    "                                                  │ a read-only copy              │",
  ],
  [
    "                                                  └───────────────────────────────┘",
  ],
];

export default function SingleRegionFlow({
  label = "FIG 01",
  title = "the single-region write path",
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
