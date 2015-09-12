'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/list', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.RoomGroup.findAll({
    attributes: [
      'id',
      'name',
      'externalType',
      'externalId'
    ],
    where: {
      userId: userId
    },
    include: [{
      model: models.Room,
      as: 'Rooms',
      attributes: [
        'id',
        'name',
        'externalType',
        'externalId',
        'latest'
      ]
    }]
  }).then(function(roomGroup) {
    res.json({
      ok: true,
      roomGroups: roomGroup
    });
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
