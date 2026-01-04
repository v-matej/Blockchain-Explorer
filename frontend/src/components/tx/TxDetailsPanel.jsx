import HashWithCopy from "../common/HashWithCopy";

export default function TxDetailsPanel({ summary, raw, onOpenBlock }) {
  return (
    <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-6">
      <h3 className="font-semibold mb-4">Advanced Details</h3>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <Label label="Block Hash">
            <HashWithCopy value={summary.blockHash} onClick={() => onOpenBlock(summary.blockHash)} />
        </Label>

        <Label label="Block Height">
            <HashWithCopy value={summary.blockHeight} onClick={() => onOpenBlock(summary.blockHeight)} />
        </Label>

        <Label label="Time">
          {new Date(summary.timestamp * 1000).toLocaleString()}
        </Label>

        <Label label="Size">
          {summary.size} bytes
        </Label>

        <Label label="Virtual Size">
          {summary.vsize} vB
        </Label>

        <Label label="Inputs">
          {summary.inputCount}
        </Label>

        <Label label="Outputs">
          {summary.outputCount}
        </Label>

        <Label label="Version">
          {raw.version}
        </Label>

        <Label label="Locktime">
          {raw.locktime}
        </Label>

        <Label label="Coinbase">
          {summary.isCoinbase ? "Yes" : "No"}
        </Label>

        <Label label="RBF">
          {summary.rbf ? "Yes" : "No"}
        </Label>
      </div>
    </div>
  );
}

function Label({ label, children }) {
  return (
    <>
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-200 break-all">{children}</div>
    </>
  );
}
