const express = require('express');
const passport = require('../../authentication/passportLocal');

const app = express();

// Login Route
app.post(
  '/auth/login',
  passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
  }),
  (req, res) => {
    return res.redirect('/home');
  }
);

module.exports = app;
