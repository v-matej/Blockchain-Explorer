import HashWithCopy from "../common/HashWithCopy";

export default function BlockOverviewPanel({
  summary,
  raw,
  onBlockClick,
}) {
  return (
    <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          Bitcoin Block{" "}
          <span className="text-orange-400">
            {summary.height}
          </span>
        </h2>
        <p className="text-gray-400 text-sm">
          Mined on{" "}
          {new Date(summary.timestamp * 1000).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Miner: Unknown
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed">
        A total of {summary.totalOutputBTC} BTC were
        sent in this block. The miner
        earned a total reward of {summary.rewardBTC} BTC
        including fees.
      </p>

      {/* Two-column details */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <Label label="Hash">
          <HashWithCopy
            value={summary.hash}
            linkable
            onClick={() =>
              onBlockClick(summary.hash)
            }
          />
        </Label>

        <Label label="Previous Block">
          <HashWithCopy
            value={raw.previousblockhash}
            linkable
            onClick={() =>
              onBlockClick(raw.previousblockhash)
            }
          />
        </Label>

        <Label label="Merkle Root">
          <HashWithCopy value={raw.merkleroot} />
        </Label>

        <Label label="Transactions">
          {summary.txCount}
        </Label>

        <Label label="Inputs">
          {summary.inputs}
        </Label>

        <Label label="Outputs">
          {summary.outputs}
        </Label>

        <Label label="Fees">
          {summary.feesBTC} BTC
        </Label>

        <Label label="Reward">
          {summary.rewardBTC} BTC
        </Label>

        <Label label="Difficulty">
          {summary.difficulty}
        </Label>

        <Label label="Nonce">
          {raw.nonce}
        </Label>

        <Label label="Size">
          {summary.size} bytes
        </Label>

        <Label label="Weight">
          {raw.weight} WU
        </Label>

        <Label label="Confirmations">
          {summary.confirmations}
        </Label>

        <Label label="Version">
          {raw.version}
        </Label>
      </div>
    </div>
  );
}

function Label({ label, children }) {
  return (
    <>
      <div className="text-gray-500">
        {label}
      </div>
      <div className="text-gray-200 break-all">
        {children}
      </div>
    </>
  );
}
