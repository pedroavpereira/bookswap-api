const Wishlist = require('../../../models/Wishlist')
const db = require('../../../db/connect')

describe('Wishlist Model', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    describe('create', () => {
        it('should create a new wishlist entry', async() => {
            const mockWishlistData = {
                wishlist_id: 1,
                user_id: 1,
                book_id: 101,
                radius: 10
            }

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [mockWishlistData]})

            const wishlist = await Wishlist.create({ user_id: 1, book_id: 101, radius: 10})

            expect(db.query).toHaveBeenCalledWith(`INSERT INTO wishlists (user_id, book_id, radius) VALUES ($1, $2, $3) RETURNING *`,[1, 101, 10])
            expect(wishlist).toEqual(new Wishlist(mockWishlistData))
        })

        it('should throw an error if there is an issue creating the wishlist', async () => {

            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'))

            await expect(Wishlist.create({ user_id: 1, book_id: 101, radius: 10 })).rejects.toThrow('Error creating wishlist entry: Database error')
        })
    })

    describe('findByUserId', () => {
        it('should find wishlists by user_id', async() => {
            const mockWishlistData = [
                {wishlist_id: 1, user_id: 1, book_id: 101, radius: 10},
                {wishlist_id: 2, user_id: 1, book_id: 102, radius: 15}
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: mockWishlistData})

            const wishlists = await Wishlist.findByUserId(1)

            expect(db.query).toHaveBeenCalledWith(`SELECT * FROM wishlists WHERE user_id = $1`, [1])

            expect(wishlists).toEqual(mockWishlistData.map(row => new Wishlist(row)))
        })

        it('should throw an error if there is an issue finding the wishlists', async() => {
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'))

            await expect(Wishlist.findByUserId(1)).rejects.toThrow('Error finding wishlist by user_id: Database error')
        })
    })


    describe('findByWishlistId',() => {
        it('should find a wishlist by wishlist_id', async() => {
            const mockWishlistData = {
                wishlist_id: 1,
                user_id: 1,
                book_id: 101,
                radius: 10
            }

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockWishlistData]})

            const wishlist = await Wishlist.findByWishlistId(1)

            expect(db.query).toHaveBeenCalledWith(`SELECT * FROM wishlists WHERE wishlist_id = $1`, [1])
            expect(wishlist).toEqual(new Wishlist(mockWishlistData))
        })

        it('should return null if no wishlist is found by wishlist_id', async() => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []})

            const wishlist = await Wishlist.findByWishlistId(999)

            expect(db.query).toHaveBeenCalledWith(`SELECT * FROM wishlists WHERE wishlist_id = $1`, [999])
            expect(wishlist).toBeNull()
        })

        it('should throw an error if there is an issue finding the wishlist', async() => {
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'))

            await expect(Wishlist.findByWishlistId(1)).rejects.toThrow('Error finding wishlist by wishlist_id: Database error')
        })
    })

    describe('destroy', () => {
        it('should delete a wishlist entry', async() => {
            const mockWishlistData = {
                wishlist_id: 1,
                user_id: 1,
                book_id: 101,
                radius: 10
            }

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [mockWishlistData]})

            const wishlist = new Wishlist(mockWishlistData)
            const isDeleted = await wishlist.destroy()

            expect(db.query).toHaveBeenCalledWith(`DELETE FROM wishlists WHERE wishlist_id = $1 RETURNING *`, [1])

            expect(isDeleted).toBe(true)
        })

        it('should return false if the wishlist entry is not found', async() => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []})

            const wishlist = new Wishlist({ wishlist_id: 999})
            const isDeleted = await wishlist.destroy()

            expect(isDeleted).toBe(false)
        })

        it('should throw an error if there is an issue deleting the wishlist entry', async() => {
            const mockWishlistData = {
                wishlist_id: 1,
                user_id: 1,
                book_id: 101,
                radius: 10
            }

            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Database error'))

            const wishlist = new Wishlist(mockWishlistData)

            await expect(wishlist.destroy()).rejects.toThrow('Error deleting wishlist entry: Database error')
        })
    })
})