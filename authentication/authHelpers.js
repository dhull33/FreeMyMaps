const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const moment = require('moment');
const { db } = require('../data/dataBase');

// Function that creates a new user on sign-up
const createNewUser = (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const dateCreated = moment().format();
  const userId = uniqid();
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);
  return db
    .any(
      'INSERT INTO "user" (user_id, password, username, date_created) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, hashPassword, username, dateCreated]
    )
    .catch((error) => {
      console.log(error);
      return error;
    });
};

// checks to see if user exists. Returns a boolean
const doesUserExist = (username) => {
  return db
    .one('SELECT exists(SELECT username FROM "user" WHERE username = $1)', [username])
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
