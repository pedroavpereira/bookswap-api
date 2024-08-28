const { Router } = require("express");
const roomsController = require("../controllers/rooms");

const { authenticator } = require("../middleware/authenticator");

const roomsRouter = Router();

roomsRouter.use(authenticator);

roomsRouter.get("/", roomsController.index);

module.exports = roomsRouter;
