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
  const diffMultiple = serviceValue / tigrisValue;
  const multiple = Math.round(diffMultiple * 100) / 100;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "8px",
        verticalAlign: "middle",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.125rem" }}>
        {serviceValue} {unit}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#ccc" }}>
        ({multiple}x Tigris)
      </div>
    </div>
  );
};

export default MetricCell;
