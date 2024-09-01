const Room = require("../models/Room");
const User = require("../models/User");
const Message = require("../models/Message");

const index = async (req, res) => {
  try {
    const user_id = req.user_id;
    const rooms = await Room.getRooms(user_id);

    const populatedRooms = await Promise.all(
      rooms.map(async (room) => {
        const last_message = await Message.findLast(room.room_id);
        const user = await User.findById(
          +user_id === room.user_1 ? room.user_2 : room.user_1
        );
        return { ...room, last_message, user };
      })
    );

    res.status(200).json(populatedRooms);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};

const showSwap = async (req, res) => {
  try {
    const { swaps_id } = req.params;
    const room = await Room.getRoomBySwapId(swaps_id);

    const last_message = await Message.findLast(room.room_id);
    const user = await User.findById(
      +user_id === room.user_1 ? room.user_2 : room.user_1
    );

    res.status(200).json(...room, last_message, user);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

const showRoom = async (req, res) => {
  try {
    const { room_id } = req.params;
    const room = await Room.getRoom(room_id);

    const last_message = await Message.findLast(room.room_id);
    const user = await User.findById(
      +user_id === room.user_1 ? room.user_2 : room.user_1
    );

    res.status(200).json(...room, last_message, user);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
const markAsRead = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { room_id } = req.params;
    await Message.markAsRead({ user_id, room_id });

    next();
  } catch (err) {
    console.log("Mark as read", err);
    res.status(500).json({ error: err });
  }
};

module.exports = { index, showSwap, markAsRead, showRoom };
