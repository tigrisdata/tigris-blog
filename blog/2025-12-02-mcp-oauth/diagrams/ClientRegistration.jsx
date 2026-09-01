// Fig 05 — dynamic client registration
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art (scripts/ascii-seqgen.mjs); LINES hold [color, text] segments.
// the client registers itself with the MCP server (RFC 7591)

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" client                MCP server                Tigris"],
  ["    │                       │                       │"],
  ["    │ Discover OIDC metadata│                       │"],
  ["    ├──────────────────────▶│                       │"],
  [
    "    │                       │                       │   ",
    ["gray", "GET /.well-known/"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "openid-configuration"],
  ],
  ["    │ OIDC metadata response│                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
  ["    │                       │                       │"],
  ["    │ Register at /register │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │                       │ Save client details   │"],
  ["    │                       ├──────────────────────▶│"],
  ["    │ ", ["green", "Client ID + secret"], "    │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
  ["    │                       │                       │"],
  ["    │ Start OAuth flow      │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │ Interaction redirect  │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
];

export default function ClientRegistration({
  label = "FIG 05",
  title = "dynamic client registration",
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
