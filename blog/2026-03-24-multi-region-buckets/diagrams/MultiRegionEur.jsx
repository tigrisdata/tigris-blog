// Fig 01 — a multi-region bucket in the eur geography
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ┌─────────────────────┐     ┌───────────────┐     ┌─────────────────────┐      ┌─────┐",
  ],
  [
    "  │ multi-region bucket │ ──▶ │ EUR geography │ ──▶ │ Tigris auto-selects │ ──┬▶ │ ",
    ["green", "ams"],
    " │",
  ],
  [
    "  │ (eur)               │     └───────────────┘     │ regions within EUR  │   │  └─────┘",
  ],
  [
    "  └─────────────────────┘                           └─────────────────────┘   │  ┌─────┐",
  ],
  [
    "                                                                              └▶ │ ",
    ["green", "fra"],
    " │",
  ],
  [
    "                                                                                 └─────┘",
  ],
  [],
  [
    "  ",
    [
      "gray",
      "two or more copies — consistent reads and writes inside the geography",
    ],
  ],
];

export default function MultiRegionEur({
  label = "FIG 01",
  title = "a multi-region bucket in the eur geography",
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
