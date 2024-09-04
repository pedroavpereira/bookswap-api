DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_reviews;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_rooms;
DROP TABLE IF EXISTS swaps;
DROP TABLE IF EXISTS book_collections;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS books_ratings;

CREATE TABLE users(
    user_id INT GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL, 
    password VARCHAR(100) UNIQUE NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE users_reviews(
    review_id INT GENERATED ALWAYS AS IDENTITY,
    rating INT NOT NULL,
    message TEXT,
    user_id INT, 
    submitted_by INT NOT NULL,
    PRIMARY KEY(review_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE books(
    book_id INT GENERATED ALWAYS AS IDENTITY,
    title TEXT,
    authors TEXT[],
    categories TEXT[], 
    lang VARCHAR(30),
    isbn BIGINT NOT NULL,
    image TEXT,
    PRIMARY KEY(book_id)
);

CREATE TABLE book_collections(
    collection_id INT GENERATED ALWAYS AS IDENTITY,
    book_id INT,
    user_id INT,
    condition TEXT,
    delivery_preference TEXT[], 
    PRIMARY KEY(collection_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE swaps(
    swap_id INT GENERATED ALWAYS AS IDENTITY,
    user_requesting INT,
    collection_requested INT,
    user_offered INT,
    collection_offered INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    completed BOOLEAN DEFAULT false,   
    PRIMARY KEY(swap_id),
    FOREIGN KEY (user_requesting) REFERENCES users(user_id),
    FOREIGN KEY (collection_requested) REFERENCES book_collections(collection_id),
    FOREIGN KEY (user_offered) REFERENCES users(user_id),
    FOREIGN KEY (collection_offered) REFERENCES book_collections(collection_id)
);

CREATE TABLE chat_rooms(
    room_id INT GENERATED ALWAYS AS IDENTITY,
    user_1 INT,
    user_2 INT,
    swap_id INT,     
    PRIMARY KEY(room_id),
    FOREIGN KEY (swap_id) REFERENCES swaps(swap_id),
    FOREIGN KEY (user_1) REFERENCES users(user_id),
    FOREIGN KEY (user_2) REFERENCES users(user_id)
);

CREATE TABLE messages(
    message_id INT GENERATED ALWAYS AS IDENTITY,
    room_id INT,
    user_sent INT,
    message TEXT, 
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (message_id),
    FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id),
    FOREIGN KEY (user_sent) REFERENCES users(user_id)

);



CREATE TABLE wishlists(
    wishlist_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    book_id INT,
    radius FLOAT,
    PRIMARY KEY(wishlist_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE books_ratings(
    ratings_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    book_id INT,
    rating INT,
    PRIMARY KEY(ratings_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);