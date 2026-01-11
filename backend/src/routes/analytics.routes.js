const express = require("express");
const {
  getBlockchainStats,
  getBlockchainChart,
  getNetworkInsights,
  getBtcPriceChart,
  getBtcMarket,
} = require("../controllers/analytics.controller");

const router = express.Router();

router.get("/chart/:metric", getBlockchainChart);
router.get("/network-insights", getNetworkInsights);
router.get("/btc-price", getBtcPriceChart);
router.get("/btc-market", getBtcMarket);


module.exports = router;
