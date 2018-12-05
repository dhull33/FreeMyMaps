const express = require('express');

const app = express();

/* GET home page. */
app.get('/', (req, res, next) => {
  return res.render('indexPage', { title: 'FreeMyMaps' });
});

module.exports = app;
