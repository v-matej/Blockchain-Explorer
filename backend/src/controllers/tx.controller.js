const { callRpc } = require("../services/bitcoinRpc.service.js");

/**
 * Helper: zbroj izlaza
 */
function calculateTotalOutput(vout) {
  return vout.reduce((sum, o) => sum + o.value, 0);
}

/**
 * Helper: izračun fee-a
 * (input - output)
 */
function calculateFee(vin, totalOutput) {
  let totalInput = 0;

  for (const input of vin) {
    if (input.prevout && input.prevout.value) {
      totalInput += input.prevout.value;
    }
  }

  return totalInput > 0 ? totalInput - totalOutput : null;
}

function mapTransactionSummary(tx) {
  const totalOutput = calculateTotalOutput(tx.vout);
  const fee = calculateFee(tx.vin, totalOutput);

  return {
    txid: tx.txid,
    confirmations: tx.confirmations || 0,
    blockhash: tx.blockhash || null,
    timestamp: tx.time || null,
    size: tx.size,
    vsize: tx.vsize,
    inputCount: tx.vin.length,
    outputCount: tx.vout.length,
    totalOutput,
    fee,
  };
}

/**
 * Novi endpoint: summary + raw
 */
async function getTransactionSummary(req, res) {
  try {
    const { txid } = req.params;

    // verbose = true
    const tx = await callRpc("getrawtransaction", [txid, true]);

    res.json({
      summary: mapTransactionSummary(tx),
      raw: tx,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Postojeći endpoint (ne diramo)
 */
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
