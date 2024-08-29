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
        const req = { params: { user_id: '1'}}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
    
      jest.spyOn(Wishlist, 'findByUserId').mockResolvedValue([new Wishlist(testWishlist)])
      
      await wishlistController.show(mockReq, mockRes);

      
      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([new Wishlist(testWishlist)])

      await wishlistController.show(req, res);

      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([new Wishlist(testWishlist)])
      
    })

    it('should return 404 status if there is error is obtaining wishlist with certain user_id', async () => {
       const req = { params: { user_id: '1'}}
       const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
        
      jest.spyOn(Wishlist, 'findByUserId').mockRejectedValue(new Error('oh no'))

      await wishlistController.show(mockReq, mockRes)
      
      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(404)
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' })

      await wishlistController.show(req, res)
      
      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(2)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({error: 'oh no' })
      
    })

    it('should return 404 status with error stating "Wishlists not found." when the error has no message"', async () => {
        const req = { params: { user_id: '1'}}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
         
       jest.spyOn(Wishlist, 'findByUserId').mockRejectedValue(new Error())
 
       await wishlistController.show(mockReq, mockRes)
       
       expect(Wishlist.findByUserId).toHaveBeenCalledTimes(1)
       expect(mockStatus).toHaveBeenCalledWith(404)
       expect(mockJson).toHaveBeenCalledWith({ error: "Wishlists not found." })
 
       await wishlistController.show(req, res)
       
       expect(Wishlist.findByUserId).toHaveBeenCalledTimes(2)
       expect(res.status).toHaveBeenCalledWith(404)
       expect(res.json).toHaveBeenCalledWith({error: "Wishlists not found." })
       
     })
  })

  describe ('create', () => {
    it('should return a new wishlist with a 201 status code', async () => {
      const req = {body: { user_id:1, book_id:3, radius:9.5}}
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
      let testWishlist = {user_id: 1, book_id: 3, radius: 9.5 }
      const mockReq = { body: testWishlist }
      const wishlist_id = 1

      jest.spyOn(Wishlist, 'create').mockResolvedValue(new Wishlist(testWishlist.user_id, testWishlist.book_id, testWishlist.radius, wishlist_id))

      await wishlistController.create(mockReq, mockRes)
      
      expect(Wishlist.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(new Wishlist(testWishlist.user_id, testWishlist.book_id, testWishlist.radius, wishlist_id))

      
      await wishlistController.create(req, res)
      
      expect(Wishlist.create).toHaveBeenCalledTimes(2)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(new Wishlist(testWishlist.user_id, testWishlist.book_id, testWishlist.radius, wishlist_id))
   
   
   
   
    })


    it('should return status 400 when if wishlist is not able to be created with with error stating "oh no". ', async () => {
      let testWishlist = {book_id: 3, radius: 9.5 }
      const mockReq = { body: testWishlist }
      const req = {body: {book_id:3, radius:9.5}}
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}

      jest.spyOn(Wishlist, 'create').mockRejectedValue(new Error('oh no'))

      await wishlistController.create(mockReq, mockRes)
      
      expect(Wishlist.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no'})
      


      await wishlistController.create(req, res)
      
      expect(Wishlist.create).toHaveBeenCalledTimes(2)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'oh no'})
      
    })
    it('should return status 400 when if wishlist is not able to be created and return "An unknown error occurred" when no message from error object. ', async () => {
        let testWishlist = {book_id: 3, radius: 9.5 }
        const mockReq = { body: testWishlist }
        const req = {body: {book_id:3, radius:9.5}}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
  
        jest.spyOn(Wishlist, 'create').mockRejectedValue(new Error())
  
        await wishlistController.create(mockReq, mockRes)
        
        expect(Wishlist.create).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(400)
        expect(mockJson).toHaveBeenCalledWith({ error: "An unknown error occurred"})
        
  
  
        await wishlistController.create(req, res)
        
        expect(Wishlist.create).toHaveBeenCalledTimes(2)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error:  "An unknown error occurred"})
        
      })
  })





  describe ('destroy', () => {
    it('should return a 204 status when wishlist has been deleted', async () => {
      const req = { params: { wishlist_id: '1'}}
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
      const testWishlist = {wishlist_id:1, user_id: 1, book_id: 4, radius: 2.5 };
      const mockReq = { params: { wishlist_id: '1' } };

      jest.spyOn(Wishlist, 'findByWishlistId').mockResolvedValue(new Wishlist(testWishlist));
      jest.spyOn(Wishlist.prototype, 'destroy').mockResolvedValue();

      await wishlistController.destroy(mockReq, mockRes);

      expect(Wishlist.findByWishlistId).toHaveBeenCalledWith(1);
      expect(Wishlist.prototype.destroy).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
     

      await wishlistController.destroy(req, res);

      expect(Wishlist.findByWishlistId).toHaveBeenCalledWith(1);
      expect(Wishlist.prototype.destroy).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(204)

    });

    it('should return 404 status code when wishlist is not found and return message in error object.', async () => {
      const req = { params: { wishlist_id: '49'}}
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
      const mockReq = { params: { wishlist_id: '49' } };


      jest.spyOn(Wishlist, 'findByWishlistId').mockRejectedValue(new Error('Error'));

      await wishlistController.destroy(mockReq, mockRes);

      expect(Wishlist.findByWishlistId).toHaveBeenCalledWith(49);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Error' });


      await wishlistController.destroy(req, res);

      expect(Wishlist.findByWishlistId).toHaveBeenCalledWith(49);
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: "Error" })
      
    });

    it('should return 404 status code when wishlist is not found and return message "Wishlist not found" when error has no message.', async () => {
        const mockReq = { params: {wishlist_id: '49'} }

        const req = {params: {wishlist_id: '49'}}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn()}
  
        jest.spyOn(Wishlist, 'findByWishlistId').mockRejectedValue(new Error())
  
        await wishlistController.destroy(mockReq, mockRes)
        //expect(Wishlist.prototype.destroy).toHaveBeenCalledTimes(1);
        expect(Wishlist.findByWishlistId).toHaveBeenCalledWith(49);
        expect(mockStatus).toHaveBeenCalledWith(404)
        expect(mockJson).toHaveBeenCalledWith({ error: "Wishlist not found" })
        
  
  
        await wishlistController.destroy(req, res)
        
        //expect(Wishlist.prototype.destroy).toHaveBeenCalledTimes(2)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error:  "Wishlist not found" })
        
      })
  })
})