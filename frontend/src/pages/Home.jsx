import BtcPriceCard from "../components/home/BtcPriceCard";
import BtcPriceChart from "../components/home/BtcPriceChart";

export default function Home() {
  return (
    <div className="max-w-[1600px] mx-auto px-8 py-10 space-y-10">

      {/* Top section: price + chart placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <BtcPriceCard />

        <BtcPriceChart />
      </div>

      {/* Latest blocks placeholder */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-6 text-gray-500">
        Latest blocks (coming next)
      </div>
    </div>
  );
}
