'use strict';

var express = require('express'),
  router = express.Router(),
  validator = require('validator'),
  config = require('config'),
  models = require('../models');

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
    models.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.header('Location', config.host + config.login.redirect_path.success);
      res.status(201).json({
        'ok': true
      });
    });
  }
});

module.exports = router;
