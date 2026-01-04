import { useEffect, useState } from "react";
import BtcPriceCard from "../components/home/BtcPriceCard";
import BtcPriceChart from "../components/home/BtcPriceChart";
import LatestBlocks from "../components/home/LatestBlocks";
import Loader from "../components/common/Loader";

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return <Loader text="Loading blockchain data…" />;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-10 space-y-10">

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <BtcPriceCard />
        <BtcPriceChart />
      </div>

      <LatestBlocks />
    </div>
  );
}
