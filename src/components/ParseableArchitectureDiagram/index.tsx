import React, { useState, useEffect } from "react";

const boxStyle: React.CSSProperties = {
  backgroundColor: "var(--docs-color-background-200)",
  border: "1px solid var(--docs-color-border)",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  textAlign: "left",
  cursor: "default",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const boxTitleStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "var(--docs-color-text)",
  fontSize: "13px",
  lineHeight: 1.3,
};

const boxSubtitleStyle: React.CSSProperties = {
  color: "var(--docs-color-text-100)",
  fontSize: "11px",
  marginTop: "2px",
  lineHeight: 1.3,
};

const arrowStyle: React.CSSProperties = {
  color: "var(--docs-color-text-100)",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "24px",
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "var(--docs-color-text-100)",
  marginBottom: "0.5rem",
};

function Box({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={boxStyle}>
      <div style={boxTitleStyle}>{title}</div>
      {subtitle && <div style={boxSubtitleStyle}>{subtitle}</div>}
    </div>
  );
}

function Arrow() {
  return <div style={arrowStyle}>→</div>;
}

function TraditionalDiagram({ isMobile }: { isMobile: boolean }) {
  const rows = [
    {
      source: { title: "K8s Logs" },
      tool: { title: "Log Aggregator", subtitle: "Fluentd, Logstash" },
      storage: { title: "Search Index", subtitle: "Elasticsearch" },
      dashboard: { title: "Infra Dashboard" },
    },
    {
      source: { title: "App Metrics" },
      tool: { title: "Metrics DB", subtitle: "Prometheus, Graphite" },
      storage: { title: "Time-Series DB", subtitle: "Local disk" },
      dashboard: { title: "APM Dashboard" },
    },
    {
      source: { title: "Agent Traces" },
      tool: { title: "Tracing Backend", subtitle: "Jaeger, Zipkin" },
      storage: { title: "Trace Store", subtitle: "Yet another DB" },
      dashboard: { title: "Agent Dashboard" },
    },
    {
      source: { title: "LLM Token Data" },
      tool: { title: "LLM Cost Tracker", subtitle: "Custom scripts" },
      storage: { title: "Analytics DB", subtitle: "ClickHouse, Postgres" },
      dashboard: { title: "LLM Dashboard" },
    },
  ];

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              flexWrap: "nowrap",
            }}
          >
            <div style={{ flex: "1", minWidth: 0 }}>
              <Box title={row.source.title} />
            </div>
            <Arrow />
            <div style={{ flex: "1", minWidth: 0 }}>
              <Box title={row.tool.title} />
            </div>
            <Arrow />
            <div style={{ flex: "1", minWidth: 0 }}>
              <Box title={row.dashboard.title} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 24px 1.2fr 24px 1.2fr 24px 1fr",
          gap: "0.25rem",
          marginBottom: "0.25rem",
          padding: "0 0.25rem",
        }}
      >
        <div style={sectionHeaderStyle}>Sources</div>
        <div />
        <div style={sectionHeaderStyle}>Ingestion</div>
        <div />
        <div style={sectionHeaderStyle}>Storage</div>
        <div />
        <div style={sectionHeaderStyle}>Dashboards</div>
      </div>
      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 24px 1.2fr 24px 1.2fr 24px 1fr",
              gap: "0.25rem",
              alignItems: "center",
            }}
          >
            <Box title={row.source.title} />
            <Arrow />
            <Box title={row.tool.title} subtitle={row.tool.subtitle} />
            <Arrow />
            <Box title={row.storage.title} subtitle={row.storage.subtitle} />
            <Arrow />
            <Box title={row.dashboard.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ParseableDiagram({ isMobile }: { isMobile: boolean }) {
  const sources = ["K8s Logs", "App Metrics", "Agent Traces", "LLM Token Data"];

  // Hardcoded dark green for WCAG AA contrast in both light and dark themes.
  // White on #1a5c47 = 7.88:1 (AAA), #c0e8d8 on #1a5c47 = 5.92:1 (AA).
  const centerBoxStyle: React.CSSProperties = {
    backgroundColor: "#1a5c47",
    border: "2px solid var(--ifm-color-primary)",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  };

  const centerTitleColor = "#ffffff";
  const centerSubtitleColor = "#c0e8d8";

  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* Sources as a row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          {sources.map((s, i) => (
            <Box key={i} title={s} />
          ))}
        </div>
        <div style={{ ...arrowStyle, transform: "rotate(90deg)" }}>→</div>
        <div style={{ ...centerBoxStyle, width: "100%" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: centerTitleColor,
            }}
          >
            Parseable
          </div>
          <div
            style={{
              fontSize: "11px",
              color: centerSubtitleColor,
              marginTop: "4px",
            }}
          >
            Smart Cache + Parquet
          </div>
        </div>
        <div style={{ ...arrowStyle, transform: "rotate(90deg)" }}>→</div>
        <div style={{ ...centerBoxStyle, width: "100%" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: centerTitleColor,
            }}
          >
            Tigris Object Storage
          </div>
          <div
            style={{
              fontSize: "11px",
              color: centerSubtitleColor,
              marginTop: "4px",
            }}
          >
            Globally distributed
          </div>
        </div>
        <div style={{ ...arrowStyle, transform: "rotate(90deg)" }}>→</div>
        <div style={{ ...boxStyle, width: "100%", textAlign: "center" }}>
          <div style={boxTitleStyle}>Single Interface</div>
          <div style={boxSubtitleStyle}>Natural language queries</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.8fr 24px 1.2fr 24px 1.2fr 24px 1fr",
          gap: "0.25rem",
          marginBottom: "0.25rem",
          padding: "0 0.25rem",
        }}
      >
        <div style={sectionHeaderStyle}>Sources</div>
        <div />
        <div style={sectionHeaderStyle}>Ingestion + Cache</div>
        <div />
        <div style={sectionHeaderStyle}>Storage</div>
        <div />
        <div style={sectionHeaderStyle}>Interface</div>
      </div>
      {/* Flow */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.8fr 24px 1.2fr 24px 1.2fr 24px 1fr",
          gap: "0.25rem",
          alignItems: "center",
        }}
      >
        {/* Sources column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {sources.map((s, i) => (
            <Box key={i} title={s} />
          ))}
        </div>
        {/* Arrow */}
        <Arrow />
        {/* Parseable center */}
        <div style={centerBoxStyle}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "16px",
              color: centerTitleColor,
              marginBottom: "4px",
            }}
          >
            Parseable
          </div>
          <div style={{ fontSize: "12px", color: centerSubtitleColor }}>
            Unified ingestion
          </div>
          <div style={{ fontSize: "12px", color: centerSubtitleColor }}>
            Smart cache + Parquet
          </div>
          <div style={{ fontSize: "12px", color: centerSubtitleColor }}>
            SQL + natural language
          </div>
        </div>
        {/* Arrow */}
        <Arrow />
        {/* Tigris */}
        <div style={centerBoxStyle}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "16px",
              color: centerTitleColor,
              marginBottom: "4px",
            }}
          >
            Tigris
          </div>
          <div style={{ fontSize: "12px", color: centerSubtitleColor }}>
            Object storage
          </div>
          <div style={{ fontSize: "12px", color: centerSubtitleColor }}>
            Globally distributed
          </div>
          <div style={{ fontSize: "12px", color: centerSubtitleColor }}>
            80–90% compression
          </div>
        </div>
        {/* Arrow */}
        <Arrow />
        {/* Single output */}
        <div
          style={{
            ...boxStyle,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            height: "100%",
            minHeight: "120px",
          }}
        >
          <div style={{ ...boxTitleStyle, fontSize: "14px" }}>
            Single Interface
          </div>
          <div style={boxSubtitleStyle}>Natural language queries</div>
          <div style={boxSubtitleStyle}>Dashboards + alerts</div>
        </div>
      </div>
    </div>
  );
}

export default function ParseableArchitectureDiagram(): JSX.Element {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const diagramLabelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--docs-color-text)",
    marginBottom: "0.75rem",
    textAlign: "center",
  };

  const diagramContainerStyle: React.CSSProperties = {
    backgroundColor: "var(--docs-color-background-100)",
    border: "1px solid var(--docs-color-border)",
    borderRadius: "12px",
    padding: "1.25rem",
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "2rem auto" }}>
      {/* Traditional */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={diagramLabelStyle}>Traditional Observability</div>
        <div style={diagramContainerStyle}>
          <TraditionalDiagram isMobile={isMobile} />
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          margin: "1rem 0",
          fontSize: "13px",
          color: "var(--docs-color-text-100)",
          fontStyle: "italic",
        }}
      >
        vs.
      </div>

      {/* Parseable */}
      <div>
        <div style={diagramLabelStyle}>With Parseable + Tigris</div>
        <div style={diagramContainerStyle}>
          <ParseableDiagram isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

// WCAG-compliant colors (same as ParseableDiagram center boxes)
const tierGreen = "#1a5c47";
const tierGreenText = "#ffffff";
const tierGreenSubtext = "#c0e8d8";

function TierBox({
  label,
  detail,
  accent,
}: {
  label: string;
  detail: string;
  accent?: boolean;
}) {
  if (accent) {
    return (
      <div
        style={{
          backgroundColor: tierGreen,
          border: "2px solid var(--ifm-color-primary)",
          borderRadius: "10px",
          padding: "0.75rem 1rem",
          textAlign: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          width: "100%",
        }}
      >
        <div
          style={{ fontWeight: 600, fontSize: "13px", color: tierGreenText }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: tierGreenSubtext,
            marginTop: "2px",
          }}
        >
          {detail}
        </div>
      </div>
    );
  }
  return (
    <div style={{ ...boxStyle, textAlign: "center", width: "100%" }}>
      <div style={boxTitleStyle}>{label}</div>
      <div style={boxSubtitleStyle}>{detail}</div>
    </div>
  );
}

function DownArrow({ label }: { label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        padding: "0.25rem 0",
      }}
    >
      <div style={{ color: "var(--docs-color-text-100)", fontSize: "16px" }}>
        ↓
      </div>
      {label && (
        <div
          style={{
            fontSize: "10px",
            color: "var(--docs-color-text-100)",
            fontStyle: "italic",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export function ParseableCachingDiagram(): JSX.Element {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: "var(--docs-color-background-100)",
    border: "1px solid var(--docs-color-border)",
    borderRadius: "12px",
    padding: "1.25rem",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--docs-color-text)",
    marginBottom: "0.75rem",
    textAlign: "center",
  };

  const columnStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    maxWidth: "280px",
  };

  if (isMobile) {
    return (
      <div style={{ width: "100%", maxWidth: "800px", margin: "2rem auto" }}>
        <div style={labelStyle}>Storage Tiers: Traditional vs. Parseable</div>
        <div style={containerStyle}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Traditional */}
            <div>
              <div style={{ ...sectionHeaderStyle, textAlign: "center" }}>
                Traditional
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TierBox label="Hot" detail="Memory + SSD" />
                <DownArrow label="separate infra" />
                <TierBox label="Warm" detail="Local disk" />
                <DownArrow label="separate infra" />
                <TierBox label="Cold" detail="Object storage" />
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "var(--docs-color-text-100)",
                fontStyle: "italic",
              }}
            >
              vs.
            </div>
            {/* Parseable */}
            <div>
              <div style={{ ...sectionHeaderStyle, textAlign: "center" }}>
                Parseable + Tigris
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TierBox label="Hot" detail="Memory + SSD" />
                <DownArrow />
                <TierBox
                  label="Warm + Cold"
                  detail="Tigris Object Storage"
                  accent
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "2rem auto" }}>
      <div style={labelStyle}>Storage Tiers: Traditional vs. Parseable</div>
      <div style={containerStyle}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* Left: Traditional tiers */}
          <div style={columnStyle}>
            <div
              style={{
                ...sectionHeaderStyle,
                textAlign: "center",
                width: "100%",
              }}
            >
              Traditional
            </div>
            <TierBox label="Hot" detail="Memory + SSD" />
            <DownArrow label="separate infra" />
            <TierBox label="Warm" detail="Local disk" />
            <DownArrow label="separate infra" />
            <TierBox label="Cold" detail="Object storage" />
          </div>

          {/* Center divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
              color: "var(--docs-color-text-100)",
              fontSize: "13px",
              fontStyle: "italic",
              padding: "3rem 0",
            }}
          >
            vs.
          </div>

          {/* Right: Parseable tiers */}
          <div style={columnStyle}>
            <div
              style={{
                ...sectionHeaderStyle,
                textAlign: "center",
                width: "100%",
              }}
            >
              Parseable + Tigris
            </div>
            <TierBox label="Hot" detail="Memory + SSD" />
            <DownArrow />
            <TierBox
              label="Warm + Cold"
              detail="Tigris Object Storage"
              accent
            />
            <div
              style={{
                fontSize: "11px",
                color: "var(--ifm-color-primary)",
                fontWeight: 600,
                textAlign: "center",
                marginTop: "0.5rem",
                lineHeight: 1.3,
              }}
            >
              Tigris is fast enough for both tiers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
