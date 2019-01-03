const express = require('express');

const app = express();

app.get('/', (req, res) => {
  // console.log(req.user);
  return res.render('indexPage', {
    title: 'FreeMyMaps',
    message: req.flash('error')[0]
  });
});

module.exports = app;
