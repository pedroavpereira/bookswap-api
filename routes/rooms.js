const { Router } = require("express");
const roomsController = require("../controllers/rooms");

const { authenticator } = require("../middleware/authenticator");

const roomsRouter = Router();

roomsRouter.use(authenticator);

roomsRouter.get("/", roomsController.index);
roomsRouter.get("/swap/:swap_id", roomsController.showSwap);
roomsRouter.get(
  "/markAsRead/:room_id",
  roomsController.markAsRead,
  roomsController.showRoom
);

module.exports = roomsRouter;
