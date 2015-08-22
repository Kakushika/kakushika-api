'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.User.findById(userId, {
    include: [{
      model: models.Room,
      as: 'ReadableRooms',
      attributes: [
        'id',
        'name',
        'externalType',
        'externalId',
        'roomGroupId',
        'latest'
      ]
    }, {
      model: models.Room,
      as: 'Rooms',
      attributes: [
        'id',
        'name',
        'externalType',
        'externalId',
        'roomGroupId',
        'latest'
      ]
    }]
  }).then(function(user) {
    return res.json({
      ok: true,
      rooms: user.Rooms,
      readableRooms: user.ReadableRooms
    });
  }).catch(function(err) {
    next(err);
  });
});

router.get('/:external_id', auth, function(req, res, next) {
  var userId = req.decoded.id,
    externalId = req.params.external_id;

  models.Room.findById(externalId, {
    include: {
      model: models.ExternalUser,
      as: 'ExternalUsers'
    }
  }).then(function(room) {
    if (room.userId !== userId) {
      return res.status(400).json({
        ok: false
      });
    }
    return res.json({
      ok: true,
      externalUsers: room.ExternalUsers
    });
  }).catch(function(err) {
    return next(err);
  });
});

module.exports = router;
