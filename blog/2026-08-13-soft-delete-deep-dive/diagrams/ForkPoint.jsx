// Fig 02 — fork at any version timestamp to see the bucket's past
// Standalone React component. Inline styles only, React is the only dependency.

const PRE_STYLE = { margin: "0", background: "#0f172a", border: "1px solid #16202f", borderRadius: "6px", padding: "32px", overflowX: "auto", lineHeight: "1.3", color: "#cbd5e1", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: "13px", whiteSpace: "pre", textAlign: "left" };

export default function ForkPoint({ label = "FIG 02", title = "fork at any version timestamp to see the bucket's past", showHeader = true, fontSize }) {
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
        <div>{"  "}<span style={{ color: "#64748b" }}>{"every write appends a new version entry"}</span></div>
        <div>{" "}</div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"v1"}</span>{"              "}<span style={{ color: "#4ade80" }}>{"v2"}</span>{"              "}<span style={{ color: "#4ade80" }}>{"╎"}</span>{"   "}<span style={{ color: "#475569" }}>{"v3"}</span>{"              "}<span style={{ color: "#475569" }}>{"v4"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"┌────────────┐"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"┌────────────┐"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"╎"}</span>{"   "}<span style={{ color: "#475569" }}>{"┌────────────┐"}</span>{"  "}<span style={{ color: "#475569" }}>{"┌────────────┐"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"…198086"}</span>{"    "}<span style={{ color: "#4ade80" }}>{"│"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"…431907"}</span>{"    "}<span style={{ color: "#4ade80" }}>{"│"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"╎"}</span>{"   "}<span style={{ color: "#475569" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"…764522"}</span>{"    "}<span style={{ color: "#475569" }}>{"│"}</span>{"  "}<span style={{ color: "#475569" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"…055310"}</span>{"    "}<span style={{ color: "#475569" }}>{"│"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" 4.1 MB     "}<span style={{ color: "#4ade80" }}>{"│"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" 4.3 MB     "}<span style={{ color: "#4ade80" }}>{"│"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"╎"}</span>{"   "}<span style={{ color: "#475569" }}>{"│"}</span>{" 4.4 MB     "}<span style={{ color: "#475569" }}>{"│"}</span>{"  "}<span style={{ color: "#475569" }}>{"│"}</span>{" 5.0 MB     "}<span style={{ color: "#475569" }}>{"│"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"└─────┬──────┘"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"└─────┬──────┘"}</span>{"  "}<span style={{ color: "#4ade80" }}>{"╎"}</span>{"   "}<span style={{ color: "#475569" }}>{"└─────┬──────┘"}</span>{"  "}<span style={{ color: "#475569" }}>{"└─────┬──────┘"}</span></div>
        <div>{"  "}<span style={{ color: "#475569" }}>{"──────┴───────────────┴─────────"}</span><span style={{ color: "#4ade80" }}>{"╎"}</span><span style={{ color: "#475569" }}>{"─────────┴───────────────┴───────▶"}</span></div>
        <div>{"  "}<span style={{ color: "#64748b" }}>{"earlier"}</span>{"                         "}<span style={{ color: "#4ade80" }}>{"╎ fork point"}</span>{"                "}<span style={{ color: "#64748b" }}>{"later"}</span></div>
        <div>{"  "}<span style={{ color: "#4ade80" }}>{"the fork inherits these"}</span>{"         "}<span style={{ color: "#4ade80" }}>{"╎"}</span>{"   "}<span style={{ color: "#64748b" }}>{"written later — the fork never sees them"}</span></div>
        <div>{"                                  "}<span style={{ color: "#4ade80" }}>{"▼"}</span></div>
        <div>{"                      "}<span style={{ color: "#4ade80" }}>{"┌──────────────────────────────┐"}</span></div>
        <div>{"                      "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" uploads/report.pdf           "}<span style={{ color: "#4ade80" }}>{"│"}</span></div>
        <div>{"                      "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"current version"}</span>{" "}<span style={{ color: "#4ade80" }}>{"v2"}</span>{"           "}<span style={{ color: "#4ade80" }}>{"│"}</span></div>
        <div>{"                      "}<span style={{ color: "#4ade80" }}>{"│"}</span>{" "}<span style={{ color: "#64748b" }}>{"as of 1775929812004431907"}</span>{"    "}<span style={{ color: "#4ade80" }}>{"│"}</span></div>
        <div>{"                      "}<span style={{ color: "#4ade80" }}>{"└──────────────────────────────┘"}</span></div>
        <div>{" "}</div>
        <div>{"  "}<span style={{ color: "#64748b" }}>{"// appending metadata instead of overwriting keeps any past instant addressable."}</span></div>
      </pre>
    </figure>
  );
}
