/* eslint-disable object-curly-newline */
/* eslint-disable import/no-extraneous-dependencies */
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const debug = require('debug')('app:authRoutes');

function userController(nav) {
  function createAccount(req, res) {
    const { username, password, email, password2 } = req.body;
    const url = 'mongodb://127.0.0.1:27017';
    const dbName = 'libraryApp';
    // eslint-disable-next-line wrap-iife
    (async function addUser() {
      let client;
      try {
        if (password === '') {
          req.flash('notify', 'Please enter a password.');
          throw new Error('Redirect Page');
        }
        if (email === '') {
          req.flash('notify', 'Please enter a email.');
          throw new Error('Redirect Page');
        }
        if (username === '') {
          req.flash('notify', 'Please enter a username.');
          throw new Error('Redirect Page');
        }
        if (password !== password2) {
          req.flash('notify', 'Password does not match.');
          throw new Error('Redirect Page');
        }
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        debug('connected to db server');
        const db = client.db(dbName);
        const col = db.collection('users');
        const existingUser = await col.findOne({ username });
        if (_.get(existingUser, 'username')) {
          req.flash('notify', 'username is already exist.');
          throw new Error('username is already exist.');
        }
        if (_.get(existingUser, 'email')) {
          req.flash('notify', 'email is already exist.');
          throw new Error('email is already exist.');
        }
        const user = { username, password, email };
        const result = await col.insertOne(user);
        req.login(result.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (err) {
        debug(err);
        if (client) {
          client.close();
        }
        req.flash('notify', 'Please try again!.');
        res.redirect('/');
      }
    })();
  }
  function login(req, res) {
    if (!_.get(req, 'user.username')) {
      req.flash('notify', 'Username/Password does not exist!');
      res.redirect('/');
    }
  }
  function isLogin(req, res, next) {
    if (_.get(req, 'user.username')) {
      next();
    } else {
      req.flash('notify', 'You are not logged In.');
      res.redirect('/');
    }
  }
  function renderProfile(req, res) {
    if (_.get(req, 'user.username')) {
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
  }

  return {
    createAccount,
    login,
    isLogin,
    renderProfile,
  };
}

module.exports = userController;
