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

router.get('/:analyticsGroupId', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analyticsGroupId;

  models.AnalyticsGroup.findById(analyticsGroupId, {
    include: [{
      model: models.User,
      as: 'Users'
    }, {
      model: models.Room,
      as: 'Rooms'
    }, {
      model: models.AnalyticsGroup,
      as: 'ChildGroups'
    }]
  }).then(function(analyticsGroup) {
    var hasUser = function(users) {
      users.forEach(function(user) {
        if (user.id === userId) {
          return true;
        }
      });
      return false;
    };
    if (analyticsGroup.userId !== userId ||
      hasUser(analyticsGroup.Users)) {
      res.status(401).json({
        ok: false
      });
    } else {
      res.json({
        ok: true,
        analyticsGroup: analyticsGroup
      });
    }
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
