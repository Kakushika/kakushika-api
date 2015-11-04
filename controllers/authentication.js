'use strict';

const jwt = require('jsonwebtoken'),
  config = require('config'),
  validator = require('validator'),
  models = require('../models');

const auth = {
  signup: (req, res, next) => {
    let email = req.body.email,
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
    } else if (!name) {
      res.status(400).json({
        ok: false,
        message: 'invalid_name'
      });
    } else {
      models.user.create(email, name, password)
        .then((user) => {
          let token = jwt.sign({
            id: user.id
          }, config.jwt.secret, {
            expiresInMinutes: 1440 // 24 hours
          });
          res.status(201).json({
            ok: true,
            token: token
          });
        }).catch((err) => {
          next(err);
        });
    }
  },
  login: (req, res, next) => {
    let email = req.body.email,
      password = req.body.password;
console.log(email, ':', password);
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
console.log('check pass');
      models.user.verify(email, password)
        .then((user) => {
console.log(user);
          if (!user || !user.id) {
            return res.status(401);
          }
          let token = jwt.sign({
            id: user.id
          }, config.jwt.secret, {
            expiresInMinutes: 1440 // 24 hours
          });
          res.json({
            token: token,
            expires: new Date(Date.now() + 1440 * 60 * 1000).toISOString(),
            refleshToken: ''
          });
        }).catch((err) => {
          return next(err);
        });
    }
  },
  reflesh: (req, res, next) => {}
};

module.exports = auth;
