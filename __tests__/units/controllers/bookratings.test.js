const { create, show } = require('../../../controllers/bookRatings')
const BookRatings = require('../../../models/BookRatings')

describe('BookRatings Controller', () => {

    describe('create', () => {
        it('should create a new book rating and return a 201 status', async() => {
            const req = {body: { user_id:1, book_id:101, rating:5}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

            const mockNewRating = { ratings_id: 1, user_id: 1, book_id: 101, rating: 5}

            jest.spyOn(BookRatings, 'create').mockResolvedValue(mockNewRating)

            await create(req, res)

            expect(BookRatings.create).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(mockNewRating)
        })

        it('should return a 400 status if there is an error creating the book rating', async()=> {
            const req = {body: { user_id: 1, book_id: 101, rating: 5}}
            const res = {status: jest.fn().mockReturnThis(), json: jest.fn()}

            jest.spyOn(BookRatings, 'create').mockRejectedValue(new Error('Database error'))

            await create(req,res)

            expect(BookRatings.create).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
        })

        it('should return a 400 status with "An unknown error occurred." if error has no message', async () => {
            const req = { body: { user_id: 1, book_id: 101, rating: 5 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            jest.spyOn(BookRatings, 'create').mockRejectedValue(new Error());

            await create(req, res);

            expect(BookRatings.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "An unknown error occurred." });
        })
    })

    describe('show', () => {
        it('should return book ratings and a 200 status', async() => {
            const req = { params: { book_id: '101'}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

            const mockRatings = [
                {ratings_id: 1, user_id: 1, book_id: 101, rating: 5},
                {ratings_id: 2, user_id: 2, book_id: 101, rating: 4}
            ]

            jest.spyOn(BookRatings, 'findByBookId').mockResolvedValue(mockRatings)

            await show(req,res)

            expect(BookRatings.findByBookId).toHaveBeenCalledWith(101)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockRatings)
        })

        it('should return a 404 status if there is an error fetching book ratings', async() => {
            const req = { params: {book_id: '101'}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

            jest.spyOn(BookRatings, 'findByBookId').mockRejectedValue(new Error('Database error'))

            await show(req,res)

            expect(BookRatings.findByBookId).toHaveBeenCalledWith(101)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({error: 'Database error'})
        })

        it('should return a 404 status with "Book ratings not found." if error has no message', async () => {
            const req = { params: { book_id: '101' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            jest.spyOn(BookRatings, 'findByBookId').mockRejectedValue(new Error());

            await show(req, res);

            expect(BookRatings.findByBookId).toHaveBeenCalledWith(101);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Book ratings not found." });
        })
    })
})