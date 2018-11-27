/* eslint-disable global-require,no-debugger */
const Raven = require('raven');

Raven.context(() => {
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const bcrypt = require('bcryptjs');
  const db = require('../../the-hunter-sight/data/database-main');
  const init = require('./init');
  const options = {
    usernameField: 'email',
    passwordField: 'password'
  };
  // Serialize and Deserialize Users with init()
  init();
  // =====================================================
  // Local================================================
  // =====================================================
  passport.use(
    'local',
    new LocalStrategy(options, (email, password, done) => {
      db.any('SELECT * FROM users WHERE LOWER(email_address)=$1', [email.toLowerCase().trim()])
        .then((user) => {
          debugger;
          if (!user[0]) {
            return done(null, false, {
              message: 'Incorrect username and password combination'
            });
          }
          if (!bcrypt.compareSync(password, user[0].pass_word)) {
            return done(null, false, {
              message: 'Incorrect username and password combination'
            });
          }
          return done(null, user[0]);
        })
        .catch((err) => {
          console.log(err);
          return done(null, false, {
            message: 'Incorrect username and password combination'
          });
        });
    })
  );
  module.exports = passport;
});
