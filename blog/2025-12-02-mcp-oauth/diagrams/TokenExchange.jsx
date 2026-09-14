// Fig 09 — exchanging the code for tokens
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art (scripts/ascii-seqgen.mjs); LINES hold [color, text] segments.
// the interaction code becomes the access token the client will reuse

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" client                MCP server                Tigris"],
  ["    │                       │                       │"],
  ["    │ Redeem code for token │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │                       │ Fetch interaction data│"],
  ["    │                       ├──────────────────────▶│"],
  ["    │ ", ["green", "Newly minted tokens"], "   │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
  [
    "    │                       │                       │   ",
    ["gray", "used for every MCP"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "session from here on"],
  ],
];

export default function TokenExchange({
  label = "FIG 09",
  title = "exchanging the code for tokens",
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
