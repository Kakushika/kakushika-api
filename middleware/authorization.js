'use strict';

var jwt = require('jsonwebtoken'),
  config = require('config');

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'Failed to authenticate token.'
      });
    } else {
      req.decoded = decoded;
      next();
    }
  });
};
