const express = require("express");
const { getBlockStatsByHeight } = require("../controllers/stats.controller.js");

const router = express.Router();

router.get("/block/:height", getBlockStatsByHeight);

module.exports = router;
