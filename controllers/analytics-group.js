'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.AnalyticsGroup.findAll({
    attributes: [
      'id',
      'name'
    ],
    where: {
      userId: userId
    }
  }).then(function(analyticsGroups) {
    res.json({
      ok: true,
      analyticsGroups: analyticsGroups
    });
  }).catch(function(err) {
    next(err);
  });
});

router.get('/:analyticsGroupId', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analyticsGroupId;

  models.AnalyticsGroup.findById(analyticsGroupId, {
    include: [{
      model: models.User,
      as: 'Users'
    }, {
      model: models.Room,
      as: 'Rooms'
    }, {
      model: models.AnalyticsGroup,
      as: 'ChildGroups'
    }]
  }).then(function(analyticsGroup) {
    var hasUser = function(users) {
      users.forEach(function(user) {
        if (user.id === userId) {
          return true;
        }
      });
      return false;
    };
    if (analyticsGroup.userId !== userId ||
      hasUser(analyticsGroup.Users)) {
      res.status(401).json({
        ok: false
      });
    } else {
      res.json({
        ok: true,
        analyticsGroup: analyticsGroup
      });
    }
  }).catch(function(err) {
    next(err);
  });
});

router.get('/:analyticsGroupId/external-user', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analyticsGroupId;
  var sql = " SELECT DISTINCT e.*, u.name as userName FROM[dbo].[Messages] AS m"
          + " INNER JOIN [dbo].[MessageProperties] AS p"
          + " 	ON m.id = p.messageId"
          + " INNER JOIN [dbo].[Rooms] AS r"
          + " 	ON r.id = m.roomId"
          + " INNER JOIN [dbo].[AnalyticsGroupRooms] AS agr"
          + " 	ON r.id = agr.roomId"
          + " INNER JOIN [dbo].[ExternalUsers] AS e"
          + " 	ON p.externalUserId = e.id"
          + " LEFT OUTER JOIN [dbo].[Users] AS u"
          + "   ON e.userId = u.id"
          + " WHERE agr.analyticsGroupId = ?";
  models.sequelize.query(sql, { 
    replacements: [analyticsGroupId], 
    type: models.sequelize.QueryTypes.SELECT }
  ).then(function(externalUsers) {
    return res.json({
      ok: true,
      externalUser: externalUsers
    });
  }).catch(function(err) {
    return next(err);
  });
});

router.post('/', auth, function(req, res, next) {
  var userId = req.decoded.id,
    name = req.body.name;

  models.AnalyticsGroup.create({
    userId: userId,
    name: name
  }).then(function(analyticsGroup) {
    res.status(201).json({
      ok: true,
      analyticsGroup: analyticsGroup
    });
  }).catch(function(err) {
    next(err);
  });
});

router.put('/:analytics_group_id/rooms', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analytics_group_id,
    roomId = req.body.roomId;

  models.AnalyticsGroup.findById(analyticsGroupId, {
    where: {
      userId: userId
    }
  }).then(function(analyticsGroup) {
    if (!analyticsGroup) {
      return res.status(401).json({
        ok: false
      });
    }
    models.Room.findById(roomId, {
      where: {
        userId: userId
      }
    }).then(function(room) {
      if (!room) {
        return res.status(401).json({
          ok: false
        });
      }
      models.AnalyticsGroupRoom.create({
        analyticsGroupId: analyticsGroupId,
        roomId: roomId
      }).then(function(analyticsGroupRoom) {
        models.Room.findById(analyticsGroupRoom.roomId).then(function(room){
          analyticsGroupRoom.dataValues.room = room.dataValues;
          return res.json({
            ok: true,
            analyticsGroupRoom: analyticsGroupRoom
          });
        }).catch(function(err) {
          return next(err);
        });
      }).catch(function(err) {
        return next(err);
      });
    }).catch(function(err) {
      return next(err);
    });
  }).catch(function(err) {
    return next(err);
  });
});

router.put('/:analytics_group_id/groups', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analytics_group_id,
    groupId = req.body.group_id;

  models.AnalyticsGroup.findById(analyticsGroupId, {
    where: {
      userId: userId
    }
  }).then(function(analyticsGroup) {
    if (!analyticsGroup) {
      return res.status(401).json({
        ok: false
      });
    }
    models.AnalyticsGroup.findById(groupId, {
      where: {
        userId: userId
      }
    }).then(function(group) {
      if (!group) {
        return res.status(401).json({
          ok: false
        });
      }
      models.AnalyticsGroupMesh.create({
        parentAnalyticsGroupId: analyticsGroupId,
        childAnalyticsGroupId: groupId
      }).then(function(analyticsGroupMesh) {
        models.AnalyticsGroup.findById(analyticsGroupMesh.childAnalyticsGroupId).then(function(analyticsGroup){
          analyticsGroupMesh.dataValues.child = analyticsGroup.dataValues;
          return res.json({
            ok: true,
            analyticsGroupMesh: analyticsGroupMesh
          });
        }).catch(function(err) {
          return next(err);
        });
      }).catch(function(err) {
        return next(err);
      });
    }).catch(function(err) {
      return next(err);
    });
  }).catch(function(err) {
    return next(err);
  });
});

router.put('/:analytics_group_id/users', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analytics_group_id,
    addUserId = req.body.user_id;

  models.AnalyticsGroup.findById(analyticsGroupId, {
    where: {
      userId: userId
    }
  }).then(function(analyticsGroup) {
    if (!analyticsGroup) {
      return res.status(401).json({
        ok: false
      });
    }
    models.User.findById(addUserId)
      .then(function(user) {
        if (!user) {
          return res.status(404).json({
            ok: false
          });
        }
        models.AnalyticsUser.create({
          userId: addUserId,
          analyticsGroupId: analyticsGroupId
        }).then(function(analyticsUser) {
          return res.json({
            ok: true,
            analyticsUser: analyticsUser
          });
        }).catch(function(err) {
          return next(err);
        });
      }).catch(function(err) {
        return next(err);
      });
  }).catch(function(err) {
    return next(err);
  });
});

module.exports = router;
