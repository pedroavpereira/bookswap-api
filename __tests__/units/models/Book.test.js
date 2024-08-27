const Book = require('../../../models/Book')
const db = require('../../../db/connect')

describe('Book', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('findByISBN', () => {
        it('shows the details of a book with ISBN number', async () => {

            const testBook = {book_id: 5, title: 'Tulip', authors: ['Aa Be', 'Se Hn'], categories: ['Fiction', 'History'], lang: 'Eng', isbn: '887-45-33211-07-9', image: 'dgaujn_vwnaidjb_fsndjbfv_vsnnchsbkf.png'};
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [testBook] });

            //Act

            const result = await Book.findByISBN('887-45-33211-07-9')

            expect(result).toBeInstanceOf(Book);
            expect(result.title).toBe('Tulip');
            expect(result.authors).toBe( ['Aa Be', 'Se Hn']);
            expect(result.categories).toBe(['Fiction', 'History']);
            expect(result.lang).toBe('Eng');
            expect(result.isbn).toBe('887-45-33211-07-9');
            expect(result.image).toBe('dgaujn_vwnaidjb_fsndjbfv_vsnnchsbkf.png');
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM books WHERE isbn=$1;", [
        '887-45-33211-07-9']);


        });

        it('should return null when book not found with ISBN is nor found or Database returns more than one books with the ISBN', 
            async () =>{
                //Arrange
                jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [] });

                // Act & Assert
                await expect(Book.findByISBN('000-00-00000-00-0').rejects.toBeNull()) 
            });
    })

    describe('create', () => {
        it('returns Book object containing details of book created', async () => {
            // Arrange
            const bookData = {title: 'Beautiful Sea', authors: ['Create test', ' bbbb'], categories: ['Adventure', 'Fiction'], lang: 'Eng', isbn: '777-31-88221-01-8', image: 'aaaaaabbbbbbbccccccdddd.png'};
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{...bookData, book_id: 1}] });

            //Act

            const result = await Book.create(bookData)

            expect(result).toBeInstanceOf(Book);
            expect(result).toHaveProperty('book_id', 1);
            expect(result).toHaveProperty('title', 'Beautiful Sea');
            expect(result).toHaveProperty('authors', ['Create test', ' bbbb']);
            expect(result).toHaveProperty('categories', ['Adventure', 'Fiction']);
            expect(result).toHaveProperty('lang', 'Eng');
            expect(result).toHaveProperty('isbn', '777-31-88221-01-8');
            expect(result).toHaveProperty('image', 'aaaaaabbbbbbbccccccdddd.png');
            expect(db.query).toHaveBeenCalledWith("INSERT INTO books (title, authors, categories, lang, isbn, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
                [title, authors, categories, lang, isbn, image]);


        });

        it('should throw an error when title is missing.', 
            async () =>{
                //Arrange
                const noTitleBook = { authors: ['Error', ' Error'], categories: ['Non Fiction', 'History'], lang: 'Eng', isbn: '888-99-77777-06-9', image: 'zzzzyyyy.png'};
                jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [] });

                // Act & Assert
                await expect(Book.create(noTitleBook).rejects.toThrow(TypeError));
            });
    })
})