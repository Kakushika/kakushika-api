'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/room/:room_id', auth, function(req, res, next) {
  var userId = req.decoded.id,
    roomId = req.params.room_id | 0, // parse int
    offset = req.query.offset | 0,
    limit = req.query.limit | 10;

  if (roomId === 0) {
    return res.status(400).json({
      ok: false
    });
  }

  if (100 < limit) {
    limit = 100;
  }
  models.Room.findById(roomId, {
    include: [{
      model: models.User,
      as: 'ReadableUsers',
      where: {
        id: userId
      }
    }, {
      model: models.Message,
      as: 'Messages',
      attribute: [
        'id',
        'message',
        'pubDate'
      ],
      order: [
        [
          'pubDate',
          'DESC'
        ]
      ],
      offset: offset,
      limit: limit
    }]
  }).then(function(room) {
    if (room.ReadableUsers.length !== 1) {
      return res.status(404).json({
        ok: false
      });
    }
    return res.json({
      ok: true,
      messages: room.Messages,
      raw: room
    });
  }).catch(function(err) {
    next(err);
  });
});

router.get('/analytics-group-id/:analytics_group_id', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analytics_group_id | 0, // parse int
    offset = req.query.offset | 0,
    limit = req.query.limit | 10;

  if (analyticsGroupId === 0) {
    return res.status(400).json({
      ok: false
    });
  }

  models.AnalyticsGroup.findById(analyticsGroupId, {
    include: [{
      model: models.Room,
      as: 'Rooms',
      include: [{
        model: models.Message,
        as: 'Messages',
        attribute: [
          'id',
          'message',
          'pubDate'
        ],
        order: [
          [
            'pubDate',
            'DESC'
          ]
        ],
        offset: offset,
        limit: limit
      }]
    }]
  }).then(function(analyticsGroup) {
    if (analyticsGroup.userId !== userId) {
      return res.status(404).json({
        ok: false
      });
    }
    res.json({
      ok: true,
      rooms: analyticsGroup.Rooms
    });
  }).catch(function(err) {
    return next(err);
  });
});

module.exports = router;
