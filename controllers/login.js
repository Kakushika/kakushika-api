'use strict';

var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  config = require('config'),
  validator = require('validator'),
  models = require('../models');

router.post('/', function(req, res, next) {
  var email = req.body.email,
    password = req.body.password;

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
  } else {
    models.User.findOne({
      email: email
    }).then(function(user) {
      if (!user) {
        return res.status(401).json({
          ok: false
        });
      }
      user.verifyPassword(password, function(err, result) {
        if (err) {
          return next(err);
        }
        if (!result) {
          return res.status(401).json({
            ok: false
          });
        } else {
          var token = jwt.sign({
            id: user.id
          }, config.jwt.secret, {
            expiresInMinutes: 1440 // 24 hours
          });
          res.json({
            ok: true,
            token: token
          });
        }
      });
    }).catch(function(err) {
      return next(err);
    });
  }
});

module.exports = router;
