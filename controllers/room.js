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

router.get('/:room_id/external-user', auth, function(req, res, next) {
  var userId = req.decoded.id,
    roomId = req.params.room_id;
  var sql = "SELECT e.id AS id"
              + ", e.externalType AS externalType"
              + ", e.name AS name"
              + ", u.id AS userId"
              + ", u.name AS userName"
            + " FROM [dbo].[ExternalUsers] AS e"
            + " LEFT OUTER JOIN [dbo].[Users] AS u"
              + " ON e.userId = u.id"
            + " INNER JOIN [dbo].[RoomExternalUsers] AS re"
              + " ON e.id = re.externalUserId"
            + " WHERE re.roomId = ?";
    models.sequelize.query(sql, { 
      replacements: [roomId], 
      type: models.sequelize.QueryTypes.SELECT }
    ).then(function(externalUsers) {
      return res.json({
        ok: true,
        externalUser: externalUsers
      });
    }).catch(function(err) {
      return next(err);
    });
  // models.Room.findById(roomId,{
  //   where: {
  //     userId: userId
  //   },
  //   include: [{
  //     model: models.ExternalUser,
  //     as: 'ExternalUsers'
  //   }]
  // }).then(function(externalUsers) {
  //   return res.json({
  //     ok: true,
  //     externalUser: externalUsers
  //   });
  // }).catch(function(err) {
  //   return next(err);
  // });
});

router.get('/external/:external_id', auth, function(req, res, next) {
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
