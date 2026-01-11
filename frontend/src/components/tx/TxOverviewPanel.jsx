import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HashWithCopy from "../common/HashWithCopy";
import { fetchBtcMarket } from "../../api/explorerApi";

export default function TxOverviewPanel({ summary }) {
  const navigate = useNavigate();

  const [btcUsd, setBtcUsd] = useState(null);

  useEffect(() => {
    fetchBtcMarket()
      .then((p) => setBtcUsd(p.price))
      .catch(() => {});
  }, []);

  const amountUsd =
    btcUsd && summary.totalOutputBTC
      ? summary.totalOutputBTC * btcUsd
      : null;

  const feeUsd =
    btcUsd && summary.feeBTC
      ? summary.feeBTC * btcUsd
      : null;
  
  return (
    <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          Bitcoin Transaction
        </h2>
        <p className="text-gray-400 text-sm">
          {summary.confirmations > 0
            ? `Mined on ${new Date(summary.timestamp * 1000).toLocaleString()}`
            : "Pending (in mempool)"}
        </p>
      </div>

      {/* Hash */}
      <div>
        <p className="text-gray-500 text-sm mb-1">Hash ID</p>
        <HashWithCopy value={summary.txid} />
      </div>

      {/* Amounts */}
      <div className="space-y-3 text-sm">
        <Row label="Amount">
          <div className="text-right">
            <div>{summary.totalOutputBTC} BTC</div>
          </div>
        </Row>
        <Row label="Current value">
          <div className="text-right">
            {amountUsd && (
              <div className="text-xs text-gray-400">
                Current amount ≈ ${amountUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </Row>

        <Row label="Fee">
          <div className="text-right">
            <div>{summary.feeBTC ?? "0.00000000"} BTC</div>
          </div>
        </Row>
        <Row label="Current value">
          <div className="text-right">
            {feeUsd && (
              <div className="text-xs text-gray-400">
                Current value ≈ ${feeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
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
