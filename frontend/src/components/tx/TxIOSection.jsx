import { useNavigate } from "react-router-dom";
import HashWithCopy from "../common/HashWithCopy";

export default function TxIOSection({ raw }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-5">
        <h4 className="font-semibold mb-3">From</h4>

        {raw.vin.map((vin, i) => (
          <div key={i} className="border-b border-neutral-800 py-3">
            {vin.coinbase ? (
              <span className="italic text-gray-500">
                Block Reward (Coinbase)
              </span>
            ) : (
              <>
                <HashWithCopy value={vin.txid} onClick={() => navigate(`/tx/${vin.txid}`)} />
                <p className="text-xs text-gray-500">
                  Vout: {vin.vout}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Outputs */}
      <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-5">
        <h4 className="font-semibold mb-3">To</h4>

        {raw.vout.map((vout, i) => {
            const addresses =
                vout.scriptPubKey.addresses ??
                (vout.scriptPubKey.address
                ? [vout.scriptPubKey.address]
                : []);

            return (
                <div key={i} className="border-b border-neutral-800 py-3 space-y-1">
                <p className="text-sm text-gray-200">
                    {vout.value} BTC
                </p>

                {addresses.length > 0 ? (
                    addresses.map(addr => (
                    <HashWithCopy key={addr} value={addr} />
                    ))
                ) : (
                    <span className="text-xs text-gray-500 italic">
                    Non-standard output
                    </span>
                )}
                </div>
            );
        })}
      </div>
    </div>
  );
}