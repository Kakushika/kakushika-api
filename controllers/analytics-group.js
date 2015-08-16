'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.AnalyticsGroup.findAll({
    attributes: [
      'id'
    ],
    where: {
      userId: userId
    }
  }).then(function(analyticsGroups) {
    res.json({
      ok: true,
      analyticsGroups: analyticsGroups
    });
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
