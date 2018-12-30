/* eslint-disable global-require,prettier/prettier */
// configures sqreen in production mode
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  require('sqreen');
}
// Must configure Raven before doing anything else with it
const Raven = require('raven');
// require('dotenv').config();

Raven.config(process.env.SENTRY_DSN).install();

Raven.context(() => {
  // const createError = require('http-errors');
  const express = require('express');
  const enforce = require('express-sslify');
  const passport = require('passport');
  const flash = require('connect-flash');
  const path = require('path');
  const session = require('express-session');
  const pgSession = require('connect-pg-simple');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');
  const bodyParser = require('body-parser');
  const compression = require('compression');
  const { connection } = require('./data/dataBase');

  const app = express();

  // The raven request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
  app.use(compression());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  // Session store used for authentication
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: new (pgSession(session))({
        conObject: connection,
        pruneSessionInterval: 3600
      }),
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    })
  );
  // Enforces HTTPS
  app.use(enforce.HTTPS({ trustProtoHeader: true }));

  /* ===================================
  ===================ROUTES=============
  ======================================
   */
  const indexRouter = require('./routes/index');
  const signUpRouter = require('./routes/authentication/signup');

  app.use('/', indexRouter);
  app.use('/', signUpRouter);

  // Sets view engine to ejs
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // The Raven error handler must be before any other error middleware
  app.use(Raven.errorHandler());

  // Uncaught exception handler...
  process.on('uncaughtException', (err) => {
    console.log(err);
    console.log(`Caught exception: ${err}`);
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT} 🚀`);
  });

  module.exports = app;
});
