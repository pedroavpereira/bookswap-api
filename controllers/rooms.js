const Room = require("../models/Room");

const index = async (req, res) => {
  try {
    const user_id = req.user_id;
    const rooms = await Room.getRooms(user_id);
    res.status(200).json(rooms);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

module.exports = { index };