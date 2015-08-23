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

router.get('/search', auth, function(req, res, next) {
  var userId = req.decoded.id,
    qRoomId = req.query.room_id | 0, // room parse int
    qPubDate = req.query.pub_date, // assume Date, timezone
    qMessage = req.query.message, // like, message
    qUserId = req.query.user_id | 0, // external parse int
    qUserName = req.query.user_name; // external

  var roomQuery = {};
  if (qRoomId) {
    roomQuery.id = qRoomId;
  }

  var messageQuery = {};
  if (qPubDate) {
    var today = new Date(qPubDate);
    messageQuery.pubDate = {
      $lte: today, // qPubDate <= pubDate
      $gt: new Date(today + 24 * 60 * 60 * 1000) // pubDate < qPubDate
    };
  }
  if (qMessage) {
    messageQuery.message = {
      $like: '%' + qMessage + '%'
    };
  }

  var externalQuery = {},
    isExternalQuery = false;
  if (qUserId) {
    externalQuery.externalId = qUserId;
    isExternalQuery = true;
  } else if (qUserName) {
    externalQuery.name = qUserName;
    isExternalQuery = true;
  }

  models.User.findById(userId, {
    attributes: [
      'id'
    ],
    include: [{
      model: models.Room,
      as: 'Rooms',
      attributes: [
        'id'
      ],
      where: roomQuery,
      include: [{
        model: models.Message,
        as: 'Messages',
        attributes: [
          'id',
          'roomId',
          'message',
          'pubDate'
        ],
        where: messageQuery,
        include: [{
          model: models.ExternalUser,
          as: 'ExternalUsers',
          attributes: [
            'externalId',
            'name'
          ],
          where: externalQuery
        }],
        order: [
          ['pubDate', 'DESC']
        ],
        limit: 10
      }]
    }, {
      model: models.Room,
      as: 'ReadableRooms',
      attributes: [
        'id'
      ],
      where: roomQuery,
      include: [{
        model: models.Message,
        as: 'Messages',
        attributes: [
          'id',
          'roomId',
          'message',
          'pubDate'
        ],
        where: messageQuery,
        include: [{
          model: models.ExternalUser,
          as: 'ExternalUsers',
          attributes: [
            'externalId',
            'name'
          ],
          where: externalQuery
        }],
        order: [
          ['pubDate', 'DESC']
        ],
        limit: 10
      }]
    }]
  }).then(function(user) {
    var parseRoom = function(room) {
        if (room.Messages.length !== 0) {
          var Room = {
            id: room.id,
            Messages: []
          };
          room.Messages.forEach(function(message) {
            if (message.ExternalUsers.length !== 0) {
              Room.Messages.push({
                id: message.id,
                roomId: message.roomId,
                message: message.message,
                pubDate: message.pubDate,
                externalUserId: message.ExternalUsers[0].externalId,
                externalUserName: message.ExternalUsers[0].name
              });
            } else if (!isExternalQuery) {
              Room.Messages.push({
                id: message.id,
                roomId: message.roomId,
                message: message.message,
                pubDate: message.pubDate,
                externalUserId: null,
                externalUserName: null
              });
            }
          });
          return Room;
        }
      },
      Rooms = [],
      ReadableRooms = [];

    if (!user) {
      return res.status(401).json({
        ok: false
      });
    }

    user.Rooms.forEach(function(room) {
      var Room = parseRoom(room);
      if (Room) {
        Rooms.push(Room);
      }
    });
    user.ReadableRooms.forEach(function(room) {
      var Room = parseRoom(room);
      if (Room) {
        ReadableRooms.push(Room);
      }
    });
    return res.json({
      ok: true,
      rooms: Rooms,
      readableRooms: ReadableRooms
    });
  }).catch(function(err) {
    return next(err);
  });
});

module.exports = router;
