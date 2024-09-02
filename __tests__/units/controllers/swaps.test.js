const { create, showMine, accept, reject, complete, destroy} = require('../../../controllers/swaps')
const Swap= require('../../../models/Swap')
const Collection = require('../../../models/Collection')
const Room = require('../../../models/Room')
const Book = require('../../../models/Book')
const User = require('../../../models/User')


describe('swaps Controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('showMine', () => {
        it('should show all swaps of user with user_id=1 and return a 200 status', async() => {
            const req = {user_id: 1}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockNewSwap = { swap_id: 1, user_requesting: req.user_id, collection_requested: 7, user_offered: 5,
                collection_offered: 18 , created_at:'2024-08-30 13:19:01', status:'Pending', completed: false
            }


            const mockCollectionRequested = { collection_id: mockNewSwap.collection_requested, book_id: 23, user_id: mockNewSwap.user_offered, condition:'Good',
                delivery_preference: ['Postal', 'Door Pickup']
            }
            const mockCollectionOffered= { collection_id: mockNewSwap.collection_offered, book_id: 57, user_id: mockNewSwap.user_requesting, condition:'Good',
                delivery_preference: ['Postal', 'Door Pickup']
            }
           
            const mockBookOffered = { book_id: mockCollectionOffered.book_id, title: 'Sea is Beautiful', authors: ['ZZZZZ', 'AAAAA'], categories: ['Geography', 'Education'], lang: 'Eng', isbn: 1336525434223, image:'gbbjifhbngfs.png' }
            
            const userOfferedDetails= {user_id: mockNewSwap.user_offered, email:'aaa333@yahoo.co.uk' , first_name: 'AAA', last_name:'ZZZ', password: '5432' , lat: 10.99 , lng: 11.88}
                      
            const mockBookRequested = { book_id: mockCollectionRequested.book_id, title: 'Beautiful Sun', authors: ['Mccc', 'Bddd'], categories: ['Mystery', 'Fiction'], lang: 'Eng', isbn: 9687225434113, image:'gsbdjvieufanmgfkorf.png' }
           
            const userRequestedDetails = {user_id: mockNewSwap.user_requesting, email:'bbb222@yahoo.co.uk' , first_name: 'bbb', last_name:'BBB', password: '1234' , lat: 5.66 , lng: 9.77}

           
            
            jest.spyOn(Swap, 'findByUserId').mockResolvedValue([mockNewSwap])
            jest.spyOn(Collection, 'findById').mockReturnValueOnce(mockCollectionRequested)
            jest.spyOn(Collection, 'findById').mockReturnValueOnce(mockCollectionOffered)
            jest.spyOn(Book, 'findById').mockReturnValueOnce(mockBookRequested)
            jest.spyOn(User, 'findById').mockReturnValueOnce(userRequestedDetails)
            jest.spyOn(User, 'findById').mockReturnValueOnce(userOfferedDetails)
            jest.spyOn(Book, 'findById').mockReturnValueOnce(mockBookOffered)
             
            await showMine(req, res)
            
            expect(req.user_id).toBe(1)
            expect(Swap.findByUserId).toHaveBeenCalledWith(req.user_id)
            expect(Book.findById).toHaveBeenCalledWith(23)
            expect(User.findById).toHaveBeenCalledWith(req.user_id)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith([{...mockNewSwap, "collectionRequested":mockCollectionRequested, "bookRequested": mockBookRequested, "collectionOffered": mockCollectionOffered, "bookOffered": mockBookOffered, "userRequested": userRequestedDetails, "userOffered": userOfferedDetails}])
            
        })

        it('should show all swaps of user with user_id=1, all swaps have bookOffered and Collection Offered as null, and return 200 status code', async() => {
            const req = {user_id: 1}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockNewSwap = { swap_id: 1, user_requesting: req.user_id, collection_requested: 7, user_offered: 5,
                collection_offered: null , created_at:'2024-08-30 13:19:01', status:'Pending', completed: false
            }


            const mockCollectionRequested = { collection_id: mockNewSwap.collection_requested, book_id: 23, user_id: mockNewSwap.user_offered, condition:'Good',
                delivery_preference: ['Postal', 'Door Pickup']
            }
            const mockCollectionOffered= { collection_id: mockNewSwap.collection_offered, book_id: 57, user_id: mockNewSwap.user_requesting, condition:'Good',
                delivery_preference: ['Postal', 'Door Pickup']
            }
           
            const mockBookOffered = { book_id: mockCollectionOffered.book_id, title: 'Sea is Beautiful', authors: ['ZZZZZ', 'AAAAA'], categories: ['Geography', 'Education'], lang: 'Eng', isbn: 1336525434223, image:'gbbjifhbngfs.png' }
            
            const userOfferedDetails= {user_id: mockNewSwap.user_offered, email:'aaa333@yahoo.co.uk' , first_name: 'AAA', last_name:'ZZZ', password: '5432' , lat: 10.99 , lng: 11.88}

            const mockBookRequested = { book_id: mockCollectionRequested.book_id, title: 'Beautiful Sun', authors: ['Mccc', 'Bddd'], categories: ['Mystery', 'Fiction'], lang: 'Eng', isbn: 9687225434113, image:'gsbdjvieufanmgfkorf.png' }
            const userRequestedDetails = {user_id: mockNewSwap.user_requesting, email:'bbb222@yahoo.co.uk' , first_name: 'bbb', last_name:'BBB', password: '1234' , lat: 5.66 , lng: 9.77}

           
            
            jest.spyOn(Swap, 'findByUserId').mockResolvedValue([mockNewSwap])
            jest.spyOn(Collection, 'findById').mockReturnValueOnce(mockCollectionRequested)
            jest.spyOn(Collection, 'findById').mockReturnValueOnce(mockCollectionOffered)
            jest.spyOn(Book, 'findById').mockReturnValueOnce(mockBookRequested)
            jest.spyOn(User, 'findById').mockReturnValueOnce(userRequestedDetails)
            jest.spyOn(User, 'findById').mockReturnValueOnce(userOfferedDetails)
            jest.spyOn(Book, 'findById').mockReturnValueOnce(mockBookOffered)

            await showMine(req, res)
            
            expect(req.user_id).toBe(1)
            expect(Swap.findByUserId).toHaveBeenCalledWith(req.user_id)
            expect(Book.findById).toHaveBeenCalledWith(23)
            expect(User.findById).toHaveBeenCalledWith(req.user_id)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith([{...mockNewSwap, "collectionRequested":mockCollectionRequested, "bookRequested": mockBookRequested, "collectionOffered": null, "bookOffered": null, "userRequested": userRequestedDetails, "userOffered": userOfferedDetails}])
            
        })

        it('should return error with Error Message and status code of 500 if any error occurs when obtaining rows in swaps table', async() => {
            const req = {user_id: 1}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

            jest.spyOn(Swap, 'findByUserId').mockRejectedValue(new Error("Cannot read properties of an empty string (reading swap.collection_offered)"))
            await showMine(req, res)
            
            expect(req.user_id).toBe(1)
            expect(Swap.findByUserId).toHaveBeenCalledWith(req.user_id)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: "Cannot read properties of an empty string (reading swap.collection_offered)"})
            
        })

  

    })
    describe('create', () => {
        it('should create a new row in swaps table and return a 201 status', async() => {
            const req = {user_id: 1, body: {collection_id: 7}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
            const mockCollection = { collection_id: req.body.collection_id, book_id: 23, user_id: 5, condition:'Good',
                delivery_preference: ['Postal', 'Door Pickup']
            }
            const mockNewSwap = { swap_id: 1, user_requesting: req.user_id, collection_requested: req.body.collection_id, user_offered: mockCollection.user_id,
                collection_offered: 10 , created_at:'2024-08-30 13:19:01', status:'Ppending', completed: false
            }

            const collection = await Collection.findById(req.body.collection_id)
            jest.spyOn(Collection, 'findById').mockResolvedValue(mockCollection)
            jest.spyOn(Swap, 'create').mockResolvedValue(mockNewSwap)
            await create(req, res)
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_id)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(mockNewSwap)
        })

        it('should return a 400 status if there is an error creating a row in swaps table', async()=> {
            const req = {user_id: 1, body: {collection_id: 55}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
            jest.spyOn(Collection,'findById').mockReturnValue([])
            jest.spyOn(Swap, 'create').mockRejectedValue(new Error(`Unable to create Swap due to undefined arguments in create function in Swap Model.`)) 
            await create(req,res)      
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_id)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ error:`Unable to create Swap due to undefined arguments in create function in Swap Model.`})
        })

    })

    describe('accept', () => {
        it('should create a new room containing user_offered and user_requesting and return 201 status code.', async() => {
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
        
            
            expect(Collection.findById).toHaveBeenCalledWith(req.body.collection_chosen)
            expect(Room.create).toHaveBeenCalledWith({user_1:undefined, user_2: undefined, swap_id: undefined})
            
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'Unable to create Room.'})

        })
    })

    describe('reject', () => {
        it('should create a new room containing user_offered and user_requesting and return 201 status code.', async() => {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const mockSwap ={ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: null , created_at:'2024-08-30 13:19:01', status:'rejected', completed: true
            }

            jest.spyOn(Swap, 'update').mockResolvedValue(mockSwap)
            

            await reject(req, res)
        
            expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: mockSwap.collection_offered, status:mockSwap.status, completed: mockSwap.completed})
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockSwap)
        })

        it('should return a 500 status if there is an error updating swap entry in Swaps table', async()=> {
            const req = {params: {swap_id: 2}, body: {collection_chosen: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            jest.spyOn(Swap, 'update').mockRejectedValue(new Error('Unable to create Room.'))
           

            await reject(req, res)
    
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'Unable to create Room.'})

        })
    })

    describe('complete', () => {
        it('should create a new room containing user_offered and user_requesting and return 201 status code.', async() => {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
           
            const currentMockSwap ={ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 8 , created_at:'2024-08-30 13:19:01', status:'completed', completed: false
            }

            const completedMockSwap ={ swap_id: 2, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 8 , created_at:'2024-08-30 13:19:01', status:'completed', completed: true
            }

            jest.spyOn(Swap, 'findBySwapId').mockResolvedValue(currentMockSwap)
            jest.spyOn(Swap, 'update').mockResolvedValue(completedMockSwap)
            

            await complete(req, res)
        
            expect(Swap.update).toHaveBeenCalledWith(req.params.swap_id, {collection_offered: completedMockSwap.collection_offered, status:completedMockSwap.status, completed:completedMockSwap.completed})
            expect(Swap.findBySwapId).toHaveBeenCalledWith(req.params.swap_id)
            
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(completedMockSwap)
        })

        it('should return a 500 status if there is an error updating swap entry in Swaps table', async()=> {
            const req = {params: {swap_id: 2}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
                    
            jest.spyOn(Swap, 'findBySwapId').mockResolvedValue([])
            jest.spyOn(Swap, 'update').mockRejectedValue(new Error('Cannot read properties of null.'))

            await complete(req, res)

            const currentSwap = await Swap.findBySwapId(req.params.swap_id)

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
           
            const mockSwap = { swap_id: req.params.swap_id, user_requesting: 1, collection_requested: 7, user_offered: 5,
                collection_offered: 8 , created_at:'2024-08-30 13:19:01', status:'pending', completed: false
            }


            jest.spyOn(Swap, 'findBySwapId').mockResolvedValue(new Swap(mockSwap))
            jest.spyOn(Swap.prototype, 'destroy').mockResolvedValue()
            const swap = await Swap.findBySwapId(req.params.swap_id)        

            await destroy(req, res)

            expect(Swap.findBySwapId).toHaveBeenCalledWith(req.params.swap_id)

            expect(res.status).toHaveBeenCalledWith(204)
            
            expect(res.end).toHaveBeenCalled()

        })

        it('should return a 500 status if there is an error updating swap entry in Swaps table', async()=> {
            const req = {params:{swap_id: 1}}
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
                   
            jest.spyOn(Swap, 'findBySwapId').mockRejectedValue(new Error('null values have no properties'))
    
            await destroy(req, res)
                
            expect(Swap.findBySwapId).toHaveBeenCalledWith(req.params.swap_id)
           
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'null values have no properties'})
        })
    })
    
})