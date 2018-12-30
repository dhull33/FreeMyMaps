const express = require('express');
const passport = require('../../authentication/passportLocal');
const authHelpers = require('../../authentication/authHelpers');

const app = express();

app.post('/auth/signup/free', (req, res, next) => {
  console.log(req.body);
  authHelpers
    .createNewUser(req, res)
    .then((result) => {
      console.log(result);
      passport.authenticate('local', {
        successRedirect: '/',
        failureFlash: true
      })(req, res, next);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

module.exports = app;
