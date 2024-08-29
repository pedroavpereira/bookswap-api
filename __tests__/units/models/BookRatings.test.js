const BookRatings = require('../../../models/BookRatings')
const db = require('../../../db/connect')


describe('BookRatings Model', () => {

    describe('create', () => {
        it('should create a new book rating entry', async () => {
            const mockRatingData = {
                ratings_id: 1,
                user_id: 1,
                book_id: 101,
                rating: 5
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockRatingData] });

            const rating = await BookRatings.create({ user_id: 1, book_id: 101, rating: 5 });

            expect(db.query).toHaveBeenCalledWith(
                `INSERT INTO books_ratings (user_id, book_id, rating) VALUES ($1, $2, $3) RETURNING *`,
                [1, 101, 5]
            );
            expect(rating).toEqual(new BookRatings(mockRatingData));
        });

        it('should throw an error if there is an issue creating the book rating entry', async () => {
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'));

            await expect(BookRatings.create({ user_id: 1, book_id: 101, rating: 5 })).rejects.toThrow('Error creating book rating entry: Database error');
        });
    });

    describe('findByBookId', () => {
        it('should find all ratings for a specific book by book_id', async () => {
            const mockRatingData = [
                { ratings_id: 1, user_id: 1, book_id: 101, rating: 5 },
                { ratings_id: 2, user_id: 2, book_id: 101, rating: 4 }
            ];

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockRatingData });

            const ratings = await BookRatings.findByBookId(101);

            expect(db.query).toHaveBeenCalledWith(
                `SELECT * FROM books_ratings WHERE book_id = $1`,
                [101]
            );
            expect(ratings).toEqual(mockRatingData.map(row => new BookRatings(row)));
        });

        it('should throw an error if there is an issue finding ratings by book_id', async () => {
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'));

            await expect(BookRatings.findByBookId(101)).rejects.toThrow('Error finding ratings by book_id: Database error');
        });
    });
});
