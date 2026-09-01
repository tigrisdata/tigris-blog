// Fig 04 — a clock-skew race resurrects a deleted object
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "./AsciiFigure";

const LINES = [
  [" client          Chicago (bucket owner)         Singapore"],
  ["    │                       │                       │"],
  ["    │ PUT thing.txt         │                       │"],
  ["    ├──────────────────────▶│                       │"],
  [
    "    │                       │                       │   ",
    ["gray", "stamped …000200"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "(the clock ran a hair fast)"],
  ],
  ["    │                       │                       │"],
  ["    │                       │ replicate @ …000200   │"],
  ["    │                       ├──────────────────────▶│"],
  [
    "    │                       │                       │   ",
    ["gray", "Singapore stores the"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "live copy @ …000200"],
  ],
  ["    │                       │                       │"],
  ["    │ DELETE thing.txt      │                       │"],
  ["    ├──────────────────────▶│                       │"],
  [
    "    │                       │                       │   ",
    ["gray", "the clock still reads …000100,"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "so the tombstone is stamped"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "BEHIND the row it deletes"],
  ],
  ["    │ 204 No Content        │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
  ["    │                       │                       │"],
  ["    │                       │ tombstone @ …000100   │"],
  ["    │                       ├──────────────────────▶│"],
  [
    "    │                       │                       │   ",
    ["gray", "…000100 is not newer than"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "…000200: the tombstone is"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "dropped, the live copy survives"],
  ],
  ["    │                       │                       │"],
  ["    │ GET thing.txt         │                       │"],
  ["    ├───────────────────────┼──────────────────────▶│"],
  ["    │ ", ["red", "200 OK, the deleted object is back"], "            │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  ["    │                       │                       │"],
  ["    │ PUT If-None-Match: *  │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │ ", ["red", "412 Precondition Failed"], "                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
];

export default function ClockSkewRace({
  label = "FIG 04",
  title = "a clock-skew race resurrects a deleted object",
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
