const { Router } = require("express");

const wishlistController = require("../controllers/wishlist.js");

const wishlistRouter = Router();

// create new wishlist:
wishlistRouter.post("/", wishlistController.create);

// find wishlist by user_id
wishlistRouter.get("/user/:user_id", wishlistController.show);

//delete wishlist by wishlist_id
wishlistRouter.delete("/:wishlist_id", wishlistController.destroy);

module.exports = wishlistRouter;
