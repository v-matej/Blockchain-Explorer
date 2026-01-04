const express = require("express");
const {
  getBlockByHash,
  getBlockByHeight,
  getBlockSummaryByHash,
  getBlockSummaryByHeight,
  getLatestBlocks,
} = require("../controllers/block.controller.js");

const router = express.Router();

router.get("/hash/:hash", getBlockByHash);
router.get("/hash/:hash/summary", getBlockSummaryByHash);

router.get("/height/:height", getBlockByHeight);
router.get("/height/:height/summary", getBlockSummaryByHeight);

router.get("/latest", getLatestBlocks);

module.exports = router;
