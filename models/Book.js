
const db = require('../db/connect.js')

class Book{
    constructor(book_object){
        this.book_id = book_object.book_id
        this.title = book_object.title
        this.authors = book_object.authors
        this.categories = book_object.categories
        this.lang = book_object.lang
        this.isbn = book_object.isbn
        this.image = book_object.image
        
    }

    static async findByISBN(ISBN) {
        
        const response = await db.query("SELECT * FROM books WHERE isbn=$1;", [ISBN]);
        if (response.rows.length != 1){
            return null
        }

        return new Book(response.rows[0]);

    }
}