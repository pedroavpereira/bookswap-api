const Book = require('../../../models/Book')
const db = require('../../../db/connect')

describe('Book', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe ('findByISBN', () => {
    it('resolves with a book that has ISBN that we were searching for', async () => {
      // Arrange
      const testBook = 
        { book_id: 1, title: 'Tulip', authors: ['Aaa', 'Bbb'], categories: ['Fiction', 'Adventure'], lang: 'Eng', isbn: 7788885444062, image:'5huejjwqif.png' }
    
      
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [testBook] });

      // Act
      const result = await Book.findByISBN(7788885444062);

      // Assert
      expect(db.query).toHaveBeenCalledTimes(1)
      expect(result).toBeInstanceOf(Book);
      expect(result.title).toBe('Tulip');
      expect(result.authors).toStrictEqual(['Aaa', 'Bbb']);
      expect(result.categories).toStrictEqual( ['Fiction', 'Adventure']);
      expect(result.lang).toBe('Eng');
      expect(result.isbn).toBe(7788885444062);
      expect(result.image).toBe('5huejjwqif.png');
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM books WHERE isbn=$1;", [7788885444062]);
    });

    it('should return null when no Book are found with a certain ISBN', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      const book_result = await Book.findByISBN(1000800004062)
      
      expect(db.query).toHaveBeenCalledTimes(1)
      expect(book_result).toBeNull()
    });
  })
  describe ('findById', () => {
    it('resolves with a book that has certain book_id', async () => {
      // Arrange
      const testBook = 
        { book_id: 1, title: 'Beautiful Sun', authors: ['Mccc', 'Bddd'], categories: ['Mystery', 'Fiction'], lang: 'Eng', isbn: 9687225434113, image:'gsbdjvieufanmgfkorf.png' }
    
      
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [testBook] });

      // Act
      const result = await Book.findById(1);

      // Assert
      expect(db.query).toHaveBeenCalledTimes(1)
      expect(result).toBeInstanceOf(Book);
      expect(result.title).toBe('Beautiful Sun');
      expect(result.authors).toStrictEqual(['Mccc', 'Bddd']);
      expect(result.categories).toStrictEqual(  ['Mystery', 'Fiction']);
      expect(result.lang).toBe('Eng');
      expect(result.isbn).toBe(9687225434113);
      expect(result.image).toBe('gsbdjvieufanmgfkorf.png');
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM books WHERE book_id = $1;", [
      1
    ]);
    });

    it('should return null when no Book are found with a certain book_id', async () => {
      // Arrange
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

      // Act & Assert
      const book_result = await Book.findById(5)
      
      expect(db.query).toHaveBeenCalledTimes(1)
      expect(book_result).toBe(null)
      expect(book_result).not.toBeInstanceOf(Book)
      
    });
  })
  describe ('create', () => {
    it('resolves with a book on successful creation', async () => {
      // Arrange
      const testBookData = 
        {title: 'Beautiful Sea', authors: ['Ccc', 'Ddd'], categories: ['History', 'Fiction'], lang: 'Eng', isbn: 9977500111028, image:'hhjiedadwvdxf.png' }
    
      
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [testBookData] });

      // Act
      const result = await Book.create(testBookData);

      // Assert
      expect(db.query).toHaveBeenCalledTimes(1)
      expect(result).toBeInstanceOf(Book);
      expect(result.title).toBe('Beautiful Sea');
      expect(result.authors).toStrictEqual(['Ccc', 'Ddd']);
      expect(result.categories).toStrictEqual(['History', 'Fiction']);
      expect(result.lang).toBe('Eng');
      expect(result.isbn).toBe(9977500111028);
      expect(result.image).toBe('hhjiedadwvdxf.png');
      expect(db.query).toHaveBeenCalledWith("INSERT INTO books (title, authors, categories, lang, isbn, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [testBookData.title, testBookData.authors, testBookData.categories, testBookData.lang, testBookData.isbn, testBookData.image]);
    });

    // it('should return an error when title is missing', async () => {
    //   // Arrange
      
    //   const noTitleBook = {authors: ['Eee', 'Fff'], categories: ['Adventure', 'Fiction'], lang: 'Eng', isbn: '11-998-88776-02-9', image:'fsdfnfvicujqklae.png' }

    //   // Act & Assert
    //   const book_result = await Book.create(noTitleBook)
      
    //   expect(db.query).toHaveBeenCalledTimes(1)
    // });
  })

  
})