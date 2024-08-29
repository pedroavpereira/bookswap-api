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

  afterAll(() => jest.resetAllMocks())

  describe ('show', () => {
    let testWishlist, mockReq;

    beforeEach(() => {
      testWishlist = {wishlist_id: 1, user_id: 1, book_id: 2, radius: 5.4 }
      mockReq = { params: { user_id: 1 } }
    });

    it('should return a wishlist with a 200 status code', async () => {
      jest.spyOn(Wishlist, 'findByUserId').mockResolvedValue([new Wishlist(testWishlist)])
      
      await wishlistController.show(mockReq, mockRes);
      
      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([new Wishlist(testWishlist)])
    })

    it('should return an error if the wishlist with certain user_id is not found', async () => {
      jest.spyOn(Wishlist, 'findByUserId').mockRejectedValue(new Error('oh no'))

      await wishlistController.show(mockReq, mockRes)
      
      expect(Wishlist.findByUserId).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(404)
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' })
    })
  })

//   describe ('create', () => {
//     it('should return a new goat with a 201 status code', async () => {
//       let testGoat = { name: 'Test Goat', age: 2 }
//       const mockReq = { body: testGoat }

//       jest.spyOn(Goat, 'create').mockResolvedValue(new Goat(testGoat))

//       await goatsController.create(mockReq, mockRes)
      
//       expect(Goat.create).toHaveBeenCalledTimes(1)
//       expect(mockStatus).toHaveBeenCalledWith(201)
//       expect(mockSend).toHaveBeenCalledWith({ data: new Goat({ ...testGoat }) })
//     })


//     it('should return an error if creation fails', async () => {
//       let testGoat = { name: 'Test Goat' }
//       const mockReq = { body: testGoat }

//       jest.spyOn(Goat, 'create').mockRejectedValue(new Error('oh no'))

//       await goatsController.create(mockReq, mockRes)
      
//       expect(Goat.create).toHaveBeenCalledTimes(1)
//       expect(mockStatus).toHaveBeenCalledWith(400)
//       expect(mockSend).toHaveBeenCalledWith({ error: 'oh no' })
//     })
//   })



//   describe ('destroy', () => {
//     it('should return a 204 status code on successful deletion', async () => {
//       const testGoat = { id: 1, name: 'Test Goat', age: 22 };
//       const mockReq = { params: { id: '1' } };

//       jest.spyOn(Goat, 'findById').mockResolvedValue(new Goat(testGoat));
//       jest.spyOn(Goat.prototype, 'destroy').mockResolvedValue();

//       await goatsController.destroy(mockReq, mockRes);

//       expect(Goat.findById).toHaveBeenCalledWith(1);
//       expect(Goat.prototype.destroy).toHaveBeenCalledTimes(1);
//       expect(mockStatus).toHaveBeenCalledWith(204);
//       expect(mockEnd).toHaveBeenCalled();
//     });

//     it('should return an error if the goat is not found', async () => {
//       const mockReq = { params: { id: '49' } };

//       jest.spyOn(Goat, 'findById').mockRejectedValue(new Error('Goat not found'));

//       await goatsController.destroy(mockReq, mockRes);

//       expect(Goat.findById).toHaveBeenCalledWith(49);
//       expect(mockStatus).toHaveBeenCalledWith(404);
//       expect(mockSend).toHaveBeenCalledWith({ error: 'Goat not found' });
//     });
//   })
})