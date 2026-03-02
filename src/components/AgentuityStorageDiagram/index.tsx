import React, { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

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

const layers = [
  {
    title: "Agent Persistent Storage",
    desc: "TigrisFS mount at /data",
    detail: "POSIX filesystem backed by object storage",
  },
  {
    title: "Deployment Assets",
    desc: "Encrypted with customer keys",
    detail: "Signed URL upload, on-prem or cloud",
  },
  {
    title: "Global CDN",
    desc: "Pull-through cache at the edge",
    detail: "Origin storage behind Agentuity CDN",
  },
  {
    title: "Customer Buckets",
    desc: "On-demand, unlimited",
    detail: "Secrets injection, ephemeral keys, billing",
  },
  {
    title: "Sandbox Snapshots",
    desc: "Full state capture and restore",
    detail: "Timeline-indexed, forkable sessions",
  },
];

export default function AgentuityStorageDiagram(): JSX.Element {
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
      {/* Tigris header */}
      <div
        style={{
          backgroundColor: colors.tigrisBg,
          border: `1.5px solid ${colors.tigrisBorder}`,
          borderRadius: "10px 10px 0 0",
          padding: "1rem",
          textAlign: "center",
          borderBottom: "none",
        }}
      >
        <div
          style={{ fontWeight: 700, fontSize: "15px", color: colors.tigris }}
        >
          Tigris Object Storage
        </div>
        <div style={{ fontSize: "12px", color: colors.text100, marginTop: 4 }}>
          One service, five roles across the Agentuity platform
        </div>
      </div>

      {/* Five layers */}
      <div
        style={{
          border: `1.5px solid ${colors.tigrisBorder}`,
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}
      >
        {layers.map((layer, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              padding: "0.85rem 1.25rem",
              borderBottom:
                i < layers.length - 1 ? `1px solid ${colors.border}` : "none",
              gap: isMobile ? "0.25rem" : "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                minWidth: isMobile ? "auto" : "220px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: colors.tigris,
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "13px",
                    color: colors.text,
                  }}
                >
                  {layer.title}
                </div>
                <div style={{ fontSize: "11px", color: colors.text100 }}>
                  {layer.desc}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: colors.text100,
                marginLeft: isMobile ? "1rem" : "0",
              }}
            >
              {layer.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
