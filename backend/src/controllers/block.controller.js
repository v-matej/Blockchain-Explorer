const { callRpc } = require("../services/bitcoinRpc.service.js");

function mapBlockSummary(block) {
  return {
    hash: block.hash,
    height: block.height,
    confirmations: block.confirmations,
    timestamp: block.time,
    txCount: block.nTx,
    size: block.size,
    weight: block.weight,
    difficulty: block.difficulty,
    previousBlockHash: block.previousblockhash || null,
    nextBlockHash: block.nextblockhash || null,
    miner: block.miner || null, // placeholder za kasnije
  };
}

async function getBlockByHash(req, res) {
  try {
    const { hash } = req.params;
    const block = await callRpc("getblock", [hash, 2]);
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBlockByHeight(req, res) {
  try {
    const { height } = req.params;
    const hash = await callRpc("getblockhash", [Number(height)]);
    const block = await callRpc("getblock", [hash, 2]);
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBlockSummaryByHash(req, res) {
  try {
    const { hash } = req.params;
    const block = await callRpc("getblock", [hash, 2]);

    res.json({
      summary: mapBlockSummary(block),
      raw: block,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBlockSummaryByHeight(req, res) {
  try {
    const { height } = req.params;
    const hash = await callRpc("getblockhash", [Number(height)]);
    const block = await callRpc("getblock", [hash, 2]);

    res.json({
      summary: mapBlockSummary(block),
      raw: block,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getBlockByHash,
  getBlockByHeight,
  getBlockSummaryByHash,
  getBlockSummaryByHeight,
};
