require('dotenv');

const Promise = require('bluebird');

const initOptions = {
  promiseLib: Promise
};

const pgp = require('pg-promise')(initOptions);

const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: true
};

const db = pgp(connection);

module.exports = {
  db,
  connection
};
