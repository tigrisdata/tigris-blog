import React from "react";

/**
 * Animated log-scale bar chart, 9s loop: bars draw in sequence — before
 * (640k), cold page (~64k), warm page (~500) — values pop as each lands.
 */

const subtext = "var(--tigris-diagram-subtext, #94a3b8)";

const rowLabel: React.CSSProperties = {
  position: "absolute",
  right: 470,
  width: 120,
  textAlign: "right",
  fontSize: 11.5,
  color: "var(--tigris-diagram-text, #bac1be)",
};

const tiny: React.CSSProperties = {
  position: "absolute",
  right: 470,
  width: 120,
  textAlign: "right",
  fontSize: 11.5,
  color: subtext,
};

const valueStyle: React.CSSProperties = {
  position: "absolute",
  fontSize: 13,
  fontWeight: 600,
  color: "#62feb5",
  opacity: 0,
};

// log scale: x = 140 + (log10(v) - 2) * 100, container-left relative
const GRID = [
  { x: 140, label: "100" },
  { x: 240, label: "1k" },
  { x: 340, label: "10k" },
  { x: 440, label: "100k" },
  { x: 540, label: "1M" },
];

export default function CostChartDiagram(): JSX.Element {
  return (
    <div
      role="img"
      aria-label="Log-scale bar chart of FoundationDB reads per 500-bucket page, drawn in sequence. Before the cache: about 640,000 reads. A cold page at 90 percent hit rate: about 64,000. A fully warm page: about 500, just the metadata range read."
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        height: 218,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes cc-loop {
          0%, 92% { opacity: 1; }
          97%, 100% { opacity: 0; }
        }
        @keyframes cc-b1 { 0%, 4% { width: 0px; } 14%, 100% { width: 381px; } }
        @keyframes cc-b2 { 0%, 24% { width: 0px; } 34%, 100% { width: 281px; } }
        @keyframes cc-b3 { 0%, 44% { width: 0px; } 54%, 100% { width: 70px; } }
        @keyframes cc-v1 { 0%, 15% { opacity: 0; } 18%, 100% { opacity: 1; } }
        @keyframes cc-v2 { 0%, 35% { opacity: 0; } 38%, 100% { opacity: 1; } }
        @keyframes cc-v3 { 0%, 55% { opacity: 0; } 58%, 100% { opacity: 1; } }
      `}</style>

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
        FoundationDB reads per 500-bucket page
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 20,
          textAlign: "center",
          fontSize: 11.5,
          color: subtext,
        }}
      >
        log scale — each gridline is 10×
      </div>

      {/* gridlines + axis labels */}
      {GRID.map((g) => (
        <React.Fragment key={g.label}>
          <div
            style={{
              position: "absolute",
              left: g.x,
              top: 44,
              width: 1,
              height: 134,
              borderLeft:
                "1px dashed var(--tigris-diagram-node-border, #2a3731)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: g.x - 20,
              top: 184,
              width: 40,
              textAlign: "center",
              fontSize: 11.5,
              color: subtext,
            }}
          >
            {g.label}
          </div>
        </React.Fragment>
      ))}

      <div style={{ animation: "cc-loop 9s linear infinite" }}>
        {/* before */}
        <div style={{ ...rowLabel, top: 56 }}>before</div>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 50,
            height: 24,
            borderRadius: 5,
            background: "rgba(98, 254, 181, 0.14)",
            border: "1px solid rgba(98, 254, 181, 0.45)",
            animation: "cc-b1 9s cubic-bezier(0.2, 0.8, 0.2, 1) infinite",
          }}
        />
        <div
          style={{
            ...valueStyle,
            left: 528,
            top: 55,
            animation: "cc-v1 9s linear infinite",
          }}
        >
          640k
        </div>

        {/* cold page */}
        <div style={{ ...rowLabel, top: 100 }}>cold page</div>
        <div style={{ ...tiny, top: 115 }}>(90% hit rate)</div>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 94,
            height: 24,
            borderRadius: 5,
            background: "rgba(98, 254, 181, 0.14)",
            border: "1px solid rgba(98, 254, 181, 0.45)",
            animation: "cc-b2 9s cubic-bezier(0.2, 0.8, 0.2, 1) infinite",
          }}
        />
        <div
          style={{
            ...valueStyle,
            left: 428,
            top: 99,
            animation: "cc-v2 9s linear infinite",
          }}
        >
          ~64k
        </div>

        {/* warm page */}
        <div style={{ ...rowLabel, top: 144 }}>warm page</div>
        <div style={{ ...tiny, top: 159 }}>(metadata only)</div>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 138,
            height: 24,
            borderRadius: 5,
            background: "rgba(98, 254, 181, 0.4)",
            border: "1px solid #62feb5",
            animation: "cc-b3 9s cubic-bezier(0.2, 0.8, 0.2, 1) infinite",
          }}
        />
        <div
          style={{
            ...valueStyle,
            left: 217,
            top: 143,
            animation: "cc-v3 9s linear infinite",
          }}
        >
          ~500
        </div>
      </div>
    </div>
  );
}
