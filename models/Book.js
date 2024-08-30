const db = require("../db/connect.js");

class Book {
  constructor(book_object) {
    this.book_id = book_object.book_id;
    this.title = book_object.title;
    this.authors = book_object.authors;
    this.categories = book_object.categories;
    this.lang = book_object.lang;
    this.isbn = book_object.isbn;
    this.image = book_object.image;
  }

  static async findByISBN(ISBN) {
    const response = await db.query("SELECT * FROM books WHERE isbn=$1;", [
      ISBN,
    ]);
    if (response.rows.length != 1) {
      return null;
    }

    return new Book(response.rows[0]);
  }

  static async findById(id) {
    const response = await db.query("SELECT * FROM books WHERE book_id = $1;", [
      id,
    ]);
    if (response.rows.length != 1) {
      return null;
    }

    return new Book(response.rows[0]);
  }

  static async create({ title, authors, categories, lang, isbn, image }) {
    let response = await db.query(
      "INSERT INTO books (title, authors, categories, lang, isbn, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [title, authors, categories, lang, isbn, image]
    );
    return new Book(response.rows[0]);
  }
}

module.exports = Book;
