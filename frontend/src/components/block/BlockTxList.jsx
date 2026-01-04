import { useNavigate } from "react-router-dom";
import HashWithCopy from "../common/HashWithCopy";

export default function BlockTxList({ txs }) {
  const navigate = useNavigate();

  return (
    <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-5">
      <h3 className="font-semibold mb-4">
        Transactions ({txs.length})
      </h3>

      <div
        className="
          max-h-[700px]
          overflow-y-auto
          space-y-3
          pr-2
          scrollbar-thin
          scrollbar-thumb-neutral-700
          scrollbar-track-transparent
        "
      >
        {txs.map((tx, i) => (
          <div
            key={tx.txid}
            className="border-b border-neutral-800 pb-3"
          >
            <div className="flex justify-between">
              <div>
                <HashWithCopy value={tx.txid} onClick={() => navigate(`/tx/${tx.txid}`)} />
                <p className="text-xs text-gray-500 mt-1">
                  Inputs: {tx.vin.length} • Outputs:{" "}
                  {tx.vout.length}
                </p>
              </div>

              <div className="text-sm text-gray-200">
                {tx.vout
                  .reduce((s, v) => s + v.value, 0)
                  .toFixed(8)}{" "}
                BTC
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
