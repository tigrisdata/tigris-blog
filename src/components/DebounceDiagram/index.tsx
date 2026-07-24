import React from "react";

/**
 * Steady-state scene: a dense stream of writes pours into the debounce and
 * vanishes there; once in a while a single dot passes through to the cache,
 * which blips. The imbalance IS the message.
 */

const nodeStyle: React.CSSProperties = {
  position: "absolute",
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--tigris-diagram-node-bg, #13221e)",
  border: "1px solid var(--tigris-diagram-node-border, #2a3731)",
  color: "var(--tigris-diagram-text, #bac1be)",
  fontSize: 13,
};

const subtext = "var(--tigris-diagram-subtext, #94a3b8)";

export default function DebounceDiagram(): JSX.Element {
  const stormDelays = Array.from({ length: 10 }, (_, i) => -(i * 0.12));
  return (
    <div
      role="img"
      aria-label="A dense stream of write dots pours into a debounce node and is absorbed. Once every few seconds a single dot passes through to the cache, which lights up briefly. One hundred writes per second in, roughly one cache operation per cooldown window out."
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        height: 178,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes dbn-storm {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          82% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes dbn-pass {
          0%, 70% { offset-distance: 0%; opacity: 0; }
          73% { opacity: 1; }
          84% { offset-distance: 100%; opacity: 1; }
          86%, 100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes dbn-blip {
          0%, 83% { box-shadow: 0 0 0 0 rgba(98, 254, 181, 0); }
          88% { box-shadow: 0 0 16px 3px rgba(98, 254, 181, 0.35); }
          96%, 100% { box-shadow: 0 0 0 0 rgba(98, 254, 181, 0); }
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
        How a write storm becomes one cache operation
      </div>

      {/* storm of writes */}
      {stormDelays.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: subtext,
            offsetPath: `path("M 20 ${58 + (i % 5) * 14} C 90 ${
              58 + (i % 5) * 14
            }, 150 ${72 + (i % 3) * 8}, 226 ${80 + (i % 3) * 6}")`,
            offsetRotate: "0deg",
            animation: "dbn-storm 1.2s linear infinite",
            animationDelay: `${d}s`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 128,
          width: 120,
          fontSize: 11,
          color: subtext,
        }}
      >
        100 writes / sec
      </div>

      {/* debounce gate */}
      <div style={{ ...nodeStyle, left: 226, top: 62, width: 128, height: 54 }}>
        debounce
        <small style={{ color: subtext, fontSize: 10, marginTop: 2 }}>
          in-memory
        </small>
      </div>

      {/* the one that gets through, every 4s */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#62feb5",
          offsetPath: 'path("M 354 89 L 452 89")',
          offsetRotate: "0deg",
          animation: "dbn-pass 4s ease-in-out infinite",
        }}
      />

      {/* cache */}
      <div
        style={{
          ...nodeStyle,
          left: 452,
          top: 62,
          width: 118,
          height: 54,
          border: "1px solid rgba(98, 254, 181, 0.5)",
          background: "rgba(98, 254, 181, 0.07)",
          animation: "dbn-blip 4s linear infinite",
        }}
      >
        cache
      </div>
      <div
        style={{
          position: "absolute",
          left: 430,
          top: 128,
          width: 160,
          fontSize: 11,
          color: subtext,
          textAlign: "center",
        }}
      >
        ~1 op per window
      </div>
    </div>
  );
}
