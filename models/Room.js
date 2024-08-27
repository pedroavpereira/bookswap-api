const db = require("../db/connect");

class Room {
  constructor({ room_id, user_1, user_2, swap_id }) {
    this.room_id = room_id;
    this.user_1 = user_1;
    this.user_2 = user_2;
    this.swap_id = swap_id;
  }

  static async getRoom(room_id) {
    const response = await db.query("SELECT * FROM rooms WHERE room_id = $1", [
      room_id,
    ]);

    if (response.rows.length === 0) return null;

    return new Room(response.rows[0]);
  }

  static async getRooms(user_id) {
    const response = await db.query(
      "SELECT * FROM rooms WHERE (user_1 = $1 OR user_2 = $1) AND closed = false ",
      [user_id]
    );

    if (response.rows.length === 0) return [];

    return new Room(response.rows[0]);
  }

  static async createRoom({ user_1, user_2, swap_id }) {
    const response = await db.query(
      "INSERT into rooms (user_1 , user_2~, swap) VALUES ($1, $2) RETURNING *;",
      [user_1, user_2, swap_id]
    );

    if (response.rows.length === 0) throw new Error("Error creating room");

    return new Room(response.rows[0]);
  }
}

module.exports = Room;
