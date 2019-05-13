const express = require('express');

const bookRouter = express.Router();

const books = [
  {
    title: 'War and Peace',
    genre: 'Historical Friction',
    author: 'John deo',
    read: false,
    img: '/image/book.jpg',
  },
  {
    title: 'War and Peace',
    genre: 'Historical Friction',
    author: 'John deo',
    read: false,
    img: '/image/book.jpg',
  },
  {
    title: 'War and Peace',
    genre: 'Historical Friction',
    author: 'John deo',
    read: false,
    img: '/image/book.jpg',
  },
  {
    title: 'War and Peace',
    genre: 'Historical Friction',
    author: 'John deo',
    read: false,
    img: '/image/book.jpg',
  },
  {
    title: 'War and Peace',
    genre: 'Historical Friction',
    author: 'John deo',
    read: false,
    img: '/image/book.jpg',
  },
  {
    title: 'War and Peace',
    genre: 'Historical Friction',
    author: 'John deo',
    read: false,
    img: '/image/book.jpg',
  },
  {
    title: 'War and Peace',
    genre: 'Historical Friction',
    author: 'John deo',
    read: false,
    img: '/image/book.jpg',
  },
];

function router(nav) {
  bookRouter.route('/').get((req, res) => {
    res.render('bookListView', {
      title: 'MY Articles',
      nav,
      books,
    });
  });

  bookRouter.route('/:id').get((req, res) => {
    const { id } = req.params;
    res.render('bookView', {
      title: 'MY Articles',
      nav,
      book: books[id],
    });
  });
  return bookRouter;
}

module.exports = router;
