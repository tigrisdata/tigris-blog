import React, { type ReactNode } from "react";

/**
 * A numbered point: circled number, content slightly indented.
 * Usage:
 *   <Takeaway n={1} title="The claim in one sentence.">
 *     Supporting explanation.
 *   </Takeaway>
 */

interface TakeawayProps {
  n: number;
  title: string;
  children: ReactNode;
}

export default function Takeaway({
  n,
  title,
  children,
}: TakeawayProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.9rem",
        alignItems: "flex-start",
        maxWidth: "42rem",
        margin: "1.4rem auto",
        paddingLeft: "0.75rem",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 27,
          height: 27,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #62feb5",
          color: "#62feb5",
          fontWeight: 700,
          fontSize: "0.9rem",
          marginTop: 1,
        }}
      >
        {n}
      </div>
      <div>
        <strong style={{ color: "#62feb5" }}>{title}</strong> {children}
      </div>
    </div>
  );
}
