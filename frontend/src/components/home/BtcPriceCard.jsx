import { useEffect, useState } from "react";

export default function BtcPriceCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin" +
            "?localization=false&tickers=false&market_data=true" +
            "&community_data=false&developer_data=false&sparkline=false"
        );
        const json = await res.json();
        setData(json.market_data);
      } catch (err) {
        console.error("Failed to fetch BTC data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-6 text-gray-500">
        Loading…
      </div>
    );
  }

  const price = data.current_price.usd;
  const change24h = data.price_change_percentage_24h;
  const isUp = change24h >= 0;

  const stats = [
    {
      label: "Market cap",
      value: `$${(data.market_cap.usd / 1e12).toFixed(2)}T`,
      change: data.market_cap_change_percentage_24h,
    },
    {
      label: "Volume (24h)",
      value: `$${(data.total_volume.usd / 1e9).toFixed(2)}B`,
    },
    {
      label: "FDV",
      value: `$${(data.fully_diluted_valuation.usd / 1e12).toFixed(2)}T`,
    },
    {
      label: "Vol / Mkt Cap",
      value: `${(
        (data.total_volume.usd / data.market_cap.usd) *
        100
      ).toFixed(2)}%`,
    },
    {
      label: "Total supply",
      value: `${(data.total_supply / 1e6).toFixed(2)}M BTC`,
    },
    {
      label: "Max supply",
      value: `${(data.max_supply / 1e6).toFixed(0)}M BTC`,
    }, 
  ];

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold">
          ₿
        </div>
        <div>
          <h2 className="text-lg font-semibold">Bitcoin</h2>
          <p className="text-sm text-gray-400">BTC</p>
        </div>

        {/* Price */}
        <div className="flex items-end gap-3">
            <div
            className={`text-sm font-medium ${
                isUp ? "text-green-400" : "text-red-400"
            }`}
            >
            {isUp ? "▲" : "▼"} {change24h.toFixed(2)}% (24h)
            </div>
            <div className="text-3xl font-bold">
            ${price.toLocaleString()}
            </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-neutral-800 rounded-lg p-3 bg-neutral-950"
          >
            <div className="text-gray-400 mb-1 flex items-center gap-1">
              {s.label}
              {s.change !== undefined && (
                <span
                  className={`text-xs ${
                    s.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {s.change >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(s.change).toFixed(2)}%
                </span>
              )}
            </div>
            <div className="font-medium">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
