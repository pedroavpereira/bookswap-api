const reviewController = require('../../../controllers/review');
const Review = require('../../../models/Review');

// Mocking response methods
const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

// We are mocking .send(), .json(), and .end() methods of the response
const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}));

const mockRes = { status: mockStatus };

describe('Review Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  describe('create', () => {
    it('should create a review and return it with a 201 status code', async () => {
      const testReview = { rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' };
      const mockReq = { body: testReview };

      jest.spyOn(Review, 'create').mockResolvedValue(new Review(testReview));

      await reviewController.create(mockReq, mockRes);

      expect(Review.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(new Review(testReview));
    });

    it('should return an error if creation fails', async () => {
      const testReview = { rating: 5, message: 'Great!', user_id: 1 };
      const mockReq = { body: testReview };

      jest.spyOn(Review, 'create').mockRejectedValue(new Error('Creation failed'));

      await reviewController.create(mockReq, mockRes);

      expect(Review.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Creation failed' });
    });
  });

  describe('show', () => {
    it('should return reviews for a user with a 200 status code', async () => {
      const userId = 1;
      const testReviews = [
        { review_id: 1, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' },
      ];
      const mockReq = { params: { user_id: '1' } };

      jest.spyOn(Review, 'getByUserId').mockResolvedValue(testReviews);

      await reviewController.show(mockReq, mockRes);

      expect(Review.getByUserId).toHaveBeenCalledWith(userId);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testReviews);
    });

    it('should return an error if reviews are not found', async () => {
      const mockReq = { params: { user_id: '99' } };

      jest.spyOn(Review, 'getByUserId').mockRejectedValue(new Error('Reviews not found'));

      await reviewController.show(mockReq, mockRes);

      expect(Review.getByUserId).toHaveBeenCalledWith(99);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Reviews not found' });
    });
  });

  describe('destroy', () => {
    it('should delete a review and return a 204 status code', async () => {
      const testReview = { review_id: 1, rating: 5, message: 'Great!', user_id: 1, submitted_by: 'user1' };
      const mockReq = { params: { review_id: '1' } };

      jest.spyOn(Review, 'getById').mockResolvedValue(new Review(testReview));
      jest.spyOn(Review.prototype, 'destroy').mockResolvedValue();

      await reviewController.destroy(mockReq, mockRes);

      expect(Review.getById).toHaveBeenCalledWith(1);
      expect(Review.prototype.destroy).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
    });

    it('should return an error if the review is not found', async () => {
      const mockReq = { params: { review_id: '99' } };

      jest.spyOn(Review, 'getById').mockRejectedValue(new Error('Review not found'));

      await reviewController.destroy(mockReq, mockRes);

      expect(Review.getById).toHaveBeenCalledWith(99);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Review not found' });
    });
  });
});