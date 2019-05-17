const express = require('express');
const _ = require('lodash');
const database = require('./../../database/mysql');

const bookRouter = express.Router();
let connection;
let books = [];
let book = {};

function router(nav) {
  bookRouter.use((req, res, next) => {
    if (_.get(req, 'user.username')) {
      next();
    } else {
      req.flash('notify', 'You are not logged In.');
      res.redirect('/');
    }
  });
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

  bookRouter
    .route('/:id')
    .all((req, res, next) => {
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
          }
          req.book = book;
          next();
          return book;
        })
        .catch(error => {
          if (connection && connection.end) connection.end();
          /* eslint-disable no-console */
          console.info(error);
          req.book = book;
          next();
        });
    })
    .get((req, res) => {
      res.render('bookView', {
        title: book.title,
        nav,
        book: req.book,
      });
    });
  return bookRouter;
}

module.exports = router;
