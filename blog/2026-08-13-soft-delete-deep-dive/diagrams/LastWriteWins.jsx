// Fig 05 — replication records are timestamped in Unix nanoseconds
// Standalone React component. Inline styles only, React is the only dependency.

const PRE_STYLE = { margin: "0", background: "#0f172a", border: "1px solid #16202f", borderRadius: "6px", padding: "32px", overflowX: "auto", lineHeight: "1.3", color: "#cbd5e1", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: "13px", whiteSpace: "pre", textAlign: "left" };

export default function LastWriteWins({ label = "FIG 05", title = "replication records are timestamped in Unix nanoseconds", showHeader = true, fontSize }) {
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
        <div>{"  "}<span style={{ color: "#64748b" }}>{"produced first"}</span>{"                          "}<span style={{ color: "#64748b" }}>{"produced 277 ms later"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"┌──────────────────────────────────┐"}</span>{"    "}<span style={{ color: "#f87171" }}>{"┌──────────────────────────────────┐"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" uploads/report.pdf               "}<span style={{ color: "#4ade80" }}>{"│"}</span>{"    "}<span style={{ color: "#f87171" }}>{"│"}</span>{" uploads/report.pdf               "}<span style={{ color: "#f87171" }}>{"│"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" op: "}<span style={{ color: "#4ade80" }}>{"PUT"}</span>{"                          "}<span style={{ color: "#4ade80" }}>{"│"}</span>{"    "}<span style={{ color: "#f87171" }}>{"│"}</span>{" op: "}<span style={{ color: "#f87171" }}>{"DELETE"}</span>{"                       "}<span style={{ color: "#f87171" }}>{"│"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"LastModified"}</span>{"  1775929768"}<span style={{ color: "#4ade80" }}>{"707198086"}</span><span style={{ color: "#4ade80" }}>{"│"}</span>{"    "}<span style={{ color: "#f87171" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"LastModified"}</span>{"  1775929768"}<span style={{ color: "#f87171" }}>{"984210773"}</span><span style={{ color: "#f87171" }}>{"│"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"block 0x3f2ac701 · origin ORD"}</span>{"    "}<span style={{ color: "#4ade80" }}>{"│"}</span>{"    "}<span style={{ color: "#f87171" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"block 0x3f2ac701 · origin IAD"}</span>{"    "}<span style={{ color: "#f87171" }}>{"│"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"└──────────────────────────────────┘"}</span>{"    "}<span style={{ color: "#f87171" }}>{"└──────────────────────────────────┘"}</span></div>
        <div>{" "}</div>
        <div>{"  "}<span style={{ color: "#64748b" }}>{"last write wins"}</span></div>
        <div>{"  "}<span style={{ color: "#f87171" }}>{"984210773"}</span>{"   "}<span style={{ color: "#64748b" }}>{"is greater than"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"707198086"}</span></div>
        <div>{" "}</div>
        <div>{"  "}<span style={{ color: "#64748b" }}>{"// the delete carries the newer LastModified, so the delete survives"}</span></div>
      </pre>
    </figure>
  );
}
