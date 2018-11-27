const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const moment = require('moment');
const dateFormat = require('dateformat');
const db = require('../../the-hunter-sight/data/database-main');

// Creates a user who went through regular sign-up process i.e. they paid and skipped free trial
const create_user = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    city,
    state,
    zipcode
  } = req.body;
  const lowerEmail = email.toLowerCase().trim();
  if (password !== confirm_password) {
    console.log(password);
    console.log(confirm_password);
  }
  const salt = bcrypt.genSaltSync();
  const hashed_password = bcrypt.hashSync(password, salt);
  const user_id = uniqid(last_name);
  const date_created = dateFormat('mm dd yyyy');
  const signUpOption = 'regular';
  const subscriptStatus = 'unpaid';
  const photoLimit = 0;
  // trial starts and ends today because they went through regular sign up process
  const date_trial_starts = moment().format();
  const date_trial_ends = moment(date_trial_starts).format();

  return db
    .any(
      'INSERT INTO users (user_id, first_name, last_name,' +
        ' email_address, city, state, zip_code, pass_word, date_created, signup_option, date_trial_ends, photo_limit, date_trial_starts, subscript_status)' +
        ' VALUES($1, $2, $3,' +
        ' $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      [
        user_id,
        first_name,
        last_name,
        lowerEmail,
        city,
        state,
        zipcode,
        hashed_password,
        date_created,
        signUpOption,
        date_trial_ends,
        photoLimit,
        date_trial_starts,
        subscriptStatus
      ]
    )
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const createFreeTrialUser = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    city,
    state,
    zipcode
  } = req.body;
  const lowerEmail = email.toLowerCase().trim();
  if (password !== confirm_password) {
    console.log(password);
    console.log(confirm_password);
  }
  const salt = bcrypt.genSaltSync();
  const hashed_password = bcrypt.hashSync(password, salt);
  const user_id = uniqid(last_name);
  const date_created = dateFormat('mm dd yyyy');
  const signUpOption = 'trial';
  const subscriptStatus = 'trial';
  const photoLimit = 100;
  // Add 14 days to today
  const date_trial_starts = moment().format();
  const date_trial_ends = moment(date_trial_starts)
    .add(14, 'days')
    .format();

  return db
    .any(
      'INSERT INTO users (user_id, first_name, last_name,' +
        ' email_address, city, state, zip_code, pass_word, date_created, signup_option, date_trial_ends, photo_limit, date_trial_starts, subscript_status)' +
        ' VALUES($1, $2, $3,' +
        ' $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [
        user_id,
        first_name,
        last_name,
        lowerEmail,
        city,
        state,
        zipcode,
        hashed_password,
        date_created,
        signUpOption,
        date_trial_ends,
        photoLimit,
        date_trial_starts,
        subscriptStatus
      ]
    )
    .catch((error) => {
      console.log(error);
      return error;
    });
};

// returns true or false depending on whether the user exists or not
const does_user_exist = (email) => {
  return db
    .any('SELECT exists(SELECT email_address FROM users WHERE email_address=$1)', [email])
    .then((result) => {
      const answer = result[0].exists;
      return answer;
    })
    .catch((err) => {
      return console.log(err);
    });
};

module.exports = {
  does_user_exist,
  create_user,
  createFreeTrialUser
};
