import React, { useState } from "react";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const LINES = [
  "  key   ·   lexicographic, one contiguous range per subspace                 value",
  "",
  "  ┌──────────┬──────────┬────────────┬────────────────────────────────┐      ┌────────────────┐",
  "  │ tenant   │ bucket   │ subspace   │ object / index / key           │      │ value          │",
  "  ├──────────┼──────────┼────────────┼────────────────────────────────┤      ├────────────────┤",
  "  │ t_9f3a   │ photos   │ obj        │ 2026/08/img_001.jpg            │  ──▶ │ manifest ptr   │",
  "  └──────────┴──────────┴────────────┴────────────────────────────────┘      └────────────────┘",
  "",
  "  └─────────────────── one FDB key, tuple-encoded ────────────────────┘",
];

export default function FdbRowLayout({
  label = "FIG 01",
  title = "FDB row layout",
  showHeader = true,
  fontSize = 13,
  caption = "The subspace byte decides what the remaining key means — object, index, or queue entry. Everything for one bucket is one contiguous range.",
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const text = LINES.join("\n");
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText)
      navigator.clipboard.writeText(text).then(done, done);
    else done();
  };

  return (
    <div
      data-fig="01"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: MONO,
        maxWidth: "52rem",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {showHeader && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span
            style={{ fontSize: 11, letterSpacing: "0.16em", color: "#f59e0b" }}
          >
            {label}
          </span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>{title}</span>
          <span style={{ flex: 1 }} />
          <button
            onClick={copy}
            style={{
              fontFamily: "inherit",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748b",
              background: "transparent",
              border: "1px solid #1e293b",
              borderRadius: 4,
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {copied ? "copied" : "copy"}
          </button>
        </div>
      )}
      <pre
        style={{
          margin: 0,
          background: "#0f172a",
          border: "1px solid #16202f",
          borderRadius: 6,
          padding: 32,
          fontFamily: MONO,
          fontSize,
          lineHeight: 1.3,
          whiteSpace: "pre",
          color: "#cbd5e1",
          overflowX: "auto",
        }}
      >
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#64748b" }}>
            {"key"}
          </span>
          <span key={2}>{"   "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"·"}
          </span>
          <span key={4}>{"   "}</span>
          <span key={5} style={{ color: "#64748b" }}>
            {"lexicographic, one contiguous range per subspace"}
          </span>
          <span key={6}>{"                 "}</span>
          <span key={7} style={{ color: "#64748b" }}>
            {"value"}
          </span>
        </div>
        <div>
          <span key={0}> </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {
              "┌──────────┬──────────┬────────────┬────────────────────────────────┐"
            }
          </span>
          <span key={2}>{"      "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"┌────────────────┐"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={2} style={{ color: "#60a5fa" }}>
            {" tenant   "}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={4} style={{ color: "#60a5fa" }}>
            {" bucket   "}
          </span>
          <span key={5} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={6} style={{ color: "#4ade80" }}>
            {" subspace   "}
          </span>
          <span key={7} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={8} style={{ color: "#f59e0b" }}>
            {" object / index / key           "}
          </span>
          <span key={9} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={10}>{"      "}</span>
          <span key={11} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={12}>{" value          "}</span>
          <span key={13} style={{ color: "#475569" }}>
            {"│"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {
              "├──────────┼──────────┼────────────┼────────────────────────────────┤"
            }
          </span>
          <span key={2}>{"      "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"├────────────────┤"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={2} style={{ color: "#64748b" }}>
            {" t_9f3a   "}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={4} style={{ color: "#64748b" }}>
            {" photos   "}
          </span>
          <span key={5} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={6} style={{ color: "#64748b" }}>
            {" obj        "}
          </span>
          <span key={7} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={8} style={{ color: "#64748b" }}>
            {" 2026/08/img_001.jpg            "}
          </span>
          <span key={9} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={10}>{"  "}</span>
          <span key={11} style={{ color: "#60a5fa" }}>
            {"──▶"}
          </span>
          <span key={12}> </span>
          <span key={13} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={14} style={{ color: "#64748b" }}>
            {" manifest ptr   "}
          </span>
          <span key={15} style={{ color: "#475569" }}>
            {"│"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {
              "└──────────┴──────────┴────────────┴────────────────────────────────┘"
            }
          </span>
          <span key={2}>{"      "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"└────────────────┘"}
          </span>
        </div>
        <div>
          <span key={0}> </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"└───────────────────"}
          </span>
          <span key={2} style={{ color: "#64748b" }}>
            {" one FDB key, tuple-encoded "}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"────────────────────┘"}
          </span>
        </div>
      </pre>
      {caption && (
        <div
          style={{
            fontSize: 12,
            color: "#475569",
            lineHeight: 1.6,
            textWrap: "pretty",
            marginBottom: "1rem",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
