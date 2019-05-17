const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const flash = require('express-flash-messages');
const engine = require('ejs-mate');
const logger = require('./logger');

const nav = [
  { title: 'Books', link: '/books' },
  { title: 'Authors', link: '/authors' },
];

const app = express();

const PORT = process.env.PORT || 3000;

app.use(flash());
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

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

require('./src/config/passport.js')(app);

const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);

const adminRouter = require('./src/routes/adminRoutes')(nav);

app.use('/admin', adminRouter);

const authorRouter = require('./src/routes/authorRoutes')(nav);

app.use('/authors', authorRouter);

const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  logger.debug(chalk.yellow('Debug statement'));
  logger.info(chalk.blue('Info statement'));
  // res.sendFile(path.join(__dirname, 'views/index.html'));
  if (req.user) {
    res.render('profile', {
      title: 'Library',
      nav,
      user: req.user,
    });
  } else {
    res.render('index', {
      title: 'Library',
      nav,
    });
  }
});

app.use((req, res) => {
  logger.error(chalk.red('404 page requested'));
  res.status(404).send('This page does not exist!');
});

app.listen(PORT, () => {
  debug('In dev Mode');
  logger.info(chalk.green(`Hi!  Example app listening on port ${PORT}`));
});
