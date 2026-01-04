export default function TxSummaryPanel({ summary }) {
  return (
    <div className="border rounded-xl bg-neutral-900 p-[clamp(1.25rem,2vw,2rem)] space-y-4">
      <h2 className="font-semibold text-[clamp(1.2rem,1.5vw,1.6rem)]">
        Summary
      </h2>

      <div className="space-y-2">
        <div>
          <p className="text-gray-400">TxID</p>
          <p className="break-all text-sm text-gray-300">{summary.txid}</p>
        </div>

        <div>
          <p className="text-gray-400">Status</p>
          <span className="inline-block px-3 py-1 text-sm rounded bg-green-600/20 text-green-400">
            {summary.confirmations > 0 ? "Confirmed" : "Pending"}
          </span>
        </div>

        <div>
          <p className="text-gray-400">Amount</p>
          <p>{summary.totalOutput} BTC</p>
        </div>

        <div>
          <p className="text-gray-400">Fee</p>
          <p>{summary.fee ?? "Coinbase"} BTC</p>
        </div>

        <div>
          <p className="text-gray-400">Confirmations</p>
          <p>{summary.confirmations}</p>
        </div>
      </div>
    </div>
  );
}
