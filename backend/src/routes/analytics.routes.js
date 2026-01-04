const express = require("express");
const { getBlockchainStats, getBlockchainChart } = require("../controllers/analytics.controller");

const router = express.Router();

// router.get("/blockchain", getBlockchainStats);
router.get("/chart/:metric", getBlockchainChart);

module.exports = router;
