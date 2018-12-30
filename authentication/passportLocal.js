const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { db } = require('../data/dataBase');
const init = require('./init');

const options = {
  usernameField: 'email',
  passwordField: 'password'
};
// Serialize and Deserialize Users with init()
init();

// =====================================================
// ============LOCAL STRATEGY==========================
// =====================================================
passport.use(
  'local',
  new LocalStrategy(options, (username, password, done) => {
    db.any('SELECT * FROM "user" WHERE username=$1', [username])
      .then((user) => {
        if (!user[0]) {
          return done(null, false, {
            message: 'Incorrect username and password combination.'
          });
        }
        if (!bcrypt.compareSync(password, user[0].password)) {
          return done(null, false, {
            message: 'Incorrect username and password combination.'
          });
        }
        return done(null, user[0]);
      })
      .catch((err) => {
        console.log(err);
        return done(null, false, {
          message: 'There was an error!'
        });
      });
  })
);
module.exports = passport;
