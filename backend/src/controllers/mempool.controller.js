const { callRpc } = require("../services/bitcoinRpc.service");

let lastMempoolSize = null;

/* -------------------- 1. MEMPOOL OVERVIEW -------------------- */

async function getMempoolOverview(req, res) {
  try {
    const info = await callRpc("getmempoolinfo");

    res.json({
      txCount: info.size,
      sizeMB: Number((info.bytes / 1e6).toFixed(2)),
      totalFees: Number(info.total_fee.toFixed(4)),
      minRelayFee: info.minrelaytxfee,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* -------------------- 2. MEMPOOL TRANSACTIONS (SAMPLE) -------------------- */

async function getMempoolTransactions(req, res) {
  try {
    const limit = Number(req.query.limit) || 2000;

    const pool = await callRpc("getrawmempool", [true]);

    const txs = Object.entries(pool)
      .slice(0, limit)
      .map(([txid, tx]) => {
        const fee = tx.fees?.base || 0;
        const vsize = tx.vsize || 1;

        return {
          txid,
          fee,
          vsize,
          time: tx.time * 1000,
          feeRateSatVb: (fee * 1e8) / vsize,
        };
      });

    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* -------------------- 3. FEE DISTRIBUTION -------------------- */

async function getFeeDistribution(req, res) {
  try {
    const pool = await callRpc("getrawmempool", [true]);

    const buckets = {
      "1-5": 0,
      "5-10": 0,
      "10-20": 0,
      "20-50": 0,
      "50+": 0,
    };

    Object.values(pool).forEach((tx) => {
      const fee = tx.fees?.base || 0;
      const vsize = tx.vsize || 1;
      const satVb = (fee * 1e8) / vsize;

      if (satVb < 5) buckets["1-5"]++;
      else if (satVb < 10) buckets["5-10"]++;
      else if (satVb < 20) buckets["10-20"]++;
      else if (satVb < 50) buckets["20-50"]++;
      else buckets["50+"]++;
    });

    res.json(buckets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* -------------------- 4. LIVE MEMPOOL DELTA -------------------- */

async function getMempoolDelta(req, res) {
  try {
    const info = await callRpc("getmempoolinfo");

    const currentSize = info.size;
    const sizeMB = info.bytes / 1e6;

    let delta = null;
    if (lastMempoolSize !== null) {
      delta = currentSize - lastMempoolSize;
    }

    lastMempoolSize = currentSize;

    res.json({
      time: Date.now(),
      txCount: currentSize,
      sizeMB: Number(sizeMB.toFixed(2)),
      delta,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMempoolOverview,
  getMempoolTransactions,
  getFeeDistribution,
  getMempoolDelta,
};
