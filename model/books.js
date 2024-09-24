const books = [
    { isbn: 1, title: 'Book1', author: 'Author1', reviews: [{ reviewId: 1, reviewBody: 'review1', userId: 1}, { reviewId: 2, reviewBody: 'review2', userId: 2}, { reviewId: 3, reviewBody: 'review3', userId: 2}] },
    { isbn: 2, title: 'Book2', author: 'Author2', reviews: [] },
    { isbn: 3, title: 'Book3', author: 'Author1', reviews: [] },
    { isbn: 4, title: 'Book4', author: 'Author2', reviews: [] },
    { isbn: 5, title: 'Book5', author: 'Author1', reviews: [] },
    { isbn: 6, title: 'Book6', author: 'Author3', reviews: [] },
    { isbn: 7, title: 'Book7', author: 'Author3', reviews: [] },
    { isbn: 8, title: 'Book8', author: 'Author1', reviews: [] },
    { isbn: 9, title: 'Book9', author: 'Author1', reviews: [] },
    { isbn: 10, title: 'Book10', author: 'Author4', reviews: [] },
    { isbn: 11, title: 'Book11', author: 'Author2', reviews: [] },
    { isbn: 12, title: 'Book12', author: 'Author4', reviews: [] },
    { isbn: 13, title: 'Book13', author: 'Author4', reviews: [] },
    { isbn: 14, title: 'Book14', author: 'Author3', reviews: [] },
    { isbn: 15, title: 'Book15', author: 'Author3', reviews: [] },
]; 

const booksLength = books.length;

module.exports = { books, booksLength };