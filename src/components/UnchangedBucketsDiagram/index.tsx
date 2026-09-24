import React, { useEffect, useRef, useState } from "react";

/**
 * Two beats, 7s loop, one JS clock:
 *   ① a few buckets take writes (a handful of cells turn green)
 *   ② the page reloads and a recompute sweep flashes every cell
 */

const CYCLE = 7;
const FADE_AT = 6.3;
const COLS = 25;
const ROWS = 4;
const SWEEP_START = 3.6;
const SWEEP_LEN = 1.3;

// which cells get written between the two loads, and when
const HOT: Record<number, number> = {
  3: 0.7,
  41: 1.0,
  91: 1.3,
  55: 1.6,
  16: 1.9,
  73: 2.2,
  27: 2.4,
};

const subtext = "var(--tigris-diagram-subtext, #94a3b8)";

export default function UnchangedBucketsDiagram(): JSX.Element {
  const [t, setT] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      setT(((now - start) / 1000) % CYCLE);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const fade = t < FADE_AT ? 1 : Math.max(0, (CYCLE - t) / (CYCLE - FADE_AT));
  const sweepCol =
    t >= SWEEP_START ? ((t - SWEEP_START) / SWEEP_LEN) * (COLS + 3) : -10;
  const p1 = t > 0.5 && t < 3.3 ? 1 : 0;
  const p2 = t > 3.5 && t < 6.2 ? 1 : 0;

  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
  return (
    <div
      role="img"
      aria-label="A grid of 100 cells representing one tenant's buckets between two dashboard loads. A handful of cells turn green as writes land. Then a recompute sweep flashes across every cell, because the old path recomputed all of them on every load at 1,280 reads apiece."
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        height: 172,
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
        One tenant's buckets, between two dashboard loads
      </div>

      <div style={{ opacity: fade }}>
        {/* the two narrating lines */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 22,
            textAlign: "center",
            fontSize: 11.5,
            color: "#62feb5",
            opacity: p1,
            transition: "opacity 0.3s",
          }}
        >
          ① a few buckets take writes
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 22,
            textAlign: "center",
            fontSize: 11.5,
            color: subtext,
            opacity: p2,
            transition: "opacity 0.3s",
          }}
        >
          ② the page reloads and recomputes every cell anyway
        </div>

        {/* the grid */}
        <div style={{ position: "absolute", left: 52, top: 48 }}>
          {cells.map((i) => {
            const col = i % COLS;
            const isHot = HOT[i] !== undefined && t >= HOT[i];
            const inSweep = Math.abs(col - sweepCol) < 1.4;
            const background = inSweep
              ? "rgba(98, 254, 181, 0.5)"
              : isHot
              ? "rgba(98, 254, 181, 0.4)"
              : "var(--tigris-diagram-node-bg, #1a2e35)";
            const border = isHot
              ? "1px solid #62feb5"
              : "1px solid var(--tigris-diagram-node-border, #2a3731)";
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: col * 20,
                  top: Math.floor(i / COLS) * 20,
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  background,
                  border,
                  transition: "background 0.25s",
                }}
              />
            );
          })}
        </div>

        {/* legend */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 144,
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            fontSize: 11.5,
            color: subtext,
          }}
        >
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "rgba(98, 254, 181, 0.4)",
                border: "1px solid #62feb5",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
            written since the last load
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "var(--tigris-diagram-node-bg, #1a2e35)",
                border: "1px solid var(--tigris-diagram-node-border, #2a3731)",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
            size unchanged
          </span>
        </div>
      </div>
    </div>
  );
}
