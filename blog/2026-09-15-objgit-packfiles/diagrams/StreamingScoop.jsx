// Fig 06 — two requests race: the ranged GET and the whole container
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.
//
// The bar is one segment so a step can swap in a fuller version of it; every
// replacement is the same 48 characters wide, so the art never reflows.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  ["  ", ["#q", "read 1c7a26a901..ec7966 out of packs/019a7f3c..bin", "base"]],
  ["  ", ["#q", "its .cue record says: offset 100663296, stored 366", "base"]],
  [],
  ["  ", ["#hdr", "two requests go out at the same time:", "gray"]],
  [],
  [
    "  ",
    ["#la", "A   ", "cyan"],
    ["#ga", "GET packs/019a7f3c..bin", "base"],
    "  ",
    ["#ra", "Range: bytes=100663296-100663661", "cyan"],
    "     ",
    ["#sa", "366 B", "cyan"],
  ],
  [
    "  ",
    ["#lb", "B   ", "green"],
    ["#gb", "GET packs/019a7f3c..bin", "base"],
    "  ",
    ["#rb", "the whole container", "green"],
    "                ",
    ["#sb", "128 MiB", "green"],
  ],
  [],
  [
    "  ",
    ["#box", "┌────────────────────────────────────────────────┐", "base"],
  ],
  [
    "  ",
    ["#box", "│", "base"],
    ["#bar", "████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "green"],
    ["#box", "│", "base"],
    "  ",
    ["#blab", "B, still arriving", "green"],
  ],
  [
    "  ",
    ["#box", "└───────────────────────────────────", "base"],
    ["#tick", "▲", "cyan"],
    ["#box", "────────────┘", "base"],
  ],
  [
    "                                      ",
    ["#tick", "└── the bytes A asked for", "cyan"],
  ],
  [],
  ["  ", ["#win", "whichever lands first is what the read gets.", "gray"]],
];

const bar = (n) => "█".repeat(n) + "░".repeat(48 - n);

const ALL = [
  "q",
  "hdr",
  "la",
  "ga",
  "ra",
  "sa",
  "lb",
  "gb",
  "rb",
  "sb",
  "box",
  "bar",
  "blab",
  "tick",
  "win",
];

const STEPS = [
  {
    show: ["q"],
    text: { bar: bar(0) },
    caption: "one object, 366 bytes, somewhere in a 128 MiB container",
  },
  {
    show: ["hdr", "la", "ga", "ra", "sa", "lb", "gb", "rb", "sb"],
    focus: ["hdr", "la", "ga", "ra", "sa", "lb", "gb", "rb", "sb"],
    text: { bar: bar(0) },
    caption: "two requests go out at once: the span, and the whole file",
  },
  {
    show: ["box", "bar", "blab", "tick"],
    focus: ["lb", "gb", "rb", "sb", "box", "bar", "blab"],
    text: { bar: bar(12) },
    caption: "B is streaming, but it has not reached the object yet",
  },
  {
    show: ["win"],
    focus: ["la", "ga", "ra", "sa", "tick", "win"],
    ms: 1900,
    text: { bar: bar(20) },
    caption: "so A gets there first, and A is what this read reads",
  },
  {
    show: [],
    focus: ["lb", "gb", "rb", "sb", "bar", "blab", "win"],
    text: { bar: bar(44) },
    caption: "later, B has passed the object and wins instead. no A is sent",
  },
  {
    show: [],
    focus: ALL,
    text: { bar: bar(48) },
    caption: "no read ever waits for B. it takes whichever is already there",
  },
];

export default function StreamingScoop({
  label = "FIG 06",
  title = "Two requests, racing: the span and the whole container",
  fontSize,
}) {
  return (
    <AnimatedAsciiFigure
      label={label}
      title={title}
      lines={LINES}
      steps={STEPS}
      fontSize={fontSize}
    />
  );
}
