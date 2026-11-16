// Fig 01: what one app setup creates on Runable
// Standalone React component. Inline styles only, React is the only dependency.
// Generated: 56 columns wide so it fits better on phones.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["┌──────────────────────┐        ┌──────────────────────┐"],
  ["│ small business owner │        │ Runable agent        │"],
  [
    "│ ",
    ["gray", '"build me a booking  '],
    "│───────▶│ ",
    ["gray", "writes the app's     "],
    "│",
  ],
  [
    "│ ",
    ["gray", " app with photo      "],
    "│        │ ",
    ["gray", "code, then calls     "],
    "│",
  ],
  [
    "│ ",
    ["gray", ' uploads"            '],
    "│        │ ",
    ["gray", "app_init             "],
    "│",
  ],
  ["└──────────────────────┘        └──────────────────────┘"],
  ["                                            ▼"],
  ["┌──────────────────────────────────────────────────────┐"],
  [
    "│ ",
    ["gray", "app_init: 5 resources in parallel, 10.8 s median"],
    "     │",
  ],
  [
    "│ ",
    ["green", "┌──────────────────┐"],
    " ",
    ["green", "┌──────────────────┐"],
    "            │",
  ],
  [
    "│ ",
    ["green", "│ "],
    "Tigris bucket    ",
    ["green", "│"],
    " ",
    ["green", "│ "],
    "access key       ",
    ["green", "│"],
    " ",
    ["gray", "database"],
    "   │",
  ],
  [
    "│ ",
    ["green", "│ "],
    "one per app,     ",
    ["green", "│"],
    " ",
    ["green", "│ "],
    "Editor on this   ",
    ["green", "│"],
    " ",
    ["gray", "payments"],
    "   │",
  ],
  [
    "│ ",
    ["green", "│ "],
    "CORS for uploads ",
    ["green", "│"],
    " ",
    ["green", "│ "],
    "bucket only      ",
    ["green", "│"],
    " ",
    ["gray", "AI gateway"],
    " │",
  ],
  [
    "│ ",
    ["green", "└──────────────────┘"],
    " ",
    ["green", "└──────────────────┘"],
    "            │",
  ],
  ["└──────────────────────────────────────────────────────┘"],
  ["           ▲                                │"],
  [
    "           │ ",
    ["gray", "presigned URLs"],
    "     ",
    ["gray", "credentials"],
    " ▼",
  ],
  ["┌──────────────────────┐        ┌──────────────────────┐"],
  ["│ the app's customers  │        │ the app, deployed    │"],
  [
    "│ ",
    ["gray", "upload and download  "],
    "│        │ ",
    ["gray", "bucket endpoint and  "],
    "│",
  ],
  [
    "│ ",
    ["gray", "files directly       "],
    "│        │ ",
    ["gray", "key in environment   "],
    "│",
  ],
  ["└──────────────────────┘        └──────────────────────┘"],
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
