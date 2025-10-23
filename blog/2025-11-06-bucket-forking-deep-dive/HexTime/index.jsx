import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function HexTimeCard() {
  const [hex, setHex] = useState(encodeVersionHex(new Date()));
  const [iso, setIso] = useState(new Date().toISOString());

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setHex(encodeVersionHex(now));
      setIso(now.toISOString());
    };
    tick(); // initialize immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Current Hex Time (Big‑Endian U64)</h2>
        <p className={styles.description}>Based on <span className={styles.monoText}>MAX_U64 - unix_nanos(UTC)</span>. Updates every second.</p>

        <div className={styles.section}>
          <div className={styles.label}>UTC now</div>
          <div className={styles.isoValue}>{iso}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>Hex value (16 hex chars / 8 bytes)</div>
          <div className={styles.hexValue}>{hex}</div>
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
