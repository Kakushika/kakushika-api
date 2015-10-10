'use strict';

let config = require('config'),
  models = require('../models');

let user = {
  me: function(req, res, next) {
    var userId = req.decoded.id;

    models.user.single(userId).then(function(user) {
      if (!user) {
        return res.status(401).json({
          ok: false
        });
      }
      return res.json({
        name: user.name,
        home: user.home
      });
    }).catch(function(err) {
      return next(err);
    });
  }
};

module.exports = user;
