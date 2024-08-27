const db = require('../db/connect');

class Review {
    constructor({ review_id, rating, message, user_id, submitted_by }) {
        this.review_id = review_id;
        this.rating = rating;
        this.message = message;
        this.user_id = user_id;
        this.submitted_by = submitted_by;
    }

    // Get all reviews
    static async getAll() {
        const response = await db.query("SELECT * FROM users_reviews;");
        return response.rows.map(r => new Review(r));
    }

    // Get all reviews by a specific user_id
    static async getByUserId(user_id) {
        const response = await db.query("SELECT * FROM users_reviews WHERE user_id = $1;", [user_id]);
        return response.rows.map(r => new Review(r));
    }

    // Create a new review
    static async create({ rating, message, user_id, submitted_by }) {
        const response = await db.query(
            "INSERT INTO users_reviews (rating, message, user_id, submitted_by) VALUES ($1, $2, $3, $4) RETURNING *;",
            [rating, message, user_id, submitted_by]
        );
        return new Review(response.rows[0]);
    }

    // Update an existing review
    async update(data) {
        const response = await db.query(
            "UPDATE users_reviews SET rating = $1, message = $2 WHERE review_id = $3 RETURNING *;",
            [data.rating, data.message, this.review_id]
        );
        if (response.rows.length !== 1) {
            throw new Error("Unable to update review.");
        }
        return new Review(response.rows[0]);
    }

    // Delete a review by review_id
    async destroy() {
        const response = await db.query(
            "DELETE FROM users_reviews WHERE review_id = $1 RETURNING *;",
            [this.review_id]
        );
        if (response.rows.length !== 1) {
            throw new Error("Unable to delete review.");
        }
        return new Review(response.rows[0]);
    }

    // Get a review by its ID
    static async getById(review_id) {
        const response = await db.query("SELECT * FROM users_reviews WHERE review_id = $1;", [review_id]);
        if (response.rows.length === 0) {
            throw new Error("Review not found.");
        }
        return new Review(response.rows[0]);
    }
}

module.exports = Review;

