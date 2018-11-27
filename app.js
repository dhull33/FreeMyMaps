/* eslint-disable global-require,prettier/prettier */
// configures sqree
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
  const session = require('express-session');
  const pgStore = require('connect-pg-simple');
  const passport = require('passport');
  const flash = require('connect-flash');
  
  const app = express();
  const compression = require('compression');
  app.use(compression());
  
  // db connection string
  const connection = {
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: true,
    poolSize: 12,
    poolIdleTimeout: 2000
  };
  
  // PG session store
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: new (pgStore(session))({
        conObject: connection,
        pruneSessionInterval: 1800
      }),
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    })
  );
  
  // The raven request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  // app.use(bodyParser.text({limit: 1024102420, extended: true}));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(require('webpack-dev-middleware')(compiler, {
  //   publicPath: config.output.publicPath
  // }))
  
  // // Enforces HTTPS
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  
  // ===================ROUTES=============
  const indexRouter = require('./routes/index');
  // const sign_up_router = require('./routes/authentication/signup');
  // const login_router = require('./routes/authentication/login');
  // const logout_router = require('./routes/authentication/logout');
  // const verification_router = require('./routes/authentication/verify.js');
  // const payment_router = require('./routes/payments/payments');
  // const imageUpload = require('./routes/api/image-upload/image-upload');
  // const insert = require('./routes/api/insert');
  // const deleteRoute = require('./routes/api/delete');
  // const harvest = require('./routes/api/harvest-api');
  // const weather = require('./routes/api/darkSkyWeather');
  // const gamePhotos = require('./routes/api/gamePhotos');
  // const huntClubRouter = require('./routes/huntClubs/huntClub');
  // const gameTrends = require('./routes/api/gameTrends');
  // const home = require('./routes/api/home');
  // const propertyEdit = require('./routes/api/propertyEdit');
  // const nutrition = require('./routes/api/nutrition');
  
  const propertiesRouter = require('./routes/properties/properties.js');
  
  app.use('/', propertiesRouter);
  
  app.use('/', indexRouter);
  
  // app.use('/', sign_up_router);
  // app.use('/', login_router);
  // app.use('/', logout_router);
  // app.use('/', payment_router);
  // app.use('/', huntClubRouter);
  // app.use('/verification', verification_router);
  // app.use('/home', home);
  // app.use('/property-edit', propertyEdit);
  // app.use('/nutrition', nutrition);
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  
  //= =====================================
  //= ===========ERROR HANDLERS============
  //= =====================================
  // The Raven error handler must be before any other error middleware
  app.use(Raven.errorHandler());
  // //Uncaught exception handler...
  process.on('uncaughtException', (err) => {
    console.log(err);
    console.log(`Caught exception in 'node forever': ${err}`);
  });
  
  const server = app.listen(process.env.PORT, () => {
    console.log(`🚀  Server listening on port ${process.env.PORT}`);
  });
  
  module.exports = app;
});
