// Fig 01 — pulling an image from the self-hosted registry
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  User                  Registry                  Auth                   Tigris",
  ],
  [
    "    │                       │                       │                       │",
  ],
  [
    "    │ GET projects/name:tag │                       │                       │",
  ],
  [
    "    ├──────────────────────▶│                       │                       │",
  ],
  [
    "    │ get a token at /token │                       │                       │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │                       │",
  ],
  [
    "    │                       │                       │                       │",
  ],
  [
    "    │ here's my creds for /token                    │                       │",
  ],
  [
    "    ├───────────────────────┼──────────────────────▶│                       │",
  ],
  [
    "    │ ",
    ["green", "sounds good, here's a token"],
    "                   │                       │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │",
  ],
  [
    "    │                       │                       │                       │",
  ],
  [
    "    │ GET name:tag + token  │                       │                       │",
  ],
  [
    "    ├──────────────────────▶│                       │                       │",
  ],
  [
    "    │ ",
    ["green", "presigned Tigris URLs"],
    " │                       │                       │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │                       │",
  ],
  [
    "    │                       │                       │                       │",
  ],
  [
    "    │ layers please         │                       │                       │",
  ],
  [
    "    ├───────────────────────┼───────────────────────┼──────────────────────▶│",
  ],
  [
    "    │ ",
    ["green", "image layer tarballs"],
    "  │                       │                       │",
  ],
  [
    "    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤",
  ],
];

export default function RegistryPullFlow({
  label = "FIG 01",
  title = "pulling an image from the self-hosted registry",
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
