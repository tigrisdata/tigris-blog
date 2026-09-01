// Fig 01 — a RAG pipeline grounds the model's answer in retrieved docs
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  user             backend                model             vector DB        Tigris",
  ],
  [
    "    │                 │                     │                   │               │",
  ],
  [
    "    │ how do I upload a file to Tigris?     │                   │               │",
  ],
  [
    "    ├────────────────▶│                     │                   │               │",
  ],
  [
    "    │                 │                     │                   │               │",
  ],
  [
    "    │                 │ embed the question  │                   │               │",
  ],
  [
    "    │                 ├────────────────────▶│                   │               │",
  ],
  [
    "    │                 │ embedding vectors   │                   │               │",
  ],
  [
    "    │                 │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                   │               │",
  ],
  [
    "    │                 │                     │                   │               │",
  ],
  [
    "    │                 │ find similar docs   │                   │               │",
  ],
  [
    "    │                 ├─────────────────────┼──────────────────▶│               │",
  ],
  [
    "    │                 │                     │                   │ fetch data    │",
  ],
  [
    "    │                 │                     │                   ├──────────────▶│",
  ],
  [
    "    │                 │                     │                   │ binary data   │",
  ],
  [
    "    │                 │                     │                   │◀─ ─ ─ ─ ─ ─ ─ ┤",
  ],
  [
    "    │                 │ top 10 documents    │                   │               │",
  ],
  [
    "    │                 │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤               │",
  ],
  [
    "    │                 │                     │                   │               │",
  ],
  [
    "    │                 │ answer the question │                   │               │",
  ],
  [
    "    │                 ├────────────────────▶│                   │               │",
  ],
  [
    "    │                 │                     │                   │               │   ",
    ["gray", "using the top 10 docs"],
  ],
  [
    "    │ ",
    ["green", "sure, you upload a file using..."],
    "      │                   │               │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                   │               │",
  ],
];

export default function RagPipeline({
  label = "FIG 01",
  title = "a RAG pipeline grounds the model's answer in retrieved docs",
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
