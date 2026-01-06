import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import {
  Pickaxe,
  Gauge,
  Flame,
  Timer
} from "lucide-react";

export default function NetworkInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../api/explorerApi").then(({ fetchNetworkInsights }) =>
      fetchNetworkInsights()
        .then(setData)
        .finally(() => setLoading(false))
    );
  }, []);

  if (loading || !data) {
    return <Loader text="Loading network insights…" />;
  }

  const {
    difficulty,
    hashRate,
    epoch,
    halving
  } = data;

  const difficultyT = (difficulty / 1e12).toFixed(2);
  const hashRateEH = (hashRate / 1e18).toFixed(1);
  const epochProgress =
    (epoch.blocksIntoEpoch / epoch.total) * 100;

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-6 space-y-6">
      <h2 className="text-xl font-semibold">
        Network Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Difficulty */}
        <InsightItem
          icon={<Pickaxe />}
          label="Mining Difficulty"
          value={`${difficultyT} T`}
          description="Controls how hard it is to mine a block"
        />

        {/* Hashrate */}
        <InsightItem
          icon={<Gauge />}
          label="Estimated Hashrate"
          value={`${hashRateEH} EH/s`}
          description="Estimated network security level"
        />

        {/* Difficulty Epoch */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Timer size={16} />
            Difficulty Epoch Progress
          </div>

          <div className="text-lg font-semibold">
            {epochProgress.toFixed(1)}%
          </div>

          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${epochProgress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500">
            {epoch.blocksIntoEpoch} / {epoch.total} blocks mined
          </p>
        </div>

        {/* Halving */}
        <InsightItem
          icon={<Flame />}
          label="Next Halving"
          value={`~ ${halving.blocksRemaining.toLocaleString()} blocks`}
          description="Block subsidy will be reduced by 50%"
        />

      </div>
    </div>
  );
}

function InsightItem({ icon, label, value, description }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {icon}
        {label}
      </div>
      <div className="text-lg font-semibold text-orange-400">
        {value}
      </div>
      <p className="text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}