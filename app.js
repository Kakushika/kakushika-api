'use strict';

const express = require('express'),
  app = express(),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  cors = require('cors');

// Use helmet to secure Express headers
app.use(helmet());
app.use(cors({
  origin: '*',
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-access-token']
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());

app.all('/', (req, res) => {
  res.json({
    message: 'hello, from kksk api.'
  });
});
app.use(require('./routers/public'));
app.use(require('./middleware/authorization'));
app.use(require('./routers/private'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    error: err.message
  });
});

module.exports = app;
