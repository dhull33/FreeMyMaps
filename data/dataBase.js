require('dotenv');

const Promise = require('bluebird');

const initOptions = {
  promiseLib: Promise,
  // eslint-disable-next-line no-unused-vars
  connect(client, dc) {
    const cp = client.connectionParameters;
    console.log('Connecting to database:', cp.database);
  },
  // eslint-disable-next-line no-unused-vars
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    console.log('Disconnecting from database:', cp.database);
  }
};

const monitor = require('pg-monitor');

monitor.attach(initOptions);
monitor.setTheme('matrix');

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
