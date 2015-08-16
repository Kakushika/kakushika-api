'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('config'),
  request = require('superagent'),
  Slack = require('slack-api'),
  auth = require('../middleware/auth'),
  models = require('../models'),
  task = require('../utils/task');

router.get('/slack', auth, function(req, res, next) {
  if (!req.query.code) {
    res.json({
      ok: false
    });
  } else {
    Slack.oauth.access({
      client_id: config.slack.client_id,
      client_secret: config.slack.client_secret,
      code: req.query.code
    }, function(error, data) {
      if (error || !data.ok) {
        res.json({
          ok: false
        });
      } else {
        request
          .get(config.slack.api_url + '/team.info?token=' + data.access_token)
          .end(function(err, res) {
            if (err) {
              console.error(err);
              return res.json({
                ok: false
              });
            }
            models.Claim.create({
              userId: req.decoded.id,
              key: 'slack:' + res.body.team.id + ':token',
              token: data.access_token
            });
            models.RoomGroup.create({
              userId: req.decoded.id,
              externalType: 'slack',
              externalId: res.body.team.id,
              name: res.body.team.name
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
                    userId: req.decoded.id,
                    externalType: 'slack',
                    externalId: channel.id,
                    roomGroupId: roomGroup.id,
                    name: channel.name
                  }).then(function(room) {
                    task(req.decoded.id, room.id);
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
                    userId: req.decoded.id,
                    externalType: 'slack',
                    externalId: group.id,
                    roomGroupId: roomGroup.id,
                    name: group.name
                  }).then(function(room) {
                    task(req.decoded.id, room.id);
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
