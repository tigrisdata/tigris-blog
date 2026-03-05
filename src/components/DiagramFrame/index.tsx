import React from "react";

interface DiagramFrameProps {
  title?: string;
  children: React.ReactNode;
}

export default function DiagramFrame({
  title,
  children,
}: DiagramFrameProps): JSX.Element {
  return (
    <div
      style={{
        maxWidth: "42rem",
        margin: "1.5rem auto",
      }}
    >
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid rgba(124, 92, 252, 0.4)",
          backgroundColor: "var(--docs-color-background-100)",
          boxShadow: "0 0 0 1px rgba(124,92,252,0.12)",
          padding: "1.25rem 1.5rem",
        }}
      >
        {title && (
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
              color: "var(--docs-color-text-100)",
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
