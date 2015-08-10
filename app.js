'use strict';

/* jshint unused: false */

var express = require('express'),
  app = express(),
  fs = require('fs'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  cors = require('cors'),
  flash = require('connect-flash'),
  passport = require('passport'),
  session = require('express-session'),
  config = require('config'),
  localStrategy = require('./middleware/local_strategy'),
  models = require('./models');

// Use helmet to secure Express headers
app.use(helmet());
app.use(cors({
  origin: config.host,
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));
app.use(function(req, res, next) {
  if (!req.xhr) {
    var err = new Error('Forbidden');
    err.status = 403;
    next(err);
  }
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(compression());
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  models.User.findById(id)
    .then(function(user) {
      done(null, user);
    })
    .catch(function(err) {
      done(err);
    });
});

app.use(require('./controllers'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
