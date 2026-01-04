export default function BlockSummary({ data }) {
  const b = data.summary;

  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="text-xl font-semibold mb-2">Block</h2>
      <ul className="text-sm space-y-1">
        <li><strong>Height:</strong> {b.height}</li>
        <li><strong>Hash:</strong> {b.hash}</li>
        <li><strong>Tx count:</strong> {b.txCount}</li>
        <li><strong>Size:</strong> {b.size} bytes</li>
        <li><strong>Difficulty:</strong> {b.difficulty}</li>
        <li><strong>Timestamp:</strong> {new Date(b.timestamp * 1000).toLocaleString()}</li>
      </ul>
    </div>
  );
}
