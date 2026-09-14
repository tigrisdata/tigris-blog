// Fig 01 — one endpoint, nearest-region routing, weights from one Tigris bucket
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "  ┌──────────────────┐                                   ┌────────────────────┐",
  ],
  [
    "  │ user · Tokyo     │ ──┐                           ┌─▶ │ Tokyo region       │ ",
    ["gray", "◀┄┄┐"],
  ],
  [
    "  └──────────────────┘   │ ",
    ["gray", "requests"],
    "                  │   │ weights + KV cache │    ",
    ["gray", "┆"],
  ],
  [
    "                         │    ┌──────────────────┐   │   └────────────────────┘    ",
    ["gray", "┆"],
  ],
  [
    "  ┌──────────────────┐   │    │ CougarLLM global │   │   ┌────────────────────┐    ",
    ["gray", "┆"],
  ],
  [
    "  │ user · São Paulo │ ──┼──▶ │ endpoint         │ ──┼─▶ │ São Paulo region   │ ",
    ["gray", "◀┄┄┤"],
  ],
  [
    "  └──────────────────┘   │    │ (one URL)        │   │   │ weights + KV cache │    ",
    ["gray", "┆"],
  ],
  [
    "                         │    └──────────────────┘   │   └────────────────────┘    ",
    ["gray", "┆"],
  ],
  [
    "  ┌──────────────────┐   │    ",
    ["gray", "route to nearest"],
    "       │   ┌────────────────────┐    ",
    ["gray", "┆"],
  ],
  [
    "  │ user · Frankfurt │ ──┘                           └─▶ │ Frankfurt region   │ ",
    ["gray", "◀┄┄┤"],
  ],
  [
    "  └──────────────────┘                                   │ weights + KV cache │    ",
    ["gray", "┆"],
  ],
  [
    "                                                         └────────────────────┘    ",
    ["gray", "┆"],
  ],
  [
    "                                                                   ",
    ["gray", "auto-replicates ┆"],
  ],
  [
    "                                                           ",
    ["green", "┌───────────────────────┴──┐"],
  ],
  [
    "                                                           ",
    ["green", "│ Tigris bucket            │"],
  ],
  [
    "                                                           ",
    ["green", "│ (single source of truth) │"],
  ],
  [
    "                                                           ",
    ["green", "└──────────────────────────┘"],
  ],
];

export default function GlobalRoutingFlow({
  label = "FIG 01",
  title = "one endpoint routes to the nearest region; weights replicate from one Tigris bucket",
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
