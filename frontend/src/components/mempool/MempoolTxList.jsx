import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HashWithCopy from "../common/HashWithCopy";

function satsFromBtc(btc) {
  return Math.round((btc || 0) * 1e8);
}

export default function MempoolTxList({ txs }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState("newest");

  const sortedTxs = useMemo(() => {
    const copy = [...(txs || [])];

    switch (sort) {
      case "newest":
        return copy.sort((a, b) => b.time - a.time);

      case "oldest":
        return copy.sort((a, b) => a.time - b.time);

      case "fee-desc":
        return copy.sort((a, b) => (b.fee || 0) - (a.fee || 0));

      case "fee-asc":
        return copy.sort((a, b) => (a.fee || 0) - (b.fee || 0));

      case "rate-desc":
        return copy.sort(
          (a, b) => (b.feeRateSatVb || 0) - (a.feeRateSatVb || 0)
        );

      case "rate-asc":
        return copy.sort(
          (a, b) => (a.feeRateSatVb || 0) - (b.feeRateSatVb || 0)
        );

      default:
        return copy;
    }
  }, [txs, sort]);

  return (
    <div className="border border-neutral-800 rounded-lg bg-neutral-900 p-5">
      {/* Header + filters */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          Transactions ({txs?.length ?? 0})
        </h3>

        <div className="flex gap-2 text-sm flex-wrap">
          <FilterButton active={sort === "newest"} onClick={() => setSort("newest")}>
            Newest
          </FilterButton>
          <FilterButton active={sort === "oldest"} onClick={() => setSort("oldest")}>
            Oldest
          </FilterButton>
          <FilterButton
            active={sort === "fee-desc"}
            onClick={() => setSort("fee-desc")}
          >
            ↑ Fee
          </FilterButton>
          <FilterButton
            active={sort === "fee-asc"}
            onClick={() => setSort("fee-asc")}
          >
            ↓ Fee
          </FilterButton>
          <FilterButton
            active={sort === "rate-desc"}
            onClick={() => setSort("rate-desc")}
          >
            ↑ sat/vB
          </FilterButton>
          <FilterButton
            active={sort === "rate-asc"}
            onClick={() => setSort("rate-asc")}
          >
            ↓ sat/vB
          </FilterButton>
        </div>
      </div>

      {/* Scrollable list */}
      <div
        className="
          max-h-[700px]
          overflow-y-auto
          space-y-3
          pr-2
          scrollbar-minimal
        "
      >
        {sortedTxs.map((tx) => (
          <div
            key={tx.txid}
            className="border-b border-neutral-800 pb-3"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <HashWithCopy
                  value={tx.txid}
                  onClick={() => navigate(`/tx/${tx.txid}`)}
                />

                <p className="text-xs text-gray-500 mt-1">
                  vsize: {tx.vsize} vB •{" "}
                  {tx.time
                    ? new Date(tx.time).toLocaleTimeString()
                    : "—"}
                </p>
              </div>

              <div className="text-sm text-right whitespace-nowrap">
                <div className="text-gray-200">
                  {satsFromBtc(tx.fee).toLocaleString()} sats
                </div>
                <div className="text-xs text-gray-500">
                  {(tx.feeRateSatVb ?? 0).toFixed(1)} sat/vB
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full transition ${
        active
          ? "bg-white text-black"
          : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
      }`}
    >
      {children}
    </button>
  );
}
