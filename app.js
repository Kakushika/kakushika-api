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
  Sequelize = require('sequelize'),
  config = require('./config');

// var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
//   host: config.db.host,
//   dialect: config.db.dialect,
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   },
// });

// Use helmet to secure Express headers
app.use(helmet());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(compression());
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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
