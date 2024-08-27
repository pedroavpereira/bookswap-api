const express = require("express");
const cors = require("cors");
const collectionsRouter = require("./routes/collections");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/collection", collectionsRouter);

module.exports = app;
