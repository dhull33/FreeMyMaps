const passport = require('passport');
const db = require('../data/dataBase');

module.exports = () => {
  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    db.one('SELECT * FROM user WHERE user_id=$1', [user.user_id])
      .then((myUser) => {
        return done(null, myUser);
      })
      .catch((error) => {
        return done(error, null);
      });
  });
};
