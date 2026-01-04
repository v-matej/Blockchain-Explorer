const express = require("express");
const {
  getTransaction,
  getTransactionSummary,
} = require("../controllers/tx.controller.js");

const router = express.Router();

router.get("/:txid", getTransaction);
router.get("/:txid/summary", getTransactionSummary);

module.exports = router;
