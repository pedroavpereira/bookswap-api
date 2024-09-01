const { create, showMine, accept, reject, complete, destroy} = require('../../../controllers/swaps')
const Swap= require('../../../models/Swap')
const Collection = require('../../../models/Collection')
const Room = require('../../../models/Room')

describe('swaps Controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())
    describe('create', () => {
        it('should create a new book rating and return a 201 status', async() => {
            const req = {user_id: 1, body: { collection_id: 7}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockNewSwap = { swap_id: 1, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 18 , created_at:'2024-08-30 13:19:01', status:'Pending', completed: false
            }

            const mockCollection = { collection_id: 7, book_id: 23, user_id: 5, condition:'Good',
                delivery_preference: ['Postal', 'Door Pickup']
            }
            jest.spyOn(Collection, 'findById').mockResolvedValue(mockCollection)
            jest.spyOn(Swap, 'create').mockResolvedValue(mockNewSwap)
             console.log("req.user is:", req.user)
            await create(req, res)
            expect(req.user_id).toBe(1)
            expect(Swap.create).toHaveBeenCalledWith({user_requesting:req.user_id, collection_requested:mockCollection.collection_id, user_offered:mockCollection.user_id})
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_id)
            
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(mockNewSwap)
        })

        it('should return a 500 status if there is an error creating a swap entry in swaps table', async()=> {
            const req = {user_id: 1, body: { collection_id: 7}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
            jest.spyOn(Collection, 'findById').mockResolvedValue({rows:[]})
            jest.spyOn(Swap, 'create').mockRejectedValue(new Error(`Requested collection is not in collection table, so unable to create a swap entry in swaps table.`))
        

            await create(req,res)
            const collection = await Collection.findById(req.body.collection_id)
            expect(Swap.create).toHaveBeenCalledWith({user_requesting: req.user_id, collection_requested:collection.collection_id, user_offered: collection.user_id })
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_id)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ error: `Requested collection is not in collection table, so unable to create a swap entry in swaps table.`})
        })

    })
    describe('showMine', () => {
        it('should create a new book rating and return a 201 status', async() => {
            const req = {user_id: 1}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockSwaps = [{ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 18 , created_at:'2024-08-30 13:19:01', status:'Accepted', completed: true
            },{ swap_id: 8, user_requesting: 26, collection_requested: 2, user_offered: 1,
                collection_offered: 18 , created_at:'2024-08-30 22:35:50', status:'Pending', completed: false
            },{ swap_id: 17, user_requesting: 33, collection_requested: 20, user_offered: 1,
                collection_offered: 18 , created_at:'2024-08-30 11:20:01', status:'Accepted', completed: true
            }]

            jest.spyOn(Swap, 'findByUserId').mockResolvedValue(mockSwaps)

            await showMine(req, res)

            expect(Swap.findByUserId).toHaveBeenCalledWith(req.user_id)

            //expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockSwaps)
        })

        it('should return a 500 status if there is an error obtaining a swap entry from swaps table', async()=> {
            const req = {user_id: 1}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
            jest.spyOn(Swap,'findByUserId').mockRejectedValue(new Error(`Swaps with user_requesting=${req.user_id} or user_offered=${req.user_id} cannot be found in swaps table.`))
            // const swaps = await Swap.findByUserId(req.user_id)
            await showMine(req,res)
            
            expect(Swap.findByUserId).toHaveBeenCalledWith(req.user_id)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ error: `Swaps with user_requesting=${req.user_id} or user_offered=${req.user_id} cannot be found in swaps table.`})
        })

    })

    describe('accept', () => {
        it('should create a new room containg user_offered and user_requesting and return 201 status code.', async() => {
            const req = {params: {swap_id: 2}, body: {collection_chosen: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockSwap = [{ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 2 , created_at:'2024-08-30 13:19:01', status:'accepted', completed: true
            }]

            const mockCollection = { collection_id: 7, book_id: 23, user_id: 5, condition:'Good',
                delivery_preference: ['Postal', 'Door Pickup']
            }

            const testRoom = { room_id: 20, user_1: 5, user_2: 1, swap_id:mockSwap.swap_id
            }



            jest.spyOn(Swap, 'update').mockResolvedValue({rows:mockSwap})
            jest.spyOn(Collection, 'findById').mockResolvedValue({rows:[mockCollection]})
            jest.spyOn(Room, 'create').mockResolvedValue(testRoom)

            await accept(req, res)
        
            //expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: 7, status: "accepted"})
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_chosen)
            expect(Room.create).toHaveBeenCalledWith({user_1:mockSwap.user_offered, user_2: mockSwap.user_requesting, swap_id: mockSwap.swap_id})
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(testRoom)
        })

        it('should return a 500 status if there is an error updating swap entry in Swaps table', async()=> {
            const req = {params: {swap_id: 2}, body: {collection_chosen: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
    


            jest.spyOn(Swap, 'update').mockResolvedValue({rows:[]})
            jest.spyOn(Collection, 'findById').mockResolvedValue({rows:[]})
            jest.spyOn(Room, 'create').mockRejectedValue(new Error('Unable to create Room.'))

            await accept(req, res)
        
            //expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: 7, status: "accepted"})
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_chosen)
            expect(Room.create).toHaveBeenCalledWith({user_1:undefined, user_2: undefined, swap_id: undefined})
            
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'Unable to create Room.'})

        })
    })

    describe('reject', () => {
        it('should create a new room containg user_offered and user_requesting and return 201 status code.', async() => {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockSwap ={ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: null , created_at:'2024-08-30 13:19:01', status:'rejected', completed: true
            }

            



            jest.spyOn(Swap, 'update').mockResolvedValue(mockSwap)
            

            await reject(req, res)
        
            expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: mockSwap.collection_offered, status:mockSwap.status})
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockSwap)
        })

        it('should return a 500 status if there is an error updating swap entry in Swaps table', async()=> {
            const req = {params: {swap_id: 2}, body: {collection_chosen: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
    


            jest.spyOn(Swap, 'update').mockResolvedValue({rows:[]})
            jest.spyOn(Collection, 'findById').mockResolvedValue({rows:[]})
            jest.spyOn(Room, 'create').mockRejectedValue(new Error('Unable to create Room.'))

            await accept(req, res)
        
            //expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: 7, status: "accepted"})
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_chosen)
            expect(Room.create).toHaveBeenCalledWith({user_1:undefined, user_2: undefined, swap_id: undefined})
            
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'Unable to create Room.'})

        })
    })

    describe('complete', () => {
        it('should create a new room containg user_offered and user_requesting and return 201 status code.', async() => {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockSwap ={ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 8 , created_at:'2024-08-30 13:19:01', status:'pending', completed: false
            }

            const updatedMockSwap ={ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 8 , created_at:'2024-08-30 13:19:01', status:'completed', completed: false
            }

            


            jest.spyOn(Swap, 'findBySwapId').mockResolvedValue(mockSwap)
            jest.spyOn(Swap, 'update').mockResolvedValue(updatedMockSwap)
            

            await complete(req, res)
        
            expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: updatedMockSwap.collection_offered, status:updatedMockSwap.status})
            expect(Swap.findBySwapId).toHaveBeenCalledWith(req.params.swap_id)
            
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(updatedMockSwap)
        })

        it('should return a 500 status if there is an error updating swap entry in Swaps table', async()=> {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
    

            
           
            jest.spyOn(Swap, 'findBySwapId').mockResolvedValue([])
            jest.spyOn(Swap, 'update').mockRejectedValue(new Error('Cannot read properties of null.'))
            await complete(req, res)
            const currentSwap = await Swap.findBySwapId(req.params.swap_id)
        
            //expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: 7, status: "accepted"})
            //expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: undefined, status:undefined})
            expect(Swap.findBySwapId).toHaveBeenCalledWith(req.params.swap_id)
            expect(currentSwap).toStrictEqual([])
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'Cannot read properties of null.'})

        })
    })

    
    describe('destroy', () => {
        it('should delete a row in swaps table return 204 status code.', async() => {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), end:jest.fn()}
           
            const mockSwap = { swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 8 , created_at:'2024-08-30 13:19:01', status:'pending', completed: false
            }



            jest.spyOn(Swap, 'findBySwapId').mockResolvedValue({rows:[mockSwap]})
            const swap = await Swap.findBySwapId(req.params.swap_id)
    
            

            await destroy(req, res)
            console.log("The swap is: ", swap)
            console.log("The swap is: ", swap)
            expect(Swap.findBySwapId).toHaveBeenCalledWith(req.params.swap_id)
            //expect(swap).toBeInstanceOf(Swap)
            console.log("The swap is: ", swap)
            //expect(res.status).toHaveBeenCalledWith(204)
            
            expect(res.end).toHaveBeenCalled()

        })

        it('should return a 500 status if there is an error updating swap entry in Swaps table', async()=> {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
    

            
           
            jest.spyOn(Swap, 'findBySwapId').mockResolvedValue(null)
            
            
            const swap = await Swap.findBySwapId(req.params.swap_id)

            await destroy(req, res)
        
           
            expect(Swap.findBySwapId).toHaveBeenCalledWith(req.params.swap_id)
            expect(swap).toBe(null)
            //expect(swap.destroy).rejects.toThrow(new Error("Cannot read properties of null (reading destroy)"))
            
            

            
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: "Cannot read properties of null (reading 'destroy')"})
        })
    })
    // describe('show', () => {
    //     it('should return book ratings and a 200 status', async() => {
    //         const req = { params: { book_id: '101'}}
    //         const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

    //         const mockRatings = [
    //             {ratings_id: 1, user_id: 1, book_id: 101, rating: 5},
    //             {ratings_id: 2, user_id: 2, book_id: 101, rating: 4}
    //         ]

    //         jest.spyOn(BookRatings, 'findByBookId').mockResolvedValue(mockRatings)

    //         await show(req,res)

    //         expect(BookRatings.findByBookId).toHaveBeenCalledWith(101)
    //         expect(res.status).toHaveBeenCalledWith(200)
    //         expect(res.json).toHaveBeenCalledWith(mockRatings)
    //     })

    //     it('should return a 404 status if there is an error fetching book ratings', async() => {
    //         const req = { params: {book_id: '101'}}
    //         const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

    //         jest.spyOn(BookRatings, 'findByBookId').mockRejectedValue(new Error('Database error'))

    //         await show(req,res)

    //         expect(BookRatings.findByBookId).toHaveBeenCalledWith(101)
    //         expect(res.status).toHaveBeenCalledWith(404)
    //         expect(res.json).toHaveBeenCalledWith({error: 'Database error'})
    //     })

    //     it('should return a 404 status with "Book ratings not found." if error has no message', async () => {
    //         const req = { params: { book_id: '101' } };
    //         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    //         jest.spyOn(BookRatings, 'findByBookId').mockRejectedValue(new Error());

    //         await show(req, res);

    //         expect(BookRatings.findByBookId).toHaveBeenCalledWith(101);
    //         expect(res.status).toHaveBeenCalledWith(404);
    //         expect(res.json).toHaveBeenCalledWith({ error: "Book ratings not found." });
    //     })
    // })
})