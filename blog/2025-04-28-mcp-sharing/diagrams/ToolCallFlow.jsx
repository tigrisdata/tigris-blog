// Fig 01 — the model answers a request by calling a tool
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  user                    model                 tool"],
  ["    │                       │                     │"],
  ["    │                       │                     │"],
  ['    │ "can you upload an image to my bucket?"     │'],
  ["    ├──────────────────────▶│                     │"],
  ["    │                       │                     │"],
  ["    │                       │ upload_image(bucket, path, key)"],
  ["    │                       ├────────────────────▶│"],
  ["    │                       │                     │"],
  ["    │                       │ ", ["green", "HTTP 200, it worked"], " │"],
  ["    │                       │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  ["    │                       │                     │"],
  ['    │ "it\'s in the bucket!" │                     │'],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                     │"],
];

export default function ToolCallFlow({
  label = "FIG 01",
  title = "the model answers a request by calling a tool",
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
