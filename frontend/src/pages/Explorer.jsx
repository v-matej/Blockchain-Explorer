import { useState } from "react";
import TransactionPage from "./TransactionPage";
import BlockPage from "./BlockPage";

import SearchBar from "../components/SearchBar";
import {
  fetchBlockByHeight,
  fetchBlockByHash,
  fetchTx,
} from "../api/explorerApi";

export default function Explorer() {
  const [result, setResult] = useState(null);
  const [type, setType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

    function handleTxClick(txid) {
        handleSearch(txid);
    }

    function handleBlockClick(hash) {
        handleSearch(hash);
    }

  async function handleSearch(value) {
    setLoading(true);
    setError(null);
    setResult(null);
    setType(null);

    try {
        // 1️⃣ Block height
        if (/^\d+$/.test(value)) {
        const data = await fetchBlockByHeight(value);
        setType("block");
        setResult(data);
        setLoading(false);
        return;
        }

        // 2️⃣ Hash (tx FIRST, then block)
        if (value.length === 64) {
        try {
            const tx = await fetchTx(value);
            setType("tx");
            setResult(tx);
            setLoading(false);
            return;
        } catch {
            const block = await fetchBlockByHash(value);
            setType("block");
            setResult(block);
            setLoading(false);
            return;
        }
        }

        throw new Error("Invalid input");
    } catch (err) {
        setError("Nothing found for this value.");
    }
  }


  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
        {/* Header / Search */}
        <div className="max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,4rem)] py-6">
            <h1 className="text-[clamp(1.8rem,2.5vw,2.6rem)] font-bold mb-4">
            Bitcoin Block Explorer
            </h1>
            <SearchBar onSearch={handleSearch} />
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Content */}
        {type === "tx" && result && <TransactionPage data={result} />}
        {type === "block" && result && (
            <BlockPage
                data={result}
                onTxClick={handleTxClick}
                onBlockClick={handleBlockClick}
            />
        )}


        <div className="max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,4rem)] py-6">
            {loading && <p className="text-[clamp(1.8rem,2.5vw,2.6rem)] font-bold mb-5">Loading…</p>}
        </div>
    </div>
  );
}
