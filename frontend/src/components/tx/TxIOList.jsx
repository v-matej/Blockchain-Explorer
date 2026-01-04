export default function TxIOList({ raw }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="border rounded-xl bg-neutral-900 p-[clamp(1.25rem,2vw,2rem)]">
        <h3 className="font-semibold text-[clamp(1.2rem,1.4vw,1.5rem)] mb-4">
          Inputs
        </h3>
        {raw.vin.map((vin, i) => (
          <div key={i} className="border-b border-neutral-800 py-3">
            {vin.coinbase ? (
              <span className="italic text-gray-500">Coinbase</span>
            ) : (
              <>
                <p className="break-all text-sm text-gray-300">{vin.txid}</p>
                <p className="text-gray-500">Vout: {vin.vout}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Outputs */}
      <div className="border rounded-xl bg-neutral-900 p-[clamp(1.25rem,2vw,2rem)]">
        <h3 className="font-semibold text-[clamp(1.2rem,1.4vw,1.5rem)] mb-4">
          Outputs
        </h3>
        {raw.vout.map((vout, i) => (
          <div key={i} className="border-b border-neutral-800 py-3">
            <p>{vout.value} BTC</p>
            <p className="break-all text-gray-500">
              {vout.scriptPubKey.addresses?.[0] || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
