'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.post('/', auth, function(req, res, next) {
  var userId = req.decoded.id,
    otherUserId = req.body.user_id | 0, // parse int
    otherEmail = req.body.email,
    roomId = req.body.room_id | 0; // parse int

  if (otherUserId) {
    models.User.findById(otherUserId)
      .then(function(user) {
        if (user) {
          models.Room.findById(roomId)
            .then(function(room) {
              if (room.userId === userId) {
                models.Readable.create({
                  userId: otherUserId
                }).then(function(readable) {
                  return res.json({
                    ok: true,
                    readable: readable
                  });
                }).catch(function(err) {
                  return next(err);
                });
              } else {
                return res.status(400).json({
                  ok: false
                });
              }
            }).catch(function(err) {
              return next(err);
            });
        }
      }).catch(function(err) {
        return next(err);
      });
  } else if (otherEmail) {
    models.User.findByOne({
      where: {
        email: otherEmail
      }
    }).then(function(user) {
        if (user) {
          models.Room.findById(roomId)
            .then(function(room) {
              if (room.userId === userId) {
                models.Readable.create({
                  userId: otherUserId
                }).then(function(readable) {
                  return res.json({
                    ok: true,
                    readable: readable
                  });
                }).catch(function(err) {
                  return next(err);
                });
              } else {
                return res.status(400).json({
                  ok: false
                });
              }
            }).catch(function(err) {
              return next(err);
            });
        }
      }).catch(function(err) {
        return next(err);
      });
  }

  res.status(400).json({
    ok: false
  });
});

module.exports = router;
