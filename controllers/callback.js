'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('config'),
  request = require('superagent'),
  Slack = require('slack-api'),
  auth = require('../middleware/auth'),
  models = require('../models'),
  task = require('../utils/task');

router.get('/slack', auth, function(req, res) {
  var userId = req.decoded.id;

  if (!req.query.code) {
    res.status(400).json({
      ok: false
    });
  } else {
    Slack.oauth.access({
      client_id: config.slack.client_id,
      client_secret: config.slack.client_secret,
      code: req.query.code
    }, function(error, data) {
      if (error || !data.ok) {
        res.status(400).json({
          ok: false
        });
      } else {
        request
          .get(config.slack.api_url + '/team.info?token=' + data.access_token)
          .end(function(err, result) {
            if (err) {
              console.error(err);
              return res.status(500).json({
                ok: false
              });
            }
            models.Claim.create({
              userId: userId,
              key: 'slack:' + result.body.team.id + ':token',
              value: data.access_token
            });
            models.RoomGroup.create({
              userId: userId,
              externalType: 'slack',
              externalId: result.body.team.id,
              name: result.body.team.name
            }).then(function(roomGroup) {
              Slack.channel.list({
                token: data.access_token
              }, function(err, data) {
                if (err) {
                  console.error(err);
                  return;
                }
                data.channels.forEach(function(channel) {
                  models.Room.create({
                    userId: userId,
                    externalType: 'slack',
                    externalId: channel.id,
                    roomGroupId: roomGroup.id,
                    name: channel.name
                  }).then(function(room) {
                    task(userId, room.id);
                    models.Readable.create({
                      userId: userId,
                      roomId: room.id
                    });
                  });
                });
              });
              Slack.groups.list({
                token: data.access_token
              }, function(err, data) {
                if (err) {
                  console.error(err);
                  return;
                }
                data.groups.forEach(function(group) {
                  models.Room.create({
                    userId: userId,
                    externalType: 'slack',
                    externalId: group.id,
                    roomGroupId: roomGroup.id,
                    name: group.name
                  }).then(function(room) {
                    task(userId, room.id);
                    models.Readable.create({
                      userId: userId,
                      roomId: room.id
                    });
                  });
                });
              });
            });
            res.json({
              ok: true
            });
          });
      }
    });
  }
});

module.exports = router;
