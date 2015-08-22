'use strict';

var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  config = require('config'),
  validator = require('validator'),
  models = require('../models');

router.post('/', function(req, res, next) {
  var email = req.body.email,
    password = req.body.password,
    name = req.body.name;

  if (!email || !validator.isEmail(email)) {
    res.status(400).json({
      ok: false,
      message: 'invalid_email'
    });
  } else if (!password) {
    res.status(400).json({
      ok: false,
      message: 'invalid_password'
    });
  } else if(!name) {
    res.status(400).json({
      ok: false,
      message: 'invalid_name'
    });
  } else {
    models.User.create({
      email: email,
      passwordHash: password,
      name: name
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
