const db = require("../db/connect.js");

class User {
  constructor({ first_name, last_name }) {
    this.first_name = first_name;
    this.last_name = last_name;
  }

  static async findById(id) {
    const response = await db.query("SELECT * FROM users WHERE user_id = $1;", [
      id,
    ]);

    if (response.rows.length != 1) {
      return null;
    }

    return new User(response.rows[0]);
  }
}

module.exports = User;
