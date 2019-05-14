const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const engine = require('ejs-mate');
const logger = require('./logger');
const database = require('./database/mysql');

const nav = [
  { title: 'Books', link: '/books' },
  { title: 'Authors', link: '/authors' },
];

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  morgan('dev', {
    skip(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr,
  }),
);

app.use(
  morgan('dev', {
    skip(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  }),
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/css',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/jquery/dist')),
);

app.set('views', './src/views');

// app.set('view engine', 'pug');

app.engine('ejs', engine);
app.set('view engine', 'ejs');

const books = [];
let connection;
let bookRouter = require('./src/routes/bookRoutes')(nav, books);

database()
  .then(conn => {
    connection = conn;
    return connection.query('SELECT * FROM books');
  })
  .then(resultSet => {
    connection.end();

    if (resultSet) {
      // eslint-disable-next-line no-restricted-syntax
      for (const value of resultSet) {
        books.push({ ...value });
      }
    }
    console.info(books);
    bookRouter = require('./src/routes/bookRoutes')(nav, books);
    return bookRouter;
  })
  .catch(error => {
    if (connection && connection.end) connection.end();
    logger.debug(error);
  });

app.use('/books', bookRouter);

app.get('/', (req, res) => {
  logger.debug(chalk.yellow('Debug statement'));
  logger.info(chalk.blue('Info statement'));
  // res.sendFile(path.join(__dirname, 'views/index.html'));
  res.render('index', {
    title: 'MY Articles',
    nav,
    list: ['Math', 'Science', 'English', 'Hindi'],
    imagePath: [
      '/image/book.jpg',
      '/image/book.jpg',
      '/image/book.jpg',
      '/image/book.jpg',
    ],
  });
});

app.use((req, res) => {
  logger.error(chalk.red('404 page requested'));
  res.status(404).send('This page does not exist!');
});

app.listen(PORT, () => {
  debug('In dev Mode');
  logger.info(chalk.green(`Hi!  Example app listening on port ${PORT}`));
});
