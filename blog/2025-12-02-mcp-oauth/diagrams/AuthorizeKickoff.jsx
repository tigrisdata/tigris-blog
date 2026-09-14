// Fig 06 — kicking off the authorization
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art (scripts/ascii-seqgen.mjs); LINES hold [color, text] segments.
// the /authorize request that starts the three-way handshake

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" client                MCP server"],
  ["    │                       │"],
  ["    │ GET /authorize        │"],
  ["    ├──────────────────────▶│"],
  ["    │                       │   ", ["gray", "start the OAuth flow"]],
  ["    │ Redirect URL to Auth0 │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  ["    │                       │   ", ["gray", "the browser opens"]],
  ["    │                       │   ", ["gray", "the Auth0 login page"]],
];

export default function AuthorizeKickoff({
  label = "FIG 06",
  title = "kicking off the authorization",
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
