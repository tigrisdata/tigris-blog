// Fig 01 — every failable step forks the timeline
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ┌───────┐     ┌────────────────┐     ┌───────────────┐     ┌────────────┐",
  ],
  [
    "  │ start │ ──▶ │ create foo.txt │ ──▶ │ write to file │ ──▶ │ close file │ ──▶ ",
    ["green", "success ✓"],
  ],
  [
    "  └───────┘     └───────┬────────┘     └───────┬───────┘     └─────┬──────┘",
  ],
  [
    "                        │ ",
    ["gray", "can't open"],
    "           │ ",
    ["gray", "can't write"],
    "       │ ",
    ["gray", "can't close"],
  ],
  ["                        ▼                      ▼                   ▼"],
  [
    "                    ",
    ["red", "failure ✗"],
    "              ",
    ["red", "failure ✗"],
    "           ",
    ["red", "failure ✗"],
  ],
];

export default function ErrorForkFlow({
  label = "FIG 01",
  title = "every failable step forks the timeline",
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
