const express = require('express');
const port = process.env.PORT1 || 5000;
const { books, booksLength } = require('./model/books'); // Import the books array from books.js ...
const { users, usersLength } = require('./model/users'); // Import the users array from users.js ...
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const authenticateToken = require('./auth/authenticateToken');
require('dotenv').config();

const app = express(); 

app.use(express.json());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Registration Of A User ...
app.post('/register', async function(req, res) {
    try {
        const { username, password } = req.body;
        // Check if the user already exists
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(409).send('User Already Exists!');
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user object
        const newUser = { id: users.length + 1, username: username, password: hashedPassword };
        // Save the user (in this case, pushing to the in-memory array, but you'd use a DB here)
        users.push(newUser);
        // Generate a JWT token for the new user
        const token = jwt.sign({ username }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });
        // Respond with success message, user data, and token
        res.json({ message: 'User registered', data: newUser, token });

    } catch (error) {
        // Catch and handle any errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Login Of The User ...
app.post('/login', async function(req, res) {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // Compare the password with the hashed password in the database
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ message: 'Invalid Credentials' });
        // }
        const isPasswordValid = users.find(p => p.password === password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        // Hashing the password ...
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate a JWT token ...
        const token = jwt.sign({ username }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

        // Respond with success message and token, but exclude password from response
        res.json({
            message: 'Login successful',
            data: { id: user.id, username: user.username, password: hashedPassword}, // Exclude sensitive data
            token
        });

    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get All Books ...
app.get('/books', function(req, res){
    console.log(req.params);
    res.status(200).json(books); // Send all books as a JSON response ...
});

// Get A Single Book ...
app.get('/books/isbn/:isbn', function(req, res){
    const id = parseInt(req.params.isbn);
    console.log(id);
    const book = books.find(book => book.isbn == id);
    console.log(book);
    // Check whether the book is existing or not ...
    if(!book){
        res.status(404).send('Book not found'); // Send not found ...
    } else {
        res.status(200).json(book); // Send the book as a JSON response ...
    }
});

// Get Book From It's Title ...
app.get('/books/title/:title', function(req, res){
    const title = req.params.title.trim().toLowerCase();
    console.log('Title from request:', title);  // Log the title

    // Log all book titles to check the dataset
    console.log('Available books:', books.map(b => b.title));

    const book = books.filter(book => book.title.toLowerCase() === title);
    console.log(book);
    // Check whether the book is existing or not ...
    if(!book){
        res.status(404).send('Book not found'); // Send not found ...
    } else {
        res.status(200).json(book); // Send the book as a JSON response ...
    }
});

// Get Book From It's Author ...
app.get('/books/author/:author', function(req, res){
    const author = req.params.author.trim().toLowerCase();
    console.log(author);
    const book = books.filter(book => book.author.toLowerCase() === author);
    console.log(book);
    // Check whether the book is existing or not ...
    if(!book){
        res.status(404).send('Book not found'); // Send not found ...
    } else {
        res.status(200).json(book); // Send the book as a JSON response ...
    }
});

// Get All Reviews For A Book ...
app.get('/books/reviews/:isbn', function(req, res) {
    const id = parseInt(req.params.isbn);
    const book = books.find(book => book.isbn == id);
    if (!book) {
        res.status(404).send('Book not found');
    } else {
        res.status(200).json(book.reviews); // Send book's reviews
    }
});

// Get All Reviews Related To A User ...
app.get('/books/reviews/user/:userId', function(req, res) {
    const userId = parseInt(req.params.userId, 10); // Convert userId to a number
    const user = users.find(user => user.id === userId);
    console.log("User:", user);
    if (!user) {
        res.status(404).send('User not found');
    } else {
        // Find all reviews related to the given user
        let userReviews = [];

        books.forEach(book => {
            const reviewsByUser = book.reviews.filter(review => review.userId === userId);
            if (reviewsByUser.length > 0) {
                userReviews = userReviews.concat(reviewsByUser);
            }
        });

        // If no reviews are found for the user
        if (userReviews.length === 0) {
            res.status(404).send('No reviews found for this user');
        } else {
            res.status(200).json(userReviews); // Send the user's reviews
        }
    }
});

// Add A New Book ...
app.post('/books/add', function(req, res){
    const book_title = req.body.title;
    const book_author = req.body.author;
    //console.log(booksLength);
    // check whether the book is already existing in the data set ...
    const result = books.find(book => book.title == book_title);
    console.log(result);
    if(result){
        res.status(400).send('Book already exists');
        //console.log('Cannot Add the book!');
    } else {
        // Check if either title or author is missing
        if (!book_title || !book_author) {
            res.status(400).send('Bad request: Title and Author are required');
            //console.log('Cannot Add the book!');
        } else {
            // Create a new book and push it to the books array
            const book = { isbn: booksLength + 1, title: book_title, author: book_author, reviews: [] };
            books.push(book);
            res.status(200).json({message: 'Book added successfully', data: book});  // Respond with the newly added book
        }
    }
});

// Add A New Review ...
app.post('/books/reviews/add', authenticateToken, function (req, res) {
    const reviewBody = req.body.reviewBody;
    const userId = parseInt(req.body.userId, 10); // Parse the userId to an integer ...
    const isbn = parseInt(req.body.isbn, 10); // Parse the ISBN to an integer ...

    const user = users.find(user => user.id === userId);
    console.log("User:", user);
    if (!user) {
        res.status(404).send('User not found');
    } else {
        // Find the book by its ISBN (ensure it's compared as a number)
        const book = books.find(book => book.isbn === isbn);
        console.log("Book:", book);        
        if (!book) {
            res.status(404).send('Book not found');
        } else {
            // Create the new review object
            const newReview = { "reviewId":book.reviews.length + 1, "reviewBody":reviewBody, "userId":userId };

            // Push the new review to the reviews array
            book.reviews.push(newReview);

            // Respond with the newly added review
            res.status(200).json({message: 'Review added successfully', data: newReview});
        }
    }
});

// Update A Book ...
app.put('/books/:isbn', function (req, res) {
    const id = parseInt(req.params.isbn);
    const book = books.find(book => book.isbn == id);
    if (!book) {
        res.status(404).send('Book not found');
    } else {
        if(!req.body.title && !req.body.author) {
            res.status(400).send('Bad request: Title and Author are required');
        } else {
            if(!req.body.author){
                book.title = req.body.title;
                res.status(200).json({message: 'Book added successfully', data: book});  // Respond with the updated book ...
            } else if(!req.body.title){
                book.author = req.body.author;
                res.status(200).json({message: 'Book added successfully', data: book});  // Respond with the updated book ...
            } else {
                book.title = req.body.title;
                book.author = req.body.author;
                res.status(200).json({message: 'Book added successfully', data: book});  // Respond with the updated book ...
            }
        }
    }
});

// Update A Review
app.put('/books/reviews/:isbn/:reviewId', authenticateToken, function (req, res) {
    const id = parseInt(req.params.isbn, 10); // Extracting ISBN
    const reviewId = parseInt(req.params.reviewId, 10); // Extracting Review ID

    // Find the book by its ISBN
    const book = books.find(book => book.isbn === id);
    
    if (!book) {
        // If the book is not found, send a 404 error
        res.status(404).send('Book Not Found!!');
    } else {
        // Find the review by its reviewId within the book's reviews array
        const review = book.reviews.find(r => r.reviewId === reviewId);
        
        if (!review) {
            // If the review is not found, send a 404 error
            res.status(404).send('Review Not Found!!');
        } else {
            // Update the review's content
            if (req.body.reviewBody) {
                review.reviewBody = req.body.reviewBody;
                res.status(200).json({message: 'Review modified successfully', data: review}); // Respond with the updated review
            } else {
                res.status(400).send('Bad request: Review body is required');
            }
        }
    }
});

// Delete A Book ...
app.delete('/books/:isbn', function(req, res) {
    const id = parseInt(req.params.isbn);
    const book = books.find(book => book.isbn == id);
    if (!book) {
        res.status(404).send('Book not found');
    } else {
        const index = books.indexOf(book);
        books.splice(index, 1);
        res.status(200).json('Book deleted successfully');
        res.status(200).json(book);
    }
}); 

// Delete A Review ...
app.delete('/books/reviews/:isbn/:reviewId', authenticateToken, function(req, res) {
    const id = req.params.isbn;
    const reviewId = req.params.reviewId;
    const book = books.find(book => book.isbn == id);
    if(!book){
        res.status(404).send('Book not found');
    } else {
        const review = book.reviews.find(r => r.reviewId == reviewId);
        if(!review) {
            res.status(404).send('Review not found');
        } else {
            const index = book.reviews.indexOf(review);
            book.reviews.splice(index, 1);
            res.status(200).json('Review deleted successfully');
            res.status(200).json(review);
        }
    }
});

// Running The App ...
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});

