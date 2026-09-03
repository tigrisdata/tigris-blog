// Fig 02 — where reduced telemetry goes once it leaves the host
// Standalone React component. Inline styles only, React is the only dependency.
import { AsciiFigure } from "@site/src/components/AsciiFigure";

const LINES = [
  ["┌─ customer host ──────────────────────────┐"],
  ["│ supervisor, reduces every 60s window     │"],
  ["└─────────────────────┬────────────────────┘"],
  ["                      │ ", ["gray", "reduced telemetry"]],
  ["                      ▼"],
  ["┌─ the customer's data plane ──────────────┐"],
  ["│ ingest sidecar: ", ["green", "write-only credential,"], "   │"],
  ["│ ", ["green", "one prefix, no read access"], "               │"],
  ["└─────────────────────┬────────────────────┘"],
  ["                      │ ", ["gray", "Parquet"]],
  ["                      ▼"],
  ["┌─ that customer's own Tigris bucket ──────┐"],
  ["│ ", ["green", "one tenant, one credential"], "               │"],
  ["└─────────────────────┬────────────────────┘"],
  ["                      │"],
  ["                      ▼"],
  ["┌─ the daily intelligence run ─────────────┐"],
  ["│ DuckDB, over those files                 │"],
  ["└──────────────────────────────────────────┘"],
];

export default function ReducedTelemetryPath({
  label = "FIG 02",
  title = "every hop scoped to one customer",
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
