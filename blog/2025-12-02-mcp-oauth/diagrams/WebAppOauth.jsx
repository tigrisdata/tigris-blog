// Fig 03 — OAuth for a web app backed by GitHub
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art (scripts/ascii-seqgen.mjs); LINES hold [color, text] segments.
// the normal OAuth flow for a web app that uses GitHub for login

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" client                  web app                 GitHub"],
  ["    │                       │                       │"],
  ["    │ Authorize me please   │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │ Ask GitHub to confirm │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
  ["    │                       │                       │"],
  ["    │ Authorize me please   │                       │"],
  ["    ├───────────────────────┼──────────────────────▶│"],
  ["    │ Authorized; confirm with web app              │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  ["    │                       │                       │"],
  ["    │ GitHub says: confirm  │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │ ", ["green", "Welcome back, Xe!"], "     │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
];

export default function WebAppOauth({
  label = "FIG 03",
  title = "OAuth for a web app backed by GitHub",
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
