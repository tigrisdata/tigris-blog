import React, { useState, useEffect } from "react";

interface LogseamArchitectureDiagramProps {
  leftBoxes?: {
    title: string;
    subtitle: string;
  }[];
  rightBoxes?: {
    title: string;
    subtitle: string;
  }[];
  centerTitle?: string;
  centerSubtitle?: string;
}

export default function LogseamArchitectureDiagram({
  leftBoxes = [
    { title: "Data Sources", subtitle: "Applications, logs, metrics" },
    { title: "Security Events", subtitle: "SIEM, EDR, firewall logs" },
    { title: "Infrastructure", subtitle: "Cloud, on-premise systems" },
  ],
  rightBoxes = [
    { title: "Analytics", subtitle: "Real-time insights" },
    { title: "Alerting", subtitle: "Automated responses" },
    { title: "Reporting", subtitle: "Compliance & auditing" },
  ],
  centerTitle = "LogSeam Security Data Lake House",
  centerSubtitle = "Centralized log processing & analysis",
}: LogseamArchitectureDiagramProps): JSX.Element {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "1rem",
        }}
      >
        {/* Mobile Layout - Center Image First */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Center - LogSeam Image */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "320px",
              gap: "1rem",
            }}
          >
            {/* LogSeam Image */}
            <div
              style={{
                backgroundColor: "var(--docs-color-background-100)",
                border: "2px solid black",
                borderRadius: "12px",
                padding: "1rem",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transformOrigin: "center",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src="https://logseam.com/images/e33971cc-56bd-4f5a-ab8c-cad14e303dcf.png"
                alt="LogSeam Architecture"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </div>

            {/* Title and Subtitle */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "0.5rem",
                  color: "var(--docs-color-text)",
                }}
              >
                {centerTitle}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--docs-color-text-100)",
                }}
              >
                {centerSubtitle}
              </div>
            </div>
          </div>

          {/* Mobile Boxes - All Below */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            {/* Left Boxes */}
            {leftBoxes.map((box, index) => (
              <div
                key={`mobile-left-${index}`}
                style={{
                  backgroundColor: "var(--docs-color-background-200)",
                  border: "1px solid var(--docs-color-border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transformOrigin: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.backgroundColor =
                    "var(--docs-color-background-300)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor =
                    "var(--docs-color-background-200)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "var(--docs-color-text)",
                    fontSize: "14px",
                    marginBottom: "0.25rem",
                  }}
                >
                  {box.title}
                </div>
                <div
                  style={{
                    color: "var(--docs-color-text-100)",
                    fontSize: "12px",
                  }}
                >
                  {box.subtitle}
                </div>
              </div>
            ))}

            {/* Right Boxes */}
            {rightBoxes.map((box, index) => (
              <div
                key={`mobile-right-${index}`}
                style={{
                  backgroundColor: "var(--docs-color-background-200)",
                  border: "1px solid var(--docs-color-border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transformOrigin: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.backgroundColor =
                    "var(--docs-color-background-300)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor =
                    "var(--docs-color-background-200)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "var(--docs-color-text)",
                    fontSize: "14px",
                    marginBottom: "0.25rem",
                  }}
                >
                  {box.title}
                </div>
                <div
                  style={{
                    color: "var(--docs-color-text-100)",
                    fontSize: "12px",
                  }}
                >
                  {box.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "nowrap",
          minHeight: "400px",
        }}
      >
        {/* Left Side - Data Sources */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1rem",
            flex: "1",
            minWidth: "200px",
            maxWidth: "240px",
            height: "100%",
          }}
        >
          {leftBoxes.map((box, index) => (
            <div
              key={`left-${index}`}
              style={{
                backgroundColor: "var(--docs-color-background-200)",
                border: "1px solid var(--docs-color-border)",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transformOrigin: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor =
                  "var(--docs-color-background-300)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor =
                  "var(--docs-color-background-200)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "var(--docs-color-text)",
                  fontSize: "14px",
                  marginBottom: "0.25rem",
                }}
              >
                {box.title}
              </div>
              <div
                style={{
                  color: "var(--docs-color-text-100)",
                  fontSize: "12px",
                }}
              >
                {box.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Center - LogSeam */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "0 0 auto",
            width: "380px",
            minWidth: "380px",
            maxWidth: "380px",
            gap: "1rem",
          }}
        >
          {/* LogSeam Image */}
          <div
            style={{
              backgroundColor: "var(--docs-color-background-100)",
              border: "2px solid black",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              transformOrigin: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src="https://logseam.com/images/e33971cc-56bd-4f5a-ab8c-cad14e303dcf.png"
              alt="LogSeam Architecture"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </div>

          {/* Title and Subtitle */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "0.5rem",
                color: "var(--docs-color-text)",
              }}
            >
              {centerTitle}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--docs-color-text-100)",
              }}
            >
              {centerSubtitle}
            </div>
          </div>
        </div>

        {/* Right Side - Outputs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1rem",
            flex: "1",
            minWidth: "200px",
            maxWidth: "240px",
            height: "100%",
          }}
        >
          {rightBoxes.map((box, index) => (
            <div
              key={`right-${index}`}
              style={{
                backgroundColor: "var(--docs-color-background-200)",
                border: "1px solid var(--docs-color-border)",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transformOrigin: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor =
                  "var(--docs-color-background-300)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor =
                  "var(--docs-color-background-200)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "var(--docs-color-text)",
                  fontSize: "14px",
                  marginBottom: "0.25rem",
                }}
              >
                {box.title}
              </div>
              <div
                style={{
                  color: "var(--docs-color-text-100)",
                  fontSize: "12px",
                }}
              >
                {box.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
