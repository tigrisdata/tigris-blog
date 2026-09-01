// Fig 04 — the MCP server man-in-the-middle flow
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art (scripts/ascii-seqgen.mjs); LINES hold [color, text] segments.
// the same login, with the MCP server and Auth0 both in the middle

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    " client               MCP server                Auth0                 GitHub",
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │ Authorize me please  │                      │                      │",
  ],
  [
    "    ├─────────────────────▶│                      │                      │",
  ],
  [
    "    │ Ask Auth0 to confirm │                      │                      │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤                      │                      │",
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │ Authorize me please  │                      │                      │",
  ],
  [
    "    ├──────────────────────┼─────────────────────▶│                      │",
  ],
  [
    "    │ Ask GitHub to confirm│                      │                      │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                      │",
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │ Authorize me please  │                      │                      │",
  ],
  [
    "    ├──────────────────────┼──────────────────────┼─────────────────────▶│",
  ],
  [
    "    │ Authorized; confirm with Auth0              │                      │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤",
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │ GitHub says: confirm │                      │                      │",
  ],
  [
    "    ├──────────────────────┼─────────────────────▶│                      │",
  ],
  [
    "    │                      │                      │ Access code, please  │",
  ],
  [
    "    │                      │                      ├─────────────────────▶│",
  ],
  [
    "    │                      │                      │ Here's a token       │",
  ],
  [
    "    │                      │                      │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤",
  ],
  [
    "    │ Authorized; confirm with MCP server         │                      │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                      │",
  ],
  [
    "    │                      │                      │                      │",
  ],
  [
    "    │ Auth0 says: confirm  │                      │                      │",
  ],
  [
    "    ├─────────────────────▶│                      │                      │",
  ],
  [
    "    │                      │ Access code, please  │                      │",
  ],
  [
    "    │                      ├─────────────────────▶│                      │",
  ],
  [
    "    │                      │ Here's a token       │                      │",
  ],
  [
    "    │                      │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤                      │",
  ],
  [
    "    │ ",
    ["green", "Here's your access token"],
    "                    │                      │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤                      │                      │",
  ],
];

export default function McpOauthChain({
  label = "FIG 04",
  title = "the MCP server man-in-the-middle flow",
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
