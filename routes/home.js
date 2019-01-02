const express = require('express');

const app = express();

app.get('/home', (req, res, next) => {
  return res.render('home', {
    title: 'FreeMyMaps',
    user: req.user,
    message: req.flash('error')[0]
  });
});

module.exports = app;
