const wishlistController = require('../../../controllers/wishlist')
const Wishlist = require('../../../models/Wishlist')

// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

const mockRes = { status: mockStatus };


describe('Wishlist controller', () => {
  beforeEach(() => jest.clearAllMocks())
  beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    global.console.error.mockRestore();
  })

  afterAll(() => jest.resetAllMocks())

  describe ('show', () => {
    let testWishlist, mockReq;

    beforeEach(() => {
      testWishlist = {wishlist_id: 1, user_id: 1, book_id: 2, radius: 5.4 }
      mockReq = { params: { user_id: '1' } }
    });

    it('should return a wishlist with a 200 status code', async () => {
      jest.spyOn(Wishlist, 'findByUserId').mockResolvedValue([new Wishlist(testWishlist)])
      
      await wishlistController.show(mockReq, mockRes);
      
      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([new Wishlist(testWishlist)])
      expect(Wishlist.findByUserId).toHaveBeenCalledwith(1)
      expect(req.status).toHaveBeenCalledWith(200)
      expect(req.json).toHaveBeenCalledWith([new Wishlist(testWishlist.user_id, testWishlist.book_id, testWishlist.radius, wishlist_id)])
      
    })

    it('should return an error if the wishlist with certain user_id is not found', async () => {

      jest.spyOn(Wishlist, 'findByUserId').mockRejectedValue(new Error('oh no'))

      await wishlistController.show(mockReq, mockRes)
      
      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(404)
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' })
      expect(Wishlist.findByUserId).toHaveBeenCalledwith(1)
      expect(req.status).toHaveBeenCalledWith(404)
      expect(req.json).toHaveBeenCalledWith({error: 'oh no' || "Wishlists not found" })
      
    })
  })

  describe ('create', () => {
    it('should return a new wishlist with a 201 status code', async () => {
      const req = {body: { user_id:1, book_id:101, rating:5}}
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
      let testWishlist = {user_id: 1, book_id: 3, radius: 9.5 }
      const mockReq = { body: testWishlist }
      const wishlist_id = 1

      jest.spyOn(Wishlist, 'create').mockResolvedValue(new Wishlist(testWishlist.user_id, testWishlist.book_id, testWishlist.radius, wishlist_id))

      await wishlistController.create(mockReq, mockRes)
      
      expect(Wishlist.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(new Wishlist(testWishlist.user_id, testWishlist.book_id, testWishlist.radius, wishlist_id))
      expect(Wishlist.create).toHaveBeenCalledwith(req.body)
      expect(req.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(new Wishlist(testWishlist.user_id, testWishlist.book_id, testWishlist.radius, wishlist_id))
    })


    it('should return an error if wishlist is not able to be created.', async () => {
      let testWishlist = {book_id: 3, radius: 9.5 }
      const mockReq = { body: testWishlist }

      jest.spyOn(Wishlist, 'create').mockRejectedValue(new Error('oh no'||'Unknown error'))

      await wishlistController.create(mockReq, mockRes)
      
      expect(Wishlist.create).toHaveBeenCalledTimes(1)
      expect(Wishlist.create).toHaveBeenCalledwith(req.body)
      expect(req.status).toHaveBeenCalledWith(400)
      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' || 'Unknown error'})
      expect(console.error).toHaveBeenCalledTimes(1)
    })
  })



  describe ('destroy', () => {
    it('should return a 204 status when wishlist has been deleted', async () => {
      const testWishlist = {wishlist_id:1, user_id: 1, book_id: 4, radius: 2.5 };
      const mockReq = { params: { wishlist_id: '1' } };

      jest.spyOn(Wishlist, 'findByWishlistId').mockResolvedValue(new Wishlist(testWishlist));
      jest.spyOn(Wishlist.prototype, 'destroy').mockResolvedValue();

      await wishlistController.destroy(mockReq, mockRes);

      expect(Wishlist.findByWishlistId).toHaveBeenCalledWith(1);
      expect(Wishlist.prototype.destroy).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
      expect(req.status).toHaveBeenCalledWith(204)
      expect(req.end).toHaveBeenCalledWith()
    });

    it('should return an error if the wishlist is not found', async () => {
      const mockReq = { params: { wishlist_id: '49' } };

      jest.spyOn(Wishlist, 'findByWishlistId').mockRejectedValue(new Error('Wishlist not found'));

      await wishlistController.destroy(mockReq, mockRes);

      expect(Wishlist.findByWishlistId).toHaveBeenCalledWith(49);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Wishlist not found' });
      expect(req.status).toHaveBeenCalledWith(404)
      expect(req.json).toHaveBeenCalledWith({ error: 'Wishlist not found' || "Wishlist not found" })
      
    });
  })
})