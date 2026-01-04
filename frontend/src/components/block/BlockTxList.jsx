import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HashWithCopy from "../common/HashWithCopy";

export default function BlockTxList({ txs }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState("first");

  const sortedTxs = useMemo(() => {
    const copy = [...txs];

    switch (sort) {
      case "first":
        return copy.reverse();

      case "value-desc":
        return copy.sort(
          (a, b) =>
            b.vout.reduce((s, v) => s + v.value, 0) -
            a.vout.reduce((s, v) => s + v.value, 0)
        );

      case "value-asc":
        return copy.sort(
          (a, b) =>
            a.vout.reduce((s, v) => s + v.value, 0) -
            b.vout.reduce((s, v) => s + v.value, 0)
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
          Transactions ({txs.length})
        </h3>

        <div className="flex gap-2 text-sm">
          <FilterButton active={sort === "first"} onClick={() => setSort("first")}>
            First
          </FilterButton>
          <FilterButton active={sort === "last"} onClick={() => setSort("last")}>
            Last
          </FilterButton>
          <FilterButton
            active={sort === "value-desc"}
            onClick={() => setSort("value-desc")}
          >
            ↑ Value
          </FilterButton>
          <FilterButton
            active={sort === "value-asc"}
            onClick={() => setSort("value-asc")}
          >
            ↓ Value
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
                  Inputs: {tx.vin.length} • Outputs: {tx.vout.length}
                </p>
              </div>

              <div className="text-sm text-gray-200 whitespace-nowrap">
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
