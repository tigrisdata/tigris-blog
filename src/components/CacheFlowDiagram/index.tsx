import React from "react";

/**
 * Animated steady-state view of the bucket-size cache: a stream of size
 * lookups leaves the gateway, ~90% turn around at the edge cache, and only
 * the occasional miss makes the long trip to the backend counters.
 * Self-contained; drop into MDX as <CacheFlowDiagram />.
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

const subStyle: React.CSSProperties = {
  color: "var(--tigris-diagram-subtext, #94a3b8)",
  fontSize: 11.5,
  marginTop: 2,
};

const countStyle: React.CSSProperties = {
  position: "absolute",
  fontSize: 11.5,
  color: "var(--tigris-diagram-subtext, #94a3b8)",
  width: 170,
  textAlign: "center",
};

const HIT_PATH =
  'path("M 150 108 C 195 92, 215 92, 240 108 C 215 126, 195 126, 150 122")';
const MISS_PATH = 'path("M 150 116 L 300 120 L 456 120 L 300 124 L 150 120")';

export default function CacheFlowDiagram(): JSX.Element {
  const hitDelays = [0, -0.27, -0.53, -0.8, -1.07, -1.33];
  const missDelays = [0, -2.25];
  return (
    <div
      role="img"
      aria-label="A stream of size lookups flows between the gateway and the edge cache, where about 450 of 500 turn around. Only an occasional lookup travels the full path to the backend, where each miss costs a 1,280-read counter scan."
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        height: 200,
        margin: "0 auto",
      }}
    >
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
        How the gateway fetches 500 bucket sizes
      </div>
      <style>{`
        @keyframes cfd-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(98, 254, 181, 0); }
          45% { box-shadow: 0 0 14px 2px rgba(98, 254, 181, 0.25); }
        }
        @keyframes cfd-ride {
          0% { offset-distance: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>

      {/* routes, faintly drawn */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 200"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <path
          d="M 150 108 C 195 92, 215 92, 240 108"
          fill="none"
          stroke="rgba(98, 254, 181, 0.15)"
          strokeWidth="1"
        />
        <path
          d="M 240 108 C 215 126, 195 126, 150 122"
          fill="none"
          stroke="rgba(98, 254, 181, 0.15)"
          strokeWidth="1"
        />
        <path
          d="M 360 120 L 456 120"
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      </svg>

      <div style={{ ...nodeStyle, left: 30, top: 88, width: 120, height: 62 }}>
        gateway
      </div>
      <div
        style={{
          ...nodeStyle,
          left: 240,
          top: 90,
          width: 120,
          height: 58,
          border: "1px solid rgba(98, 254, 181, 0.5)",
          background: "rgba(98, 254, 181, 0.07)",
          animation: "cfd-pulse 1.6s ease-in-out infinite",
        }}
      >
        edge cache
        <small style={subStyle}>sizes, remembered</small>
      </div>
      <div style={{ ...nodeStyle, left: 456, top: 90, width: 118, height: 58 }}>
        backend
        <small style={subStyle}>1,280 reads each</small>
      </div>

      <div style={{ ...countStyle, left: 215, top: 160 }}>
        ~450 of 500 turn around here
      </div>
      <div style={{ ...countStyle, left: 430, top: 160 }}>
        ~50 reach the counters
      </div>

      {hitDelays.map((d) => (
        <div
          key={`hit${d}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#62feb5",
            offsetPath: HIT_PATH,
            offsetRotate: "0deg",
            animation: `cfd-ride 1.6s ease-in-out infinite`,
            animationDelay: `${d}s`,
          }}
        />
      ))}
      {missDelays.map((d) => (
        <div
          key={`miss${d}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#94a3b8",
            offsetPath: MISS_PATH,
            offsetRotate: "0deg",
            animation: `cfd-ride 4.5s ease-in-out infinite`,
            animationDelay: `${d}s`,
          }}
        />
      ))}
    </div>
  );
}
