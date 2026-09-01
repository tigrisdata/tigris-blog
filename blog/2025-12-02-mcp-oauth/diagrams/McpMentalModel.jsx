// Fig 01 — the mental model for MCP authentication
// Standalone React component. Inline styles only, React is the only dependency.
// The MCP client sits between the user and the OAuth-protected API.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ┌──────┐      ┌────────────┐      ┌────────────┐      ┌─────────────────────┐",
  ],
  [
    "  │ User │ ◀──▶ │ MCP client │ ◀──▶ │ MCP server │ ◀──▶ │ OAuth-protected API │",
  ],
  [
    "  └──────┘      └────────────┘      └────────────┘      └─────────────────────┘",
  ],
];

export default function McpMentalModel({
  label = "FIG 01",
  title = "the mental model for MCP authentication",
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
