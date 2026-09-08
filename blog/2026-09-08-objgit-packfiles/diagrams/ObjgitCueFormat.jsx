// Fig 05 — objgit's v3 .cue: a 16-byte header and seven columns
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art: the LINES arrays hold plain strings and tagged
// ["#id", text, color] segments that the STEPS below reveal and light up.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

const LINES = [
  [
    "  ",
    ["#k", "packs/019a7f3c..bin", "gray"],
    "   ",
    ["#k", "the payload bytes", "gray"],
  ],
  [
    "  ",
    ["#k", "packs/019a7f3c..cue", "gray"],
    "   ",
    ["#k", "the map", "gray"],
  ],
  [],
  ["  ", ["#hh", "16-byte header", "gray"]],
  [
    "  ",
    [
      "#hb",
      "┌───────┬─────┬──────┬───────┬──────────┬──────────────────────┐",
      "base",
    ],
  ],
  [
    "  ",
    ["#hb", "│", "base"],
    " ",
    ["#hf", '"OGC"', "cyan"],
    " ",
    ["#hb", "│", "base"],
    "  ",
    ["#hf", "3", "cyan"],
    "  ",
    ["#hb", "│", "base"],
    "  ",
    ["#hf", "20", "cyan"],
    "  ",
    ["#hb", "│", "base"],
    " ",
    ["#hf", "zstd", "cyan"],
    "  ",
    ["#hb", "│", "base"],
    " ",
    ["#hf", "reserved", "cyan"],
    " ",
    ["#hb", "│", "base"],
    " ",
    ["#hf", "11827138 records", "cyan"],
    "     ",
    ["#hb", "│", "base"],
  ],
  [
    "  ",
    [
      "#hb",
      "└───────┴─────┴──────┴───────┴──────────┴──────────────────────┘",
      "base",
    ],
  ],
  ["  ", ["#hn", "   magic   ver   hash   block", "gray"]],
  ["  ", ["#hn", "                 width  codec", "gray"]],
  [],
  [
    "  ",
    [
      "#cb",
      "then one record block, seven columns, not one struct per object:",
      "gray",
    ],
  ],
  [
    "  ",
    [
      "#c1",
      "    hash   │ 1c7a26a9.. │ 8e67afbb.. │ 9cc98673.. │ ...  20 or 32 B",
      "violet",
    ],
  ],
  [
    "  ",
    [
      "#c2",
      "    type   │ commit     │ tree       │ blob       │ ...         1 B",
      "base",
    ],
  ],
  [
    "  ",
    [
      "#c3",
      "    codec  │ zstd       │ raw        │ zstd       │ ...         1 B",
      "base",
    ],
  ],
  [
    "  ",
    [
      "#c4",
      "    offset │          0 │        366 │        414 │ ...         8 B",
      "amber",
    ],
  ],
  [
    "  ",
    [
      "#c5",
      "    stored │        366 │         48 │         22 │ ...         8 B",
      "green",
    ],
  ],
  [
    "  ",
    [
      "#c6",
      "    raw    │        526 │         37 │         13 │ ...         8 B",
      "green",
    ],
  ],
  [
    "  ",
    [
      "#c7",
      "    base   │ 00000000.. │ 00000000.. │ 1c7a26a9.. │ ...  20 or 32 B",
      "cyan",
    ],
  ],
  [],
  [
    "  ",
    [
      "#n1",
      "columnar because interleaved records put 20 to 32 bytes of hash entropy",
      "gray",
    ],
  ],
  [
    "  ",
    [
      "#n1",
      "every 26 and starve zstd's match finder. split out, that noise",
      "gray",
    ],
  ],
  [
    "  ",
    [
      "#n1",
      "stays in the hash columns and everything else compresses to nothing.",
      "gray",
    ],
  ],
  [],
  [
    "  ",
    ["#n2", "stored", "green"],
    " ",
    ["#n2d", "is the span to fetch.", "gray"],
    " ",
    ["#n3", "raw", "green"],
    " ",
    ["#n3d", "is the object's own size.", "gray"],
  ],
  [
    "  ",
    ["#n4", "a set", "gray"],
    " ",
    ["#n4b", "base", "cyan"],
    " ",
    ["#n4", "means the payload is a delta, and it is still its own", "gray"],
  ],
  ["  ", ["#n4", "record, with its own offset, fetchable on its own.", "gray"]],
];

const STEPS = [
  { show: ["k"], caption: "every container is a pair: the bytes, and the map" },
  {
    show: ["hh", "hb", "hf", "hn"],
    caption:
      "sixteen plaintext bytes: magic, version, hash width, codec, count",
  },
  {
    show: ["cb", "c1", "c2", "c3"],
    caption: "then one block of seven columns. what the object is",
  },
  {
    show: ["c4", "c5", "c6"],
    focus: ["c4", "c5", "c6"],
    caption: "where it starts, how many bytes to fetch, how big it decodes to",
  },
  {
    show: ["c7"],
    caption: "and its base, the only thing that marks a record as a delta",
  },
  {
    show: ["n1"],
    caption:
      "columnar, so zstd sees runs of near-identical bytes, not hash noise",
  },
  {
    show: ["n2", "n2d", "n3", "n3d", "n4", "n4b"],
    focus: ["n2", "n2d", "n3", "n3d", "n4", "n4b", "c5"],
    caption: "stored is the span to fetch. that is the whole trick",
  },
];

export default function ObjgitCueFormat({
  label = "FIG 05",
  title = "objgit's .cue: sixteen bytes of header, then seven columns",
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
