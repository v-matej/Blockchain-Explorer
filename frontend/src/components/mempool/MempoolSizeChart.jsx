import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MAX_POINTS = 180; // ~15 minutes at 5s resolution

export default function MempoolSizeChart({ data }) {
  if (!data?.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-gray-500 text-sm">
        Waiting for mempool data…
      </div>
    );
  }

  const slicedData = useMemo(
    () => data.slice(-MAX_POINTS),
    [data]
  );

  const barSize =
    slicedData.length > 120 ? 2 :
    slicedData.length > 60 ? 4 :
    6;

  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={slicedData}>
          <defs>
            <linearGradient id="mempoolFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#1f2937"
            strokeDasharray="3 3"
            vertical={false}
          />

          {/* Time axis */}
          <XAxis
            dataKey="time"
            interval="preserveStartEnd"
            tickFormatter={(t) =>
              new Date(t).toLocaleTimeString([], {
                minute: "2-digit",
                second: "2-digit",
              })
            }
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />

          {/* LEFT Y → mempool size */}
          <YAxis
            yAxisId="size"
            tickFormatter={(v) => `${v.toFixed(1)} MB`}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />

          {/* RIGHT Y → tx count */}
          <YAxis
            yAxisId="tx"
            orientation="right"
            tickFormatter={(v) => v.toLocaleString()}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />

          <Tooltip
            labelFormatter={(t) =>
              `Time: ${new Date(t).toLocaleTimeString()}`
            }
            formatter={(value, name) => {
              if (name === "sizeMB") {
                return [`${value.toFixed(2)} MB`, "Mempool Size"];
              }
              if (name === "txCount") {
                return [`${value}`, "Transactions"];
              }
              return value;
            }}
          />

          {/* Histogram: tx count */}
          <Bar
            yAxisId="tx"
            dataKey="txCount"
            barSize={barSize}
            fill="#60a5fa"
            opacity={0.35}
          />

          {/* Area: mempool size */}
          <Area
            yAxisId="size"
            type="monotone"
            dataKey="sizeMB"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#mempoolFill)"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
