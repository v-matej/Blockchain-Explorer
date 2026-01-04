const express = require("express");
const {
  getBlockByHash,
  getBlockByHeight,
  getBlockSummaryByHash,
  getBlockSummaryByHeight,
} = require("../controllers/block.controller.js");

const router = express.Router();

router.get("/hash/:hash", getBlockByHash);
router.get("/hash/:hash/summary", getBlockSummaryByHash);

router.get("/height/:height", getBlockByHeight);
router.get("/height/:height/summary", getBlockSummaryByHeight);

module.exports = router;
