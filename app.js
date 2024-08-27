const express = require("express");
const cors = require("cors");
const reviewRouter = require("./routes/reviewRouter");  
const collectionsRouter = require("./routes/collections");

const app = express();

app.use(cors());
app.use(express.json());

 
app.use('/reviews', reviewRouter);

 
const PORT = process.env.PORT || 3000;

 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use("/collection", collectionsRouter);

module.exports = app;

