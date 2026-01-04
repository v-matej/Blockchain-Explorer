import TxOverviewPanel from "../components/tx/TxOverviewPanel";
import TxDetailsPanel from "../components/tx/TxDetailsPanel";
import TxIOSection from "../components/tx/TxIOSection";

export default function TransactionPage({ data }) {
  if (!data) return null;

  return (
    <div className="max-w-[1700px] mx-auto px-10 py-10 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-10">
        <TxOverviewPanel summary={data.summary} raw={data.raw} />
        <TxDetailsPanel summary={data.summary} raw={data.raw} />
      </div>

      <TxIOSection raw={data.raw} />
    </div>
  );
}
