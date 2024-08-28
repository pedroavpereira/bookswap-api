const axios = require("axios");

const Collection = require("../models/Collection");
const Book = require("../models/Book");
const User = require("../models/User");

const booksExternalApi = `https://www.googleapis.com/books/v1/`;

const mockUser = 1;

const create = async (req, res) => {
  const { condition, delivery_preference } = req.body;
  const isbn = parseInt(req.body.isbn);
  try {
    let book = await Book.findByISBN(isbn);

    let newCollection;

    if (book) {
      newCollection = await Collection.create({
        book_id: book.book_id,
        condition,
        user_id: mockUser, // CHANGE TO REAL USER
        delivery_preference,
      });
    } else {
      const externalBook = await axios.get(
        `${booksExternalApi}volumes?q=isbn:${isbn}`
      ); //Fetch from external
      if (externalBook.data.totalItems === 0)
        throw new Error("ISBN provided is incorrect");

      bookData = externalBook.data.items[0];

      const newBook = await Book.create({
        title: bookData.volumeInfo.title,
        authors: bookData.volumeInfo.authors,
        categories: bookData.volumeInfo.categories,
        lang: bookData.volumeInfo.language,
        isbn: isbn,
        image: bookData.volumeInfo.imageLinks.thumbnail,
      });
      newCollection = await Collection.create({
        book_id: newBook.book_id,
        user_id: mockUser, // CHANGE TO REAL USER
        condition,
        delivery_preference,
      });
    }

    res.status(201).json(newCollection);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const collection_id = req.params.id;

    const collection = await Collection.findById(collection_id);
    await collection.destroy();

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const searchProximity = async (req, res) => {
  try {
    const { radius, lat, lng, title } = req.query;
    const formattedTitle = title.replaceAll("%20", " ").toLowerCase();
    console.log(radius, lat, lng, formattedTitle);
    const collection = await Collection.findTitleInsideRadius({
      radius,
      lat,
      lng,
      title: formattedTitle,
    });

    const searchResults = await Promise.all(
      collection.map(async (col) => {
        const book = await Book.findById(col.book_id);
        const user = await User.findById(col.user_id);
        return { ...col, book, user };
      })
    );

    // console.log(searchResults);

    const filteredResults = searchResults.filter(
      (col) => col.book.title.toLowerCase() === formattedTitle
    );
    console.log(filteredResults);

    res.status(200).json(filteredResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const searchByUser = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const collection = await Collection.showByUserId(user_id);

    // console.log(collections);

    const results = await Promise.all(
      collection.map(async (col) => {
        const book = await Book.findById(col.book_id);

        console.log(book);

        return { ...col, book };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

module.exports = { create, searchProximity, destroy, searchByUser };
