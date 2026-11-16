// Fig 01: what one app setup creates on Runable
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [
    "┌──────────────────────────┐      ┌──────────────────────────┐          ┌──────────────────────────┐",
  ],
  [
    "│ small business owner     │      │ Runable agent            │          │ the app, deployed        │",
  ],
  [
    "│ ",
    ["gray", '"build me a booking app  '],
    "│─────▶│ ",
    ["gray", "writes the app's code,   "],
    "│          │ ",
    ["gray", "bucket endpoint and key  "],
    "│",
  ],
  [
    "│  ",
    ["gray", 'with photo uploads"     '],
    "│      │ ",
    ["gray", "then calls app_init      "],
    "│          │ ",
    ["gray", "in its environment       "],
    "│",
  ],
  [
    "└──────────────────────────┘      └──────────────────────────┘          └──────────────────────────┘",
  ],
  [
    "                                                │                                     ▲",
  ],
  [
    "                                                ▼                                     │ ",
    ["gray", "credentials"],
  ],
  [
    "┌──────────────────────────────────────────────────────────────────────────────────────────────────┐",
  ],
  [
    "│ ",
    [
      "gray",
      "app_init: five resources created in parallel, 10.8 s median                                      ",
    ],
    "│",
  ],
  [
    "│ ┌───────────────┐ ",
    ["green", "┌──────────────────┐ ┌──────────────────┐ "],
    "┌───────────────┐ ┌────────────────┐ │",
  ],
  [
    "│ │ database      │ ",
    ["green", "│ Tigris bucket    │ │ access key       │ "],
    "│ payments      │ │ AI gateway     │ │",
  ],
  [
    "│ │ ",
    ["gray", "one per app   "],
    "│ ",
    ["green", "│ "],
    "one per app,     ",
    ["green", "│ │ "],
    "Editor on this   ",
    ["green", "│ "],
    "│ ",
    ["gray", "per app       "],
    "│ │ ",
    ["gray", "config + keys  "],
    "│ │",
  ],
  [
    "│ │               │ ",
    ["green", "│ "],
    "CORS for uploads ",
    ["green", "│ │ "],
    "bucket only      ",
    ["green", "│ "],
    "│               │ │                │ │",
  ],
  [
    "│ └───────────────┘ ",
    ["green", "└──────────────────┘ └──────────────────┘ "],
    "└───────────────┘ └────────────────┘ │",
  ],
  [
    "└──────────────────────────────────────────────────────────────────────────────────────────────────┘",
  ],
  ["                              ▲"],
  [
    "                              │ ",
    ["gray", "presigned URLs, straight to Tigris"],
  ],
  ["                ┌────────────────────────────┐"],
  ["                │ the app's own customers    │"],
  ["                │ ", ["gray", "upload and download files  "], "│"],
  ["                └────────────────────────────┘"],
];

export default function AppInitArchitecture({
  label = "FIG 01",
  title = "Every app Runable builds gets its own Tigris bucket and a key for that bucket only",
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
