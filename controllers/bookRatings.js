const BookRatings = require('../models/BookRatings');

async function create(req, res) {
    try {
        const data = req.body;
        const newBookRating = await BookRatings.create(data);
        res.status(201).json(newBookRating);
    } catch (err) {
        console.error("Error creating book rating:", err);
        res.status(400).json({ error: err.message || "An unknown error occurred." });
    }
}

async function show(req, res) {
    try {
        const bookId = parseInt(req.params.book_id);
        const bookRatings= await BookRatings.findByBookId(bookId);
        res.status(200).json(bookRatings);
    } catch (err) {
        console.error("Error fetching book ratings:", err);
        res.status(404).json({ error: err.message || "Book ratings not found." });
    }
}


module.exports = { create, show};