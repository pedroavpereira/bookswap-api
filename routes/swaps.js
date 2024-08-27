const { Router } = require("express");

const swapsController = require("../controllers/swaps");

const swapsRouter = Router();

swapsRouter.post("/", swapsController.create);
swapsRouter.patch("/accept/:swap_id", swapsController.accept);
swapsRouter.patch("/reject/:swap_id", swapsController.reject);
swapsRouter.patch("/complete/:swap_id", swapsController.complete);
swapsRouter.delete("/:swap_id", swapsController.destroy);

module.exports = swapsRouter;
