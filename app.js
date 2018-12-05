/* eslint-disable global-require,prettier/prettier */
// configures sqreen in production mode
if (process.env.NODE_ENV === 'production') {
  require('sqreen');
}
// Must configure Raven before doing anything else with it
const Raven = require('raven');
require('dotenv').config();

Raven.config(process.env.SENTRY_DSN).install();

Raven.context(() => {
  // const createError = require('http-errors');
  const express = require('express');
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');
  const bodyParser = require('body-parser');
  const enforce = require('express-sslify');
  const passport = require('passport');
  const flash = require('connect-flash');
  const compression = require('compression');
  
  const app = express();
  app.use(compression());
  
  // The raven request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Enforces HTTPS
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  
  /* ===================================
  ===================ROUTES=============
  ======================================
   */
  const indexRouter = require('./routes/index');
  
  app.use('/', indexRouter);
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  
  //= =====================================
  //= ===========ERROR HANDLERS============
  //= =====================================
  
  // The Raven error handler must be before any other error middleware
  app.use(Raven.errorHandler());
  
  // Uncaught exception handler...
  process.on('uncaughtException', (err) => {
    console.log(err);
    console.log(`Caught exception in 'node forever': ${err}`);
  });
  
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT} 🚀`);
  });
  
  module.exports = app;
});
