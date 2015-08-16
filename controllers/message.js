'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id,
    room_id = req.query.room_id | 0, // parse int
    analytics_group_id = req.query.analytics_group_id | 0, // parse int
    offset = req.query.offset | 0,
    limit = req.query.limit | 10;

  if (room_id === 0 && analytics_group_id === 0) {
    return res.json({
      ok: false
    });
  }

  if (room_id !== 0) {
    if (100 < limit) {
      limit = 100;
    }
    models.Room.findById(room_id, {
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
        offset: offset,
        limit: limit
      }]
    }).then(function(room) {
      if (room.ReadableUsers.length !== 1) {
        return res.json({
          ok: false
        });
      }
      res.json({
        ok: true,
        messages: room.Messages,
        raw: room
      });
    }).catch(function(err) {
      next(err);
    });
  } else {
    models.AnalyticsGroup.findById(analytics_group_id, {
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
          offset: offset,
          limit: limit
        }]
      }]
    }).then(function(analyticsGroup) {
      if (analyticsGroup.userId !== userId) {
        return res.json({
          ok: false
        });
      }
      res.json({
        ok: true,
        rooms: analyticsGroup.Rooms
      });
    });
  }
});

module.exports = router;
