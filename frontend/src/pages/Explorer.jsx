import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BlockPage from "./BlockPage";
import TransactionPage from "./TransactionPage";
import Loader from "../components/common/Loader";
import {
  fetchBlockByHeight,
  fetchBlockByHash,
  fetchTx,
} from "../api/explorerApi";

export default function Explorer() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        // block by height
        if (/^\d+$/.test(id)) {
          const block = await fetchBlockByHeight(id);
          if (!cancelled) {
            setType("block");
            setData(block);
          }
          return;
        }
        
        if (id.length === 64) {
          try {
            const tx = await fetchTx(id);
            if (!cancelled) {
              setType("tx");
              setData(tx);
            }
          } catch {
            const block = await fetchBlockByHash(id);
            if (!cancelled) {
              setType("block");
              setData(block);
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Not found");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Loader text="Loading blockchain data…" />;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!data) return null;

  return type === "block" ? (
    <BlockPage data={data} />
  ) : (
    <TransactionPage data={data} />
  );
}
