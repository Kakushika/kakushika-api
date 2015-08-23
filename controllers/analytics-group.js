'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models');

router.get('/', auth, function(req, res, next) {
  var userId = req.decoded.id;

  models.AnalyticsGroup.findAll({
    attributes: [
      'id'
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

router.post('/', auth, function(req, res, next) {
  var userId = req.decoded.id,
    name = req.body.name;

  models.AnalyticsGroup.create({
    userId: userId,
    name: name
  }).then(function(analyticsGroup) {
    res.status(201).son({
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
