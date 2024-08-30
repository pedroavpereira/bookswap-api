const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");
const axios = require("axios");

const booksExternalApi = `https://www.googleapis.com/books/v1/`;

async function create(req, res) {
  try {
    const radius = req.body.radius;
    const isbn = parseInt(req.body.isbn);
    const user_id = req.user_id;

    let book = await Book.findByISBN(isbn);

    let newWishlist;

    if (book) {
      newWishlist = await Wishlist.create({
        book_id: book.book_id,
        radius,
        user_id,
      });
    } else {
      const externalBook = await axios.get(
        `${booksExternalApi}volumes?q=isbn:${isbn}`
      ); //Fetch from external
      if (externalBook.data.totalItems === 0)
        throw new Error("ISBN provided is incorrect");

      bookData = externalBook.data.items[0];

      book = await Book.create({
        title: bookData.volumeInfo.title,
        authors: bookData.volumeInfo.authors,
        categories: bookData.volumeInfo.categories,
        lang: bookData.volumeInfo.language,
        isbn: isbn,
        image: bookData.volumeInfo.imageLinks.thumbnail,
      });
      newWishlist = await Wishlist.create({
        book_id: book.book_id,
        radius,
        user_id,
      });
    }

    res.status(201).json({ ...newWishlist, book });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(400).json({ error: err.message || "An unknown error occurred" });
  }
}

// show function:
async function show(req, res) {
  try {
    const userId = parseInt(req.params.user_id);
    const wishlists = await Wishlist.findByUserId(userId);

    const populatedResults = await Promise.all(
      wishlists.map(async (wish) => {
        const book = await Book.findById(wish.book_id);
        return { ...wish, book };
      })
    );
    res.status(200).json(populatedResults);
  } catch (err) {
    console.error("Error fetching wishlists:", err);
    res.status(404).json({ error: err.message || "Wishlists not found." });
  }
}

async function showMine(req, res) {
  try {
    const userId = req.user_id;
    const wishlists = await Wishlist.findByUserId(userId);

    const populatedResults = await Promise.all(
      wishlists.map(async (wish) => {
        const book = await Book.findById(wish.book_id);
        return { ...wish, book };
      })
    );

    res.status(200).json(populatedResults);
  } catch (err) {
    console.error("Error fetching wishlists:", err);
    res.status(404).json({ error: err.message || "Wishlists not found." });
  }
}

async function destroy(req, res) {
  try {
    const wishlistId = parseInt(req.params.wishlist_id);
    const wishlist = await Wishlist.findByWishlistId(wishlistId);
    await wishlist.destroy();
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting wishlist:", err);
    res.status(404).json({ error: err.message || "Wishlist not found" });
  }
}

module.exports = { create, show, destroy, showMine };
