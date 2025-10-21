import React from "react";
import styles from "./styles.module.css";

// HexTimeCard (static): shows three timestamps 3 days apart, out of order, with ISO + hex
// Props:
//   baseDate (optional): Date | number | string used as the base "T". Defaults to new Date() at render time.
export default function HexTimeCard({ baseDate }) {
  // Compute base once at render. No hooks, no timers.
  const base = baseDate ? new Date(baseDate) : new Date();

  // Build three timestamps spaced by 3 days each: T, T+3d, T+6d
  const ts = [
    { key: "T", date: base },
    { key: "T+3d", date: addDays(base, 3) },
    { key: "T+6d", date: addDays(base, 6) },
  ];

  // Display out of order: [T+6d, T, T+3d]
  const order = [2, 0, 1];
  const rows = order.map((i) => ({
    label: ts[i].key,
    iso: ts[i].date.toISOString(),
    hex: encodeVersionHex(ts[i].date),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Hex Timestamps (Big‑Endian U64)</h2>
        <p className={styles.subtitle}>Three static timestamps, each 3 days apart, shown out of order.</p>

        <div className={styles.content}>
          <div className={styles.orderNote}>Out-of-order view: [T+6d, T, T+3d]</div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Label</th>
                  <th className={styles.tableHeader}>ISO (UTC)</th>
                  <th className={styles.tableHeader}>Hex (u64, big‑endian)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className={styles.tableRow}>
                    <td className={styles.labelCell}>{r.label}</td>
                    <td className={styles.monoCell}>{r.iso}</td>
                    <td className={styles.breakAllCell}>{r.hex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.note}>
          Note: JavaScript dates are millisecond precision; nanoseconds are approximated by multiplying ms × 1,000,000.
        </div>
      </div>
    </div>
  );
}

// --- helpers ---
function encodeVersionHex(date) {
  // Max uint64
  const MAX_U64 = (1n << 64n) - 1n;
  // Approximate Unix nanos from JS Date (ms → ns)
  const unixNanos = BigInt(date.getTime()) * 1_000_000n;
  const val = MAX_U64 - unixNanos;
  // 8 bytes => 16 hex digits (keep leading zeros)
  return val.toString(16).padStart(16, "0");
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
