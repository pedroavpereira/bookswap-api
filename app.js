const express = require("express");
const cors = require("cors");
const reviewRouter = require("./routes/reviewRouter");  
const app = express();

app.use(cors());
app.use(express.json());

// Use the review router for routes starting with /reviews
app.use('/reviews', reviewRouter);

// Define the port number. Use environment variable PORT if available, otherwise default to 3000.
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

