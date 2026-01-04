import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ------------------ helpers ------------------ */

function formatValue(value, unit) {
  if (unit === "difficulty") {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)} T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)} B`;
    return value.toLocaleString();
  }

  if (unit === "bytes") {
    return `${(value / 1e6).toFixed(1)} MB`;
  }

  if (unit === "BTC") {
    return `${value.toFixed(4)} BTC`;
  }

  if (unit === "tx") {
    return value.toLocaleString();
  }

  return value.toLocaleString();
}

function CustomTooltip({ active, payload, unit }) {
  if (!active || !payload || !payload.length) return null;

  const { time, value } = payload[0].payload;

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm shadow-lg">
      <div className="text-gray-400 mb-1">
        {new Date(time).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>

      <div className="text-orange-400 font-medium">
        {formatValue(value, unit)}
      </div>
    </div>
  );
}

/* ------------------ component ------------------ */

export default function SimpleLineChart({
  data,
  dataKey,
  unit,
  timeKey = "time",
}) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          {/* Gradient */}
          <defs>
            <linearGradient id="fillOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid
            stroke="#1f2937"
            vertical={false}
            strokeDasharray="3 3"
          />

          {/* X axis (time) */}
          <XAxis
            dataKey={timeKey}
            tickFormatter={(t) =>
              new Date(t).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })
            }
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y axis */}
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatValue(v, unit)}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip unit={unit} />} />

          {/* Area */}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#fillOrange)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
