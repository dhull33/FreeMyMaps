const express = require('express');

const app = express();

app.get('/', (req, res) => {
  return res.render('indexPage', { title: 'FreeMyMaps' });
});

module.exports = app;
