'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.RoomGroup.findAll({
    where: {
      userId: userId
    },
    include: [{
      model: models.Room,
      as: 'Rooms'
    }]
  }).then(function(roomGroup) {
    res.json({
      ok: true,
      roomGroup: roomGroup
    });
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
