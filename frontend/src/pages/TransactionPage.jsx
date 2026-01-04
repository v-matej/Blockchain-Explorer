import TxSummaryPanel from "../components/tx/TxSummaryPanel";
import TxDetailsPanel from "../components/tx/TxDetailsPanel";
import TxIOList from "../components/tx/TxIOList";

export default function TransactionPage({ data }) {
  return (
    <div className="max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,4rem)] py-10 space-y-10 text-[clamp(1rem,1.2vw,1.25rem)]">
      {/* Header */}
      <div>
        <h1 className="font-bold tracking-tight text-[clamp(1.8rem,2.5vw,2.6rem)]">
          Bitcoin Transaction
        </h1>
        <p className="text-gray-400 mt-1">
          {data.summary.timestamp
            ? new Date(data.summary.timestamp * 1000).toLocaleString()
            : "Unconfirmed"}
        </p>
      </div>

      {/* Summary + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8">
        <TxSummaryPanel summary={data.summary} />
        <TxDetailsPanel summary={data.summary} raw={data.raw} />
      </div>

      {/* Inputs / Outputs */}
      <TxIOList raw={data.raw} />
    </div>
  );
}
