import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BlockPage from "./BlockPage";
import TransactionPage from "./TransactionPage";
import {
  fetchBlockByHeight,
  fetchBlockByHash,
  fetchTx,
} from "../api/explorerApi";

export default function Explorer() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [type, setType] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setError(null);
      setData(null);

      try {
        if (/^\d+$/.test(id)) {
          const block = await fetchBlockByHeight(id);
          setType("block");
          setData(block);
          return;
        }

        if (id.length === 64) {
          try {
            const tx = await fetchTx(id);
            setType("tx");
            setData(tx);
          } catch {
            const block = await fetchBlockByHash(id);
            setType("block");
            setData(block);
          }
        }
      } catch {
        setError("Not found");
      }
    }

    load();
  }, [id]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return null;

  return type === "block" ? (
    <BlockPage data={data} />
  ) : (
    <TransactionPage data={data} />
  );
}
