const { Router } = require("express");

const bookRatingsController = require("../controllers/bookRatings.js");

const bookRatingsRouter = Router();

// create new book rating:
bookRatingsRouter.post("/", bookRatingsController.create);

// find book rating by book_id:
bookRatingsRouter.get("/:book_id", bookRatingsController.show);

module.exports = bookRatingsRouter;