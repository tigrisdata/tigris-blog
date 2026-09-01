// Fig 06 — the failed write that succeeds anyway
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "./AsciiFigure";

const LINES = [
  [" client            gateway           leader          every follower"],
  ["    │                 │                 │                   │"],
  ["    │ PUT object      │                 │                   │"],
  ["    ├────────────────▶│                 │                   │"],
  ["    │                 │ commit the metadata                 │"],
  ["    │                 ├────────────────▶│                   │"],
  [
    "    │                 │                 │                   │   ",
    ["gray", "the row is written and durable."],
  ],
  [
    "    │                 │                 │                   │   ",
    ["gray", "there is no undo from here"],
  ],
  [
    "    │                 │ ",
    ["green", "committed"],
    "       │                   │",
  ],
  ["    │                 │◀─ ─ ─ ─ ─ ─ ─ ─ ┤                   │"],
  ["    │                 │                 │                   │"],
  ["    │                 │ apply this right now                │"],
  ["    │                 ├─────────────────┼──────────────────▶│"],
  [
    "    │                 │ ",
    ["red", "error"],
    "           │                   │",
  ],
  ["    │                 │◀─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  ["    │                 │                 │                   │"],
  [
    "    │ ",
    ["red", "5xx, your write failed"],
    "            │                   │",
  ],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ┤                 │                   │"],
  [
    "    │                 │                 │                   │   ",
    ["gray", "no follower succeeded"],
  ],
  ["    ·                 ·                 ·                   ·"],
  [
    "    │                 │                 │                   │   ",
    ["gray", "but the queued copy was already"],
  ],
  [
    "    │                 │                 │                   │   ",
    ["gray", "durable, committed in the same"],
  ],
  [
    "    │                 │                 │                   │   ",
    ["gray", "transaction as the row"],
  ],
  ["    │                 │                 │ queued copy       │"],
  ["    │                 │                 ├──────────────────▶│"],
  [
    "    │                 │                 │                   │   ",
    ["gray", "applies normally"],
  ],
  ["    │                 │                 │                   │"],
  [
    "    │                 │                 │                   │   ",
    ["red", "the write you were told failed is"],
  ],
  [
    "    │                 │                 │                   │   ",
    ["red", "now readable in every region"],
  ],
];

export default function PhantomWrite({
  label = "FIG 06",
  title = "the failed write that succeeds anyway",
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
