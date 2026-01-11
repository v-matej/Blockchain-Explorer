import { useEffect, useState, useMemo } from "react";
import Loader from "../components/common/Loader";
import ChartCard from "../components/analytics/ChartCard";
import SimpleLineChart from "../components/analytics/SimpleLineChart";
import StatCard from "../components/analytics/StatCard";
import NetworkInsights from "../components/analytics/NetworkInsights";
import { fetchBlockchainHistory } from "../api/explorerApi";

/* -------------------------------- constants -------------------------------- */

const RANGES = [
  { label: "1M", value: "30days" },
  { label: "6M", value: "180days" },
  { label: "1Y", value: "1year" },
  { label: "ALL", value: "all" },
];

/* -------------------------------- component -------------------------------- */

export default function Analytics() {
  const [range, setRange] = useState("1year");
  const [loading, setLoading] = useState(true);

  const [blockSize, setBlockSize] = useState([]);
  const [txCount, setTxCount] = useState([]);
  const [fees, setFees] = useState([]);
  const [difficulty, setDifficulty] = useState([]);

  /* ------------------------------- data fetch ------------------------------- */

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      fetchBlockchainHistory("blocks-size", range),
      fetchBlockchainHistory("n-transactions", range),
      fetchBlockchainHistory("transaction-fees", range),
      fetchBlockchainHistory("difficulty", range),
    ])
      .then(([size, txs, feeData, diff]) => {
        if (!mounted) return;
        setBlockSize(size);
        setTxCount(txs);
        setFees(feeData);
        setDifficulty(diff);
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [range]);

  /* ---------------------------- derived metrics ---------------------------- */

  const latestDifficulty = useMemo(
    () => difficulty.at(-1)?.value ?? null,
    [difficulty]
  );

  const avgFees = useMemo(() => {
    if (!fees.length) return null;
    return fees.reduce((s, d) => s + d.value, 0) / fees.length;
  }, [fees]);

  const avgTx = useMemo(() => {
    if (!txCount.length) return null;
    return txCount.reduce((s, d) => s + d.value, 0) / txCount.length;
  }, [txCount]);

  /* -------------------------------- render -------------------------------- */

  if (loading) {
    return <Loader text="Loading blockchain analytics…" />;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-10 space-y-16">

      {/* ============================== HEADER ============================== */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Blockchain Analytics</h1>
        <p className="text-gray-400">
          Historical trends and network-level metrics of the Bitcoin blockchain.
        </p>
      </header>

      {/* ========================== NETWORK INSIGHTS ========================== */}
      {/* Static, does NOT depend on range */}
      <NetworkInsights />

      {/* ======================= RANGE + KPI OVERVIEW ======================== */}
      <section className="space-y-6">

        {/* Range selector */}
        <div className="inline-flex bg-neutral-900 border border-neutral-800 rounded-full p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-4 py-1.5 text-sm rounded-full transition
                ${
                  range === r.value
                    ? "bg-orange-500 text-black font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Current Difficulty"
            value={
              latestDifficulty
                ? `${(latestDifficulty / 1e12).toFixed(2)} T`
                : "—"
            }
            description="Mining difficulty"
          />

          <StatCard
            title="Avg Fees"
            value={avgFees ? `${avgFees.toFixed(2)} BTC` : "—"}
            description="Average fees per day"
          />

          <StatCard
            title="Tx / Day"
            value={avgTx ? Math.round(avgTx).toLocaleString() : "—"}
            description="Network activity"
          />
        </div>
      </section>

      {/* ========================== BLOCKCHAIN GROWTH ========================= */}
      <AnalyticsSection
        title="Blockchain Growth"
        description="Long-term growth and capacity of the Bitcoin blockchain."
      >
        <ChartCard title="Blockchain Size">
          <SimpleLineChart
            data={blockSize}
            dataKey="value"
            unit="MB"
          />
          <Insight>
            The blockchain size increases monotonically as new blocks are added.
          </Insight>
        </ChartCard>

        <ChartCard title="Mining Difficulty">
          <SimpleLineChart
            data={difficulty}
            dataKey="value"
          />
          <Insight>
            Difficulty adjusts every 2016 blocks to maintain a ~10 minute block time.
          </Insight>
        </ChartCard>
      </AnalyticsSection>

      {/* ========================== NETWORK ACTIVITY ========================== */}
      <AnalyticsSection
        title="Network Activity"
        description="Transaction throughput and economic activity on the network."
      >
        <ChartCard title="Transactions per Day">
          <SimpleLineChart
            data={txCount}
            dataKey="value"
            unit="tx"
          />
        </ChartCard>

        <ChartCard title="Transaction Fees">
          <SimpleLineChart
            data={fees}
            dataKey="value"
            unit="BTC"
          />
        </ChartCard>
      </AnalyticsSection>

    </div>
  );
}

/* -------------------------------- helpers -------------------------------- */

function AnalyticsSection({ title, description, children }) {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {children}
      </div>
    </section>
  );
}

function Insight({ children }) {
  return (
    <p className="mt-3 text-sm text-gray-400">
      {children}
    </p>
  );
}
