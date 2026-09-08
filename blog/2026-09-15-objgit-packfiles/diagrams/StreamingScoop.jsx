// Fig 06 — the read ladder: a ranged GET until the download catches up
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  ["  ", ["#q", "read 1c7a26a901..ec7966 out of packs/019a7f3c..bin", "base"]],
  [
    "  ",
    [
      "#q",
      "its .cue record already said: offset 100663296, stored 366",
      "base",
    ],
  ],
  [],
  [
    "  ",
    ["#t1", "tier 1   staged locally, not uploaded yet", "base"],
    "         ",
    ["#t1b", "open + pread", "gray"],
    "   ",
    ["#t1t", "  0 ms", "green"],
  ],
  [
    "  ",
    ["#t2", "tier 2   whole container already downloaded", "base"],
    "       ",
    ["#t2b", "pread", "gray"],
    "          ",
    ["#t2t", "  0 ms", "green"],
  ],
  [
    "  ",
    ["#t3", "tier 3   download in flight and already past it", "base"],
    "   ",
    ["#t3b", "pread", "gray"],
    "          ",
    ["#t3t", "  0 ms", "green"],
  ],
  [
    "  ",
    ["#t4", "tier 4   none of the above", "base"],
    "                        ",
    ["#t4b", "GetObject", "gray"],
    "      ",
    ["#t4t", " 10 ms", "red"],
  ],
  [],
  [
    "  ",
    ["#dh", "the container downloads behind you, in offset order:", "gray"],
  ],
  [],
  ["    ┌────────────────────────────────────────────────┐"],
  [
    "    │",
    ["#bar", "████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "green"],
    "│",
  ],
  [
    "    └───────────────────────────────────",
    ["#ob", "▲", "amber"],
    "────────────┘",
  ],
  [
    "     0                                  ",
    ["#ob", "│", "amber"],
    "     128 MiB",
  ],
  [
    "                                        ",
    ["#ob", "└── the object you asked for, at 96 MiB", "amber"],
  ],
  [],
  [
    "  ",
    [
      "#fin",
      "no read ever waits for the download. the far end is a ranged GET",
      "gray",
    ],
  ],
  [
    "  ",
    [
      "#fin",
      "until the watermark passes it, and a pread from then on.",
      "gray",
    ],
  ],
];

const bar = (n) => "█".repeat(n) + "░".repeat(48 - n);

const TIERS = [
  "t1",
  "t2",
  "t3",
  "t4",
  "t1b",
  "t2b",
  "t3b",
  "t4b",
  "t1t",
  "t2t",
  "t3t",
  "t4t",
];

const STEPS = [
  {
    show: ["q", ...TIERS],
    focus: ["q"],
    text: { bar: bar(0) },
    caption: "one object, four ways to get it, cheapest first",
  },
  {
    show: ["dh", "bar", "ob"],
    focus: ["t4", "t4b", "t4t", "ob", "bar"],
    text: { bar: bar(4) },
    caption: "nothing local yet, so: a ranged GET into those 366 bytes",
  },
  {
    show: [],
    focus: ["dh", "bar"],
    text: { bar: bar(20) },
    caption:
      "meanwhile the whole container streams in behind you, in offset order",
  },
  {
    show: [],
    focus: ["t3", "t3b", "t3t", "bar", "ob"],
    text: { bar: bar(39) },
    caption: "once the watermark passes the object, that same read is a pread",
  },
  {
    show: ["fin"],
    focus: ["t2", "t2b", "t2t", "bar", "fin"],
    text: { bar: bar(48) },
    caption: "and when it lands, every read out of this container is local",
  },
];

export default function StreamingScoop({
  label = "FIG 06",
  title = "A ranged GET until the download catches up",
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
