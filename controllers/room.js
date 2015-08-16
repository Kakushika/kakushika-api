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

module.exports = router;
