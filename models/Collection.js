const db = require("../db/connect");

class Collection {
  constructor({
    collection_id,
    book_id,
    user_id,
    condition,
    delivery_preference,
  }) {
    (this.collection_id = collection_id), (this.book_id = book_id);
    this.user_id = user_id;
    this.condition = condition;
    this.delivery_preference = delivery_preference;
  }

  static async create({ book_id, user_id, condition, delivery_preference }) {
    console.log(user_id);
    const response = await db.query(
      "INSERT INTO book_collections (book_id, user_id, condition, delivery_preference) VALUES ($1 , $2 , $3, $4) RETURNING *",
      [book_id, user_id, condition, delivery_preference]
    );

    return new Collection(response.rows[0]);
  }

  static async findById(id) {
    const response = await db.query(
      "SELECT * FROM book_collections WHERE collection_id = $1",
      [id]
    );
    if (response.rows.length === 0) return [];

    return new Collection(response.rows[0]);
  }

  static async showByUserId(user_id) {
    const response = await db.query(
      "SELECT * FROM book_collections WHERE user_id = $1",
      [user_id]
    );

    if (response.rows.length === 0) return [];

    return response.rows.map((col) => new Collection(col));
  }

  static async findTitleInsideRadius({ radius, lat, lng, title }) {
    const response = await db.query(
      `SELECT *
FROM (
    SELECT 
        bc.*, 
        b.title,
        (3959 * acos(
            cos(radians($1)) * cos(radians(u.lat)) * cos(radians(u.lng) - radians($2)) 
            + sin(radians($1)) * sin(radians(u.lat))
        )) AS distance
    FROM book_collections bc
    JOIN users u ON bc.user_id = u.user_id  
    JOIN books b ON bc.book_id = b.book_id  
) AS subquery
WHERE distance <= $3
ORDER BY distance;`,
      [lat, lng, radius]
    );

    if (response.rows.length === 0) return [];

    return response.rows;
  }

  async destroy() {
    const response = await db.query(
      "DELETE FROM book_collections WHERE collection_id = $1 RETURNING *",
      [this.collection_id]
    );

    return new Collection(response.rows[0]);
  }
}

module.exports = Collection;

// SELECT
//     bc.*,
//     u.first_name,
//     u.last_name,
//     b.*,
//     ( 6371 * acos(
//         cos( radians(53.408371) ) * cos( radians(u.lat) ) * cos( radians(u.lng) - radians(-2.991573) )
//         + sin( radians(53.408371) ) * sin( radians(u.lat) )
//     ) ) AS distance
// FROM book_collections bc
// JOIN user u ON bc.user_id = u.user_id
// JOIN books b ON bc.book_id = b.book_id
// HAVING distance <= 100
// ORDER BY distance;
