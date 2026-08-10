// Fig 03 — delete moves the metadata record to the soft-delete keyspace
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

export default function RecycleBin({
  label = "FIG 03",
  title = "delete moves the metadata record to the soft-delete keyspace",
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
          <span style={{ color: "#64748b" }}>
            {"main table · live keyspace"}
          </span>
          {"                "}
          <span style={{ color: "#64748b" }}>
            {"soft-delete keyspace · newest first"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>
            {"┌────────────────────────────┐"}
          </span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>
            {"┌──────────────────────────────────┐"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
          {" uploads/report.pdf         "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
          {" uploads/report.pdf   "}
          <span style={{ color: "#64748b" }}>{"3rd delete"}</span>
          {"  "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"live metadata record"}</span>
          {"       "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
          <span style={{ color: "#f59e0b" }}>{"───────▶"}</span>
          {"    "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"deleted …768707198086"}</span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"in ListObjectsV2 output"}</span>
          {"    "}
          <span style={{ color: "#4ade80" }}>{"│"}</span>
          <span style={{ color: "#4ade80" }}>{"◀╌╌╌╌╌╌"}</span>
          {"     "}
          <span style={{ color: "#f59e0b" }}>
            {"└──────────────────────────────────┘"}
          </span>
        </div>
        <div>
          {"                                            "}
          <span style={{ color: "#f59e0b" }}>
            {"┌──────────────────────────────────┐"}
          </span>
        </div>
        <div>
          {"                                            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
          {" uploads/report.pdf   "}
          <span style={{ color: "#64748b" }}>{"2nd delete"}</span>
          {"  "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
        </div>
        <div>
          {"                                            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"deleted …412888100731"}</span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>
            {"┌────────────────────────────┐"}
          </span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>
            {"└──────────────────────────────────┘"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>{"│"}</span>
          {" uploads/notes.md           "}
          <span style={{ color: "#475569" }}>{"│"}</span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>
            {"┌──────────────────────────────────┐"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"untouched by the delete"}</span>
          {"    "}
          <span style={{ color: "#475569" }}>{"│"}</span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
          {" uploads/report.pdf   "}
          <span style={{ color: "#64748b" }}>{"1st delete"}</span>
          {"  "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#475569" }}>
            {"└────────────────────────────┘"}
          </span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>{" "}
          <span style={{ color: "#64748b" }}>{"deleted …104233715492"}</span>
          {"            "}
          <span style={{ color: "#f59e0b" }}>{"│"}</span>
        </div>
        <div>
          {"                                            "}
          <span style={{ color: "#f59e0b" }}>
            {"└──────────────────────────────────┘"}
          </span>
        </div>
        <div> </div>
        <div>
          {"  "}
          <span style={{ color: "#f59e0b" }}>{"───────▶"}</span>
          {"  "}
          <span style={{ color: "#64748b" }}>
            {"DeleteObject moves the record out — one entry per delete"}
          </span>
        </div>
        <div>
          {"  "}
          <span style={{ color: "#4ade80" }}>{"◀╌╌╌╌╌╌"}</span>
          {"   "}
          <span style={{ color: "#64748b" }}>
            {"RestoreObject moves the same metadata back"}
          </span>
        </div>
        <div> </div>
        <div>
          {"  "}
          <span style={{ color: "#64748b" }}>
            {
              "// the bin entry is a copy of the metadata, not a marker. restoring is a move."
            }
          </span>
        </div>
      </pre>
    </figure>
  );
}
