const { Router } = require("express");

const { authenticator } = require("../middleware/authenticator");

const swapsController = require("../controllers/swaps");

const swapsRouter = Router();

swapsRouter.use(authenticator);

swapsRouter.get("/".swapsController.showMine);
swapsRouter.post("/", swapsController.create);
swapsRouter.patch("/accept/:swap_id", swapsController.accept);
swapsRouter.patch("/reject/:swap_id", swapsController.reject);
swapsRouter.patch("/complete/:swap_id", swapsController.complete);
swapsRouter.delete("/:swap_id", swapsController.destroy);

module.exports = swapsRouter;
