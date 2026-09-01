// Fig 08 — the second interaction
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art (scripts/ascii-seqgen.mjs); LINES hold [color, text] segments.
// the MCP server correlates the Auth0 session with its own OIDC logic

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" client                MCP server                Tigris"],
  ["    │                       │                       │"],
  ["    │ Start interaction     │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │                       │ Fetch client/session  │"],
  ["    │                       ├──────────────────────▶│"],
  ["    │                       │ Client + session data │"],
  ["    │                       │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  ["    │                       │ Create OIDC grant     │"],
  ["    │                       ├──────────────────────▶│"],
  [
    "    │                       │                       │   ",
    ["gray", "the grant token"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "lives in Tigris too"],
  ],
  ["    │ ", ["green", "Finish interaction"], "    │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
  [
    "    │                       │                       │   ",
    ["gray", "redirect back"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "to the agent"],
  ],
];

export default function SecondInteraction({
  label = "FIG 08",
  title = "the second interaction",
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
