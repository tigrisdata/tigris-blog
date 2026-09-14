// Fig 05 — a multi-region write with one follower down
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" client          gateway         leader        follower 1      follower 2"],
  ["    │               │               │               │               │"],
  ["    │ PUT object    │               │               │               │"],
  ["    ├──────────────▶│               │               │               │"],
  ["    │               │ bytes + meta  │               │               │"],
  ["    │               ├──────────────▶│               │               │"],
  [
    "    │               │               │               │               │   ",
    ["gray", "upload to the leader's block"],
  ],
  [
    "    │               │               │               │               │   ",
    ["gray", "store, commit the metadata:"],
  ],
  [
    "    │               │               │               │               │   ",
    ["gray", "ONE transaction writes the row"],
  ],
  [
    "    │               │               │               │               │   ",
    ["gray", "and enqueues replication"],
  ],
  [
    "    │               │ ",
    ["green", "committed"],
    "     │               │               │",
  ],
  ["    │               │◀─ ─ ─ ─ ─ ─ ─ ┤               │               │"],
  ["    │               │               │               │               │"],
  ["    │               │ apply this right now          │               │"],
  ["    │               ├───────────────┼──────────────▶│               │"],
  ["    │               │ apply this right now          │               │"],
  ["    │               ├───────────────┼───────────────┼──────────────▶│"],
  [
    "    │               │               │               │               │   ",
    ["gray", "pushed to every follower"],
  ],
  [
    "    │               │               │               │               │   ",
    ["gray", "at once, in parallel"],
  ],
  [
    "    │               │ ",
    ["green", "ok"],
    "            │               │               │",
  ],
  ["    │               │◀─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ┤               │"],
  [
    "    │               │ ",
    ["red", "error"],
    "         │               │               │",
  ],
  ["    │               │◀─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ┤"],
  ["    │               │               │               │               │"],
  [
    "    │ ",
    ["green", "200 OK"],
    "        │               │               │               │",
  ],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ┤               │               │               │"],
  [
    "    │               │               │               │               │   ",
    ["gray", "one follower is enough"],
  ],
  ["    ·               ·               ·               ·               ·"],
  [
    "    │               │               │               │               │   ",
    ["gray", "seconds later, the queue delivers"],
  ],
  [
    "    │               │               │               │               │   ",
    ["gray", "the same change all over again"],
  ],
  ["    │               │               │ queued copy   │               │"],
  ["    │               │               ├──────────────▶│               │"],
  [
    "    │               │               │               │               │   ",
    ["gray", "same timestamp, not newer:"],
  ],
  [
    "    │               │               │               │               │   ",
    ["gray", "follower 1 drops it"],
  ],
  ["    │               │               │ queued copy   │               │"],
  ["    │               │               ├───────────────┼──────────────▶│"],
  [
    "    │               │               │               │               │   ",
    ["gray", "nothing here yet, so it applies:"],
  ],
  [
    "    │               │               │               │               │   ",
    ["gray", "follower 2 catches up"],
  ],
];

export default function MultiRegionWrite({
  label = "FIG 05",
  title = "a multi-region write with one follower down",
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
