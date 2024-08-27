const axios = require("axios");

const Collection = require("../models/Collection");
const Book = require("../models/Book");

const booksExternalApi = `https://www.googleapis.com/books/v1/`;

const create = async (req, res) => {
  const { isbn, condition, delivery_preference } = req.body;

  try {
    let book = await Book.findByISBN(isbn);

    let newCollection;

    if (book) {
      newCollection = await Collection.create({
        book_id: book.book_id,
        condition,
        delivery_preference,
      });
    } else {
      const externalBook = axios(`${booksExternalApi}volumes?q=isbn:${isbn}`); //Fetch from external
      const newBook = await Book.create({
        title: externalBook.items[0].volumeInfo.title,
        authors: externalBook.items[0].volumeInfo.authors,
        categories: externalBook.items[0].volumeInfo.categories,
        lang: externalBook.items[0].volumeInfo.language,
        isbn: isbn,
        image: externalBook.items[0].volumeInfo.imageLinks.thumbnail,
      });
      newCollection = await Collection.create({
        book_id: newBook.book_id,
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
    const formattedTitle = title.replaceAll("+", " ");

    const searchResults = await Collection.findTitleInsideRadius({
      radius,
      lat,
      lng,
      formattedTitle,
    });

    res.status(200).json(searchResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const searchByUser = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const results = await Collection.showByUserId(user_id);

    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

module.exports = { create, searchProximity, destroy, searchByUser };
