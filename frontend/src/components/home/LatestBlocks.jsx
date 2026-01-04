import { useEffect, useState } from "react";
import { fetchLatestBlocks } from "../../api/explorerApi";
import HashWithCopy from "../common/HashWithCopy";
import { useNavigate } from "react-router-dom";

function timeAgo(ts) {
  const diff = Math.floor((Date.now() / 1000 - ts) / 60);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

export default function LatestBlocks() {
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestBlocks(12).then(setBlocks).catch(console.error);
  }, []);

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900 p-6 space-y-4">
      <h2 className="text-lg font-semibold">Latest BTC Blocks</h2>

      {/* Visual chain */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {blocks.map((b) => (
          <div
            key={b.height}
            onClick={() => navigate(`/block/${b.height}`)}
            className="min-w-[80px] h-[60px] rounded-lg
                       bg-gradient-to-br from-orange-400 to-pink-400
                       opacity-80 hover:opacity-100 cursor-pointer
                       flex items-center justify-center text-black font-semibold"
          >
            #{b.height}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-neutral-800">
            <tr>
              <th className="text-left py-2">Height</th>
              <th className="text-left py-2">Hash</th>
              <th className="text-left py-2">Mined</th>
              <th className="text-left py-2">Txs</th>
              <th className="text-left py-2">Size</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr
                key={b.hash}
                className="border-b border-neutral-800 hover:bg-neutral-800"
              >
                <td
                  className="py-2 text-orange-400 cursor-pointer"
                  onClick={() => navigate(`/block/${b.height}`)}
                >
                  {b.height}
                </td>
                <td className="py-2">
                  <HashWithCopy hash={b.hash} />
                </td>
                <td className="py-2 text-gray-400">
                  {timeAgo(b.time)}
                </td>
                <td className="py-2">{b.txCount}</td>
                <td className="py-2">{b.size.toLocaleString()} B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
