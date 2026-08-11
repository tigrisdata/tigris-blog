// Fig 06 — the tombstone is what a stale write must beat
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

export default function TombstoneGuard({
  label = "FIG 06",
  title = "the tombstone is what a stale write must beat",
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
          <span style={{ color: "#64748b" }}>{"ORD · agent PutObject"}</span>
          {"                     "}
          <span style={{ color: "#64748b" }}>{"IAD · user DeleteObject"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>
            {"┌──────────────────────────┐"}
          </span>
          {"              "}
          <span style={{ color: "#f87171" }}>
            {"┌──────────────────────────┐"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>{"│"}</span>
          {" uploads/report.pdf       "}
          <span style={{ color: "#475569" }}>{"│"}</span>
          {"              "}
          <span style={{ color: "#f87171" }}>{"│"}</span>
          {" uploads/report.pdf       "}
          <span style={{ color: "#f87171" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"new version · v2"}</span>
          {"         "}
          <span style={{ color: "#475569" }}>{"│"}</span>
          <span style={{ color: "#f87171" }}>{"◀─────────────"}</span>
          <span style={{ color: "#f87171" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>
            {"row deleted · marker kept"}
          </span>
          <span style={{ color: "#f87171" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"t = 15"}</span>
          {"                   "}
          <span style={{ color: "#475569" }}>{"│"}</span>
          {"   "}
          <span style={{ color: "#f87171" }}>{"delete"}</span>
          {"     "}
          <span style={{ color: "#f87171" }}>{"│"}</span>{" "}
          <span style={{ color: "#f87171" }}>{"tombstone t = 25"}</span>
          {"         "}
          <span style={{ color: "#f87171" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>
            {"└────────────┬─────────────┘"}
          </span>
          {"              "}
          <span style={{ color: "#f87171" }}>
            {"└────────────┬─────────────┘"}
          </span>
        </div>
        <div>
          {"               "}
          <span style={{ color: "#60a5fa" }}>
            {"└────────────────────┬────────────────────┘"}
          </span>
        </div>
        <div>
          {"                                    "}
          <span style={{ color: "#60a5fa" }}>{"▼"}</span>
        </div>
        <div>
          {"    "}
          <span style={{ color: "#4ade80" }}>
            {"┌────────────────────────────────────────────────────────────┐"}
          </span>
        </div>
        <div>
          {"    "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
          {" at IAD: is the write newer than the marker?                "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
        </div>
        <div>
          {"    "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>
            {"write t = 15  ·  marker t = 25  ·  is 15 > 25 ?"}
          </span>
          {"            "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
        </div>
        <div>
          {"    "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>{" "}
          <span style={{ color: "#f87171" }}>
            {"no — not strictly newer, so the write is dropped"}
          </span>
          {"           "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
        </div>
        <div>
          {"    "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>
            {"equal timestamps lose too · the guard runs for every bucket"}
          </span>
          <span style={{ color: "#4ade80" }}>{"│"}</span>
        </div>
        <div>
          {"    "}
          <span style={{ color: "#4ade80" }}>
            {"└────────────────────────────────────────────────────────────┘"}
          </span>
        </div>
        <div> </div>
        <div>
          {"  "}
          <span style={{ color: "#64748b" }}>
            {
              "// without the marker, an empty slot looks exactly like a key that never existed."
            }
          </span>
        </div>
      </pre>
    </figure>
  );
}
