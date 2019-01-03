const express = require('express');

const app = express();

app.all('*', (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    return res.redirect('/');
  }
  return next();
});

app.get('/home', (req, res, next) => {
  console.log('Home');
  console.log(req.user);
  return res.render('home', {
    title: 'FreeMyMaps',
    user: req.user,
    message: req.flash('error')[0]
  });
});

module.exports = app;
