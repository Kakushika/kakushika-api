'use strict';

var express = require('express'),
  router = express.Router(),
  validator = require('validator'),
  bcrypt = require('bcrypt'),
  config = require('config'),
  models = require('../models');

var getPasswordHash = function(password, cb) {
  bcrypt.genSalt(config.login.password.cost, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        cb(err);
      } else {
        cb(null, hash);
      }
    });
  });
};

router.post('/', function(req, res) {
  if (!req.body.email || !validator.isEmail(req.body.email)) {
    res.json({
      'ok': false,
      'error': 'invalid_email'
    });
  } else if (!req.body.password) {
    res.json({
      'ok': false,
      'error': 'invalid_password'
    });
  } else {
    getPasswordHash(req.body.password, function(err, hash) {
      if (err) {
        res.json({
          'ok': false,
          'error': 'invalid_password'
        });
      } else {
        models.User.create({
          email: req.body.email,
          password: hash
        }).then(function() {
          res.header('Location', config.host + config.login.redirect_path.success);
          res.status(201).json({
            'ok': true
          });
        });
      }
    });
  }
});

module.exports = router;
