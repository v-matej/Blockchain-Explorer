import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchBtcPriceSeries } from "../../api/explorerApi";

const RANGES = [
  { label: "1H", value: "1h" },
  { label: "6H", value: "6h" },
  { label: "12H", value: "12h" },
  { label: "24H", value: "24h" },
  { label: "1W", value: "7d" },
  { label: "1M", value: "30d" },
  { label: "1Y", value: "365d" },
];

export default function BtcPriceChart() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("24h");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const points = await fetchBtcPriceSeries(range);
        if (!alive) return;
        setData(points);
      } catch (err) {
        console.error("Failed to fetch BTC chart", err);
        if (!alive) return;
        setData([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [range]);

  const isIntraday = ["1h", "6h", "12h", "24h"].includes(range);

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-4 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition
              ${
                range === r.value
                  ? "bg-orange-500 text-black"
                  : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="h-[320px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading chart…
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                stroke="#1f2937"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tickFormatter={(t) =>
                  isIntraday
                    ? new Date(t).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date(t).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                }
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${Math.round(v).toLocaleString()}`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "BTC"]}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
