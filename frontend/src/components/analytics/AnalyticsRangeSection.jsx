// components/analytics/AnalyticsRangeSection.jsx
import { useEffect, useState, useMemo } from "react";
import Loader from "../common/Loader";
import ChartCard from "./ChartCard";
import SimpleLineChart from "./SimpleLineChart";
import StatCard from "./StatCard";
import { fetchBlockchainHistory } from "../../api/explorerApi";

export default function AnalyticsRangeSection({ range }) {
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
      .then(([size, txs, feeData, diff]) => {
        setBlockSize(size);
        setTxCount(txs);
        setFees(feeData);
        setDifficulty(diff);
      })
      .finally(() => setLoading(false));
  }, [range]);

  const latestDifficulty = useMemo(
    () => difficulty.at(-1)?.value,
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

  if (loading) {
    return <Loader text="Updating analytics…" />;
  }

  return (
    <>
      {/* KPI */}
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

      {/* Charts */}
      <div className="space-y-14">
        <ChartCard title="Blockchain Size">
          <SimpleLineChart data={blockSize} dataKey="value" unit="bytes" />
        </ChartCard>

        <ChartCard title="Mining Difficulty">
          <SimpleLineChart data={difficulty} dataKey="value" />
        </ChartCard>

        <ChartCard title="Transactions per Day">
          <SimpleLineChart data={txCount} dataKey="value" unit="tx" />
        </ChartCard>

        <ChartCard title="Transaction Fees">
          <SimpleLineChart data={fees} dataKey="value" unit="BTC" />
        </ChartCard>
      </div>
    </>
  );
}
