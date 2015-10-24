'use strict';

const jwt = require('jsonwebtoken'),
  config = require('config');

module.exports = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'invalid_auth'
      });
    } else {
      req.decoded = decoded;
      next();
    }
  });
};
