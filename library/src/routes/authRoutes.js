/* eslint-disable object-curly-newline */
const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const authRoute = express.Router();
function router(nav) {
  const { createAccount, login, isLogin, renderProfile } = userController(nav);
  authRoute.route('/signUp').post(createAccount);
  authRoute.route('/signIn').post(
    passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
      failureFlash: 'Invalid username or password.',
    }),
    login,
  );
  authRoute
    .route('/profile')
    .all(isLogin)
    .get(renderProfile);
  return authRoute;
}

module.exports = router;
