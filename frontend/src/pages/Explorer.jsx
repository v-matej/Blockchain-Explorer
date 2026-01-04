import { useState } from "react";
import SearchBar from "../components/SearchBar";
import BlockPage from "./BlockPage";
import TransactionPage from "./TransactionPage";
import {
  fetchBlockByHeight,
  fetchBlockByHash,
  fetchTx,
} from "../api/explorerApi";

export default function Explorer() {
  const [result, setResult] = useState(null);
  const [type, setType] = useState(null);
  const [error, setError] = useState(null);

  async function handleSearch(value) {
    const q = String(value).trim();
    if (!q) return;

    setError(null);
    setResult(null);
    setType(null);

    try {
      // height
      if (/^\d+$/.test(q)) {
        const data = await fetchBlockByHeight(q);
        setType("block");
        setResult(data);
        return;
      }

      // 64-hex: try TX first, then block
      if (q.length === 64) {
        try {
          const tx = await fetchTx(q);
          setType("tx");
          setResult(tx);
          return;
        } catch {
          const block = await fetchBlockByHash(q);
          setType("block");
          setResult(block);
          return;
        }
      }

      throw new Error("Invalid input");
    } catch {
      setError("Nothing found for this value.");
    }
  }

  const openTx = (txid) => handleSearch(txid);
  const openBlock = (hashOrHeight) => handleSearch(hashOrHeight);

  return (
    <div className="min-h-screen text-neutral-100">
      <div className="max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,4rem)] py-6">
        <h1 className="text-[clamp(1.8rem,2.5vw,2.6rem)] font-bold mb-4">
          Bitcoin Block Explorer
        </h1>

        <SearchBar onSearch={handleSearch} />

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {type === "block" && result && (
        <BlockPage data={result} onOpenTx={openTx} onOpenBlock={openBlock} />
      )}

      {type === "tx" && result && (
        <TransactionPage data={result} onOpenTx={openTx} onOpenBlock={openBlock} />
      )}
    </div>
  );
}
