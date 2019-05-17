const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const debug = require('debug')('app:authRoutes');

const authRoute = express.Router();
function router(nav) {
  authRoute.route('/signUp').post((req, res) => {
    debug(req.body);
    req.login(req.body, () => {
      const { username, password, email, password2 } = req.body;
      const url = 'mongodb://127.0.0.1:27017';
      const dbName = 'libraryApp';
      if (password === '') {
        req.flash('notify', 'Please enter a password.');
        res.redirect('/');
        return;
      }
      if (email === '') {
        req.flash('notify', 'Please enter a email.');
        res.redirect('/');
        return;
      }
      if (username === '') {
        req.flash('notify', 'Please enter a username.');
        res.redirect('/');
        return;
      }
      if (password !== password2) {
        req.flash('notify', 'Password does not match.');
        res.redirect('/');
        return;
      }
      // eslint-disable-next-line wrap-iife
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url, { useNewUrlParser: true });
          debug('connected to db server');
          const db = client.db(dbName);
          const col = db.collection('users');
          const user = { username, password, email };
          const result = await col.insertOne(user);
          debug(result.ops);
          req.login(result.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
          req.flash('notify', 'Something went wrong.PLease try again!.');
          res.redirect('/');
        }
      })();
    });
  });
  authRoute.route('/signIn').post(
    passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }),
  );
  authRoute
    .route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        req.flash('notify', 'You are not logged In.');
        res.redirect('/');
      }
    })
    .get((req, res) => {
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
  return authRoute;
}

module.exports = router;
