// Fig 01 — DeleteObject writes a delete marker
// Standalone React component. Inline styles only, React is the only dependency.

const PRE_STYLE = { margin: "0", background: "#0f172a", border: "1px solid #16202f", borderRadius: "6px", padding: "32px", overflowX: "auto", lineHeight: "1.3", color: "#cbd5e1", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: "13px", whiteSpace: "pre", textAlign: "left" };

export default function DeleteMarker({ label = "FIG 01", title = "DeleteObject writes a delete marker", showHeader = true, fontSize }) {
  const preStyle = fontSize ? { ...PRE_STYLE, fontSize } : PRE_STYLE;
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
      {showHeader && (
        <figcaption style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: PRE_STYLE.fontFamily }}>
          <span style={{ fontSize: 11, color: '#475569', letterSpacing: '0.14em' }}>{label}</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{title}</span>
        </figcaption>
      )}
      <pre style={preStyle}>
        <div>{"  "}<span style={{ color: "#475569" }}>{"┌───────────────────┐  ┌───────────────────┐  "}</span><span style={{ color: "#f87171" }}>{"┌───────────────────┐ ◀── DeleteObject"}</span></div>
        <div>{"  "}<span style={{ color: "#475569" }}>{"│"}</span><span style={{ color: "#64748b" }}>{" v1                "}</span><span style={{ color: "#475569" }}>{"│  │"}</span><span style={{ color: "#64748b" }}>{" v2                "}</span><span style={{ color: "#475569" }}>{"│  "}</span><span style={{ color: "#f87171" }}>{"│"}</span><span style={{ color: "#64748b" }}>{" v3        "}</span><span style={{ color: "#f87171" }}>{"current │"}</span></div>
        <div>{"  "}<span style={{ color: "#475569" }}>{"│"}</span>{" report.pdf        "}<span style={{ color: "#475569" }}>{"│  │"}</span>{" report.pdf        "}<span style={{ color: "#475569" }}>{"│  "}</span><span style={{ color: "#f87171" }}>{"│"}</span>{" report.pdf        "}<span style={{ color: "#f87171" }}>{"│"}</span></div>
        <div>{"  "}<span style={{ color: "#475569" }}>{"│"}</span><span style={{ color: "#64748b" }}>{" …198086           "}</span><span style={{ color: "#475569" }}>{"│  │"}</span><span style={{ color: "#64748b" }}>{" …198088           "}</span><span style={{ color: "#475569" }}>{"│  "}</span><span style={{ color: "#f87171" }}>{"│ delete marker     │"}</span></div>
        <div>{"  "}<span style={{ color: "#475569" }}>{"└─────────┬─────────┘  └─────────┬─────────┘  "}</span><span style={{ color: "#f87171" }}>{"└───────────────────┘"}</span></div>
        <div>{"  "}<span style={{ color: "#60a5fa" }}>{"          │                      │              "}</span><span style={{ color: "#f87171" }}>{"no data"}</span></div>
        <div style={{ color: "#60a5fa" }}>{"            ▼                      ▼"}</div>
        <div style={{ color: "#475569" }}>{"  ┌───────────────────────────────────────────────────────────────────┐"}</div>
        <div>{"  "}<span style={{ color: "#475569" }}>{"│"}</span><span style={{ color: "#64748b" }}>{" sea of data                                                       "}</span><span style={{ color: "#475569" }}>{"│"}</span></div>
        <div style={{ color: "#475569" }}>{"  │    ┌──────────┐         ┌──────────┐                              │"}</div>
        <div>{"  "}<span style={{ color: "#475569" }}>{"│    │"}</span>{" v1 bytes "}<span style={{ color: "#475569" }}>{"│         │"}</span>{" v2 bytes "}<span style={{ color: "#475569" }}>{"│                              │"}</span></div>
        <div style={{ color: "#475569" }}>{"  │    └──────────┘         └──────────┘                              │"}</div>
        <div style={{ color: "#475569" }}>{"  └───────────────────────────────────────────────────────────────────┘"}</div>
        <div>{" "}</div>
        <div style={{ color: "#64748b" }}>{"  // the bytes stay. only the newest record says the object is gone."}</div>
      </pre>
    </figure>
  );
}
