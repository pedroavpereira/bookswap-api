const express = require("express");
const cors = require("cors");
const reviewRouter = require("./routes/reviewRouter");
const collectionsRouter = require("./routes/collections");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/reviews", reviewRouter);

app.use("/collections", collectionsRouter);

module.exports = app;
