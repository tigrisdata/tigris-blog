import React from "react";

const colors = {
  border: "var(--docs-color-border, #e0e0e0)",
  bg100: "var(--docs-color-background-100, #ffffff)",
  bg200: "var(--docs-color-background-200, #f5f5f5)",
  text: "var(--docs-color-text, #1a1a1a)",
  text100: "var(--docs-color-text-100, #666666)",
  tigris: "#00C896",
  tigrisBg: "rgba(0, 200, 150, 0.08)",
  tigrisBorder: "rgba(0, 200, 150, 0.3)",
};

const rows = [
  {
    name: "Global",
    summary: "Global buckets distribute data worldwide.",
    detail: "Objects move to the regions where they are accessed most.",
  },
  {
    name: "Multi‑region",
    summary: "Multi-region buckets provide the highest availability in one geography.",
    detail: "Data is copied across regions in a group like us or europe.",
  },
  {
    name: "Dual‑region",
    summary: "Dual-region buckets keep data in two specific regions you choose.",
    detail: "They are a good fit for compliance and active/active topologies.",
  },
  {
    name: "Single‑region",
    summary: "Single-region buckets keep data in one region co-located with compute.",
    detail: "Data is stored redundantly within that region’s availability zones.",
  },
];

export default function BucketLocationDiagram(): JSX.Element {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "42rem",
        margin: "1.5rem auto 2rem",
        fontFamily: "var(--ifm-font-family-base, system-ui, sans-serif)",
      }}
    >
      <div
        style={{
          backgroundColor: colors.tigrisBg,
          border: `1.5px solid ${colors.tigrisBorder}`,
          borderRadius: "10px 10px 0 0",
          padding: "0.9rem 1rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            color: colors.tigris,
          }}
        >
          Bucket locations
        </div>
        <div
          style={{
            fontSize: "12px",
            color: colors.text100,
            marginTop: 4,
          }}
        >
          Four ways to control where your data lives.
        </div>
      </div>

      <div
        style={{
          border: `1.5px solid ${colors.tigrisBorder}`,
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}
      >
        {rows.map((row, index) => (
          <div
            key={row.name}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              padding: "0.85rem 1.1rem",
              borderBottom:
                index < rows.length - 1 ? `1px solid ${colors.border}` : "none",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                minWidth: "130px",
                fontWeight: 600,
                fontSize: "13px",
                color: colors.text,
              }}
            >
              {row.name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: colors.text100,
              }}
            >
              <div>{row.summary}</div>
              <div style={{ marginTop: 2 }}>{row.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

