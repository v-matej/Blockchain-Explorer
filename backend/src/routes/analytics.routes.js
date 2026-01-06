const express = require("express");
const { getBlockchainStats, getBlockchainChart, getNetworkInsights } = require("../controllers/analytics.controller");

const router = express.Router();

router.get("/chart/:metric", getBlockchainChart);
router.get("/network-insights", getNetworkInsights);

module.exports = router;
