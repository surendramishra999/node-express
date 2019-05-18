// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');

const database = require('./../../database/mysql');

function bookController(nav) {
  let connection;
  let books = [];
  let book = {};
  function getIndex(req, res) {
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
  }
  function getId(req, res, next) {
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
  }

  function renderById(req, res) {
    res.render('bookView', {
      title: book.title,
      nav,
      book: req.book,
    });
  }

  function middleWare(req, res, next) {
    if (_.get(req, 'user.username')) {
      next();
    } else {
      req.flash('notify', 'You are not logged In.');
      res.redirect('/');
    }
  }

  return {
    getIndex,
    getId,
    renderById,
    middleWare,
  };
}

module.exports = bookController;
