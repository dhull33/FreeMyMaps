const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../data/dataBase');
const init = require('./init');

const options = {};
// Serialize and Deserialize Users with init()
init();

// =====================================================
// ============LOCAL STRATEGY==========================
// =====================================================
passport.use(
  'local',
  new LocalStrategy(options, (username, password, done) => {
    db.oneOrNone('SELECT * FROM users WHERE LOWER(username)=$1', [username.toLowerCase().trim()])
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username and password combination.'
          });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {
            message: 'Incorrect username and password combination.'
          });
        }
        return done(null, user);
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
