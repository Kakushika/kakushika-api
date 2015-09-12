'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/list', auth, function(req, res, next) {
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

router.get('/:room_id', auth, function(req, res, next) {
  var userId = req.decoded.id,
    roomId = req.params.room_id;

  models.Room.findById(roomId, {
    where: {
      userId: userId
    }
  }).then(function(room) {
    return res.json({
      ok: true,
      room: room
    });
  }).catch(function(err) {
    return next(err);
  });
});

router.get('/messages', auth, function(req, res, next) {
  var userId = req.decoded.id,
    roomId = req.query.room_id | 0, // parse int
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

  var query = 'SELECT * FROM dbo.Messages AS m INNER JOIN dbo.MessageProperties AS p  ON m.id = p.messageId INNER JOIN dbo.Readables AS r ON m.roomId = r.roomId INNER JOIN dbo.Rooms AS rm ON m.roomId = rm.id WHERE m.roomId = ? AND(r.userId = ? OR rm.userId = ?) ORDER BY m.pubDate DESC OFFSET(?) ROWS FETCH NEXT(?) ROWS ONLY ';

  models.sequelize.query(query, {
    replacements: [roomId, userId, userId, offset, limit],
    type: models.sequelize.QueryTypes.SELECT,
  }).then(function(messages) {
    return res.json({
      ok: true,
      messages: messages
    });
  }).catch(function(err) {
    return next(err);
  });
});

router.get('/:room_id/external-user', auth, function(req, res, next) {
  // var userId = req.decoded.id,
  var roomId = req.params.room_id;
  var sql = 'SELECT e.id AS id' + ', e.externalType AS externalType' + ', e.name AS name' + ', u.id AS userId' + ', u.name AS userName' + ' FROM [dbo].[ExternalUsers] AS e' + ' LEFT OUTER JOIN [dbo].[Users] AS u' + ' ON e.userId = u.id' + ' INNER JOIN [dbo].[RoomExternalUsers] AS re' + ' ON e.id = re.externalUserId' + ' WHERE re.roomId = ?';
  models.sequelize.query(sql, {
    replacements: [roomId],
    type: models.sequelize.QueryTypes.SELECT
  }).then(function(externalUsers) {
    return res.json({
      ok: true,
      externalUser: externalUsers
    });
  }).catch(function(err) {
    return next(err);
  });
});

module.exports = router;
