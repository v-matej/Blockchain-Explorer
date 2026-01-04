const axios = require("axios");
const { callRpc } = require("../services/bitcoinRpc.service");

let cache = {};
let lastFetch = 0;
const CACHE_TTL = 60_000;

async function getBlockchainStats(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 1000);
    const cacheKey = `stats_${limit}`;
    const now = Date.now();

    if (cache[cacheKey] && now - lastFetch < CACHE_TTL) {
      return res.json(cache[cacheKey]);
    }

    const currentHeight = await callRpc("getblockcount");

    const heights = Array.from(
      { length: limit },
      (_, i) => currentHeight - (limit - 1 - i)
    );

    const stats = await Promise.all(
      heights.map((h) =>
        callRpc("getblockstats", [h])
      )
    );

    const result = stats.map((s) => ({
      height: s.height,
      size: s.total_size,
      txCount: s.txs,
      fees: Number((s.totalfee / 1e8).toFixed(8)),
    }));

    cache[cacheKey] = result;
    lastFetch = now;

    res.json(result);
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ error: "Failed to load blockchain analytics" });
  }
}

async function getBlockchainChart(req, res) {
  try {
    const { metric } = req.params;
    const { timespan = "1year" } = req.query;

    const url = `https://api.blockchain.info/charts/${metric}?timespan=${timespan}&format=json`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "OSS-Explorer/1.0",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    if (!response.data || !response.data.values) {
      return res.status(502).json({
        error: "Invalid response from blockchain.com",
      });
    }

    res.json(
      response.data.values.map((v) => ({
        time: v.x * 1000,
        value: v.y,
      }))
    );
  } catch (err) {
    console.error("Blockchain chart error:", err.message);

    res.status(500).json({
      error: "Failed to fetch blockchain chart",
    });
  }
}

module.exports = { getBlockchainStats, getBlockchainChart };
