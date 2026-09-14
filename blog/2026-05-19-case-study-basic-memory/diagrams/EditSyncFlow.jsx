// Fig 02 — how an edit flows through Basic Memory
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ┌───────────────┐                     ┌───────────────┐               ┌────────────────┐",
  ],
  [
    "  │ local machine │ ◀─────────────────▶ │ ",
    ["green", "Tigris bucket"],
    " │ ────────────▶ │ cloud API      │",
  ],
  [
    "  └───────────────┘    ",
    ["gray", "rclone bisync,"],
    "   │ ",
    ["green", "per-tenant"],
    "    │  ",
    ["gray", "bucket-event"],
    " │ Postgres index │",
  ],
  [
    "                    ",
    ["gray", "X-Tigris-Consistent"],
    " └───────────────┘    ",
    ["gray", "webhook"],
    "    └─────┬──────────┘",
  ],
  [
    "                                                                              │",
  ],
  [
    "                                                  ┌───────────────────────────┤",
  ],
  [
    "                                                  ▼                           ▼",
  ],
  [
    "                                            ┌────────────┐         ┌────────────────────┐",
  ],
  [
    "                                            │ web editor │         │ remote MCP clients │",
  ],
  [
    "                                            └────────────┘         └────────────────────┘",
  ],
];

export default function EditSyncFlow({
  label = "FIG 02",
  title = "how an edit flows through Basic Memory — every path converges at the index",
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
