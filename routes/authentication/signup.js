const express = require('express');
const passport = require('../../authentication/passportLocal');
const authHelpers = require('../../authentication/authHelpers');

const app = express();

app.post('/auth/signup/free', (req, res) => {});

module.exports = app;
