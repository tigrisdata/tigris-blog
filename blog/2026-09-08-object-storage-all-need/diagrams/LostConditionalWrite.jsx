// Fig 02 — the same compare-and-swap accepted in two regions
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["writer A        writer B          region 1          region 2"],
  ["    │               │                 │                 │"],
  ["    │ PUT If-Match: etag-1            │                 │"],
  ["    ├───────────────┼────────────────▶│                 │"],
  [
    "    │               │                 │                 │   ",
    ["gray", "region 1 compares etag-1 to"],
  ],
  [
    "    │               │                 │                 │   ",
    ["gray", "what it holds: they match"],
  ],
  [
    "    │ ",
    ["green", "200 OK"],
    "        │                 │                 │",
  ],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ┤                 │"],
  ["    │               │                 │                 │"],
  ["    │               │ PUT If-Match: etag-1              │"],
  ["    │               ├─────────────────┼────────────────▶│"],
  [
    "    │               │                 │                 │   ",
    ["gray", "region 2 has not seen A's"],
  ],
  [
    "    │               │                 │                 │   ",
    ["gray", "write yet, so etag-1 still"],
  ],
  [
    "    │               │                 │                 │   ",
    ["gray", "matches there too"],
  ],
  [
    "    │               │ ",
    ["green", "200 OK"],
    "          │                 │",
  ],
  ["    │               │◀─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  [
    "    │               │                 │                 │   ",
    ["gray", "both writers were told they won"],
  ],
  ["    ·               ·                 ·                 ·"],
  [
    "    │               │                 │                 │   ",
    ["gray", "replication converges"],
  ],
  [
    "    │               │                 │ ",
    ["red", "B's version"],
    "     │",
  ],
  ["    │               │                 │◀─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  [
    "    │               │                 │                 │   ",
    ["gray", "last write wins, so region 1"],
  ],
  [
    "    │               │                 │                 │   ",
    ["gray", "adopts B's version"],
  ],
  [
    "    │               │                 │                 │   ",
    ["red", "A's write is not merged and not"],
  ],
  [
    "    │               │                 │                 │   ",
    ["red", "reported. It is simply gone."],
  ],
];

export default function LostConditionalWrite({
  label = "FIG 02",
  title = "the same compare-and-swap accepted in two regions",
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
