import React from "react";
import { VIRGIL_FONT_FACE } from "./virgilFont";

type Element = {
  type: string;
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  fillStyle?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: string;
  roundness?: { type: number };
  label?: { text: string; fontSize?: number; color?: string };
  text?: string;
  fontSize?: number;
  points?: number[][];
  endArrowhead?: string | null;
  startArrowhead?: string | null;
  opacity?: number;
};

type Props = {
  elements: Element[];
};

// Compute bounding box of all elements
function getBounds(elements: Element[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const el of elements) {
    if (el.x == null || el.y == null) continue;
    const x = el.x;
    const y = el.y;
    const w = el.width ?? 0;
    const h = el.height ?? 0;

    if (el.type === "arrow" && el.points) {
      for (const [px, py] of el.points) {
        minX = Math.min(minX, x + px);
        minY = Math.min(minY, y + py);
        maxX = Math.max(maxX, x + px);
        maxY = Math.max(maxY, y + py);
      }
    } else if (el.type === "diamond") {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    } else if (el.type === "text") {
      const lines = (el.text ?? "").split("\n");
      const maxLen = Math.max(...lines.map((l) => l.length));
      const fs = el.fontSize ?? 16;
      const estW = maxLen * fs * 0.6;
      const estH = lines.length * fs * 1.2;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + estW);
      maxY = Math.max(maxY, y + estH);
    } else {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    }
  }
  return { minX, minY, maxX, maxY };
}

function renderArrowhead(
  x: number,
  y: number,
  angle: number,
  color: string,
  size = 8,
): React.ReactNode {
  const a1 = angle + Math.PI * 0.8;
  const a2 = angle - Math.PI * 0.8;
  const x1 = x + Math.cos(a1) * size;
  const y1 = y + Math.sin(a1) * size;
  const x2 = x + Math.cos(a2) * size;
  const y2 = y + Math.sin(a2) * size;
  return (
    <polyline
      points={`${x1},${y1} ${x},${y} ${x2},${y2}`}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function RenderElement({
  el,
  pad,
}: {
  el: Element;
  pad: { x: number; y: number };
}) {
  const ox = pad.x;
  const oy = pad.y;
  const x = (el.x ?? 0) + ox;
  const y = (el.y ?? 0) + oy;
  const w = el.width ?? 0;
  const h = el.height ?? 0;
  const fill =
    el.fillStyle === "solid"
      ? (el.backgroundColor ?? "transparent")
      : "transparent";
  const stroke = el.strokeColor ?? "#1e1e1e";
  const sw = el.strokeWidth ?? 1;
  const opacity = el.opacity != null ? el.opacity / 100 : 1;
  const dashed = el.strokeStyle === "dashed" ? "6 4" : undefined;
  const rounded = el.roundness ? 8 : 0;

  if (el.type === "rectangle") {
    return (
      <g opacity={opacity}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={rounded}
          ry={rounded}
          fill={fill}
          stroke={stroke === "transparent" ? "none" : stroke}
          strokeWidth={sw}
          strokeDasharray={dashed}
        />
        {el.label && (
          <text
            x={x + w / 2}
            y={y + h / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={el.label.color ?? "#1e1e1e"}
            fontSize={el.label.fontSize ?? 16}
            fontFamily="Virgil, sans-serif"
            fontWeight="500"
          >
            {el.label.text.split("\n").map((line, i, arr) => (
              <tspan
                key={i}
                x={x + w / 2}
                dy={i === 0 ? `${-(arr.length - 1) * 0.6}em` : "1.2em"}
              >
                {line}
              </tspan>
            ))}
          </text>
        )}
      </g>
    );
  }

  if (el.type === "diamond") {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    return (
      <g opacity={opacity}>
        <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
        {el.label && (
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill={el.label.color ?? "#1e1e1e"}
            fontSize={el.label.fontSize ?? 16}
            fontFamily="Virgil, sans-serif"
            fontWeight="500"
          >
            {el.label.text}
          </text>
        )}
      </g>
    );
  }

  if (el.type === "text") {
    const fs = el.fontSize ?? 16;
    const lines = (el.text ?? "").split("\n");
    return (
      <text
        x={x}
        y={y + fs}
        fill={stroke}
        fontSize={fs}
        fontFamily="Virgil, sans-serif"
        opacity={opacity}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : fs * 1.2}>
            {line}
          </tspan>
        ))}
      </text>
    );
  }

  if (el.type === "arrow") {
    const pts = el.points ?? [[0, 0]];
    const pathData = pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${x + p[0]},${y + p[1]}`)
      .join(" ");

    // Arrowheads
    const arrows: React.ReactNode[] = [];
    if (el.endArrowhead && pts.length >= 2) {
      const last = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
      arrows.push(
        <React.Fragment key="end">
          {renderArrowhead(x + last[0], y + last[1], angle, stroke)}
        </React.Fragment>,
      );
    }
    if (el.startArrowhead && pts.length >= 2) {
      const first = pts[0];
      const next = pts[1];
      const angle = Math.atan2(first[1] - next[1], first[0] - next[0]);
      arrows.push(
        <React.Fragment key="start">
          {renderArrowhead(x + first[0], y + first[1], angle, stroke)}
        </React.Fragment>,
      );
    }

    // Label
    let label: React.ReactNode = null;
    if (el.label) {
      const midIdx = Math.floor(pts.length / 2);
      const p1 = pts[midIdx - 1] ?? pts[0];
      const p2 = pts[midIdx] ?? pts[0];
      const lx = x + (p1[0] + p2[0]) / 2;
      const ly = y + (p1[1] + p2[1]) / 2 - 8;
      label = (
        <text
          x={lx}
          y={ly}
          textAnchor="middle"
          fill={el.label.color ?? "#8fa3b0"}
          fontSize={el.label.fontSize ?? 14}
          fontFamily="Virgil, sans-serif"
          fontStyle="italic"
        >
          {el.label.text}
        </text>
      );
    }

    return (
      <g opacity={opacity}>
        <path
          d={pathData}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeDasharray={dashed}
          strokeLinecap="round"
        />
        {arrows}
        {label}
      </g>
    );
  }

  if (el.type === "ellipse") {
    return (
      <ellipse
        cx={x + w / 2}
        cy={y + h / 2}
        rx={w / 2}
        ry={h / 2}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        opacity={opacity}
      />
    );
  }

  return null;
}

export default function ExcalidrawDiagram({ elements }: Props) {
  const visible = elements.filter(
    (el) => el.type !== "cameraUpdate" && !el.id?.startsWith("darkbg"),
  );

  const bounds = getBounds(visible);
  const padding = 20;
  const vx = bounds.minX - padding;
  const vy = bounds.minY - padding;
  const vw = bounds.maxX - bounds.minX + padding * 2;
  const vh = bounds.maxY - bounds.minY + padding * 2;

  return (
    <svg
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      width="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        background: "#0e1920",
        borderRadius: 14,
      }}
    >
      <defs>
        <style>{VIRGIL_FONT_FACE}</style>
      </defs>
      {visible.map((el, i) => (
        <RenderElement key={el.id ?? i} el={el} pad={{ x: 0, y: 0 }} />
      ))}
    </svg>
  );
}
