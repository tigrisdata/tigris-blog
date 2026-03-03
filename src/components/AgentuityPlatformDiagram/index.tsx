import React, { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

const colors = {
  border: "var(--docs-color-border, #e0e0e0)",
  bg100: "var(--docs-color-background-100, #ffffff)",
  bg200: "var(--docs-color-background-200, #f5f5f5)",
  bg300: "var(--docs-color-background-300, #ebebeb)",
  text: "var(--docs-color-text, #1a1a1a)",
  text100: "var(--docs-color-text-100, #666666)",
  tigris: "#00C896",
  tigrisBg: "rgba(0, 200, 150, 0.08)",
  tigrisBorder: "rgba(0, 200, 150, 0.3)",
  pilotBg: "rgba(100, 100, 255, 0.06)",
  pilotBorder: "rgba(100, 100, 255, 0.25)",
};

function Box({
  title,
  subtitle,
  style,
}: {
  title: string;
  subtitle?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: colors.bg200,
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "13px",
          color: colors.text,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: "11px", color: colors.text100, marginTop: 2 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function Arrow({ direction = "down" }: { direction?: "down" | "right" }) {
  if (direction === "right") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 0.25rem",
          color: colors.text100,
          fontSize: "18px",
        }}
      >
        →
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "0.4rem 0",
        color: colors.text100,
        fontSize: "18px",
      }}
    >
      ↓
    </div>
  );
}

export default function AgentuityPlatformDiagram(): JSX.Element {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "2rem auto",
        fontFamily: "var(--ifm-font-family-base, system-ui, sans-serif)",
      }}
    >
      {/* Developer / Agent layer */}
      <div
        style={{
          backgroundColor: colors.bg200,
          border: `1px solid ${colors.border}`,
          borderRadius: "10px",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "14px", color: colors.text }}>
          Developers &amp; Agents
        </div>
        <div style={{ fontSize: "12px", color: colors.text100, marginTop: 4 }}>
          SDKs · CLI · Agent Frameworks
        </div>
      </div>

      <Arrow />

      {/* Agentuity Platform */}
      <div
        style={{
          border: `2px solid ${colors.border}`,
          borderRadius: "12px",
          padding: "1.25rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "1rem",
            backgroundColor: colors.bg100,
            padding: "0 0.5rem",
            fontSize: "11px",
            fontWeight: 700,
            color: colors.text100,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Agentuity Platform
        </div>

        {/* Pilot Control Plane */}
        <div
          style={{
            border: `1.5px solid ${colors.pilotBorder}`,
            backgroundColor: colors.pilotBg,
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-9px",
              left: "0.75rem",
              backgroundColor: colors.bg100,
              padding: "0 0.4rem",
              fontSize: "11px",
              fontWeight: 600,
              color: colors.text100,
            }}
          >
            Pilot Control Plane
          </div>

          {/* Runtime types */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            <Box
              title="Long-Running Agents"
              subtitle="Persistent · Warm starts"
              style={{ flex: 1 }}
            />
            <Box
              title="Sandboxes"
              subtitle="Ephemeral · Forkable"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Infrastructure layer */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "0.5rem",
          }}
        >
          <Box title="containerd" style={{ flex: 1 }} />
          <Box title="eBPF" subtitle="Syscall visibility" style={{ flex: 1 }} />
          <Box
            title="Gravity Network"
            subtitle="Custom orchestration"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <Arrow />

      {/* Tigris layer */}
      <div
        style={{
          backgroundColor: colors.tigrisBg,
          border: `1.5px solid ${colors.tigrisBorder}`,
          borderRadius: "10px",
          padding: "1rem",
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
          Tigris Object Storage
        </div>
        <div style={{ fontSize: "12px", color: colors.text100, marginTop: 4 }}>
          Globally distributed · S3-compatible · Multi-cloud
        </div>
      </div>
    </div>
  );
}
