// Fig 02 — acting on the scan verdict
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ┌───────┐             ┌──────────────┐      ┌───────────────┐ ",
    ["red", "malicious"],
    " ┌──────────────┐",
  ],
  [
    "  │ queue │ ──────────▶ │ async worker │ ───▶ │ external hash │ ────────▶ │ ",
    ["red", "flag content"],
    " │",
  ],
  [
    "  └───────┘ ",
    ["gray", "reads entry"],
    " └──────────────┘      │ scan verdict? │           │ ",
    ["red", "in system"],
    "    │",
  ],
  [
    "                                              └───────┬───────┘           └──────┬───────┘",
  ],
  [
    "                                                ",
    ["gray", "clean"],
    " │                          │",
  ],
  [
    "                                                      ▼                          │",
  ],
  [
    "                                                ┌──────────┐                     │",
  ],
  [
    "                                                │ complete │ ◀───────────────────┘",
  ],
  ["                                                └──────────┘"],
];

export default function ScanVerdictFlow({
  label = "FIG 02",
  title = "acting on the scan verdict",
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
