import React from "react";

interface SummaryItem {
  title: string;
  description: string;
}

interface QuickSummaryProps {
  items: SummaryItem[];
  readTime?: string;
}

function LightningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="12" fill="var(--ifm-color-primary)" />
      <path
        d="M7.5 12.5l3 3 6-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function QuickSummary({
  items,
  readTime,
}: QuickSummaryProps): JSX.Element {
  return (
    <div
      style={{
        backgroundColor: "var(--docs-color-background-100)",
        border: "1px solid var(--docs-color-border)",
        borderRadius: "12px",
        padding: "1.5rem",
        margin: "1.5rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--ifm-color-primary)",
            color: "white",
            borderRadius: "10px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LightningIcon />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--docs-color-text)",
          }}
        >
          Quick Summary
        </span>
        {readTime && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "13px",
              color: "var(--docs-color-text-100)",
              fontWeight: 500,
            }}
          >
            {readTime}
          </span>
        )}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <div style={{ paddingTop: "2px" }}>
              <CheckIcon />
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--docs-color-text)" }}>
                {item.title}
              </strong>{" "}
              <span style={{ color: "var(--docs-color-text-100)" }}>
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom gradient bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, var(--ifm-color-primary), #7c5cfc)",
        }}
      />
    </div>
  );
}
