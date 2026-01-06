const express = require("express");
const {
  getMempoolOverview,
  getMempoolTransactions,
  getFeeDistribution,
  getMempoolDelta,
} = require("../controllers/mempool.controller");

const router = express.Router();

router.get("/overview", getMempoolOverview);
router.get("/transactions", getMempoolTransactions);
router.get("/fee-distribution", getFeeDistribution);
router.get("/delta", getMempoolDelta);

module.exports = router;
