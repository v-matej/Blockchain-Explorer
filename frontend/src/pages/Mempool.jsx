import { useEffect, useMemo, useState } from "react";
import Loader from "../components/common/Loader";
import StatCard from "../components/analytics/StatCard";
import ChartCard from "../components/analytics/ChartCard";
import MempoolTxList from "../components/mempool/MempoolTxList";
import FeeHistogram from "../components/mempool/FeeHistogram";
import MempoolSizeChart from "../components/mempool/MempoolSizeChart"

import {
  fetchMempoolOverview,
  fetchMempoolTransactions,
  fetchMempoolFeeDistribution,
  fetchMempoolDelta,
} from "../api/explorerApi";

export default function Mempool() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [overview, setOverview] = useState(null);
  const [txs, setTxs] = useState([]);
  const [feeBuckets, setFeeBuckets] = useState([]);

  const [mempoolHistory, setMempoolHistory] = useState([]);

  async function load({ silent } = { silent: false }) {
    try {
      silent ? setRefreshing(true) : setInitialLoading(true);

      const [o, t, f] = await Promise.all([
        fetchMempoolOverview(),
        fetchMempoolTransactions(300),
        fetchMempoolFeeDistribution(),
      ]);

      setOverview(o);

      setMempoolHistory((prev) => {
        if (prev.length > 0) return prev;

        return [
          {
            time: Date.now(),
            sizeMB: o.sizeMB,
            txCount: o.txCount,
            delta: null,
          },
        ];
      });

      setTxs(t);
      setFeeBuckets(f);
    } finally {
      silent ? setRefreshing(false) : setInitialLoading(false);
    }
  }

  useEffect(() => {
    load({ silent: false });
    const interval = setInterval(() => load({ silent: true }), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function tick() {
      try {
        const point = await fetchMempoolDelta();

        if (!mounted) return;

        setMempoolHistory((prev) => {
          const next = [...prev, point];
          return next.slice(-60);
        });
      } catch {}
    }

    tick();
    const interval = setInterval(tick, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);


  const medianFee = useMemo(() => {
    if (!txs?.length) return null;
    const rates = txs
      .map((t) => t.feeRateSatVb ?? 0)
      .sort((a, b) => a - b);
    return rates[Math.floor(rates.length / 2)];
  }, [txs]);

  if (initialLoading || !overview) {
    return <Loader text="Loading mempool…" />;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-10 space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mempool</h1>
          <p className="text-gray-400 mt-1">
            Live view of unconfirmed Bitcoin transactions.
          </p>
        </div>

        {refreshing && (
          <span className="text-xs text-gray-500">Updating…</span>
        )}
      </header>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Transactions" value={overview.txCount.toLocaleString()} />
        <StatCard title="Mempool Size" value={`${overview.sizeMB} MB`} />
        <StatCard title="Total Fees" value={`${overview.totalFees} BTC`} />
        <StatCard
          title="Median Fee"
          value={medianFee ? `${medianFee.toFixed(1)} sat/vB` : "—"}
        />
      </div>

      {/* Fee dist + tx list side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          <ChartCard title="Fee Distribution (sat/vB)">
            <FeeHistogram data={feeBuckets} />
          </ChartCard>

          <ChartCard title="Mempool Size (last 5 minutes)">
            <MempoolSizeChart data={mempoolHistory} />
            <p className="mt-2 text-sm text-gray-400">
              Shows how quickly transactions enter and leave the mempool in real time.
            </p>
          </ChartCard>
        </div>

        {/* RIGHT COLUMN */}
        <ChartCard title="Live Transactions">
          <MempoolTxList txs={txs} />
        </ChartCard>
      </div>
    </div>
  );
}
