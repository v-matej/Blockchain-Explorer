import { useNavigate } from "react-router-dom";
import HashWithCopy from "../common/HashWithCopy";

export default function TxOverviewPanel({ summary }) {
  const navigate = useNavigate();
  
  return (
    <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          Bitcoin Transaction
        </h2>
        <p className="text-gray-400 text-sm">
          Broadcasted on{" "}
          {new Date(summary.timestamp * 1000).toLocaleString()}
        </p>
      </div>

      {/* Hash */}
      <div>
        <p className="text-gray-500 text-sm mb-1">Hash ID</p>
        <HashWithCopy value={summary.txid} />
      </div>

      {/* Amounts */}
      <div className="space-y-2 text-sm">
        <Row label="Amount">
        {summary.totalOutputBTC} BTC
        </Row>

        <Row label="Fee">
        {summary.feeBTC ?? "0.00000000"} BTC
        </Row>
      </div>

      {/* Status */}
      <span className="inline-block px-3 py-1 rounded-full text-sm bg-emerald-600/20 text-emerald-400">
        {summary.confirmations > 0 ? "Confirmed" : "Pending"}
      </span>

      {/* Block */}
      {summary.blockHeight && (
        <div className="text-sm text-gray-300">
          Mined in block{" "}
          <span
            onClick={() => navigate(`/block/${summary.blockHash}`)}
            className="text-orange-400 cursor-pointer hover:underline"
          >
            {summary.blockHeight}
          </span>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200">{children}</span>
    </div>
  );
}
