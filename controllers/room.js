'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.Room.findAll({
    attributes: [
      'id',
      'name',
      'externalType',
      'externalId',
      'roomGroupId',
      'latest'
    ],
    where: {
      userId: userId
    }
  }).then(function(rooms) {
    res.json({
      ok: true,
      rooms: rooms
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
    if(room.userId !== userId) {
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
