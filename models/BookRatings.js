const db = require("../db/connect");

class BookRatings {
    constructor({ratings_id,user_id,book_id,rating}) {
        this.ratings_id = ratings_id
        this.user_id = user_id
        this.book_id = book_id
        this.rating = rating
    }

    static async create({user_id, book_id, rating}) {
        try{
            const result = await db.query(`INSERT INTO books_ratings (user_id, book_id, rating) VALUES ($1, $2, $3) RETURNING *`, [user_id, book_id, rating])
            return new BookRatings(result.rows[0])
        }catch (err) {
            throw new Error("Error creating book rating entry: " + err.message)
        }
    }

    static async findByBookId(book_id) {
        try {
            const result = await db.query(`SELECT * FROM books_ratings WHERE book_id = $1`, [book_id])
            return result.rows.map(row => new BookRatings(row))
        }catch (err) {
            throw new Error("Error finding ratings by book_id: " + err.message )
        }
    }
}

module.exports = BookRatings