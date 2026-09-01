// Fig 02 — Mixpeek breaks each object into layers behind a queryable index
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  ┌─────────────────┐      ┌────────────┐      ┌───────────────────┐"],
  [
    "  │ Tigris object   │ ───▶ │ Mixpeek    │ ───▶ │ transcripts       │ ",
    ["gray", "──┐"],
  ],
  [
    "  │ video/image/PDF │      │ extractors │      └───────────────────┘   ",
    ["gray", "│"],
  ],
  [
    "  └─────────────────┘      │            │      ┌───────────────────┐   ",
    ["gray", "│"],
  ],
  [
    "                           │            │ ───▶ │ visual embeddings │ ",
    ["gray", "──┤"],
  ],
  [
    "                           └────────────┘      └───────────────────┘   ",
    ["gray", "│"],
  ],
  [
    "                                                                       ",
    ["gray", "│"],
  ],
  [
    "              ",
    ["gray", "┌────────────────────────────────────────────────────────┘"],
  ],
  ["              ", ["gray", "▼"]],
  ["  ", ["green", "┌──────────────────────────────────────┐"]],
  ["  ", ["green", "│ search index + API                   │"]],
  ["  ", ["green", "│ frames, pages, segments, entities    │"]],
  ["  ", ["green", "└──────────────────────────────────────┘"]],
];

export default function ExtractionDataPath({
  label = "FIG 02",
  title = "Mixpeek breaks each object into transcripts, embeddings, and a queryable index",
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
