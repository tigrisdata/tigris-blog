// Fig 01 — flagging uploads for scanning
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ┌──────┐            ┌───────────────┐      ┌─────────────────┐  ",
    ["gray", "yes"],
    "   ┌───────────────┐",
  ],
  [
    "  │ user │ ─────────▶ │ Tigris server │ ───▶ │ needs scanning? │ ─────▶ │ enqueue entry │",
  ],
  [
    "  └──────┘  ",
    ["gray", "PutObject"],
    " └───────────────┘      └────────┬────────┘        │ for scanning  │",
  ],
  [
    "                                                   ",
    ["gray", "no"],
    " │                 └───────┬───────┘",
  ],
  [
    "                                                      ▼                         │",
  ],
  [
    "                                                ┌──────────┐                    │",
  ],
  [
    "                                                │ complete │ ◀──────────────────┘",
  ],
  ["                                                └──────────┘"],
];

export default function ScanDecisionFlow({
  label = "FIG 01",
  title = "flagging uploads for scanning",
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
