// Fig 03 — a single-region bucket in sin
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  ┌──────────────────────┐      ┌─────────────────┐"],
  ["  │ single-region bucket │ ───▶ │ ", ["green", "sin"], " (Singapore) │"],
  ["  │ (sin)                │      └─────────────────┘"],
  ["  └──────────────────────┘"],
  [],
  [
    "  ",
    [
      "gray",
      "strong consistency within the region · no replication you don't need",
    ],
  ],
];

export default function SingleRegionSin({
  label = "FIG 03",
  title = "a single-region bucket in sin",
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
