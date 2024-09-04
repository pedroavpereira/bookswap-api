const { Router } = require("express");

const { authenticator } = require("../middleware/authenticator.js");

const wishlistController = require("../controllers/wishlist.js");

const wishlistRouter = Router();

wishlistRouter.use(authenticator);

// create new wishlist:
wishlistRouter.post("/", wishlistController.create);
wishlistRouter.get("/mine", wishlistController.showMine);

// find wishlist by user_id
wishlistRouter.get("/user/:user_id", wishlistController.show);

//delete wishlist by wishlist_id
wishlistRouter.delete("/:wishlist_id", wishlistController.destroy);

module.exports = wishlistRouter;
