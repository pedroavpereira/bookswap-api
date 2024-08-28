const { default: axios } = require("axios");
const collectionsController = require("../../../controllers/collections");
const Book = require("../../../models/Book");
const Collection = require("../../../models/Collection");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}));

const mockRes = { status: mockStatus };

describe("Collections controller", () => {
  describe("searchByUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Responds with a code 200 and returns the results", async () => {
      const mockCollections = [
        {
          book_id: 1,
          user_id: 1,
          condition: "mint",
          delivery_preference: ["hand-off", "delivery"],
        },
        {
          book_id: 2,
          user_id: 1,
          condition: "mint",
          delivery_preference: ["hand-off", "delivery"],
        },
      ].map((col) => new Collection(col));

      const mockReq = { params: { user_id: 1 } };

      jest
        .spyOn(Collection, "showByUserId")
        .mockResolvedValueOnce(mockCollections);

      await collectionsController.searchByUser(mockReq, mockRes);

      expect(Collection.showByUserId).toHaveBeenCalledTimes(1);
      expect(Collection.showByUserId).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(mockCollections);
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("Responds with a code 500 when Model rejects", async () => {
      const mockError = new Error("Error message");
      const mockReq = { params: { user_id: 1 } };

      jest.spyOn(Collection, "showByUserId").mockRejectedValueOnce(mockError);

      await collectionsController.searchByUser(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith({ error: mockError });
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("searchProximity", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Responds with code 200 and the found instances", async () => {
      const mockCollections = [
        {
          book_id: 1,
          user_id: 1,
          condition: "mint",
          delivery_preference: ["hand-off", "delivery"],
        },
        {
          book_id: 2,
          user_id: 1,
          condition: "mint",
          delivery_preference: ["hand-off", "delivery"],
        },
      ].map((col) => new Collection(col));

      const mockReq = {
        query: { radius: 5, lat: 10, lng: 10, title: "testing+title" },
      };

      jest
        .spyOn(Collection, "findTitleInsideRadius")
        .mockResolvedValueOnce(mockCollections);

      await collectionsController.searchProximity(mockReq, mockRes);

      expect(Collection.findTitleInsideRadius).toHaveBeenCalledTimes(1);
      expect(Collection.findTitleInsideRadius).toHaveBeenCalledWith({
        radius: 5,
        lat: 10,
        lng: 10,
        title: "testing title",
      });
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(mockCollections);
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("Responds with a code 500 when Model rejects", async () => {
      const mockError = new Error("Error message");

      const mockReq = {
        query: { radius: 5, lat: 10, lng: 10, title: "testing+title" },
      };

      jest
        .spyOn(Collection, "findTitleInsideRadius")
        .mockRejectedValueOnce(mockError);

      await collectionsController.searchProximity(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith({ error: mockError });
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("destroy", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Responds with 204 when delete is successfull", async () => {
      const mockReq = { params: { id: 1 } };
      const mockCollections = {
        collection_id: 1,
        book_id: 1,
        user_id: 1,
        condition: "mint",
        delivery_preference: ["hand-off", "delivery"],
      };

      jest
        .spyOn(Collection, "findById")
        .mockResolvedValueOnce(new Collection(mockCollections));

      jest
        .spyOn(Collection.prototype, "destroy")
        .mockResolvedValueOnce(mockCollections);

      await collectionsController.destroy(mockReq, mockRes);

      expect(Collection.findById).toHaveBeenCalledTimes(1);
      expect(Collection.findById).toHaveBeenCalledWith(1);
      expect(Collection.prototype.destroy).toHaveBeenCalledTimes(1);
      expect(mockEnd).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
    });

    it("Responds with 204 when delete is successfull", async () => {
      const mockReq = { params: { id: 1 } };

      const mockError = new Error("Mocked Error");
      jest.spyOn(Collection, "findById").mockRejectedValueOnce(mockError);

      await collectionsController.destroy(mockReq, mockRes);

      expect(Collection.findById).toHaveBeenCalledTimes(1);
      expect(Collection.findById).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith({ error: mockError });
    });
  });

  describe("create", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Returns 201 with the new collection when book exists", async () => {
      const mockReq = {
        body: {
          isbn: 9780008669461,
          condition: "mint",
          delivery_preference: ["hand-off"],
        },
        user: { user_id: 1 },
      };

      const mockBook = {
        book_id: 1,
        title: "Lord of the rings",
        authors: ["Author1", "Author2"],
        categories: ["Cat1", "Cat2"],
        lang: "en",
        isbn: 9780008669461,
        image: "image",
      };

      const mockCollection = {
        collection_id: 1,
        book_id: 1,
        user_id: 1,
        condition: "mint",
        delivery_preference: ["hand-off", "delivery"],
      };

      jest.spyOn(Book, "findByISBN").mockResolvedValueOnce(new Book(mockBook));
      jest
        .spyOn(Collection, "create")
        .mockResolvedValueOnce(new Collection(mockCollection));

      await collectionsController.create(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(new Collection(mockCollection));
    });

    it("Returns 201 with the new collection after creating the new book", async () => {
      const mockReq = {
        body: {
          isbn: 9780008669461,
          condition: "mint",
          delivery_preference: ["hand-off"],
        },
        user: { user_id: 1 },
      };
      const mockAxios = {
        data: {
          totalItems: 1,
          items: [
            {
              volumeInfo: {
                title: "Lord of the rings",
                authors: ["Author1", "Author2"],
                categories: ["Cat1", "Cat2"],
                language: "en",
                imageLinks: { thumbnail: "image" },
              },
            },
          ],
        },
      };

      const mockBook = {
        book_id: 1,
        title: "Lord of the rings",
        authors: ["Author1", "Author2"],
        categories: ["Cat1", "Cat2"],
        lang: "en",
        isbn: 9780008669461,
        image: "image",
      };

      const mockCollection = {
        collection_id: 1,
        book_id: 1,
        user_id: 1,
        condition: "mint",
        delivery_preference: ["hand-off", "delivery"],
      };

      jest.spyOn(Book, "findByISBN").mockResolvedValueOnce(null);
      jest.spyOn(Book, "create").mockResolvedValueOnce(new Book(mockBook));
      jest.spyOn(axios, "get").mockResolvedValueOnce(mockAxios);
      jest
        .spyOn(Collection, "create")
        .mockResolvedValueOnce(new Collection(mockCollection));

      await collectionsController.create(mockReq, mockRes);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(Book.create).toHaveBeenCalledTimes(1);
      expect(Book.create).toHaveBeenCalledWith({
        title: "Lord of the rings",
        authors: ["Author1", "Author2"],
        categories: ["Cat1", "Cat2"],
        lang: "en",
        isbn: 9780008669461,
        image: "image",
      });
      expect(Collection.create).toHaveBeenCalledTimes(1);
      expect(Collection.create).toHaveBeenCalledWith({
        book_id: 1,
        user_id: 1,
        condition: "mint",
        delivery_preference: ["hand-off"],
      });
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(new Collection(mockCollection));
    });

    it("Returns 500 if any model rejects", async () => {
      const mockReq = {
        body: {
          isbn: 9780008669461,
          condition: "mint",
          delivery_preference: ["hand-off"],
        },
        user: { user_id: 1 },
      };

      const mockError = new Error("mock Error");

      jest.spyOn(Book, "findByISBN").mockRejectedValueOnce(mockError);

      await collectionsController.create(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith({ error: "mock Error" });
    });

    it("Returns 500 if external API fails to find find ISBN", async () => {
      const mockReq = {
        body: {
          isbn: 9780008669461,
          condition: "mint",
          delivery_preference: ["hand-off"],
        },
        user: { user_id: 1 },
      };
      const mockAxios = {
        data: {
          totalItems: 0,
        },
      };

      jest.spyOn(Book, "findByISBN").mockResolvedValueOnce(null);
      jest.spyOn(axios, "get").mockResolvedValueOnce(mockAxios);

      await collectionsController.create(mockReq, mockRes);

      expect(axios.get).toHaveBeenCalledTimes(1);

      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith({
        error: "ISBN provided is incorrect",
      });
    });
  });
});
