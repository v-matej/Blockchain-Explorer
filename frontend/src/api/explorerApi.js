const API_BASE = "http://localhost:3000/api";

export async function fetchBlockByHeight(height) {
  const res = await fetch(`${API_BASE}/block/height/${height}/summary`);
  if (!res.ok) throw new Error("Block not found");
  return res.json();
}

export async function fetchBlockByHash(hash) {
  const res = await fetch(`${API_BASE}/block/hash/${hash}/summary`);
  if (!res.ok) throw new Error("Block not found");
  return res.json();
}

export async function fetchTx(txid) {
  const res = await fetch(`${API_BASE}/tx/${txid}/summary`);
  if (!res.ok) throw new Error("Transaction not found");
  return res.json();
}
