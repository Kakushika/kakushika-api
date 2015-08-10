'use strict';

var express = require('express'),
  router = express.Router(),
  validator = require('validator'),
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
      passwordHash: req.body.password
    }).then(function() {
      res.status(201).json({
        'ok': true
      });
    }).catch(function(err) {
      res.status(200).json({
        'ok': false,
        'error': err
      });
    });
  }
});

module.exports = router;
