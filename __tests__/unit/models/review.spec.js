const Review = require('../../../models/Review');
const db = require('../../../db/connect');

describe('Review', () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  describe('getAll', () => {
    it('resolves with reviews on successful db query', async () => {
      // Arrange
      const mockReviews = [
        { review_id: 1, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' },
        { review_id: 2, rating: 4, message: 'Good', user_id: 2, submitted_by: 'user2' },
      ];
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockReviews });

      // Act
      const reviews = await Review.getAll();

      // Assert
      expect(reviews).toHaveLength(2);
      expect(reviews[0]).toBeInstanceOf(Review);
      expect(reviews[0].review_id).toBe(1);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users_reviews;");
    });

    it('returns an empty array when no reviews are found', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act
      const reviews = await Review.getAll();

      // Assert
      expect(reviews).toEqual([]);
    });
  });

  describe('getByUserId', () => {
    it('resolves with reviews on successful db query', async () => {
      // Arrange
      const userId = 1;
      const mockReviews = [{ review_id: 1, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' }];
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockReviews });

      // Act
      const reviews = await Review.getByUserId(userId);

      // Assert
      expect(reviews).toHaveLength(1);
      expect(reviews[0]).toBeInstanceOf(Review);
      expect(reviews[0].user_id).toBe(userId);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users_reviews WHERE user_id = $1;", [userId]);
    });

    it('returns an empty array when no reviews are found for a user', async () => {
      // Arrange
      const userId = 1;
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act
      const reviews = await Review.getByUserId(userId);

      // Assert
      expect(reviews).toEqual([]);
    });
  });

  describe('create', () => {
    it('resolves with review on successful creation', async () => {
      // Arrange
      const reviewData = { rating: 5, message: 'Excellent!', user_id: 1, submitted_by: 'user1' };
      const mockReview = { review_id: 1, ...reviewData };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockReview] });

      // Act
      const review = await Review.create(reviewData);

      // Assert
      expect(review).toBeInstanceOf(Review);
      expect(review).toHaveProperty('review_id', 1);
      expect(review).toHaveProperty('rating', 5);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO users_reviews (rating, message, user_id, submitted_by) VALUES ($1, $2, $3, $4) RETURNING *;",
        [reviewData.rating, reviewData.message, reviewData.user_id, reviewData.submitted_by]
      );
    });
  });

  describe('update', () => {
    it('should return the updated review on successful update', async () => {
      // Arrange
      const review = new Review({ review_id: 1, rating: 5, message: 'Good', user_id: 1, submitted_by: 'user1' });
      const updatedData = { rating: 4, message: 'Better than good' };
      const updatedReview = { review_id: 1, ...updatedData, user_id: 1, submitted_by: 'user1' };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedReview] });

      // Act
      const result = await review.update(updatedData);

      // Assert
      expect(result).toBeInstanceOf(Review);
      expect(result.review_id).toBe(1);
      expect(result.rating).toBe(4);
      expect(result.message).toBe('Better than good');
      expect(db.query).toHaveBeenCalledWith(
        "UPDATE users_reviews SET rating = $1, message = $2 WHERE review_id = $3 RETURNING *;",
        [updatedData.rating, updatedData.message, review.review_id]
      );
    });

    it('should throw an error if unable to update review', async () => {
      // Arrange
      const review = new Review({ review_id: 1, rating: 5, message: 'Good', user_id: 1, submitted_by: 'user1' });
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      await expect(review.update({ rating: 4, message: 'Better than good' })).rejects.toThrow('Unable to update review.');
    });
  });

  describe('destroy', () => {
    it('should return the deleted review on successful deletion', async () => {
      // Arrange
      const review = new Review({ review_id: 1, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' });
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ review_id: 1, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' }] });

      // Act
      const result = await review.destroy();

      // Assert
      expect(result).toBeInstanceOf(Review);
      expect(result.review_id).toBe(1);
      expect(db.query).toHaveBeenCalledWith("DELETE FROM users_reviews WHERE review_id = $1 RETURNING *;", [review.review_id]);
    });

    it('should throw an error if unable to delete review', async () => {
      // Arrange
      const review = new Review({ review_id: 1, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' });
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      await expect(review.destroy()).rejects.toThrow('Unable to delete review.');
    });
  });

  describe('getById', () => {
    it('resolves with review on successful db query', async () => {
      // Arrange
      const reviewId = 1;
      const mockReview = { review_id: reviewId, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockReview] });

      // Act
      const review = await Review.getById(reviewId);

      // Assert
      expect(review).toBeInstanceOf(Review);
      expect(review.review_id).toBe(reviewId);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users_reviews WHERE review_id = $1;", [reviewId]);
    });

    it('should throw an Error when review is not found', async () => {
      // Arrange
      const reviewId = 999;
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      await expect(Review.getById(reviewId)).rejects.toThrow('Review not found.');
    });
  });
});
