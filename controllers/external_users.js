'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

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

router.put('/:external_id', auth, function(req, res, next) {
  // var userId = req.decoded.id;
  var externalId = req.params.external_id | 0, // parse int
    otherUserId = req.body.user_id | 0, // parse int
    otherEmail = req.body.email;

  if (otherUserId !== 0) {
    models.ExternalUser.update({
      userId: otherUserId
    }, {
      where: {
        id: externalId
      }
    }).then(function() {
      return res.json({
        ok: true
      });
    }).catch(function(err) {
      return next(err);
    });
  } else if (otherEmail) {
    models.User.findOne({
      where: {
        email: otherEmail
      }
    }).then(function(user) {
      if (!user) {
        return res.status(400).json({
          ok: false
        });
      }
      models.ExternalUser.update({
        userId: user.id
      }, {
        where: {
          id: externalId
        }
      }).then(function() {
        return res.json({
          ok: true
        });
      }).catch(function(err) {
        return next(err);
      });
    }).catch(function(err) {
      return next(err);
    });
  } else {
    return res.status(400).json({
      ok: false
    });
  }
});

module.exports = router;
