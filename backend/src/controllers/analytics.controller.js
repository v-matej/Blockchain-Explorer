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

/* -------------------- BTC PRICE CHART -------------------- */

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

function rangeToSeconds(range) {
  switch (range) {
    case "1h": return 60 * 60;
    case "6h": return 6 * 60 * 60;
    case "12h": return 12 * 60 * 60;
    case "24h": return 24 * 60 * 60;
    case "7d": return 7 * 24 * 60 * 60;
    case "30d": return 30 * 24 * 60 * 60;
    case "365d": return 365 * 24 * 60 * 60;
    default: return null;
  }
}

async function getBtcPriceChart(req, res) {
  try {
    const range = String(req.query.range || "24h").toLowerCase();
    const now = Math.floor(Date.now() / 1000);

    // ALL range → CoinGecko supports directly
    if (range === "max") {
      const url =
        `${COINGECKO_BASE}/coins/bitcoin/market_chart` +
        `?vs_currency=usd&days=max`;

      const response = await axios.get(url, { timeout: 10000 });

      return res.json(
        response.data.prices.map(([time, price]) => ({
          time,
          price,
        }))
      );
    }

    // Sub-day & normal ranges → use /range
    const seconds = rangeToSeconds(range);
    if (!seconds) {
      return res.status(400).json({ error: "Invalid range" });
    }

    const from = now - seconds;

    const url =
      `${COINGECKO_BASE}/coins/bitcoin/market_chart/range` +
      `?vs_currency=usd&from=${from}&to=${now}`;

    const response = await axios.get(url, { timeout: 10000 });

    // Downsample for performance
    const prices = response.data.prices || [];
    const MAX_POINTS = 400;
    const step = Math.max(1, Math.floor(prices.length / MAX_POINTS));

    res.json(
      prices
        .filter((_, i) => i % step === 0)
        .map(([time, price]) => ({ time, price }))
    );
  } catch (err) {
    console.error("BTC price chart error:", err.message);
    res.status(500).json({ error: "Failed to fetch BTC price chart" });
  }
}

async function getNetworkInsights(req, res) {
  try {
    const info = await callRpc("getblockchaininfo");
    const hashRate = await callRpc("getnetworkhashps", [120]);

    const height = info.blocks;
    const difficulty = info.difficulty;

    const BLOCKS_PER_EPOCH = 2016;
    const lastAdjustmentHeight =
      height - (height % BLOCKS_PER_EPOCH);

    const blocksIntoEpoch =
      height - lastAdjustmentHeight;

    const HALVING_INTERVAL = 210000;
    const LAST_HALVING = 840000;

    const nextHalving =
      LAST_HALVING +
      Math.floor(
        (height - LAST_HALVING) / HALVING_INTERVAL + 1
      ) * HALVING_INTERVAL;

    res.json({
      height,
      difficulty,
      hashRate,
      epoch: {
        blocksIntoEpoch,
        total: BLOCKS_PER_EPOCH,
      },
      halving: {
        nextHalving,
        blocksRemaining: nextHalving - height,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/* ---------------- BTC MARKET SNAPSHOT ---------------- */

let btcMarketCache = null;
let btcMarketLastFetch = 0;
const BTC_MARKET_TTL = 60_000; // 60s cache

async function getBtcMarket(req, res) {
  try {
    const now = Date.now();

    if (
      btcMarketCache &&
      now - btcMarketLastFetch < BTC_MARKET_TTL
    ) {
      return res.json(btcMarketCache);
    }

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin",
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
        headers: {
          "User-Agent": "OSS-Explorer/1.0",
        },
        timeout: 10_000,
      }
    );

    const market = response.data.market_data;

    const payload = {
      price: market.current_price.usd,
      change24h: market.price_change_percentage_24h,
      marketCap: market.market_cap.usd,
      marketCapChange24h:
        market.market_cap_change_percentage_24h,
      volume24h: market.total_volume.usd,
      fdv: market.fully_diluted_valuation.usd,
      totalSupply: market.total_supply,
      maxSupply: market.max_supply,
    };

    btcMarketCache = payload;
    btcMarketLastFetch = now;

    res.json(payload);
  } catch (err) {
    console.error("BTC market error:", err.message);
    res.status(500).json({
      error: "Failed to fetch BTC market data",
    });
  }
}


module.exports = {
  getBlockchainStats,
  getBlockchainChart,
  getNetworkInsights,
  getBtcPriceChart,
  getBtcMarket,
};
