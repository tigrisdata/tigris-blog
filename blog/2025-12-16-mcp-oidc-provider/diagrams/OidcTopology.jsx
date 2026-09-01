// Fig 01 — where mcp-oidc-provider sits
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    ["gray", "    client side"],
    "                            ",
    ["gray", "auth layer"],
  ],
  [
    "  ┌─────────────────────┐                ┌───────────────────────┐     ┌────────────────┐",
  ],
  [
    "  │ MCP client          │",
    ["gray", " OIDC discovery "],
    "│ mcp-oidc-provider     │     │ upstream IdP   │",
  ],
  [
    "  │ (Claude, Cursor,    │",
    ["gray", " + registration "],
    "│ (OIDC authorization   │ ──▶ │ (Auth0, Clerk, │",
  ],
  [
    "  │  ChatGPT, ...)      │ ─────────────▶ │  server)              │     │  Okta, ...)    │",
  ],
  [
    "  └──────────┬──────────┘",
    ["gray", " /authorize     "],
    "└───────────",
    ["gray", "▲"],
    "───────────┘     └────────────────┘",
  ],
  [
    "             │            ",
    ["gray", "/token /jwks"],
    "               ",
    ["gray", "┆"],
    "                 ",
    ["gray", "OIDC federation"],
  ],
  [
    "             │                                       ",
    ["gray", "┆"],
    "                 ",
    ["gray", "(user auth, claims)"],
  ],
  [
    "             │ ",
    ["gray", "MCP requests with"],
    "                     ",
    ["gray", "┆ JWT verification via"],
  ],
  [
    "             │ ",
    ["green", "bearer access token"],
    "                   ",
    ["gray", "┆ /jwks + introspection"],
  ],
  ["             ▼                                       ", ["gray", "┆"]],
  [
    "  ┌─────────────────────┐  ",
    ["gray", "resource layer"],
    "            ",
    ["gray", "┆"],
  ],
  ["  │ MCP server          │ ", ["gray", "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘"]],
  ["  │ (OAuth 2.1          │"],
  ["  │  resource server)   │"],
  ["  └─────────────────────┘"],
];

export default function OidcTopology({
  label = "FIG 01",
  title = "where mcp-oidc-provider sits",
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
