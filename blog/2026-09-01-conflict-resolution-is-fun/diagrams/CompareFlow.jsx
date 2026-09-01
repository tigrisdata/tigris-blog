// Fig 02 — compare() decides which version of an object wins
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "./AsciiFigure";

const LINES = [
  ["  compare(previous, new, force)"],
  [["gray", "  │"]],
  [["gray", "  ├── "], "is prev or next unset, or a brand-new key in FDB?"],
  [
    ["gray", "  │      "],
    "yes: different objects ",
    ["gray", "──────────▶"],
    "  ",
    ["red", "drop, log the conflict  ✗"],
  ],
  [["gray", "  │"]],
  [["gray", "  ├── "], "is prev older than the new data?"],
  [
    ["gray", "  │      "],
    "yes: the new version is newer ",
    ["gray", "───▶"],
    "  ",
    ["green", "apply, row replaced     ✓"],
  ],
  [["gray", "  │"]],
  [["gray", "  └── "], "tie, or new is older: is this a forced change?"],
  [
    "         yes: tie forcibly broken ",
    ["gray", "────────▶"],
    "  ",
    ["green", "apply, row replaced     ✓"],
  ],
  [
    "         no ",
    ["gray", "──────────────────────────────▶"],
    "  ",
    ["red", "drop, log the conflict  ✗"],
  ],
];

export default function CompareFlow({
  label = "FIG 02",
  title = "compare() decides which version of an object wins",
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
