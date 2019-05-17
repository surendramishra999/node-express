const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        const url = 'mongodb://127.0.0.1:27017';
        const dbName = 'libraryApp';
        // eslint-disable-next-line wrap-iife
        (async function mongo() {
          let client;
          try {
            if (username === '') {
              throw new Error("username can't be empty");
            }
            if (password === '') {
              throw new Error("password can't be empty");
            }
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            debug('connected to db server');
            const db = client.db(dbName);
            const col = db.collection('users');
            const user = await col.findOne({ username });
            if (user && user.password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
            client.close();
          } catch (err) {
            debug(err.stack);
            done(null, false);
            client.close();
          }
        })();
      },
    ),
  );
};
