import React, { useState } from "react";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const LINES = [
  "  ┌────────────┐   ┌────────────────┐   ┌────────────────────┐   ┌────────────┐",
  "  │ client GET │──▶│ nearest region │──▶│ local FDB metadata │──▶│ location   │",
  "  └────────────┘   └────────────────┘   └────────────────────┘   └──────┬─────┘",
  "",
  "  choose the byte source                                                │",
  "             ┌───────────────────────┬───────────────────────┬──────────┘",
  "             ▼                       ▼                       ▼",
  "  ┌─ HIT ──────────────┐  ┌─ LOCAL ────────────┐  ┌─ MISS ─────────────┐",
  "  │ SSD / block cache  │  │ local block store  │  │ remote source      │",
  "  └──────────┬─────────┘  └──────────┬─────────┘  └──────────┬─────────┘",
  "             │                       │                       ├──▶ enqueue warm-cache / move",
  "             └───────────────────────┬───────────────────────┘",
  "                                     ▼",
  "                      ┌──────────────┬─────────────┐",
  "                      │ return bytes to client     │",
  "                      └────────────────────────────┘",
  "",
  "  // the read can complete before data placement catches up",
];

export default function GetResolutionFlow({
  label = "FIG 02",
  title = "GET resolution flow",
  showHeader = true,
  fontSize = 13,
  caption = "Metadata is read in the nearest region; only the bytes travel. A miss serves the read from the remote source and queues the placement work behind it.",
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText)
      navigator.clipboard.writeText(LINES.join("\n")).then(done, done);
    else done();
  };

  return (
    <div
      data-fig="02"
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
          <span key={1} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={2} style={{ color: "#475569" }}>
            {"────────────"}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"┐"}
          </span>
          <span key={4}>{"   "}</span>
          <span key={5} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={6} style={{ color: "#475569" }}>
            {"────────────────"}
          </span>
          <span key={7} style={{ color: "#475569" }}>
            {"┐"}
          </span>
          <span key={8}>{"   "}</span>
          <span key={9} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={10} style={{ color: "#475569" }}>
            {"────────────────────"}
          </span>
          <span key={11} style={{ color: "#475569" }}>
            {"┐"}
          </span>
          <span key={12}>{"   "}</span>
          <span key={13} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={14} style={{ color: "#475569" }}>
            {"────────────"}
          </span>
          <span key={15} style={{ color: "#475569" }}>
            {"┐"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={2}>{" client GET "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={4} style={{ color: "#60a5fa" }}>
            {"──▶"}
          </span>
          <span key={5} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={6} style={{ color: "#60a5fa" }}>
            {" nearest region "}
          </span>
          <span key={7} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={8} style={{ color: "#60a5fa" }}>
            {"──▶"}
          </span>
          <span key={9} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={10} style={{ color: "#4ade80" }}>
            {" local FDB metadata "}
          </span>
          <span key={11} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={12} style={{ color: "#60a5fa" }}>
            {"──▶"}
          </span>
          <span key={13} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={14}>{" location   "}</span>
          <span key={15} style={{ color: "#475569" }}>
            {"│"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"└────────────┘"}
          </span>
          <span key={2}>{"   "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"└────────────────┘"}
          </span>
          <span key={4}>{"   "}</span>
          <span key={5} style={{ color: "#475569" }}>
            {"└────────────────────┘"}
          </span>
          <span key={6}>{"   "}</span>
          <span key={7} style={{ color: "#475569" }}>
            {"└──────┬─────┘"}
          </span>
        </div>
        <div style={{ height: "1.3em" }} />
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#64748b" }}>
            {"choose the byte source"}
          </span>
          <span key={2}>
            {"                                                "}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"│"}
          </span>
        </div>
        <div>
          <span key={0}>{"             "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"┌───────────────────────┬───────────────────────┬──────────┘"}
          </span>
        </div>
        <div>
          <span key={0}>{"             "}</span>
          <span key={1} style={{ color: "#60a5fa" }}>
            {"▼"}
          </span>
          <span key={2}>{"                       "}</span>
          <span key={3} style={{ color: "#60a5fa" }}>
            {"▼"}
          </span>
          <span key={4}>{"                       "}</span>
          <span key={5} style={{ color: "#60a5fa" }}>
            {"▼"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={2} style={{ color: "#475569" }}>
            {"─"}
          </span>
          <span key={3} style={{ color: "#4ade80" }}>
            {" HIT "}
          </span>
          <span key={4} style={{ color: "#475569" }}>
            {"──────────────"}
          </span>
          <span key={5} style={{ color: "#475569" }}>
            {"┐"}
          </span>
          <span key={6}>{"  "}</span>
          <span key={7} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={8} style={{ color: "#475569" }}>
            {"─"}
          </span>
          <span key={9} style={{ color: "#64748b" }}>
            {" LOCAL "}
          </span>
          <span key={10} style={{ color: "#475569" }}>
            {"────────────"}
          </span>
          <span key={11} style={{ color: "#475569" }}>
            {"┐"}
          </span>
          <span key={12}>{"  "}</span>
          <span key={13} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={14} style={{ color: "#475569" }}>
            {"─"}
          </span>
          <span key={15} style={{ color: "#f87171" }}>
            {" MISS "}
          </span>
          <span key={16} style={{ color: "#475569" }}>
            {"─────────────"}
          </span>
          <span key={17} style={{ color: "#475569" }}>
            {"┐"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={2} style={{ color: "#4ade80" }}>
            {" SSD / block cache  "}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={4}>{"  "}</span>
          <span key={5} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={6}>{" local block store  "}</span>
          <span key={7} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={8}>{"  "}</span>
          <span key={9} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={10} style={{ color: "#f87171" }}>
            {" remote source      "}
          </span>
          <span key={11} style={{ color: "#475569" }}>
            {"│"}
          </span>
        </div>
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"└──────────┬─────────┘"}
          </span>
          <span key={2}>{"  "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"└──────────┬─────────┘"}
          </span>
          <span key={4}>{"  "}</span>
          <span key={5} style={{ color: "#475569" }}>
            {"└──────────┬─────────┘"}
          </span>
        </div>
        <div>
          <span key={0}>{"             "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={2}>{"                       "}</span>
          <span key={3} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={4}>{"                       "}</span>
          <span key={5} style={{ color: "#475569" }}>
            {"├"}
          </span>
          <span key={6} style={{ color: "#f87171" }}>
            {"──▶ enqueue warm-cache / move"}
          </span>
        </div>
        <div>
          <span key={0}>{"             "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"└───────────────────────┬───────────────────────┘"}
          </span>
        </div>
        <div>
          <span key={0}>{"                                     "}</span>
          <span key={1} style={{ color: "#60a5fa" }}>
            {"▼"}
          </span>
        </div>
        <div>
          <span key={0}>{"                      "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"┌"}
          </span>
          <span key={2} style={{ color: "#475569" }}>
            {"──────────────┬─────────────"}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"┐"}
          </span>
        </div>
        <div>
          <span key={0}>{"                      "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"│"}
          </span>
          <span key={2} style={{ color: "#4ade80" }}>
            {" return bytes to client     "}
          </span>
          <span key={3} style={{ color: "#475569" }}>
            {"│"}
          </span>
        </div>
        <div>
          <span key={0}>{"                      "}</span>
          <span key={1} style={{ color: "#475569" }}>
            {"└────────────────────────────┘"}
          </span>
        </div>
        <div style={{ height: "1.3em" }} />
        <div>
          <span key={0}>{"  "}</span>
          <span key={1} style={{ color: "#64748b" }}>
            {"// the read can complete before data placement catches up"}
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
