const { callRpc } = require("../services/bitcoinRpc.service.js");

async function computeBlockEconomicStats(block) {
  // 1) Always reliable from decoded txs
  let totalOutputBTC = 0;
  let inputCount = 0;
  let outputCount = 0;

  for (const tx of block.tx) {
    // outputs
    outputCount += tx.vout.length;
    totalOutputBTC += tx.vout.reduce((s, v) => s + v.value, 0);

    // inputs (coinbase has vin[0].coinbase)
    if (!tx.vin?.[0]?.coinbase) {
      inputCount += tx.vin.length;
    }
  }

  const avgTxValueBTC =
    block.tx.length > 0 ? totalOutputBTC / block.tx.length : 0;

  // 2) Fees: ask Bitcoin Core (source of truth)
  const stats = await callRpc("getblockstats", [block.height]);
  // totalfee is in satoshis in Bitcoin Core
  const feesBTC = stats.totalfee / 1e8;

  // 3) Subsidy: halving schedule
  const halvings = Math.floor(block.height / 210000);
  const subsidyBTC = 50 / Math.pow(2, halvings);

  // 4) Reward
  const rewardBTC = subsidyBTC + feesBTC;

  return {
    totalOutputBTC: Number(totalOutputBTC.toFixed(8)),
    avgTxValueBTC: Number(avgTxValueBTC.toFixed(8)),
    feesBTC: Number(feesBTC.toFixed(8)),
    rewardBTC: Number(rewardBTC.toFixed(8)),
    inputs: inputCount,
    outputs: outputCount,
    subsidyBTC: Number(subsidyBTC.toFixed(8)),
  };
}

async function mapBlockSummary(block) {
  const economic = await computeBlockEconomicStats(block);

  return {
    hash: block.hash,
    height: block.height,
    confirmations: block.confirmations,
    timestamp: block.time,

    txCount: block.nTx,
    size: block.size,
    weight: block.weight,
    difficulty: block.difficulty,
    version: block.version,
    nonce: block.nonce,

    previousBlockHash: block.previousblockhash || null,
    nextBlockHash: block.nextblockhash || null,

    // Economics
    totalOutputBTC: economic.totalOutputBTC,
    avgTxValueBTC: economic.avgTxValueBTC,
    feesBTC: economic.feesBTC,
    subsidyBTC: economic.subsidyBTC,
    rewardBTC: economic.rewardBTC,
    inputs: economic.inputs,
    outputs: economic.outputs,

    miner: "Unknown",
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
      summary: await mapBlockSummary(block),
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
      summary: await mapBlockSummary(block),
      raw: block,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLatestBlocks(req, res) {
  try {
    const limit = Number(req.query.limit) || 10;

    const currentHeight = await callRpc("getblockcount");
    const blocks = [];

    for (let i = 0; i < limit; i++) {
      const height = currentHeight - i;
      const hash = await callRpc("getblockhash", [height]);
      const block = await callRpc("getblock", [hash, 1]);

      blocks.push({
        height,
        hash,
        time: block.time,
        txCount: block.nTx,
        size: block.size,
      });
    }

    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getBlockByHash,
  getBlockByHeight,
  getBlockSummaryByHash,
  getBlockSummaryByHeight,
  getLatestBlocks,
};
