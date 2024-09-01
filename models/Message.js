const db = require("../db/connect");

class Message {
  constructor({ message_id, room_id, user_sent, message, sent_at }) {
    this.message_id = message_id;
    this.room_id = room_id;
    this.user_sent = user_sent;
    this.message = message;
    this.sent_at = sent_at;
  }

  static async getMessages(room_id) {
    const response = await db.query(
      "SELECT * FROM messages WHERE room_id = $1;",
      [room_id]
    );

    return response.rows.map((msg) => new Message(msg));
  }

  static async findLast(room_id) {
    const response = await db.query(
      "SELECT * FROM messages WHERE room_id = $1 ORDER BY sent_at LIMIT 1;",
      [room_id]
    );

    if (response.rows.length === 0) return null;

    return new Message(response.rows[0]);
  }

  static async createMessage({ room_id, user_sent, message }) {
    const response = await db.query(
      "INSERT INTO messages (room_id, user_sent, message) VALUES ($1, $2, $3) RETURNING *;",
      [room_id, user_sent, message]
    );

    return new Message(response.rows[0]);
  }

  static async markAsRead({ user_id, room_id }) {
    const response = await db.query(
      "UPDATE messages SET read = TRUE WHERE room_id = $1 && user_sent IS NOT $2 RETURNING *;",
      [room_id, user_id]
    );

    return new Message(response.rows[0]);
  }
}

module.exports = Message;
