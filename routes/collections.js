const { Router } = require("express");

const collectionsController = require("../controllers/collections");

const collectionsRouter = Router();

collectionsRouter.get("/search", collectionsController.searchProximity);
collectionsRouter.get("/:collection_id", collectionsController.searchById);
collectionsRouter.get("/user/:user_id", collectionsController.searchByUser);
collectionsRouter.post("/", collectionsController.create);
collectionsRouter.delete("/:id", collectionsController.destroy);

module.exports = collectionsRouter;
