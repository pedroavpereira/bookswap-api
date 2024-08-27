const { Router } = require('express');
const reviewController = require('../controllers/review');  
const reviewRouter = Router();

// Route to create a new review
reviewRouter.post('/', reviewController.create);

// Route to get all reviews by user_id
reviewRouter.get('/user/:user_id', reviewController.show);

// Route to delete a review by review_id
reviewRouter.delete('/:review_id', reviewController.destroy);

module.exports = reviewRouter;
