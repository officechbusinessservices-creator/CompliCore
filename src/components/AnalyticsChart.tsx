"use client";

import { useState } from "react";

type DataPoint = { label: string; revenue: number; occupancy: number; bookings: number };

const data: DataPoint[] = [
  { label: "Aug", revenue: 8200, occupancy: 62, bookings: 14 },
  { label: "Sep", revenue: 9400, occupancy: 71, bookings: 17 },
  { label: "Oct", revenue: 10800, occupancy: 74, bookings: 19 },
  { label: "Nov", revenue: 9100, occupancy: 68, bookings: 16 },
  { label: "Dec", revenue: 13200, occupancy: 88, bookings: 24 },
  { label: "Jan", revenue: 11600, occupancy: 79, bookings: 21 },
  { label: "Feb", revenue: 14320, occupancy: 82, bookings: 26 },
];

type Metric = "revenue" | "occupancy" | "bookings";

const metricConfig: Record<Metric, { label: string; color: string; format: (v: number) => string }> = {
  revenue: { label: "Revenue", color: "#10b981", format: (v) => `$${v.toLocaleString()}` },
  occupancy: { label: "Occupancy %", color: "#6366f1", format: (v) => `${v}%` },
  bookings: { label: "Bookings", color: "#f59e0b", format: (v) => String(v) },
};

export default function AnalyticsChart() {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [hovered, setHovered] = useState<number | null>(null);

  const cfg = metricConfig[metric];
  const values = data.map((d) => d[metric]);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // SVG line chart
  const W = 600;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  function xPos(i: number) {
    return PAD.left + (i / (data.length - 1)) * chartW;
  }
  function yPos(v: number) {
    const range = max - min || 1;
    return PAD.top + chartH - ((v - min) / range) * chartH;
  }

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yPos(d[metric])}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${xPos(data.length - 1)} ${H - PAD.bottom} L ${xPos(0)} ${H - PAD.bottom} Z`;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Performance (last 7 months)</h3>
        <div className="flex gap-1">
          {(Object.keys(metricConfig) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                metric === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {metricConfig[m].label}
            </button>
          ))}
        </div>
      </div>

      {/* Current value */}
      <div className="mb-4">
        <div className="text-2xl font-bold">
          {cfg.format(hovered !== null ? data[hovered][metric] : data[data.length - 1][metric])}
        </div>
        <div className="text-xs text-muted-foreground">
          {hovered !== null ? data[hovered].label : "Feb 2026 (current)"}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: H }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = PAD.top + t * chartH;
            const val = max - t * (max - min);
            return (
              <g key={t}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeWidth={1}
                />
                <text
                  x={PAD.left - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={9}
                  fill="currentColor"
                  opacity={0.4}
                >
                  {metric === "revenue" ? `$${Math.round(val / 1000)}k` : metric === "occupancy" ? `${Math.round(val)}%` : Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill={cfg.color} fillOpacity={0.08} />

          {/* Line */}
          <path d={linePath} fill="none" stroke={cfg.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points + hover areas */}
          {data.map((d, i) => (
            <g key={i}>
              {/* Invisible hover target */}
              <rect
                x={xPos(i) - 20}
                y={PAD.top}
                width={40}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
              />
              {/* Vertical hover line */}
              {hovered === i && (
                <line
                  x1={xPos(i)}
                  y1={PAD.top}
                  x2={xPos(i)}
                  y2={H - PAD.bottom}
                  stroke={cfg.color}
                  strokeOpacity={0.3}
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
              )}
              {/* Dot */}
              <circle
                cx={xPos(i)}
                cy={yPos(d[metric])}
                r={hovered === i ? 5 : 3.5}
                fill={cfg.color}
                stroke="white"
                strokeWidth={1.5}
                style={{ transition: "r 0.15s" }}
              />
              {/* X label */}
              <text
                x={xPos(i)}
                y={H - PAD.bottom + 16}
                textAnchor="middle"
                fontSize={10}
                fill="currentColor"
                opacity={0.5}
              >
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
