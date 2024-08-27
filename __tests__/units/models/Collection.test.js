const db = require("../../../db/connect");
const Collection = require("../../../models/Collection");

describe("Collection model", () => {
  describe("create", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Returns instance of Collection", async () => {
      const mockCollection = {
        book_id: 1,
        user_id: 1,
        condition: "mint",
        delivery_preference: ["hand-off", "delivery"],
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockCollection] });

      const newCollection = await Collection.create(mockCollection);

      expect(newCollection).toBeInstanceOf(Collection);
      expect(newCollection).toHaveProperty("book_id", 1);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO book_collections (book_id, user_id, condition, delivery_preference) VALUES ($1 , $2 , $3, $4) RETURNING *",
        [1, 1, "mint", ["hand-off", "delivery"]]
      );
    });
  });

  describe("findById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Returns instance of Collection when there is one", async () => {
      const mockCollection = {
        book_id: 1,
        user_id: 1,
        condition: "mint",
        delivery_preference: ["hand-off", "delivery"],
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockCollection] });

      const newCollection = await Collection.findById(1);

      expect(newCollection).toBeInstanceOf(Collection);
      expect(newCollection).toHaveProperty("book_id", 1);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM book_collections WHERE collection_id = $1",
        [1]
      );
    });

    it("Returns empty array when no collection is found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      const newCollection = await Collection.findById(1);

      expect(newCollection).toBeInstanceOf(Array);
    });
  });

  describe("showByUserId", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Returns An array of Collection instance", async () => {
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
      ];

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockCollections });

      const collections = await Collection.showByUserId(1);

      expect(collections).toBeInstanceOf(Array);
      expect(collections[0]).toBeInstanceOf(Collection);
      expect(collections[0]).toHaveProperty("book_id", 1);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM book_collections WHERE user_id = $1",
        [1]
      );
    });

    it("Returns empty Array when no collection is found", async () => {
      const mockCollections = [];

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockCollections });

      const collections = await Collection.showByUserId(1);

      expect(collections).toBeInstanceOf(Array);
      expect(collections).toHaveLength(0);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM book_collections WHERE user_id = $1",
        [1]
      );
    });
  });

  describe("destroy", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Return instance of the deleted", async () => {
      const mockCollection = {
        collection_id: 1,
        book_id: 1,
        user_id: 1,
        condition: "mint",
        delivery_preference: ["mockPreference"],
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [mockCollection] });

      const collection = new Collection(mockCollection);

      const deletedCollection = await collection.destroy();

      expect(deletedCollection).toBeInstanceOf(Collection);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM book_collections WHERE collection_id = $1 RETURNING *",
        [1]
      );
    });
  });

  describe("findTitleInsideRadius", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("returns array of instances of Collection", async () => {
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
      ];

      const mockArguments = { radius: 5, lat: 20, lng: 15, title: "test" };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockCollections });

      const collections = await Collection.findTitleInsideRadius(mockArguments);

      expect(collections).toBeInstanceOf(Array);
      expect(collections[0]).toBeInstanceOf(Collection);
      expect(collections[0]).toHaveProperty("book_id", 1);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("returns empty array", async () => {
      const mockCollections = [];

      const mockArguments = { radius: 5, lat: 20, lng: 15, title: "test" };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: mockCollections });

      const collections = await Collection.findTitleInsideRadius(mockArguments);

      expect(collections).toBeInstanceOf(Array);
      expect(collections).toHaveLength(0);
    });
  });
});
