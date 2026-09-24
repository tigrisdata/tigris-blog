import React, { useEffect, useRef, useState } from "react";

/**
 * One idea, 6s loop: a wall of read-cells fills in while a counter runs up
 * to 640,000, the number of FoundationDB reads one page of sizes takes.
 * The counter and the cells share one JS clock, so every loop starts from
 * a clean, empty screen.
 */

const CYCLE = 6; // seconds
const COUNT_UP = 3.5; // seconds spent counting
const FADE_AT = 5.4; // when the scene starts fading out
const TOTAL = 640_000;
const CELLS = 128;

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

export default function CounterFanoutDiagram(): JSX.Element {
  const [frame, setFrame] = useState({ count: 0, cells: 0, fade: 1 });
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) / 1000) % CYCLE;
      const p = Math.min(t / COUNT_UP, 1);
      const e = easeOutCubic(p);
      const fade =
        t < FADE_AT ? 1 : Math.max(0, (CYCLE - t) / (CYCLE - FADE_AT));
      setFrame({
        count: Math.round(TOTAL * e),
        cells: Math.round(CELLS * e),
        fade,
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const cells = Array.from({ length: CELLS }, (_, i) => i);
  return (
    <div
      role="img"
      aria-label="A wall of 128 shard cells fills in while a counter runs up to 640,000, the number of FoundationDB reads one page of 500 bucket sizes takes."
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        height: 205,
        margin: "0 auto",
      }}
    >
      {/* title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          textAlign: "center",
          fontSize: 16,
          fontWeight: 600,
          color: "#62feb5",
        }}
      >
        How many reads one page of sizes takes
      </div>

      <div style={{ opacity: frame.fade }}>
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
                transform: i < frame.cells ? "scale(1)" : "scale(0)",
                transition: "transform 0.15s ease-out",
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
          {frame.count.toLocaleString("en-US")} reads
        </div>
      </div>
    </div>
  );
}
