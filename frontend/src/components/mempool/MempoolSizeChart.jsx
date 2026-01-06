import { useMemo, useState } from "react";
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

/* ---------------- range config ---------------- */

// assuming one point every 5 seconds
const RANGES = [
  { label: "5m", points: 60 },
  { label: "15m", points: 180 },
  { label: "1h", points: 720 },
  { label: "3h", points: 2160 },
];

export default function MempoolSizeChart({ data }) {
  const [range, setRange] = useState(60);

  /* ---------------- guard ---------------- */

  if (!data?.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-gray-500 text-sm">
        Waiting for mempool data…
      </div>
    );
  }

  /* ---------------- derived ---------------- */

  const slicedData = useMemo(() => {
    return data.slice(-range);
  }, [data, range]);

  const barSize =
    slicedData.length > 180 ? 2 :
    slicedData.length > 60 ? 4 :
    6;

  /* ---------------- render ---------------- */

  return (
    <div className="space-y-3">

      {/* Range selector */}
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r.points}
            onClick={() => setRange(r.points)}
            className={`px-3 py-1 rounded-full text-xs transition
              ${
                range === r.points
                  ? "bg-orange-500 text-black font-semibold"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart */}
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
              tickFormatter={(v) => `${v.toFixed(0)} MB`}
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
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
