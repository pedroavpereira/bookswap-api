const Review = require('../models/Review');

async function create(req, res) {
    try {
        const data = req.body;
        const newReview = await Review.create(data);
        res.status(201).json(newReview);
    } catch (err) {
        console.error("Error creating review:", err);
        res.status(400).json({ error: err.message || "An unknown error occurred" });
    }
}

async function show(req, res) {
    try {
        const userId = parseInt(req.params.user_id);
        const reviews = await Review.getByUserId(userId);
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(404).json({ error: err.message || "Reviews not found" });
    }
}

async function destroy(req, res) {
    try {
        const reviewId = parseInt(req.params.review_id);
        const review = await Review.getById(reviewId);
        await review.destroy();
        res.status(204).end();
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(404).json({ error: err.message || "Review not found" });
    }
}

module.exports = { create, show, destroy };
