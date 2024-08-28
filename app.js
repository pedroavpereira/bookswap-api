const express = require("express");
const cors = require("cors");
const reviewRouter = require("./routes/reviewRouter");
const collectionsRouter = require("./routes/collections");
const wishlistRouter = require('./routes/wishlistRouter')
const roomsRouter = require("./routes/rooms");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/reviews", reviewRouter);

app.use("/collections", collectionsRouter);

app.use("/rooms", roomsRouter);

app.use("/wishlists", wishlistRouter);

module.exports = app;
