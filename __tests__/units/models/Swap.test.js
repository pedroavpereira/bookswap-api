const db = require("../../../db/connect")
const Swap = require("../../../models/Swap")


describe("Swap Model", () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should create a new swap entry", async () => {
        const mockSwapData = {
            swap_id: 1,
            user_requesting: 1,
            collection_requested: 2,
            user_offered: 3,
            collection_offered: null,
            created_at: new Date(),
            status: 'pending',
            completed: false
        }

        jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [mockSwapData]})

        

        const swap = await Swap.create({
            user_requesting: 1,
            collection_requested: 2,
            user_offered: 3
        })

        expect(db.query).toHaveBeenCalledTimes(1)
        expect(swap).toBeInstanceOf(Swap)
        expect(swap.swap_id).toBe(1)
        expect(swap.status).toBe('pending')
        expect(swap.completed).toBe(false)
    })

    it("should update a swap entry", async () => {
        const mockUpdatedSwap = {
            swap_id: 1,
            user_requesting: 1,
            collection_requested: 2,
            user_offered: 3,
            collection_offered: 4,
            created_at: new Date(),
            status: 'accepted',
            completed: false
        }
        jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [mockUpdatedSwap]})
        

        const swap = await Swap.update(1, { collection_offered: 4, status: 'accepted'})

        expect(db.query).toHaveBeenCalledTimes(1)
        expect(swap).toBeInstanceOf(Swap)
        expect(swap.swap_id).toBe(1)
        expect(swap.collection_offered).toBe(4)
        expect(swap.status).toBe('accepted')
    })

    it("should delete a swap entry", async() => {
        const mockSwapData = {
            swap_id: 1,
            user_requesting: 1,
            collection_requested: 2,
            user_offered: 3,
            collection_offered: 4,
            created_at: new Date(),
            status: 'pending',
            completed: false
        }
        jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [mockSwapData]})
       

        const swap = new Swap(mockSwapData)

        db.query.mockResolvedValueOnce({ rows: [mockSwapData]})

        const isDeleted = await swap.destroy()

        expect(db.query).toHaveBeenCalledTimes(1)
        expect(isDeleted).toBe(true)
    })

    it("should find swaps by user_id", async() => {
        const mockSwapData = [
            {
                swap_id: 1,
                user_requesting: 1,
                collection_requested: 2,
                user_offered: 3,
                collection_offered: 4,
                created_at: new Date(),
                status: 'pending',
                completed: false
            },
            {
                swap_id: 2,
                user_requesting: 1,
                collection_requested: 3,
                user_offered: 4,
                collection_offered: 5,
                created_at: new Date(),
                status: 'completed',
                completed: true
            }
        ]
        jest.spyOn(db, 'query').mockResolvedValueOnce({rows: mockSwapData})


        const swaps = await Swap.findByUserId(1)

        expect(db.query).toHaveBeenCalledTimes(1)
        expect(swaps).toHaveLength(1)
        expect(swaps[0]).toBeInstanceOf(Swap)
        expect(swaps[0].swap_id).toBe(1)
    })

    it("should find a swap by swap_id", async() => {
        const mockSwapData = {
            swap_id: 1,
            user_requesting: 1,
            collection_requested: 2,
            user_offered: 3,
            collection_offered: 4,
            created_at: new Date(),
            status: 'pending',
            completed: false
        }
        jest.spyOn(db, 'query').mockResolvedValueOnce({rows: mockSwapData})
     

        const swap = await Swap.findBySwapId(1)
        console.log(swap)
        
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(swap).toBeInstanceOf(Swap)
        expect(swap.swap_id).toBe(1)
    })

    it("should return null if no swap is found by swap_id", async() => {
        db.query.mockResolvedValueOnce({ rows: []})

        const swap = await Swap.findBySwapId(999)

        expect(db.query).toHaveBeenCalledTimes(1)
        expect(swap).toBeNull()
    })
})