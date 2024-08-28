const db = require("../db/connect");

class Wishlist {
    constructor({wishlist_id,user_id,book_id,radius}) {
        this.wishlist_id = wishlist_id
        this.user_id = user_id
        this.book_id = book_id
        this.radius = radius
    }

    static async create({user_id, book_id, radius}) {
        try {
            const result = await db.query(`INSERT INTO wishlists (user_id, book_id, radius) VALUES ($1, $2, $3) RETURNING wishlist_id, user_id, book_id, radius`, [user_id, book_id, radius])
            return new Wishlist(result.rows[0])
        }catch (err) {
            throw new Error("Error creating whislist entry:" + err.message)
        }
    }

    static async findByUserId(user_id) {
        try {
            const result = await db.query(`SELECT wishlist_id, user_id, book_id, radius FROM wishlists WHERE user_id = $1`, [user_id])
            return result.rows.map(row => new Whislist(row))
        } catch (err) {
            throw new Error("Error finding wishlist by user_id: " + err.message)
        }
    }

    async destroy() {
        try {
            const result = await db.query(`DELETE FROM wishlists WHERE wishlist_id = $1 RETURNING wishlist_id`, [this.wishlist_id])
            return result.rows.length > 0
        }catch (err) {
            throw new Error("Error deleting wishlist entry: " + err.message)
        }
    }
}

module.exports = Wishlist