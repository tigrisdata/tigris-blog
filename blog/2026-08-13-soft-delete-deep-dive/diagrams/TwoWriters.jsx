// Fig 04 — two regions write to one key at the same time
// Standalone React component. Inline styles only, React is the only dependency.

const PRE_STYLE = {
  margin: "0",
  background: "#0f172a",
  border: "1px solid #16202f",
  borderRadius: "6px",
  padding: "32px",
  overflowX: "auto",
  lineHeight: "1.3",
  color: "#cbd5e1",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: "13px",
  whiteSpace: "pre",
  textAlign: "left",
};

export default function TwoWriters({
  label = "FIG 04",
  title = "two regions write to one key at the same time",
  showHeader = true,
  fontSize,
}) {
  const preStyle = fontSize ? { ...PRE_STYLE, fontSize } : PRE_STYLE;
  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        textAlign: "left",
      }}
    >
      {showHeader && (
        <figcaption
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            fontFamily: PRE_STYLE.fontFamily,
          }}
        >
          <span
            style={{ fontSize: 11, color: "#475569", letterSpacing: "0.14em" }}
          >
            {label}
          </span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{title}</span>
        </figcaption>
      )}
      <pre style={preStyle}>
        <div>
          {"  "}
          <span style={{ color: "#64748b" }}>{"ORD (Chicago)"}</span>
          {"                               "}
          <span style={{ color: "#64748b" }}>{"IAD (Ashburn)"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>
            {"┌──────────────────────────┐"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>{" "}
          <span style={{ color: "#4ade80" }}>{"PutObject"}</span>
          {"  "}
          <span style={{ color: "#64748b" }}>{"· agent A"}</span>
          {"     "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
          {" uploads/report.pdf       "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
          {"  "}
          <span style={{ color: "#60a5fa" }}>
            {"──── replicates PUT ────▶"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"t = …768707198086"}</span>
          {"        "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>
            {"└──────────────────────────┘"}
          </span>
        </div>
        <div> </div>
        <div>
          {"                                              "}
          <span style={{ color: "#f87171" }}>
            {"┌──────────────────────────┐"}
          </span>
        </div>
        <div>
          {"                                              "}
          <span style={{ color: "#f87171" }}>{"│"}</span>{" "}
          <span style={{ color: "#f87171" }}>{"DeleteObject"}</span>
          {"  "}
          <span style={{ color: "#64748b" }}>{"· agent B"}</span>
          {"  "}
          <span style={{ color: "#f87171" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#60a5fa" }}>{"◀── replicates DELETE ──"}</span>
          {"                    "}
          <span style={{ color: "#f87171" }}>{"│"}</span>
          {" uploads/report.pdf       "}
          <span style={{ color: "#f87171" }}>{"│"}</span>
        </div>
        <div>
          {"                                              "}
          <span style={{ color: "#f87171" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"t = …768984210773"}</span>
          {"        "}
          <span style={{ color: "#f87171" }}>{"│"}</span>
        </div>
        <div>
          {"                                              "}
          <span style={{ color: "#f87171" }}>
            {"└──────────────────────────┘"}
          </span>
        </div>
        <div> </div>
        <div>
          {"  "}
          <span style={{ color: "#64748b" }}>{"ORD applies"}</span>
          {"   PUT  ▸  DELETE    "}
          <span style={{ color: "#64748b" }}>{"deleted, as expected"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#64748b" }}>{"IAD applies"}</span>
          {"   DELETE  ▸  PUT    "}
          <span style={{ color: "#f59e0b" }}>{"the put looks brand new"}</span>
        </div>
        <div> </div>
        <div>
          {"  "}
          <span style={{ color: "#64748b" }}>
            {
              "// two writers, one key. the regions disagree about whether it exists."
            }
          </span>
        </div>
      </pre>
    </figure>
  );
}
