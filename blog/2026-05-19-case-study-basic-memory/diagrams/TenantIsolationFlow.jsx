// Fig 01 — shared compute, per-tenant storage
// Standalone React component. Inline styles only, React is the only dependency.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["  ", ["gray", "client layer"]],
  [
    "  ┌────────────┐   ┌───────────────────────────┐              ┌───────────────┐",
  ],
  [
    "  │ web editor │   │ MCP clients               │              │ rclone bisync │",
  ],
  [
    "  └─────┬──────┘   │ (Claude, Cursor, VS Code) │              └───────┬───────┘",
  ],
  ["        │          └─────────────┬─────────────┘                      │"],
  ["        └───┬────────────────────┘                                    │"],
  ["            ▼                                                         │"],
  [
    "  ",
    ["gray", "shared compute"],
    "                                                      │",
  ],
  ["  ┌─────────────────────────┐                                         │"],
  [
    "  │ gateway proxy           │                                         │ ",
    ["gray", "direct S3,"],
  ],
  [
    "  │ auth + tenant lookup    │                                         │ ",
    ["gray", "skips the API,"],
  ],
  [
    "  └─────────┬───────────────┘                                         │ ",
    ["gray", "tenant-scoped"],
  ],
  [
    "            │  ",
    ["gray", "X-BM-Tenant-ID"],
    "                                         │ ",
    ["gray", "credentials"],
  ],
  [
    "            │  ",
    ["gray", "X-BM-Database-URL"],
    "                                      │",
  ],
  [
    "            │  ",
    ["gray", "X-BM-Bucket-Name"],
    "                                       │",
  ],
  ["            ▼                                                         │"],
  ["  ┌─────────────────────────┐                                         │"],
  ["  │ cloud API pool          │                                         │"],
  ["  │ (multi-tenant)          │                                         │"],
  ["  └─────────┬───────────────┘                                         │"],
  ["            ├─────────────────────────┬─────────────────────────┐     │"],
  ["            ▼                         ▼                         ▼     ▼"],
  ["  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐"],
  ["  │ tenant A, isolated │  │ tenant B, isolated │  │ tenant C, isolated │"],
  ["  ├────────────────────┤  ├────────────────────┤  ├────────────────────┤"],
  [
    "  │ ",
    ["green", "Tigris bucket A"],
    "    │  │ ",
    ["green", "Tigris bucket B"],
    "    │  │ ",
    ["green", "Tigris bucket C"],
    "    │",
  ],
  ["  │ scoped credentials │  │ scoped credentials │  │ scoped credentials │"],
  ["  │ Neon Postgres A    │  │ Neon Postgres B    │  │ Neon Postgres C    │"],
  ["  └────────────────────┘  └────────────────────┘  └────────────────────┘"],
];

export default function TenantIsolationFlow({
  label = "FIG 01",
  title = "shared compute, per-tenant storage — the bucket is the isolation boundary",
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
