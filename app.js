const express = require("express");
const cors = require("cors");
const reviewRouter = require("./routes/reviewRouter");
const collectionsRouter = require("./routes/collections");
const roomsRouter = require("./routes/rooms");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/reviews", reviewRouter);

app.use("/collection", collectionsRouter);

app.use("/rooms", roomsRouter);

module.exports = app;
