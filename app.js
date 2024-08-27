const express = require("express");
const cors = require("cors");

const collectionsRouter = require("./routes/collections");
const swapsRouter = require("./routes/swaps");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/collection", collectionsRouter);
app.use("/swaps", swapsRouter);

module.exports = app;
