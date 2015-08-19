'use strict';

var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  config = require('config'),
  validator = require('validator'),
  models = require('../models');

router.post('/', function(req, res, next) {
  if (!req.body.email || !validator.isEmail(req.body.email)) {
    res.status(400).json({
      ok: false,
      message: 'invalid_email'
    });
  } else if (!req.body.password) {
    res.status(400).json({
      ok: false,
      message: 'invalid_password'
    });
  } else {
    models.User.create({
      email: req.body.email,
      passwordHash: req.body.password
    }).then(function(user) {
      var token = jwt.sign({
        id: user.id
      }, config.jwt.secret, {
        expiresInMinutes: 1440 // 24 hours
      });
      res.status(201).json({
        ok: true,
        token: token
      });
    }).catch(function(err) {
      next(err);
    });
  }
});

module.exports = router;
