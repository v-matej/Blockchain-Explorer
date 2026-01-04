import { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import ChartCard from "../components/analytics/ChartCard";
import SimpleLineChart from "../components/analytics/SimpleLineChart";
import { fetchBlockchainHistory } from "../api/explorerApi";

const RANGES = [
  { label: "1M", value: "30days" },
  { label: "6M", value: "180days" },
  { label: "1Y", value: "1year" },
  { label: "ALL", value: "all" },
];

export default function Analytics() {
  const [range, setRange] = useState("1year");
  const [loading, setLoading] = useState(true);

  const [blockSize, setBlockSize] = useState([]);
  const [txCount, setTxCount] = useState([]);
  const [fees, setFees] = useState([]);
  const [difficulty, setDifficulty] = useState([]);

  useEffect(() => {
    setLoading(true);

    Promise.all([
        fetchBlockchainHistory("blocks-size", range),
        fetchBlockchainHistory("n-transactions", range),
        fetchBlockchainHistory("transaction-fees", range),
        fetchBlockchainHistory("difficulty", range),
        ])
      .then(([size, txs, fees, diff]) => {
        setBlockSize(size);
        setTxCount(txs);
        setFees(fees);
        setDifficulty(diff);
        })
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) {
    return <Loader text="Loading blockchain analytics…" />;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-10 space-y-10">
      <h1 className="text-3xl font-bold">Blockchain Analytics</h1>

      {/* Filters */}
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setRange(r.value)}
            className={`px-3 py-1 rounded-full text-sm transition
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

      {/* Charts */}
      <ChartCard title="Blockchain Size over Time">
        <SimpleLineChart
            data={blockSize}
            dataKey="value"
            unit="bytes"
        />
      </ChartCard>

      <ChartCard title="Transactions per Day">
        <SimpleLineChart
            data={txCount}
            dataKey="value"
            unit="tx"
        />
      </ChartCard>

      <ChartCard title="Transaction Fees per Day">
        <SimpleLineChart
            data={fees}
            dataKey="value"
            unit="BTC"
        />
      </ChartCard>

      <ChartCard title="Mining Difficulty">
        <SimpleLineChart
            data={difficulty}
            dataKey="value"
            unit="difficulty"
        />
      </ChartCard>

    </div>
  );
}
