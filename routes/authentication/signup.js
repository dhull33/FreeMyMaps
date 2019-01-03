const express = require('express');
const passport = require('../../authentication/passportLocal');
const authHelpers = require('../../authentication/authHelpers');

const app = express();

app.post('/auth/signup/free', (req, res, next) => {
  return authHelpers
    .createNewUser(req, res)
    .then((result) => {
      console.log(result);
      passport.authenticate('local', {
        successRedirect: '/home',
        failureFlash: true
      })(req, res, next);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = app;
