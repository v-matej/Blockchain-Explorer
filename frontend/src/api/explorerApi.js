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
    `${API_BASE}/block/latest?limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch latest blocks");
  }
  return res.json();
}

export async function fetchBlockchainStats(limit) {
  const res = await fetch(
    `${API_BASE}/analytics/blockchain?limit=${limit}`
  );
  if (!res.ok) throw new Error("Analytics fetch failed");
  return res.json();
}

export async function fetchBlockchainHistory(metric, timespan) {
  const res = await fetch(
    `${API_BASE}/analytics/chart/${metric}?timespan=${timespan}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain history");
  }

  return res.json();
}

export async function fetchNetworkInsights() {
  const res = await fetch(
    `${API_BASE}/analytics/network-insights`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch network insights");
  }

  return res.json();
}

export async function fetchMempoolOverview() {
  const res = await fetch(`${API_BASE}/mempool/overview`);

  if (!res.ok) {
    throw new Error("Failed to fetch mempool overview");
  }

  return res.json();
}

export async function fetchMempoolTransactions(limit = 200) {
  const res = await fetch(
    `${API_BASE}/mempool/transactions?limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch mempool transactions");
  }

  return res.json();
}

export async function fetchMempoolFeeDistribution() {
  const res = await fetch(`${API_BASE}/mempool/fee-distribution`);
  if (!res.ok) throw new Error("Failed to fetch fee distribution");

  const buckets = await res.json();

  return Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
  }));
}

export async function fetchMempoolDelta() {
  const res = await fetch(`${API_BASE}/mempool/delta`);

  if (!res.ok) {
    throw new Error("Failed to fetch mempool delta");
  }

  return res.json();
}

export async function fetchBtcPriceSeries(range = "24h") {
  const res = await fetch(`${API_BASE}/analytics/btc-price?range=${range}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchBtcMarket() {
  const res = await fetch(`${API_BASE}/analytics/btc-market`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}
