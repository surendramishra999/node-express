/* eslint-disable object-curly-newline */
const express = require('express');
const bookController = require('../controllers/bookController');
const bookService = require('./../servies/goodreadsService');

const bookRouter = express.Router();
function router(nav) {
  const { getIndex, getId, renderById, middleWare } = bookController(
    bookService,
    nav,
  );
  bookRouter.use(middleWare);
  bookRouter.route('/').get(getIndex);

  bookRouter
    .route('/:id')
    .all(getId)
    .get(renderById);
  return bookRouter;
}

module.exports = router;
