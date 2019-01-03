const express = require('express');

const app = express();

app.post(
  '/logout',
  (req, res, next) => {
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }
      req.logout();
      return next();
    });
  },
  (req, res) => {
    return res.redirect('/');
  }
);

module.exports = app;
