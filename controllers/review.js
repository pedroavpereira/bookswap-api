const Review = require('../models/review');  

// Create a new review
async function create(req, res) {
    try {
        const data = req.body;
        const newReview = await Review.create(data);  // Call the static create method on the Review class
        res.status(201).json(newReview);
    } catch (err) {
        console.error("Error creating review:", err);  // Log the error to the console
        res.status(400).json({ error: err.message });
    }
}


// Get all reviews by user_id
async function show(req, res) {
    try {
        const userId = parseInt(req.params.user_id);
        const reviews = await Review.getByUserId(userId);  
        res.status(200).json(reviews);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// Delete a review by review_id
async function destroy(req, res) {
    try {
        const reviewId = parseInt(req.params.review_id);
        const review = await Review.getById(reviewId);   
        await review.destroy();   
        res.status(204).end();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

// Export the controller functions
module.exports = { create, show, destroy };

