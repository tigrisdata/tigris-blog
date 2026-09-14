// Fig 02 — a dual-region bucket pinned to iad and sjc
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  ┌────────────────────┐      ┌────────────────┐"],
  ["  │ dual-region bucket │ ──┬▶ │ ", ["green", "iad"], " (Ashburn)  │"],
  ["  │ (iad,sjc)          │   │  └────────────────┘"],
  ["  └────────────────────┘   │  ┌────────────────┐"],
  ["                           └▶ │ ", ["green", "sjc"], " (San Jose) │"],
  ["                              └────────────────┘"],
  [],
  [
    "  ",
    [
      "gray",
      "writes go to every named region · reads route to the closest copy",
    ],
  ],
];

export default function DualRegionPinned({
  label = "FIG 02",
  title = "a dual-region bucket pinned to iad and sjc",
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
