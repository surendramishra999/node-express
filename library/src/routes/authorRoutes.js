const express = require('express');
const _ = require('lodash');
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:authorRoute');

const authorRouter = express.Router();
let authors = [];
let author = {};

function router(nav) {
  authorRouter.use((req, res, next) => {
    if (_.get(req, 'user.username')) {
      next();
    } else {
      req.flash('notify', 'You are not logged In.');
      res.redirect('/');
    }
  });
  authorRouter.route('/').get((req, res, next) => {
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
  });

  authorRouter
    .route('/:id')
    .all((req, res, next) => {
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
    })
    .get((req, res) => {
      res.render('authorView', {
        title: author.author,
        nav,
        author,
      });
    });
  return authorRouter;
}

module.exports = router;
