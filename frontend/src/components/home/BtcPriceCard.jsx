import { useEffect, useState } from "react";
import { fetchBtcMarket } from "../../api/explorerApi";

export default function BtcPriceCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchBtcMarket()
      .then(setData)
      .catch((e) =>
        console.error("BTC market error", e)
      );
  }, []);

  if (!data) {
    return (
      <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-6 text-gray-500">
        Loading…
      </div>
    );
  }

  const isUp = data.change24h >= 0;

  const stats = [
    {
      label: "Market cap",
      value: `$${(data.marketCap / 1e12).toFixed(2)}T`,
      change: data.marketCapChange24h,
    },
    {
      label: "Volume (24h)",
      value: `$${(data.volume24h / 1e9).toFixed(2)}B`,
    },
    {
      label: "FDV",
      value: `$${(data.fdv / 1e12).toFixed(2)}T`,
    },
    {
      label: "Vol / Mkt Cap",
      value: `${(
        (data.volume24h / data.marketCap) *
        100
      ).toFixed(2)}%`,
    },
    {
      label: "Total supply",
      value: `${(data.totalSupply / 1e6).toFixed(2)}M BTC`,
    },
    {
      label: "Max supply",
      value: `${(data.maxSupply / 1e6).toFixed(0)}M BTC`,
    },
  ];

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Bitcoin</h2>
          <p className="text-sm text-gray-400">BTC</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold">
            ${data.price.toLocaleString()}
          </div>
          <div
            className={`text-sm ${
              isUp ? "text-green-400" : "text-red-400"
            }`}
          >
            {isUp ? "▲" : "▼"}{" "}
            {data.change24h.toFixed(2)}% (24h)
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-neutral-800 rounded-lg p-3 bg-neutral-950"
          >
            <div className="text-gray-400 mb-1">
              {s.label}
              {s.change !== undefined && (
                <span
                  className={`ml-2 text-xs ${
                    s.change >= 0
                      ? "text-green-400"
                      : "text-red-400"
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
