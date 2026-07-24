import React, { useEffect, useRef, useState } from "react";

/**
 * One idea, 6s loop: a wall of read-cells pops in while a counter runs up
 * to 640,000 — the number of FoundationDB reads one page of sizes takes.
 */

const CYCLE = 6; // seconds
const COUNT_UP = 3.5; // seconds spent counting
const TOTAL = 640_000;

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

export default function CounterFanoutDiagram(): JSX.Element {
  const [count, setCount] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) / 1000) % CYCLE;
      const p = Math.min(t / COUNT_UP, 1);
      setCount(Math.round(TOTAL * easeOutCubic(p)));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const cells = Array.from({ length: 128 }, (_, i) => i);
  return (
    <div
      role="img"
      aria-label="A wall of 128 shard cells fills in while a counter runs up to 640,000 — the number of FoundationDB reads one page of 500 bucket sizes takes: 500 buckets times 10 counters times 128 shards."
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        height: 205,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes cfo-loop {
          0%, 92% { opacity: 1; }
          97%, 100% { opacity: 0; }
        }
        @keyframes cfo-cell {
          0% { transform: scale(0); }
          2%, 92% { transform: scale(1); }
          97%, 100% { transform: scale(0); }
        }
      `}</style>

      {/* title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
          color: "#62feb5",
        }}
      >
        How many reads one page of sizes takes
      </div>

      <div style={{ animation: `cfo-loop ${CYCLE}s linear infinite` }}>
        {/* the reads, happening */}
        <div style={{ position: "absolute", left: 206, top: 38 }}>
          {cells.map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (i % 16) * 12,
                top: Math.floor(i / 16) * 12,
                width: 9,
                height: 9,
                borderRadius: 2,
                background: "rgba(98, 254, 181, 0.35)",
                transform: "scale(0)",
                animation: `cfo-cell ${CYCLE}s ease-out infinite`,
                animationDelay: `${0.05 + i * (COUNT_UP / 128)}s`,
              }}
            />
          ))}
        </div>

        {/* the number */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 148,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 700,
            color: "#62feb5",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count.toLocaleString("en-US")} reads
        </div>
      </div>
    </div>
  );
}
