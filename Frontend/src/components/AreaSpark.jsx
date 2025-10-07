import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AreaSpark({ data = [], color = "#1E3A8A", height = 120 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 bg-surface rounded-lg text-sm text-gray-500">
        No chart data yet
      </div>
    );
  }

  return (
    <div className="w-full h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis dataKey="label" hide />
          <YAxis hide />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill="url(#colorUv)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
