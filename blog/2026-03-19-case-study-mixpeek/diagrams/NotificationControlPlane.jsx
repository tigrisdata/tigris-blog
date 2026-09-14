// Fig 01 — object events flow from Tigris into Mixpeek ingestion and indexing
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ",
    ["green", "┌──────────────────┐"],
    "   ",
    ["gray", "OBJECT_CREATED_*"],
    "    ",
    "┌──────────────────┐",
  ],
  [
    "  ",
    ["green", "│ Tigris bucket    │"],
    "   ",
    ["gray", "OBJECT_DELETED_*"],
    "    ",
    "│ object           │",
  ],
  [
    "  ",
    ["green", "│ videos, images,  │"],
    " ────────────────────▶ ",
    "│ notification     │",
  ],
  [
    "  ",
    ["green", "│ PDFs             │"],
    "                       │ webhook          │",
  ],
  [
    "  ",
    ["green", "└──────────────────┘"],
    "                       └────────┬─────────┘",
  ],
  ["                                                      ", ["gray", "│"]],
  ["              ", ["gray", "┌───────────────────────────────────────┘"]],
  ["              ", ["gray", "▼"]],
  ["  ┌────────────────────────┐      ┌────────────────────────┐"],
  ["  │ Mixpeek ingestion      │ ───▶ │ extraction + indexing  │"],
  ["  │ idempotent, DLQ-aware  │      │ embeddings, manifests  │"],
  ["  └────────────────────────┘      └────────────────────────┘"],
];

export default function NotificationControlPlane({
  label = "FIG 01",
  title = "object events flow from Tigris into Mixpeek ingestion and indexing",
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
