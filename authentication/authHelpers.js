const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const moment = require('moment');
const db = require('../data/dataBase');

// Function that creates a new user on sign-up
const createNewUser = (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const dateCreated = moment().format();
  const userId = uniqid();
  return db
    .none('INSERT INTO user (user_id, username, password, date_created) VALUES ($1, $2, $3, $4)', [
      userId,
      username,
      password,
      dateCreated
    ])
    .catch((error) => {
      console.log(error);
      return error;
    });
};

// checks to see if user exists. Returns a boolean
const doesUserExist = (username) => {
  return db
    .one('SELECT exists(SELECT username FROM user WHERE username = $1)', [username])
    .then((result) => {
      return result.exists;
    })
    .catch((error) => {
      return console.log(error);
    });
};

module.exports = {
  createNewUser,
  doesUserExist
};
