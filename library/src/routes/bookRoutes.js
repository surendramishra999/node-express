const express = require('express');
const database = require('./../../database/mysql');

const bookRouter = express.Router();
let connection;
let books = [];
let book = {};

function router(nav) {
  bookRouter.route('/').get((req, res) => {
    database()
      .then(conn => {
        connection = conn;
        return connection.query('SELECT * FROM books');
      })
      .then(resultSet => {
        books = [];
        connection.end();
        if (resultSet) {
          resultSet.map(result => books.push({ ...result }));
        }
        res.render('bookListView', {
          title: 'All Books',
          nav,
          books,
        });
      })
      .catch(error => {
        if (connection && connection.end) connection.end();
        /* eslint-disable no-console */
        console.info(error);
        res.render('bookListView', {
          title: 'All Books',
          nav,
          books,
        });
      });
  });

  bookRouter.route('/:id').get((req, res) => {
    const { id } = req.params;
    database()
      .then(conn => {
        connection = conn;
        return connection.query(`SELECT * FROM books WHERE id=${id}`);
      })
      .then(resultSet => {
        connection.end();
        if (resultSet) {
          book = { ...resultSet[0] };
          res.render('bookView', {
            title: book.title,
            nav,
            book,
          });
        }
      })
      .catch(error => {
        if (connection && connection.end) connection.end();
        /* eslint-disable no-console */
        console.info(error);
        res.render('bookView', {
          title: book.title,
          nav,
          book,
        });
      });
  });
  return bookRouter;
}

module.exports = router;
