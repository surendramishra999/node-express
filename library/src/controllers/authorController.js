// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:authorRoute');

function authorController(nav) {
  let authors = [];
  let author = {};
  function getIndex(req, res, next) {
    const url = 'mongodb://127.0.0.1:27017';
    const dbName = 'libraryApp';
    // eslint-disable-next-line wrap-iife
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('connected correctly');
        const db = client.db(dbName);
        const response = await db
          .collection('authors')
          .find()
          .toArray();
        authors = response;
        res.render('authorListView', {
          title: 'Authors',
          nav,
          authors,
        });
        next();
      } catch (err) {
        debug(err.stack);
        res.render('authorListView', {
          title: 'Authors',
          nav,
          authors,
        });
        next();
      }
    })();
  }
  function getById(req, res, next) {
    const { id } = req.params;
    const url = 'mongodb://127.0.0.1:27017';
    const dbName = 'libraryApp';
    // eslint-disable-next-line wrap-iife
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('connected correctly');
        const db = client.db(dbName);
        const response = await db
          .collection('authors')
          .findOne({ _id: new ObjectId(id) });
        debug(response);
        author = response;
        next();
      } catch (err) {
        debug(err.stack);
        next();
      }
    })();
  }
  function getMiddleware(req, res, next) {
    if (_.get(req, 'user.username')) {
      next();
    } else {
      req.flash('notify', 'You are not logged In.');
      res.redirect('/');
    }
  }

  function renderById(req, res) {
    res.render('authorView', {
      title: author.author,
      nav,
      author,
    });
  }
  return {
    getIndex,
    getById,
    getMiddleware,
    renderById,
  };
}

module.exports = authorController;
