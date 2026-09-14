// Fig 07 — authentication with Auth0
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art (scripts/ascii-seqgen.mjs); LINES hold [color, text] segments.
// Auth0 authenticates the user; the MCP server verifies and saves the session

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    " client               MCP server               Tigris                  Auth0",
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │ User logs in at Auth0│                      │                      │",
  ],
  [
    "    ├──────────────────────┼──────────────────────┼─────────────────────▶│",
  ],
  [
    "    │ Redirect back to MCP │                      │                      │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤",
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │ Callback from Auth0  │                      │                      │",
  ],
  [
    "    ├─────────────────────▶│                      │                      │",
  ],
  [
    "    │                      │ Verify the callback  │                      │",
  ],
  [
    "    │                      ├──────────────────────┼─────────────────────▶│",
  ],
  [
    "    │                      │ ",
    ["green", "Access, ID, refresh"],
    "  │                      │",
  ],
  [
    "    │                      │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤",
  ],
  [
    "    │                      │                      │                      │   ",
    ["gray", "tokens for the"],
  ],
  [
    "    │                      │                      │                      │   ",
    ["gray", "Auth0 session"],
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │                      │ Save session details │                      │",
  ],
  [
    "    │                      ├─────────────────────▶│                      │",
  ],
  [
    "    │ Start interaction    │                      │                      │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤                      │                      │",
  ],
  [
    "    │                      │                      │                      │   ",
    ["gray", "redirect into the MCP"],
  ],
  [
    "    │                      │                      │                      │   ",
    ["gray", "server's own OIDC flow"],
  ],
];

export default function Auth0Handshake({
  label = "FIG 07",
  title = "authentication with Auth0",
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
