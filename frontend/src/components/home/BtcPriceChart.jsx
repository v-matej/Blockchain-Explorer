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

const RANGES = [
  { label: "24H", value: 1 },
  { label: "1W", value: 7 },
  { label: "1M", value: 30 },
  { label: "1Y", value: 365 },
  { label: "ALL", value: "max" },
];

export default function BtcPriceChart() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChart() {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart` +
            `?vs_currency=usd&days=${range}`
        );
        const json = await res.json();

        const formatted = json.prices.map(([time, price]) => ({
          time,
          price,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch BTC chart", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, [range]);

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-4 space-y-4">
      {/* Range buttons */}
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r.label}
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

      {/* Chart */}
      <div className="h-[320px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading chart…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              {/* Horizontal grid lines */}
              <CartesianGrid
                stroke="#1f2937"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tickFormatter={(t) =>
                  new Date(t).toLocaleDateString(undefined, {
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
                labelFormatter={(label) =>
                  new Date(label).toLocaleString()
                }
                formatter={(value) => [
                  `$${value.toLocaleString()}`,
                  "BTC",
                ]}
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
