const express = require('express');

const bookRouter = express.Router();

function router(nav, books) {
  console.info(books);
  bookRouter.route('/').get((req, res) => {
    res.render('bookListView', {
      title: 'All Books',
      nav,
      books,
    });
  });

  bookRouter.route('/:id').get((req, res) => {
    const { id } = req.params;
    res.render('bookView', {
      title: books[id].title,
      nav,
      book: books[id],
    });
  });
  return bookRouter;
}

module.exports = router;
