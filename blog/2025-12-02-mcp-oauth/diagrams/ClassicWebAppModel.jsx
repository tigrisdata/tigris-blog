// Fig 02 — the usual web app OAuth setup
// Standalone React component. Inline styles only, React is the only dependency.
// In a typical web app there is no MCP client or server in the middle.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  ┌──────┐      ┌──────────┐      ┌─────────────────────┐"],
  ["  │ User │ ◀──▶ │ Your app │ ◀──▶ │ OAuth-protected API │"],
  ["  └──────┘      └──────────┘      └─────────────────────┘"],
];

export default function ClassicWebAppModel({
  label = "FIG 02",
  title = "the usual web app OAuth setup",
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
