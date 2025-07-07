import React from "react";

interface MetricCellProps {
  /** this service’s metric, e.g. 25.743 */
  serviceValue: number;
  /** Tigris baseline, e.g. 16.842 */
  tigrisValue: number;
  /** unit to display, e.g. "ms", "ops/sec" */
  unit: string;
  /**
   * If true, then diff% > 100 → ✅ (for throughput, ops/sec, etc).
   * If false (default), diff% < 100 → ✅ (for latency, ms, etc).
   */
  higherIsBetter?: boolean;
}

const MetricCell: React.FC<MetricCellProps> = ({
  serviceValue,
  tigrisValue,
  unit,
  higherIsBetter = false,
}) => {
  const diffPercent = (serviceValue / tigrisValue) * 100;
  const rounded = Math.round(diffPercent);
  const isBetter = higherIsBetter ? rounded > 100 : rounded < 100;
  const statusEmoji = isBetter ? "✅" : "❌";

  return (
    <div
      style={{
        textAlign: "center",
        padding: "8px",
        verticalAlign: "middle",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
        {serviceValue} {unit}
      </div>
      <div style={{ fontSize: "0.875rem", color: "#ccc" }}>
        ({rounded}% of Tigris)&nbsp;{statusEmoji}
      </div>
    </div>
  );
};

export default MetricCell;
