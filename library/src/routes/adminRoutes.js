const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoute');

const adminRouter = express.Router();

function router(nav) {
  adminRouter.route('/').get((req, res) => {
    const url = 'mongodb://127.0.0.1:27017';
    const dbName = 'libraryApp';
    // eslint-disable-next-line wrap-iife
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('connected correctly');
        const db = client.db(dbName);
        const response = await db.collection('authors').insertMany(authors);
        res.json(response);
      } catch (err) {
        debug(err.stack);
        res.send(err.stack);
      }
    })();
  });
  return adminRouter;
}

module.exports = router;
