// Fig 03 — the end-to-end flow from upload to query
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  ┌────────────────┐      ┌────────────────┐      ┌────────────────────┐"],
  ["  │ write object   │ ───▶ │ Tigris object  │ ───▶ │ Mixpeek receives   │"],
  ["  │ to Tigris      │      │ notification   │      │ event, checks      │"],
  ["  │ (S3-compatible │      │ webhook        │      │ idempotency key    │"],
  ["  │ upload)        │      └────────────────┘      └─────────┬──────────┘"],
  [
    "  └────────────────┘                                        ",
    ["gray", "│"],
  ],
  [
    "              ",
    ["gray", "┌─────────────────────────────────────────────┘"],
  ],
  ["              ", ["gray", "▼"]],
  [
    "  ┌─────────────────────────┐      ┌──────────────┐      ",
    ["green", "┌───────────────────┐"],
  ],
  [
    "  │ extraction job          │ ───▶ │ results      │ ───▶ ",
    ["green", "│ derived artifacts │"],
  ],
  [
    "  │ transcript, embeddings, │      │ queryable in │      ",
    ["green", "│ written back      │"],
  ],
  [
    "  │ entities                │      │ Mixpeek      │      ",
    ["green", "│ to Tigris         │"],
  ],
  [
    "  └─────────────────────────┘      └──────────────┘      ",
    ["green", "└───────────────────┘"],
  ],
];

export default function UploadToQueryFlow({
  label = "FIG 03",
  title = "an upload triggers a notification, Mixpeek processes it, results become queryable",
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
