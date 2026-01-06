const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const blockRoutes = require("./routes/block.routes.js");
const txRoutes = require("./routes/tx.routes.js");
const statsRoutes = require("./routes/stats.routes.js");
const analyticsRoutes = require("./routes/analytics.routes.js");
const mempoolRoutes = require("./routes/mempool.routes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/block", blockRoutes);
app.use("/api/tx", txRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/mempool", mempoolRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
