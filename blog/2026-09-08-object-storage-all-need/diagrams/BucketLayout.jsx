// Fig 01 — the two-layer bucket layout, and which primitive each key implements
// Standalone React component. Inline styles only, React is the only dependency.
// Generated art; the LINES arrays hold [color, text] segments.

import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  [" ┌──────────────────────────────────────────────────────┐"],
  [" │ directory bucket                         one, global │"],
  [" │                                                      │"],
  [" │   orgs/{org_id}/                                     │"],
  [" │     metadata.json                                    │"],
  [
    " │     members/{sha256(email)}.json                     │   ",
    ["green", "the index"],
  ],
  [
    " │     billing.json                                     │   ",
    ["green", "the compare-and-swap target"],
  ],
  [" │     channels/{channel_id}/metadata.json              │"],
  [" │     api-tokens/{token_id}.json                       │"],
  [
    " │     events/audit/{event_ulid}.pb                     │   ",
    ["green", "the audit log"],
  ],
  [" │   org-ops/queue.pb                                   │"],
  [" └──────────────────────────────────────────────────────┘"],
  [""],
  ["     ", ["gray", "provider credentials reach this one, and only this one"]],
  [""],
  [" ┌──────────────────────────────────────────────────────┐"],
  [" │ org bucket                          one per customer │"],
  [" │                                                      │"],
  [
    " │   channel-slugs/{slug}.json                          │   ",
    ["green", "the unique constraint"],
  ],
  [" │   channel-{channel_id}/                              │"],
  [" │     config-meta/{config_id}.json                     │"],
  [
    " │     config-versions/{version_ulid}.json              │   ",
    ["green", "the history table"],
  ],
  [" │     bundle-meta/{bundle_id}.pb                       │"],
  [" │     bundle-versions/{bundle_id}/{version_ulid}.pb    │"],
  [
    " │     active-config.pb                                 │   ",
    ["green", "a pointer, overwritten in place"],
  ],
  [" │     events/{event_ulid}.json                         │"],
  [" └──────────────────────────────────────────────────────┘"],
  [""],
  [
    "     ",
    ["gray", "that customer's scoped keys reach this one, and nothing else"],
  ],
];

export default function BucketLayout({
  label = "FIG 01",
  title = "the two layers, and which primitive each key implements",
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
