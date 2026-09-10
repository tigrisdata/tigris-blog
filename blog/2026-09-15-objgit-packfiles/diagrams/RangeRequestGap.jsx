// Fig 03 — one ranged GET pulls 366 bytes out of the middle of a 128 MiB file
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  ["  ", ["#fn", "packs/019a7f3c..bin", "base"]],
  [
    "  ",
    ["#box", "┌────────────────────────────────────────────────┐", "base"],
  ],
  [
    "  ",
    ["#box", "│", "base"],
    ["#pad", "                                   ", "base"],
    ["#obj", "██", "amber"],
    ["#pad", "           ", "base"],
    ["#box", "│", "base"],
  ],
  [
    "  ",
    ["#box", "└───────────────────────────────────", "base"],
    ["#tick", "▲", "amber"],
    ["#box", "────────────┘", "base"],
  ],
  [
    "  ",
    ["#ruler", " 0", "gray"],
    "                                  ",
    ["#tick", "│", "amber"],
    ["#ruler", "      128 MiB", "gray"],
  ],
  [
    "                                      ",
    ["#tick", "└── 366 bytes, right here", "amber"],
  ],
  [],
  [
    "  ",
    ["#ask", "you know where it starts and how long it is, so ask for", "gray"],
  ],
  ["  ", ["#ask", "exactly that span and nothing else:", "gray"]],
  [],
  ["  ", ["#get", "GET /packs/019a7f3c..bin", "base"]],
  ["  ", ["#rng", "Range: bytes=100663296-100663661", "green"]],
  [],
  ["  ", ["#and", "and that is all the bucket sends back:", "gray"]],
  [],
  ["  ", ["#resp", "206 Partial Content", "green"]],
  ["  ", ["#cr", "Content-Range: bytes 100663296-100663661/134217728", "base"]],
  ["  ", ["#rbox", "┌────┐", "base"]],
  [
    "  ",
    ["#rbox", "│", "base"],
    ["#rb", "████", "amber"],
    ["#rbox", "│", "base"],
    "  ",
    ["#rnote", "366 B on the wire, not 128 MiB", "gray"],
  ],
  ["  ", ["#rbox", "└────┘", "base"]],
];

const STEPS = [
  {
    show: ["fn", "box", "pad", "ruler"],
    caption: "one packfile in the bucket, 128 MiB of it",
  },
  {
    show: ["obj", "tick"],
    focus: ["obj", "tick"],
    caption: "the object you want is 366 bytes, 96 MiB in",
  },
  {
    show: ["ask", "get", "rng"],
    focus: ["ask", "get", "rng"],
    caption: "so name the span in a Range header",
  },
  {
    show: ["and", "resp", "cr", "rbox", "rb", "rnote"],
    focus: ["and", "resp", "cr", "rbox", "rb", "rnote"],
    caption: "the bucket answers with a partial response, and only that",
  },
  {
    show: [],
    focus: [
      "fn",
      "box",
      "pad",
      "ruler",
      "obj",
      "tick",
      "ask",
      "get",
      "rng",
      "and",
      "resp",
      "cr",
      "rbox",
      "rb",
      "rnote",
    ],
    caption: "one round trip, and you paid for 366 bytes of it",
  },
];

export default function RangeRequestGap({
  label = "FIG 03",
  title = "One ranged GET, 366 bytes out of the middle of 128 MiB",
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
