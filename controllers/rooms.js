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
    res.status(404).json({ error: err });
  }
};

const showSwap = async (req, res) => {
  try {
    const { swaps_id } = req.params;
    const room = await Room.getRooms(swaps_id);
    res.status(200).json(room);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

module.exports = { index, showSwap };
