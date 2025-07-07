import React from "react";

interface MetricCellProps {
  /** this service’s metric, e.g. 25.743 */
  serviceValue: number;
  /** Tigris baseline, e.g. 16.842 */
  tigrisValue: number;
  /** unit to display, e.g. "ms", "ops/sec" */
  unit: string;
}

const MetricCell: React.FC<MetricCellProps> = ({
  serviceValue,
  tigrisValue,
  unit,
}) => {
  const diffPercent = (serviceValue / tigrisValue) * 100;
  const rounded = Math.round(diffPercent);

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
        ({rounded}% of Tigris)
      </div>
    </div>
  );
};

export default MetricCell;
