const { callRpc } = require("../services/bitcoinRpc.service.js");

async function mapTxSummary(tx) {
  let blockHeight = null;

  if (tx.blockhash) {
    blockHeight = await callRpc("getblockheader", [tx.blockhash]);
  }

  const totalOutputBTC = tx.vout.reduce(
    (sum, v) => sum + v.value,
    0
  );

  return {
    txid: tx.txid,
    timestamp: tx.time || null,
    confirmations: tx.confirmations || 0,

    blockHash: tx.blockhash || null,
    blockHeight: blockHeight?.height ?? null,

    size: tx.size,
    vsize: tx.vsize,
    inputCount: tx.vin.length,
    outputCount: tx.vout.length,

    totalOutputBTC: Number(totalOutputBTC.toFixed(8)),
    feeBTC:
      tx.fee !== undefined
        ? Number(tx.fee.toFixed(8))
        : null,

    isCoinbase: tx.vin[0]?.coinbase !== undefined,
    rbf: tx.vin.some(v => v.sequence < 0xfffffffe),
  };
}

async function getTransactionSummary(req, res) {
  try {
    const { txid } = req.params;
    const tx = await callRpc("getrawtransaction", [txid, true]);

    res.json({
      summary: await mapTxSummary(tx),
      raw: tx,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTransaction(req, res) {
  try {
    const { txid } = req.params;
    const tx = await callRpc("getrawtransaction", [txid, true]);
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getTransaction,
  getTransactionSummary,
};
