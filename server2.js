const express = require('express');
const axios = require('axios');
const port = process.env.PORT2 || 6000;

const app = express();

// Set the base URL ...
const BOOKS_API_URL = 'http://localhost:5000/books';

// Get All Books ...
app.get('/books', async function(req, res) {
    try{
        const response = await axios.get(BOOKS_API_URL);
        console.log(response.data);
        res.status(200).json(response.data);
    } catch(error){
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    }
});

// Task 11: Search by ISBN – Using Promises ...
app.get('/books/isbn/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    axios.get(`${BOOKS_API_URL}/isbn/${isbn}`)
        .then(response => {
            if (response.data) {
                res.status(200).json(response.data);
            } else {
                res.status(404).send('Book not found');
            }
        })
        .catch(error => {
            console.error('Error fetching book by ISBN:', error);
            res.status(500).send('Error fetching book');
        });
});

// Search By Author ...
app.get('/books/author/:author', async function(req, res) {
    try{
        const author = req.params.author;
        const response = await axios.get(`${BOOKS_API_URL}/author/${author}`)
        if(!response.data) {
            res.status(404).json({message: 'Book not found'});
        } else {
            res.status(200).json({message: 'Book found', data: response.data});
        }
    } catch(error) {
        console.error('Error fetching book by title:', error);
        res.status(500).send('Error fetching book');
    }
});

// Search By Title ...
app.get('/books/title/:title', async function(req, res) {
    try{
        const title = req.params.title;
        const response = await axios.get(`${BOOKS_API_URL}/title/${title}`)
        if(!response.data) {
            res.status(404).json({message: 'Book not found'});
        } else {
            res.status(200).json({message: 'Book found', data: response.data});
        }
    } catch(error) {
        console.error('Error fetching book by title:', error);
        res.status(500).send('Error fetching book');
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`http://localhost:${port}`);
});