'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const validator = require('validator');
const models = require('../models');

const auth = {
  signup: (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (!email || !validator.isEmail(email)) {
      res.status(400).json({
        message: 'invalid_email'
      });
    } else if (!password) {
      res.status(400).json({
        message: 'invalid_password'
      });
    } else if (!name) {
      res.status(400).json({
        message: 'invalid_name'
      });
    } else {
      models.user.create(email, name, password)
        .then((user) => {
          models.folder.createHome(user.id);

          const token = jwt.sign({
            id: user.id
          }, config.jwt.secret, {
            expiresInMinutes: 1440 // 24 hours
          });
          res.status(201).json({
            token
          });
        }).catch((err) => {
          next(err);
        });
    }
  },
  login: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !validator.isEmail(email)) {
      res.status(400).json({
        message: 'invalid_email'
      });
    } else if (!password) {
      res.status(400).json({
        message: 'invalid_password'
      });
    } else {
      models.user.verify(email, password)
        .then((user) => {
          if (!user || !user.id) {
            return res.status(404);
          }
          const token = jwt.sign({
            id: user.id
          }, config.jwt.secret, {
            expiresInMinutes: 1440 // 24 hours
          });
          res.json({
            token,
            expires: new Date(Date.now() + 1440 * 60 * 1000).toISOString(),
              refleshToken: ''
          });
        }).catch(() => {
          return res.status(400);
        });
    }
  }
};

module.exports = auth;
