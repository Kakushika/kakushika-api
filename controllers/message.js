'use strict';

var express = require('express'),
  router = express.Router(),
  auth = require('../middleware/auth'),
  models = require('../models'),
  date = require('../utils/date');

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
    qUserName = req.query.user_name, // external
    offset = req.query.offset | 0,
    limit = req.query.limit | 10;

  var sql = 'SELECT r.id AS messageId,r.roomId,r.message,r.pubDate,rp.externalId,rp.externalType,rp.name FROM dbo.Users AS m ' +
    'INNER JOIN dbo.Rooms AS p  ON m.id = p.userId ' +
    'INNER JOIN dbo.Messages AS r ON p.id = r.roomId ' +
    'INNER JOIN dbo.MessageProperties AS rm ON r.id = rm.messageId ' +
    'INNER JOIN dbo.ExternalUsers AS rp ON rm.externalUserId = rp.id';
  var where = [];
  var param = [];

  where.push('m.id = ?');
  param.push(userId);

  if(qRoomId) {
    where.push('p.id = ?');
    param.push(qRoomId);
  }

  if (qPubDate) {
    var from = new Date(qPubDate);
    var to = new Date(from + 24 * 60 * 60 * 1000); // pubDate < qPubDate
    where.push('r.pubDate BETWEEN ? AND ?');
    param.push(from, to);
  }

  if (qMessage) {
    where.push('r.message LIKE \'%?%\'');
    param.push(qMessage);
  }

  var  isExternalQuery = false;
  if (qUserId) {
    where.push('rm.externalUserId = ?');
    param.push(qUserId);
    isExternalQuery = true;
  } else if (qUserName) {
    where.push('rm.name = ?');
    param.push(qUserName);
    isExternalQuery = true;
  }
  sql += ' WHERE ' + where.join(' AND ');

  sql += ' UNION SELECT r.id AS messageId,r.roomId,r.message,r.pubDate,rp.externalId,rp.externalType,rp.name FROM dbo.Users AS m '+
  'INNER JOIN dbo.Readables AS rd ON rd.userId = m.id '+
  'INNER JOIN dbo.Rooms AS p  ON p.id = rd.roomId ' +
  'INNER JOIN dbo.Messages AS r ON p.id = r.roomId ' +
  'INNER JOIN dbo.MessageProperties AS rm ON r.id = rm.messageId '+
  'INNER JOIN dbo.ExternalUsers AS rp ON rm.externalUserId = rp.id';
  sql += ' WHERE ' + where.join(' AND ');
  param = param.concat(param);

  if (20 < limit) {
    limit = 20;
  }

  sql += ' ORDER BY r.pubDate DESC OFFSET(?) ROWS FETCH NEXT(?) ROWS ONLY ';
  param.push(offset, limit);

  models.sequelize.query(sql, {
    replacements: param,
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

router.get('/search/analytics-group-id/:analytics_group_id', auth, function(req, res, next) {
  var userId = req.decoded.id,
    analyticsGroupId = req.params.analytics_group_id,
    qRoomId = req.query.room_id | 0, // room parse int
    qPubDate = req.query.pub_date, // assume Date, timezone
    qMessage = req.query.message, // like, message
    qUserId = req.query.user_id | 0, // external parse int
    qUserName = req.query.user_name, // external
    offset = req.query.offset | 0,
    limit = req.query.limit | 10;

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

  if (20 < limit) {
    limit = 20;
  }

  models.AnalyticsGroup.findById(analyticsGroupId, {
    include: [{
      model: models.User,
      as: 'Users',
      attributes: [
        'id'
      ],
      where: {
        id: userId
      }
    }, {
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
        offset: offset,
        limit: limit
      }]
    }]
  }).then(function(analyticsGroup) {
    return res.json({
      ok: true,
      analyticsGroup: analyticsGroup
    });
  }).catch(function(err) {
    return next(err);
  });
});

module.exports = router;
