const { callRpc } = require("../services/bitcoinRpc.service.js");

async function getBlockStatsByHeight(req, res) {
  try {
    const { height } = req.params;

    const stats = await callRpc("getblockstats", [Number(height)]);

    res.json({
      summary: {
        height: stats.height,
        txCount: stats.txcount,
        totalFee: stats.totalfee,
        avgFee: stats.avgfee,
        avgFeeRate: stats.avgfeerate,
        maxFeeRate: stats.maxfeerate,
        minFeeRate: stats.minfeerate,
        blockSize: stats.total_size,
      },
      raw: stats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getBlockStatsByHeight,
};
