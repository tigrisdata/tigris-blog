// Fig 01: Prisma's object storage benchmark setup
// One load-test app in each of the six Prisma Compute regions, all pointed at a
// single Tigris global bucket, with six per-region R2 buckets as the comparison.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  Prisma Compute regions"],
  ["  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐"],
  ["  │  Frankfurt  │ │    Paris    │ │ N. Virginia │ │N. California│ │  Singapore  │ │    Tokyo    │"],
  ["  │  accel-fs   │ │  accel-fs   │ │  accel-fs   │ │  accel-fs   │ │  accel-fs   │ │  accel-fs   │"],
  ["  │100 MiB cache│ │100 MiB cache│ │100 MiB cache│ │100 MiB cache│ │100 MiB cache│ │100 MiB cache│"],
  ["  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘"],
  ["         │               │               │               │               │               │       "],
  ["         │ 1,000 random reads + 1,000 random writes, 10 KiB files, one at a time         │       "],
  ["         │               │               │               │               │               │       "],
  ["         ▼               ▼               ▼               ▼               ▼               ▼       "],
  ["  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐"],
  ["  │  ", ["green", "Tigris: one global bucket"], "                                                                  │"],
  ["  │  ", ["green", "read floor ~10 ms  ·  mixed phase 109.5 s avg (50 MiB)"], "                                     │"],
  ["  └─────────────────────────────────────────────────────────────────────────────────────────────┘"],
  [],
  ["  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐"],
  ["  │", ["gray", "   R2 EEUR   "], "│ │", ["gray", "   R2 WEUR   "], "│ │", ["gray", "   R2 ENAM   "], "│ │", ["gray", "   R2 WNAM   "], "│ │", ["gray", "   R2 APAC   "], "│ │", ["gray", "   R2 APAC   "], "│"],
  ["  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘"],
  ["  ", ["gray", "R2: six regional buckets · read floor ~44 ms · mixed phase 578.7 s avg (50 MiB)"]],
];

export default function BenchmarkSetup({
  label = "FIG 01",
  title = "Six Prisma Compute regions share one Tigris bucket; R2 gets a bucket per region",
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
