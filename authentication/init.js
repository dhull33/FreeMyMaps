const passport = require('passport');
const { db } = require('../data/dataBase');

module.exports = () => {
  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    db.any('SELECT * FROM "user" WHERE username=$1', [user.username])
      .then((myUser) => {
        return done(null, myUser[0]);
      })
      .catch((error) => {
        return done(error, null);
      });
  });
};
