'use strict';

let config = require('config'),
  request = require('superagent'),
  Slack = require('slack-api'),
  models = require('../models');

let auth = {};

auth.slack = {
  oauth: function(req, res) {
    Slack.oauth.getUrl({
      client_id: config.slack.client_id,
      redirect_uri: config.host + config.slack.callback_path
    }, function(error, url) {
      if (error) {
        res.redirect(config.host + config.slack.redirect_path.error);
      } else {
        res.redirect(url);
      }
    });
  },
  callback: function(req, res) {
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
                return res.status(500).json({
                  ok: false
                });
              }
              models.claim.create(userId, 'slack:' + result.body.team.id + ':token', data.access_token);
              models.roomGroup.create(userId, result.body.team.id, 'slack', result.body.team.name).then(function(roomGroup) {
                Slack.channel.list({
                  token: data.access_token
                }, function(err, data) {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  data.channels.forEach(function(channel) {
                    models.room.create(userId, channel.id, 'slack:channel', channel.name, roomGroup.id);
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
                    models.room.create(userId,group.id,'slack:group',group.name,roomGroup.id);
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
  }
};

module.exports = auth;
