// Fig 01 — a cross-region lost update on a conditional write
// Standalone React component. Inline styles only, React is the only dependency.
import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["writer A        region A        region B        writer B"],
  ["    │               │               │               │"],
  ["    │ GET object    │               │               │"],
  ["    ├──────────────▶│               │               │"],
  ["    │               │ etag 1        │               │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ┤               │               │"],
  ["    │               │               │               │"],
  ["    │               │               │ GET object    │"],
  ["    │               │               │◀──────────────┤"],
  ["    │               │               │ etag 1        │"],
  ["    │               │               ├─ ─ ─ ─ ─ ─ ─ ▶│"],
  ["    │               │               │               │"],
  ["    │ PUT If-Match  │               │               │"],
  ["    ├──────────────▶│               │               │"],
  [
    "    │               │               │               │   ",
    ["gray", "region A sees etag 1,"],
  ],
  [
    "    │               │               │               │   ",
    ["gray", "the precondition holds,"],
  ],
  [
    "    │               │               │               │   ",
    ["gray", "so it accepts"],
  ],
  ["    │               │ 200 OK        │               │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ┤               │               │"],
  ["    │               │               │               │"],
  ["    │               │               │ PUT If-Match  │"],
  ["    │               │               │◀──────────────┤"],
  [
    "    │               │               │               │   ",
    ["gray", "region B has not seen"],
  ],
  [
    "    │               │               │               │   ",
    ["gray", "A's write. the etag is"],
  ],
  [
    "    │               │               │               │   ",
    ["gray", "still 1, so it accepts"],
  ],
  ["    │               │               │ 200 OK        │"],
  ["    │               │               ├─ ─ ─ ─ ─ ─ ─ ▶│"],
  ["    ·               ·               ·               ·"],
  [
    "    │               │               │               │   ",
    ["red", "both writers were told"],
  ],
  [
    "    │               │               │               │   ",
    ["red", "they won. one update is"],
  ],
  [
    "    │               │               │               │   ",
    ["red", "gone, with no 412 and"],
  ],
  [
    "    │               │               │               │   ",
    ["red", "no error"],
  ],
];

export default function LostUpdate({
  label = "FIG 01",
  title = "two regions adjudicate the same If-Match, and both say yes",
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
