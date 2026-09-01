// Fig 01 — TAG proxies the first request, then verifies locally
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" client                    TAG                   Tigris"],
  ["    │                       │                       │"],
  ["    │ ListBuckets (signed)  │                       │"],
  ["    ├──────────────────────▶│                       │"],
  ["    │                       │ ListBuckets (proxied) │"],
  ["    │                       ├──────────────────────▶│"],
  [
    "    │                       │                       │   ",
    ["gray", "TAG adds signed proxy headers;"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "Tigris checks both signatures:"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "2xx, derived keys returned"],
  ],
  ["    │                       │                       │"],
  ["    │                       │ ListBucketsResponse   │"],
  ["    │                       │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤"],
  [
    "    │                       │                       │   ",
    ["gray", "+ derived signing keys,"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "AES-encrypted for TAG only;"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "TAG decrypts and caches them"],
  ],
  ["    │                       │                       │"],
  ["    │ ListBucketsResponse   │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
  ["    ·                       ·                       ·"],
  [
    "    │                       │                       │   ",
    ["gray", "later: the next request"],
  ],
  ["    │ ListBuckets (signed)  │                       │"],
  ["    ├──────────────────────▶│                       │"],
  [
    "    │                       │                       │   ",
    ["gray", "TAG verifies the signature"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "locally with the cached key:"],
  ],
  [
    "    │                       │                       │   ",
    ["gray", "no round trip to the cloud"],
  ],
  ["    │                       │                       │"],
  ["    │ ", ["green", "200 OK"], "                │                       │"],
  ["    │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤                       │"],
];

export default function TagSigningKeyProxy({
  label = "FIG 01",
  title = "TAG proxies the first request, then verifies locally",
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
