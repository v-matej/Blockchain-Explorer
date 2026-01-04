export default function TxDetailsPanel({ summary, raw }) {
  return (
    <div className="border rounded-xl bg-neutral-900 p-[clamp(1.25rem,2vw,2rem)]">
      <h2 className="font-semibold text-[clamp(1.2rem,1.5vw,1.6rem)] mb-6">
        Advanced Details
      </h2>

      <div className="grid grid-cols-2 gap-x-10 gap-y-4">
        <Detail label="Block Hash" value={summary.blockhash} />
        <Detail label="Size" value={`${summary.size} bytes`} />
        <Detail label="Virtual Size" value={`${summary.vsize} vB`} />
        <Detail label="Inputs" value={summary.inputCount} />
        <Detail label="Outputs" value={summary.outputCount} />
        <Detail label="Version" value={raw.version} />
        <Detail label="Locktime" value={raw.locktime} />
        <Detail label="RBF" value={raw.rbf ? "Yes" : "No"} />
        <Detail
          label="SegWit"
          value={raw.vin.some(v => v.txinwitness) ? "Yes" : "No"}
        />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <>
      <div className="text-gray-400">{label}</div>
      <div className="break-all text-gray-200">{value ?? "-"}</div>
    </>
  );
}
