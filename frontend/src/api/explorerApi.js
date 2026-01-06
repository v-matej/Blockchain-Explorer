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

export async function fetchLatestBlocks(limit = 10) {
  const res = await fetch(
    `http://localhost:3000/api/block/latest?limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch latest blocks");
  }
  return res.json();
}

export async function fetchBlockchainStats(limit) {
  const res = await fetch(
    `http://localhost:3000/api/analytics/blockchain?limit=${limit}`
  );
  if (!res.ok) throw new Error("Analytics fetch failed");
  return res.json();
}

export async function fetchBlockchainHistory(metric, timespan) {
  const res = await fetch(
    `http://localhost:3000/api/analytics/chart/${metric}?timespan=${timespan}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain history");
  }

  return res.json();
}

export async function fetchNetworkInsights() {
  const res = await fetch(
    "http://localhost:3000/api/analytics/network-insights"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch network insights");
  }

  return res.json();
}
