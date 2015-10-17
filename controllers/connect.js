'use strict';

const config = require('config'),
  request = require('superagent'),
  Slack = require('slack-api'),
  models = require('../models');

const connect = {};

connect.slack = {
  oauth: (req, res) => {
    let type = req.query.type;

    Slack.oauth.getUrl({
      client_id: config.slack.client_id,
      redirect_uri: config.slack.callback_path[type]
    }, (err, url) => {
      if (err) {
        res.redirect(config.slack.redirect_uri[type]);
      } else {
        res.redirect(url);
      }
    });
  },
  callback: (req, res) => {
    let userId = req.decoded.id,
      code = req.body.code;

    if (!code) {
      res.status(400).json({
        ok: false
      });
    } else {
      Slack.oauth.access({
        client_id: config.slack.client_id,
        client_secret: config.slack.client_secret,
        code: code
      }, (error, data) => {
        if (error || !data.ok) {
          res.status(400).json({
            ok: false
          });
        } else {
          request
            .get(config.slack.api_url + '/team.info?token=' + data.access_token)
            .end((err, result) => {
              if (err) {
                return res.status(500).json({
                  ok: false
                });
              }
              models.claim.create(userId, 'slack:' + result.body.team.id + ':token', data.access_token);
              models.roomGroup.create(userId, result.body.team.id, 'slack', result.body.team.name).then((roomGroup) => {
                Slack.channel.list({
                  token: data.access_token
                }, (err, data) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  data.channels.forEach((channel) => {
                    models.room.create(userId, channel.id, 'slack:channel', channel.name, roomGroup.id);
                  });
                });
                Slack.groups.list({
                  token: data.access_token
                }, (err, data) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  data.groups.forEach((group) => {
                    models.room.create(userId, group.id, 'slack:group', group.name, roomGroup.id);
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

connect.hipchat = (req, res, next) => {
};

module.exports = connect;
