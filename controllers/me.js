'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.User.findById(userId, {
    attributes: [
      'id',
      'email',
      'name'
    ]
  }).then(function(user) {
    if (!user) {
      return res.status(401).json({
        ok: false
      });
    }
    return res.json({
      ok: true,
      user: user
    });
  }).catch(function(err) {
    return next(err);
  });
});

module.exports = router;
